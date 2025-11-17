import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/Approutes";
// Remove this line: import { useLocation } from "react-router-dom";

function App() {
  // Remove this line: const location = useLocation();
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}
export default App;
