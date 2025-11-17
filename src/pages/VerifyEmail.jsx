import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setStatus(query.get("status"));
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {status === "success" ? (
        <div className="text-center bg-green-50 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            ✅ Email Verified Successfully!
          </h1>
          <p className="text-gray-700 mb-6">
            You can now log in to your TurfBooking account.
          </p>
          <Link
            to="/login"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Login
          </Link>
        </div>
      ) : status === "failed" ? (
        <div className="text-center bg-red-50 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            ❌ Verification Failed
          </h1>
          <p className="text-gray-700 mb-6">
            The verification link is invalid or expired. Please register again.
          </p>
          <Link
            to="/register"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go to Register
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600">
            Verifying your email...
          </h1>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
