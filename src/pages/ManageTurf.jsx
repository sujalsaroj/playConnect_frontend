import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import loaderGif from "../loader/loading.gif";

const MyTurfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState({});
  const [editingTurf, setEditingTurf] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sports: "",
    price: "",
    location: "",
    slots: [],
    newSlot: "",
  });
  const intervalsRef = useRef({});

  //  FETCH & NORMALIZE
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/turf/my-turfs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch turfs");

        // Normalize slots: string -> { time, booked }
        const normalized = data.map((turf) => ({
          ...turf,
          slots: Array.isArray(turf.slots)
            ? turf.slots.map((s) =>
                typeof s === "string" ? { time: s, booked: false } : s
              )
            : [],
        }));

        setTurfs(normalized);

        // Initialize image index
        const indexObj = {};
        normalized.forEach((turf) => (indexObj[turf._id] = 0));
        setImageIndex(indexObj);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  //  IMAGE SLIDER
  const nextImage = (turfId, total) =>
    setImageIndex((prev) => ({
      ...prev,
      [turfId]: ((prev[turfId] || 0) + 1) % total,
    }));

  const prevImage = (turfId, total) =>
    setImageIndex((prev) => ({
      ...prev,
      [turfId]: ((prev[turfId] || 0) - 1 + total) % total,
    }));

  const startAutoSlide = (turfId, total) => {
    stopAutoSlide(turfId);
    intervalsRef.current[turfId] = setInterval(() => {
      setImageIndex((prev) => ({
        ...prev,
        [turfId]: ((prev[turfId] || 0) + 1) % total,
      }));
    }, 2000);
  };

  const stopAutoSlide = (turfId) => {
    if (intervalsRef.current[turfId]) {
      clearInterval(intervalsRef.current[turfId]);
      delete intervalsRef.current[turfId];
    }
  };

  useEffect(() => {
    return () => Object.values(intervalsRef.current).forEach(clearInterval);
  }, []);

  //  DELETE TURF
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this turf?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/turf/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete turf");
      setTurfs((prev) => prev.filter((t) => t._id !== id));
      alert("Turf deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  //  EDIT TURF
  const handleEditClick = (turf) => {
    setEditingTurf(turf._id);
    const sportsStr = Array.isArray(turf.sports)
      ? turf.sports.join(", ")
      : turf.sports || "";
    setFormData({
      name: turf.name || "",
      sports: sportsStr,
      price: turf.price ?? "",
      location: turf.location || "",
      slots: Array.isArray(turf.slots)
        ? turf.slots.map((s) =>
            typeof s === "string" ? { time: s, booked: false } : s
          )
        : [],
      newSlot: "",
    });
  };

  // SLOT HANDLING
  const handleAddSlot = () => {
    const slot = formData.newSlot.trim();
    const slotPattern = /^\d{1,2}\s?(AM|PM)\s?-\s?\d{1,2}\s?(AM|PM)$/i;
    if (!slotPattern.test(slot)) {
      alert(" Invalid slot format. Use like: 9AM - 10AM");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      slots: [...prev.slots, { time: slot, booked: false }],
      newSlot: "",
    }));
  };

  const handleRemoveSlot = (slotTime) => {
    setFormData((prev) => ({
      ...prev,
      slots: prev.slots.filter((s) => s.time !== slotTime),
    }));
  };

  // ---------------- UPDATE TURF ----------------
  const handleUpdate = async () => {
    try {
      const cleanedSlots = formData.slots.map((s) => ({
        time: String(s.time).trim(),
        booked: !!s.booked,
      }));
      if (cleanedSlots.length === 0) return alert(" Add at least one slot.");

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/turf/${editingTurf}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          sports: formData.sports,
          price: formData.price,
          location: formData.location,
          slots: cleanedSlots,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update turf");

      setTurfs((prev) =>
        prev.map((t) => (t._id === editingTurf ? data.turf : t))
      );
      setEditingTurf(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-700">My Turfs</h2>

      {turfs.length === 0 ? (
        <p className="text-gray-500">No turfs found. Add one to get started!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => {
            const currentIndex = imageIndex[turf._id] || 0;
            const sportsText = Array.isArray(turf.sports)
              ? turf.sports.join(", ")
              : turf.sports || "";

            return (
              <div
                key={turf._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* IMAGE SLIDER */}
                {turf.photos && turf.photos.length > 0 ? (
                  <div
                    className="relative h-40 w-full group"
                    onMouseEnter={() =>
                      startAutoSlide(turf._id, turf.photos.length)
                    }
                    onMouseLeave={() => stopAutoSlide(turf._id)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${turf.photos[currentIndex]}`}
                      alt={turf.name}
                      className="h-40 w-full object-cover transition-all duration-500"
                    />
                    {turf.photos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            prevImage(turf._id, turf.photos.length)
                          }
                          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={() =>
                            nextImage(turf._id, turf.photos.length)
                          }
                          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* TURF INFO / EDIT FORM */}
                <div className="p-4">
                  {editingTurf === turf._id ? (
                    <>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border p-1 w-full mb-2"
                      />
                      <input
                        type="text"
                        value={formData.sports}
                        onChange={(e) =>
                          setFormData({ ...formData, sports: e.target.value })
                        }
                        placeholder="Comma separated sports"
                        className="border p-1 w-full mb-2"
                      />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="border p-1 w-full mb-2"
                        min="0"
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="border p-1 w-full mb-2"
                      />

                      {/* Slots */}
                      <div className="mb-2">
                        <p className="font-semibold">Slots:</p>
                        <ul className="mb-1">
                          {formData.slots.map((slot, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between bg-gray-100 px-2 py-1 mb-1 rounded"
                            >
                              {slot.time}
                              <button
                                onClick={() => handleRemoveSlot(slot.time)}
                                className="text-red-500"
                                title="Remove"
                              >
                                <FaTrash />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.newSlot}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                newSlot: e.target.value,
                              })
                            }
                            placeholder="e.g. 9AM - 10AM"
                            className="border p-1 flex-1"
                          />
                          <button
                            onClick={handleAddSlot}
                            className="bg-blue-500 text-white px-3 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTurf(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-gray-800">
                        {turf.name}
                      </h3>
                      <p className="text-sm text-gray-600">{sportsText}</p>
                      <p className="mt-2 font-semibold text-green-700">
                        ₹{turf.price} / hour
                      </p>
                      <p className="text-gray-500">{turf.location}</p>

                      {Array.isArray(turf.slots) && turf.slots.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-gray-700">
                            Available Slots:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {turf.slots.map((slot, idx) => (
                              <li key={idx}>{slot.time}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(turf._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditClick(turf)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTurfs;
