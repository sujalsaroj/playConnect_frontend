import React, { useEffect, useState } from "react";
import loaderGif from "../loader/loading.gif";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings for the logged-in user
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    //  No auto-refresh here, user will see updated status immediately after cancel
  }, []);

  // Cancel a booking
  const cancelBooking = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/cancel/${id}`,
        {
          method: "DELETE", // your backend uses DELETE for cancel
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        // Update local state only for this booking
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
        );
      } else {
        console.error("Cancel failed:");
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📖 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Turf Image */}
              {booking.turfId?.photos?.[0] ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${
                    booking.turfId.photos[0]
                  }`}
                  alt={booking.turfId?.name || "Turf Image"}
                  className="w-full h-72 object-contain bg-gray-100"
                />
              ) : (
                <div className="w-full h-72 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">
                  {booking.turfId?.name || "Turf not available"}
                </h3>
                <p className="text-gray-600">
                  📍 {booking.turfId?.location || "Location not available"}
                </p>
                <p className="text-gray-600">Date: {booking.date}</p>
                <p className="text-gray-600">Time: {booking.slot}</p>
                <p
                  className={`font-medium ${
                    booking.status === "Cancelled"
                      ? "text-red-500"
                      : booking.status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Status: {booking.status}
                </p>

                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ViewBookings;
