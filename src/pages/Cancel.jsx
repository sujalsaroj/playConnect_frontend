import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-gray-700 mb-6 text-center">
        Your payment was not completed. Please try again.
      </p>
      <button
        onClick={() => navigate("/book-turf")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Back to Booking
      </button>
    </div>
  );
};

export default Cancel;
