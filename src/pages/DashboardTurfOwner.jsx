import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loaderGif from "../loader/loading.gif";

const DashboardTurfOwner = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch bookings for owner's turfs
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        "https://playconnect-backend.vercel.app/api/bookings/owner-bookings",
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
    const interval = setInterval(fetchBookings, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  // ✅ Confirm a booking
  const confirmBooking = async (id) => {
    try {
      const res = await fetch(
        `https://playconnect-backend.vercel.app/api/bookings/confirm/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b))
        );
      } else {
        alert(data.message || "Error confirming booking");
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Turf Owner</h2>
        <nav className="flex flex-col gap-4">
          <button
            className="text-left hover:bg-green-600 px-4 py-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            🏠 Dashboard
          </button>
          <button
            className="text-left hover:bg-green-600 px-4 py-2 rounded"
            onClick={() => navigate("/addturf")}
          >
            ➕ Add Turf
          </button>
          <button
            className="text-left hover:bg-green-600 px-4 py-2 rounded"
            onClick={() => navigate("/manageturf")}
          >
            ⚙️ Manage Turf
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">🏟️ Turf Owner Dashboard</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">📅 Booking List</h2>
          <ul className="bg-white p-4 rounded shadow">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <li
                  key={b._id}
                  className="border-b last:border-b-0 py-2 flex justify-between items-center"
                >
                  <span>
                    <strong>{b.turfId?.name || "Turf"}</strong> - {b.date} at{" "}
                    {b.slot} - Status:{" "}
                    <span
                      className={`font-medium ${
                        b.status === "Pending"
                          ? "text-yellow-600"
                          : b.status === "Confirmed"
                          ? "text-blue-600"
                          : b.status === "Cancelled"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </span>

                  {b.status === "Pending" && (
                    <button
                      onClick={() => confirmBooking(b._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li>No bookings yet.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardTurfOwner;
