import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://https://playconnect-backend.vercel.app/";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get("bookingId");

    const confirmBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE}/api/payment/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId }),
        });

        alert("✅ Payment successful, booking confirmed!");
        navigate("/bookTurf");
      } catch (err) {
        console.error("Confirm booking error:", err);
        alert("❌ Could not confirm booking.");
      }
    };

    if (bookingId) confirmBooking();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-green-600">
        Processing your booking...
      </h2>
    </div>
  );
};

export default Success;
