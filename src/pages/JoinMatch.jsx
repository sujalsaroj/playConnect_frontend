import React, { useEffect, useState } from "react";
import loaderGif from "../loader/loading.gif";
import { FaTrash } from "react-icons/fa"; //  Import delete icon

const JoinConnection = () => {
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnections();
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/connections/open`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch connections");
      const data = await res.json();
      setConnections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //  DELETE connection
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this connection?"))
      return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/connections/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to delete connection");

      alert("Connection deleted successfully!");
      fetchConnections(); //  Refresh after delete
    } catch (err) {
      alert(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/connections/${id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join connection");
      alert(" Joined Successfully!");
      fetchConnections();
    } catch (err) {
      alert(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          🤝 Join a Connection
        </h2>
      </div>
      {connections.length === 0 ? (
        <p>No open connections available.</p>
      ) : (
        connections.map((conn) => {
          const joined = conn.players.some((p) => p._id === currentUser?._id);

          return (
            <div
              key={conn._id}
              className="bg-white border p-5 rounded-xl shadow-md mb-5 hover:shadow-lg transition relative"
            >
              {/* 🗑 Delete button (top-right) */}
              <button
                onClick={() => handleDelete(conn._id)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
              <h3 className="text-xl font-semibold mb-2 text-green-700">
                {conn.sport} Match
              </h3>
              <p>
                <b>Turf:</b> {conn.turf}
              </p>
              <p>
                <b>Date:</b> {new Date(conn.date).toLocaleDateString()}{" "}
                <b>🕒 Time:</b>{" "}
                {new Date(conn.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <b>Players Joined:</b> {conn.players.length}/{conn.maxPlayers}
              </p>
              <p>
                <b>Location:</b> {conn.turf}
              </p>
              <p>
                <b>Contact:</b> {conn.contactNumber}
              </p>
              <p>
                <b>Email:</b> {conn.email}
              </p>
              <p>
                <b>Message:</b> {conn.message}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  disabled={joined || conn.status === "filled"}
                  className={`px-4 py-1 rounded text-white ${
                    joined
                      ? "bg-blue-500 cursor-not-allowed"
                      : conn.status === "filled"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => handleJoin(conn._id)}
                >
                  {joined
                    ? "Joined"
                    : conn.status === "filled"
                    ? "Full"
                    : "Join Now"}
                </button>
              </div>
              {conn.players.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  <b>Players:</b>{" "}
                  {conn.players.map((p) => p.name).join(", ") || "No players"}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default JoinConnection;
