import React, { useEffect, useState } from "react";
import loaderGif from "../loader/loading.gif";

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
        "http://https://playconnect-backend.vercel.app//api/connections/open",
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

  const handleJoin = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://https://playconnect-backend.vercel.app//api/connections/${id}/join`,
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
      alert("🎉 Joined Successfully!");
      fetchConnections();
    } catch (err) {
      alert(`❌ ${err.message}`);
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
      <h2 className="text-2xl font-bold mb-4">🤝 Join a Connection</h2>
      {connections.length === 0 ? (
        <p>No open connections available.</p>
      ) : (
        connections.map((conn) => {
          const joined = conn.players.some((p) => p._id === currentUser?._id);
          return (
            <div
              key={conn._id}
              className="bg-white border p-4 rounded shadow-md mb-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{conn.turf}</h3>
              <p>📅 Date: {new Date(conn.date).toLocaleString()}</p>
              <p>
                🙋‍♂️ Players Joined: {conn.players.length}/{conn.maxPlayers}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  disabled={joined || conn.status === "filled"}
                  className={`px-4 py-1 rounded text-white ${
                    joined || conn.status === "filled"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => handleJoin(conn._id)}
                >
                  {joined
                    ? "Joined ✅"
                    : conn.status === "filled"
                    ? "Full"
                    : "Join Now"}
                </button>
                {joined && (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Chat 💬
                  </button>
                )}
              </div>
              {conn.players.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <b>Players:</b> {conn.players.map((p) => p.name).join(", ")}
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
