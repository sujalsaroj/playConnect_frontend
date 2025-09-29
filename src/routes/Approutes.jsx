// src/routes/AppRoutes.jsx - Change path="/" to index
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardPlayer from "../pages/DashboardPlayer";

import Profile from "../pages/Profile";
import DashboardTurfOwner from "../pages/DashboardTurfOwner";
import AddTurf from "../pages/AddTurf";
import ManageTurf from "../pages/ManageTurf";
import BookTurf from "../pages/bookturf";
import ViewBookings from "../pages/viewbooking";
import RaiseConnection from "../pages/raiseconnection";
import JoinConnection from "../pages/JoinMatch";
import About from "../pages/about";
import Contact from "../pages/contactus";
import Homepage from "../pages/Home";
import ViewConnections from "../pages/viewConnection";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const AppRoutes = () => {
  console.log("AppRoutes component is rendering");
  return (
    <Routes>
      {/* Change this line from path="/" to index */}
      <Route path="/" element={<Homepage />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="dashboard-player" element={<DashboardPlayer />} />
      <Route path="raise-connection" element={<RaiseConnection />} />
      <Route path="my-connections" element={<ViewConnections />} />
      <Route path="join-match" element={<JoinConnection />} />
      <Route path="profile" element={<Profile />} />
      <Route path="dashboard-turf-owner" element={<DashboardTurfOwner />} />
      <Route path="addturf" element={<AddTurf />} />
      <Route path="manageturf" element={<ManageTurf />} />
      <Route path="bookTurf" element={<BookTurf />} />
      <Route path="mybooking" element={<ViewBookings />} />
      <Route path="about" element={<About />} />
      <Route path="contact-us" element={<Contact />} />
      <Route path="success" element={<Success />} />
      <Route path="cancel" element={<Cancel />} />
    </Routes>
  );
};

export default AppRoutes;
