  // src/components/MatchCard.jsx
  import React from "react";

  const MatchCard = ({ match }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto my-4">
        <h2 className="text-xl font-bold mb-2">{match.sport}</h2>
        <p className="text-gray-600 mb-1">
          📍 <strong>Location:</strong> {match.location}
        </p>
        <p className="text-gray-600 mb-1">
          📅 <strong>Date:</strong> {match.date}
        </p>
        <p className="text-gray-600 mb-1">
          🕒 <strong>Time:</strong> {match.time}
        </p>
        <p className="text-gray-600 mb-1">
          🎯 <strong>Skill:</strong> {match.skillLevel}
        </p>
        <p className="text-gray-600 mb-4">
          👥 <strong>Players Needed:</strong> {match.playersNeeded}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded">
          Join Match
        </button>
      </div>
    );
  };

  export default MatchCard;
