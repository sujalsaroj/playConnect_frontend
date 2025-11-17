import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loaderGif from "../loader/loading.gif";
import Sidebar from "../components/Sidebar";
import stateCityData from "../data/stateCityData";

// ✅ Use environment variable for API
const API_BASE = import.meta.env.VITE_API_URL;

const BookTurf = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState({});
  const navigate = useNavigate();

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

  const filteredTurfs = turfs.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      t.name?.toLowerCase().includes(term) ||
      (Array.isArray(t.sports)
        ? t.sports.some((s) => s.toLowerCase().includes(term))
        : t.sports?.toLowerCase().includes(term)) ||
      t.city?.toLowerCase().includes(term) ||
      t.state?.toLowerCase().includes(term);

    const matchState =
      !selectedState || t.state?.toLowerCase() === selectedState.toLowerCase();
    const matchCity =
      !selectedCity || t.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchSport =
      !selectedSport ||
      (Array.isArray(t.sports)
        ? t.sports.some((s) => s.toLowerCase() === selectedSport.toLowerCase())
        : t.sports?.toLowerCase() === selectedSport.toLowerCase());

    return matchSearch && matchState && matchCity && matchSport;
  });

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar
        stateCityData={stateCityData}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">📅 Book a Turf</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="border p-3 rounded shadow-sm w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Sports</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Badminton">Badminton</option>
            <option value="Table Tennis">Tennis</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        {filteredTurfs.length === 0 ? (
          <p className="text-center text-gray-500">No turfs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTurfs.map((turf) => (
              <div
                key={turf._id}
                className="border p-5 rounded-xl shadow-lg transition transform hover:scale-105 bg-white"
              >
                {turf.photos?.length > 0 && (
                  <img
                    src={`${API_BASE}/uploads/${
                      turf.photos[imageIndex[turf._id]]
                    }`}
                    alt={turf.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-xl font-semibold">{turf.name}</h3>
                <p className="text-gray-600">
                  📍 {turf.city}, {turf.state}
                </p>
                <p className="text-gray-600"> Sport: {turf.sports}</p>
                <p className="text-gray-600 mb-3"> Price: ₹{turf.price}</p>

                <button
                  onClick={() => navigate(`/book/${turf._id}`)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View & Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTurf;
