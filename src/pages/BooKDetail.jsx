import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import loaderGif from "../loader/loading.gif";

// ✅ Use environment variables
const API_BASE = import.meta.env.VITE_API_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const BookDetail = () => {
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [owner, setOwner] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
  });

  // Fetch turf
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/turf/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load turf");

        const normalized = {
          ...data,
          slots: Array.isArray(data.slots)
            ? data.slots.map((s) => ({
                time: typeof s === "string" ? s : s?.time || String(s),
                booked: !!(typeof s === "object" && s?.booked),
              }))
            : [],
        };
        setTurf(normalized);
        if (data.owner) setOwner(data.owner);
      } catch (e) {
        setError(e.message || "Failed to load turf.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Auto image rotation
  useEffect(() => {
    if (!turf?.photos?.length) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % turf.photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [turf]);

  // Booking
  const handleBook = async () => {
    if (
      !selectedSlot ||
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.date
    ) {
      alert("❗ Please fill all fields and select a slot before booking.");
      return;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("You must register/login before booking.");
      window.location.href = "/register";
      return;
    }

    if (user.role !== "player") {
      alert("Only players can book turfs!");
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
            date: formData.date,
            userDetails: formData,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Payment session failed");
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (e) {
      alert("Something went wrong. Try again later.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-24 h-24" />
      </div>
    );

  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (!turf) return null;

  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 via-gray-50 to-white min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-center text-green-700">
        Book Your Turf
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 justify-center items-stretch max-w-6xl mx-auto">
        {/* Left: Turf Info */}
        <div className="flex-1 border border-gray-200 rounded-2xl shadow-lg bg-white overflow-hidden flex flex-col transition hover:shadow-2xl">
          {turf.photos?.length > 0 && (
            <div className="relative">
              <img
                src={`${API_BASE}/uploads/${turf.photos[imageIndex]}`}
                alt={turf.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-40 text-white w-full py-2 text-center font-semibold">
                {turf.name}
              </div>
            </div>
          )}

          <div className="p-6 flex flex-col gap-2 text-gray-700 flex-1">
            <p>
              📍 <strong>Address:</strong> {turf.address || turf.location},{" "}
              {turf.city}, {turf.state}
            </p>
            <p>
              {" "}
              <strong>Sport Type:</strong> {turf.sports.join(", ")}
            </p>
            <p className=" text-lg   mt-2">
              {" "}
              <strong>Price : </strong>₹{turf.price} per slot
            </p>

            <h4 className="font-semibold mt-4 mb-2 text-gray-800 text-lg">
              🕓 Available Slots
            </h4>
            <div className="flex flex-wrap gap-2 mt-auto">
              {turf.slots.map((slotObj, idx) => (
                <button
                  key={idx}
                  disabled={slotObj.booked}
                  onClick={() => setSelectedSlot(slotObj)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                    slotObj.booked
                      ? "bg-red-100 text-gray-500 cursor-not-allowed"
                      : selectedSlot?.time === slotObj.time
                      ? "bg-green-500 text-white shadow-md scale-105"
                      : "bg-gray-100 hover:bg-blue-100"
                  }`}
                >
                  {slotObj.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="flex-1 border border-gray-200 rounded-2xl shadow-lg bg-white p-8 flex flex-col transition hover:shadow-2xl">
          {owner && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-6">
              <h4 className="font-semibold text-blue-700 mb-2">
                👤 Turf Owner Info
              </h4>
              <p>Name: {owner.name}</p>
              <p>Email: {owner.email}</p>
              <p>Phone: {owner.phone}</p>
            </div>
          )}

          <h3 className="text-2xl font-semibold mt-6 mb-6 text-center text-blue-700">
            Booking Details
          </h3>

          <div className="space-y-4 flex-1">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg outline-none transition"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg outline-none transition"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg outline-none transition"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg outline-none transition"
            />

            <button
              onClick={handleBook}
              disabled={bookingLoading || !selectedSlot}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md font-semibold transition disabled:opacity-50 mt-4"
            >
              {bookingLoading ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
