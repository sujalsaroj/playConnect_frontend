import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitterSquare,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-green-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-xl font-bold mb-3">About Us</h3>
            <p className="text-sm text-gray-200">
              PlayConnect is your go-to platform for booking turfs and
              connecting with football lovers. Join us and kick off the fun!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/home"
                  className="hover:underline hover:text-gray-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/bookturf"
                  className="hover:underline hover:text-gray-300"
                >
                  Book Turf
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:underline hover:text-gray-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:underline hover:text-gray-300"
                >
                  About PlayConnect
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="text-xl font-bold mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a
                href="http://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300"
              >
                <FaFacebook />
              </a>
              <a
                href="http://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300"
              >
                <FaInstagram />
              </a>
              <a
                href="http://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300"
              >
                <FaTwitterSquare />
              </a>
              <a
                href="http://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-green-700 pt-4 text-center text-sm text-gray-300">
          © 2025 PlayConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
