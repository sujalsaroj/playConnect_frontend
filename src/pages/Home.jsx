// Homepage.jsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Hero from "../components/Herosection";
import Features from "../components/Feacture";
import Guide from "../components/step_to_guide";

import Testinomial from "../components/Testinomial";
import Badge from "../components/Badge";

function Homepage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="scroll-smooth">
      {/* Hero Section */}
      <div>
        <Hero />
      </div>

      {/* Features Section */}
      <div data-aos="fade-up">
        <Features />
      </div>

      {/* How it Works / Guide Section */}
      <div data-aos="fade-up">
        <Guide />
      </div>

      {/* Top Turfs Section */}
      <div data-aos="fade-up">
        <Badge />
      </div>

      {/* Testimonials Section */}
      <div data-aos="fade-up">
        <Testinomial />
      </div>
    </div>
  );
}

export default Homepage;
