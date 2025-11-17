import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loaderGif from "../loader/loading.gif";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-28 h-28" />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[350px] text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleReset}>
          <label className="block text-left mb-2 font-semibold text-gray-700">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-sm"
          />

          <label className="block text-left mb-2 font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            Reset Password
          </button>
        </form>

        {/*  Error Message */}
        {error && (
          <p className="mt-5 text-red-700 font-medium bg-red-100 p-3 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/*  Success Message */}
        {message && (
          <p className="mt-5 text-green-700 font-medium bg-green-100 p-3 rounded-lg text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
