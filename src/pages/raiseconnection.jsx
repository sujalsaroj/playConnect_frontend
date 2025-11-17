import React, { useState } from "react";
import loaderGif from "../loader/loading.gif";

const RaiseConnection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sport: "",
    date: "",
    time: "",
    playersNeeded: "",
    turfLocation: "",
    contactNumber: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validations
    if (!validateEmail(formData.email)) {
      alert(" Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.contactNumber.length < 10) {
      alert(" Please enter a valid contact number (10 digits)");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return alert(" Please login first!");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/connections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            turf: formData.turfLocation,
            date: `${formData.date}T${formData.time}`,
            maxPlayers: formData.playersNeeded,
            sport: formData.sport,
            message: formData.message,
            contactNumber: formData.contactNumber,
            email: formData.email,
          }),
        }
      );

      setLoading(false);
      if (!res.ok) throw new Error("Failed to raise connection");
      await res.json();

      alert("Connection Raised Successfully!");

      setFormData({
        sport: "",
        date: "",
        time: "",
        playersNeeded: "",
        turfLocation: "",
        contactNumber: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert(" Failed to raise connection");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          🔊 Raise a Connection
        </h2>

        {/* Sport */}
        <label className="block mb-2 font-medium">Sport</label>
        <select
          name="sport"
          value={formData.sport}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="">Choose Sport</option>
          <option value="Cricket">Cricket</option>
          <option value="Football">Football</option>
          <option value="Badminton">Badminton</option>
          <option value="Basketball">Basketball</option>
        </select>

        {/* Date */}
        <label className="block mb-2 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Time */}
        <label className="block mb-2 font-medium">Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Players */}
        <label className="block mb-2 font-medium">Players Needed</label>
        <input
          type="number"
          name="playersNeeded"
          value={formData.playersNeeded}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          min="1"
          required
        />

        {/* Turf */}
        <label className="block mb-2 font-medium">Turf Location</label>
        <input
          type="text"
          name="turfLocation"
          value={formData.turfLocation}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="e.g., Sky Turf, Pune"
          required
        />

        {/* Contact Number */}
        <label className="block mb-2 font-medium">Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Enter your contact number"
          required
        />

        {/* Email */}
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Enter your email"
          required
        />

        {/* Message */}
        <label className="block mb-2 font-medium">Message (optional)</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Looking for players for a friendly match"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          Raise Connection
        </button>
      </form>
    </div>
  );
};
export default RaiseConnection;
