import React, { useState } from "react";
import { toast } from "react-toastify";
import loaderGif from "../loader/loading.gif";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setMessage(
          "Password reset link has been sent to your email. Please check your inbox."
        );
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send reset email");
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
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Forgot Password
        </h2>

        <form onSubmit={handleForgot}>
          <label className="block text-left mb-2 font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-5 text-green-700 font-medium bg-green-100 p-3 rounded-lg text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
