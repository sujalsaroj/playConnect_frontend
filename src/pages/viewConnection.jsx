import React, { useEffect, useState } from "react";
import loaderGif from "../loader/loading.gif";

const ViewConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://https://playconnect-backend.vercel.app//api/connections/my",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch connections");
      const data = await res.json();
      setConnections(data);
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📖 My Connections</h2>
      {connections.length === 0 ? (
        <p className="text-center text-gray-500">No connections found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {connections.map((conn) => {
            const isCreator = conn.createdBy === currentUser?._id;
            return (
              <div
                key={conn._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold">🏟️ {conn.turf}</h3>
                  <p className="text-gray-600">
                    📅 Date: {new Date(conn.date).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    🙋‍♂️ Players: {conn.players.length}/{conn.maxPlayers}
                  </p>
                  <p
                    className={`font-medium ${
                      conn.status === "full" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    Status: {conn.status}
                  </p>

                  {conn.players.length > 0 && (
                    <div className="text-sm">
                      <b>Players:</b>{" "}
                      {conn.players.map((p) => p.name).join(", ")}
                    </div>
                  )}

                  {isCreator && (
                    <div className="flex gap-2 mt-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded">
                        Start Match
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded">
                        Cancel Match
                      </button>
                    </div>
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

export default ViewConnections;
