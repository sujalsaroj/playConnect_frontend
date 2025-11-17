import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1> Payment Cancelled</h1>
      <p>Your payment was not completed. Please try again.</p>
      <button
        onClick={() => navigate("/book-turf")}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        Back to Booking
      </button>
    </div>
  );
};

export default Cancel;
