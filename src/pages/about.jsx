import React, { useState, useEffect } from "react";
import { Users, Building2, Target, Lightbulb } from "lucide-react";
import loaderGif from "../loader/loading.gif";

const About = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (can replace with API later)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="bg-gray-50 py-14">
      <div className="max-w-6xl mx-auto px-6 text-gray-800">
        <h1 className="text-4xl font-extrabold mb-6 text-green-600 text-center">
          About <span className="text-gray-900">PlayConnect</span>
        </h1>

        <p className="mb-10 text-lg text-center max-w-3xl mx-auto">
          <strong>PlayConnect</strong> is a modern turf booking platform that
          bridges the gap between{" "}
          <span className="text-green-600">players</span> and{" "}
          <span className="text-green-600">turf owners</span>. We make booking
          and managing sports turfs simple, fast, and community-driven.
        </p>

        {/* Mission */}
        <div className="mb-10">
          <h2 className="flex items-center text-2xl font-semibold mb-3 text-green-500">
            <Target className="w-6 h-6 mr-2" /> Our Mission
          </h2>
          <p>
            To connect sports lovers with quality turfs and help turf owners
            digitize their booking & management with ease.
          </p>
        </div>

        {/* For Players */}
        <div className="mb-10">
          <h2 className="flex items-center text-2xl font-semibold mb-3 text-green-500">
            <Users className="w-6 h-6 mr-2" /> For Players
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Find and book nearby turfs instantly</li>
            <li>Choose time slots, pay securely, and get confirmation</li>
            <li>Post connections like “Looking for players at 6 PM”</li>
            <li>Join open games and expand your network</li>
          </ul>
        </div>

        {/* For Turf Owners */}
        <div className="mb-10">
          <h2 className="flex items-center text-2xl font-semibold mb-3 text-green-500">
            <Building2 className="w-6 h-6 mr-2" /> For Turf Owners
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Manage turf listings & slots effortlessly</li>
            <li>Edit turf details anytime with ease</li>
            <li>Track bookings and player requests</li>
            <li>Boost visibility by showcasing your turf</li>
          </ul>
        </div>

        {/* Why Choose */}
        <div className="mb-10">
          <h2 className="flex items-center text-2xl font-semibold mb-3 text-green-500">
            <Lightbulb className="w-6 h-6 mr-2" /> Why Choose PlayConnect?
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Simple dashboards for owners & players</li>
            <li>Real-time booking with instant updates</li>
            <li>Powered by modern stack (React + Node + MongoDB)</li>
            <li>Focus on sports community & connections</li>
          </ul>
        </div>

        <p className="text-lg font-medium text-center text-gray-700">
          Whether you're playing or managing — with{" "}
          <span className="text-green-600 font-bold">PlayConnect</span>, you're
          always just one tap away from the game! ⚡
        </p>
      </div>
    </div>
  );
};

export default About;
