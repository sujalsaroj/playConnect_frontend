import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import loaderGif from "../loader/loading.gif";
import Sidebar from "../components/Sidebar";
import stateCityData from "../data/stateCityData";

const API_BASE = "http://localhost:5000";
const stripePromise = loadStripe("your_stripe_key_here");

const BookTurf = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState({});

  // Fetch turfs
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/turf`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load turfs");

        const normalized = (Array.isArray(data) ? data : []).map((turf) => ({
          ...turf,
          slots: Array.isArray(turf.slots)
            ? turf.slots.map((s) => ({
                time: typeof s === "string" ? s : s?.time || String(s),
                booked: !!(typeof s === "object" && s?.booked),
              }))
            : [],
        }));

        setTurfs(normalized);

        // For rotating images
        const idx = {};
        normalized.forEach((t) => (idx[t._id] = 0));
        setImageIndex(idx);
      } catch (e) {
        setError(e.message || "Failed to load turfs.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-rotate gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => {
        const next = { ...prev };
        turfs.forEach((t) => {
          if (t.photos?.length > 0) {
            next[t._id] = ((prev[t._id] || 0) + 1) % t.photos.length;
          }
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [turfs]);

  // Filter turfs
  const filteredTurfs = turfs.filter(
    (t) =>
      (!selectedState || t.state === selectedState) &&
      (!selectedCity || t.city === selectedCity) &&
      t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Booking
  const handleBook = async (turf) => {
    if (!selectedSlot || selectedTurf?._id !== turf._id) {
      alert("❗ Please select a time slot for this turf.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again. (No token found)");
      return;
    }

    setBookingLoading(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch(
        `${API_BASE}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            turfId: turf._id,
            slot: selectedSlot.time,
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Payment session failed");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (e) {
      alert("❌ Something went wrong. Try again later.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        stateCityData={stateCityData}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">📅 Book a Turf</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search turfs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 mb-6 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {filteredTurfs.length === 0 && (
          <p className="text-center text-gray-500">No turfs found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTurfs.map((turf) => (
            <div
              key={turf._id}
              className={`border p-5 rounded-xl shadow-lg transition transform hover:scale-105 ${
                selectedTurf?._id === turf._id ? "bg-green-50" : "bg-white"
              }`}
            >
              {/* Turf Images */}
              {turf.photos?.length > 0 && (
                <div className="relative w-full h-64 mb-4 group">
                  <img
                    src={`${API_BASE}/uploads/${
                      turf.photos[imageIndex[turf._id]]
                    }`}
                    alt={turf.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              <h3 className="text-xl font-semibold">{turf.name}</h3>
              <p className="text-gray-600 mb-1">
                📍 {turf.city}, {turf.state}
              </p>
              <p className="text-gray-600 mb-3">💰 ₹{turf.price}</p>

              {/* Slots */}
              <div>
                <p className="font-medium mb-2">🕓 Select Slot:</p>
                <div className="flex gap-2 flex-wrap">
                  {turf.slots.map((slotObj, idx) => (
                    <button
                      key={idx}
                      disabled={slotObj.booked}
                      onClick={() => {
                        if (slotObj.booked) return;
                        setSelectedTurf(turf);
                        setSelectedSlot(slotObj);
                      }}
                      className={`px-4 py-2 border rounded-lg transition relative ${
                        slotObj.booked
                          ? "bg-red-200 text-gray-600 cursor-not-allowed"
                          : selectedTurf?._id === turf._id &&
                            selectedSlot?.time === slotObj.time
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {slotObj.time}
                      {slotObj.booked && (
                        <span className="absolute inset-0 bg-red-500 bg-opacity-50 text-white flex items-center justify-center rounded-lg">
                          Booked
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleBook(turf)}
                  disabled={
                    bookingLoading ||
                    !(selectedTurf?._id === turf._id && selectedSlot)
                  }
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {bookingLoading && selectedTurf?._id === turf._id
                    ? "⏳ Processing..."
                    : "✅ Book & Pay"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookTurf;
