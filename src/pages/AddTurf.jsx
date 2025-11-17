import React, { useState } from "react";
import loaderGif from "../loader/loading.gif";
import stateCityData from "../data/stateCityData"; // create this file

const AddTurf = () => {
  const [formData, setFormData] = useState({
    name: "",
    sports: "",
    price: "",
    state: "",
    city: "",
    location: "",
    slots: [""],
    photos: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      const fileArray = Array.from(files || []);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...fileArray].slice(0, 5),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSlotChange = (index, value) => {
    const updated = [...formData.slots];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, slots: updated }));
  };

  const addSlotField = () => {
    setFormData((prev) => ({ ...prev, slots: [...prev.slots, ""] }));
  };

  const removeSlotField = (index) => {
    setFormData((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const cleanedSlots = formData.slots.map((s) => s.trim()).filter(Boolean);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("sports", formData.sports);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("location", formData.location.trim());
      formDataToSend.append("slots", JSON.stringify(cleanedSlots));

      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      // ✅ Use environment variable for backend URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turf/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add turf");

      alert("Turf added successfully!");
      setFormData({
        name: "",
        sports: "",
        price: "",
        state: "",
        city: "",
        location: "",
        slots: [""],
        photos: [],
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-20 h-20" />
      </div>
    );

  return (
    <div className="p-8 mt-10 mb-10 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-green-700">Add New Turf</h2>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Photos Upload */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Turf Photos (Max 5)
          </label>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 border rounded p-2"
          />
          {formData.photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.photos.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Turf Name */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Turf Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Greenfield Arena"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Sports */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Sports
          </label>
          <input
            type="text"
            name="sports"
            value={formData.sports}
            placeholder="Football, Cricket"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Price (per hour)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            placeholder="500"
            onChange={handleChange}
            required
            min="0"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* State */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            State
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                state: e.target.value,
                city: "",
              }))
            }
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Select State</option>
            {Object.keys(stateCityData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={!formData.state}
            className="border p-2 rounded w-full"
          >
            <option value="">Select City</option>
            {formData.state &&
              stateCityData[formData.state].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Location / Address
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Andheri East, near station"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Slots */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Available Time Slots
          </label>
          {formData.slots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={slot}
                onChange={(e) => handleSlotChange(index, e.target.value)}
                placeholder="e.g. 5PM - 6PM"
                className="border p-2 rounded w-full"
              />
              {formData.slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlotField(index)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSlotField}
            className="text-blue-600 font-medium text-sm mt-1"
          >
            + Add another slot
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Save Turf
        </button>
      </form>
    </div>
  );
};

export default AddTurf;
