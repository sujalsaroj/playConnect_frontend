import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        const userData = {
          ...data,
          profilePic: data.profilePic
            ? `${import.meta.env.VITE_API_URL}${data.profilePic}`
            : null,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();

    const handleUserUpdate = (e) => {
      const updatedUser = {
        ...e.detail,
        profilePic: e.detail.profilePic
          ? e.detail.profilePic.startsWith("http")
            ? e.detail.profilePic
            : `${import.meta.env.VITE_API_URL}${e.detail.profilePic}`
          : null,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          PlayConnect
        </Link>

        {/* Nav Links & Auth/User */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6 text-xl">
            <NavLinks user={user} closeMenu={() => {}} />
          </div>
          {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <AuthLinks />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavLinks
            user={user}
            mobile
            closeMenu={() => setMobileMenuOpen(false)}
          />
          {user ? (
            <UserDropdown
              user={user}
              onLogout={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              mobile
            />
          ) : (
            <AuthLinks />
          )}
        </div>
      )}
    </nav>
  );
}

//  Updated Role-based NavLinks
function NavLinks({ user, mobile = false, closeMenu }) {
  const className = `block py-2 px-3 hover:bg-green-800 rounded ${
    mobile ? "text-lg" : ""
  }`;

  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  const role = user?.role; // player / owner / undefined

  return (
    <>
      {/* Home - Common */}

      {/* Book Turf - Visible to everyone except owner */}
      {role !== "owner" && (
        <>
          <Link to="/home" className={className} onClick={handleClick}>
            Home
          </Link>
          <Link
            to="/dashboard-player"
            className={className}
            onClick={handleClick}
          >
            Book Turf
          </Link>
        </>
      )}
      {role == "owner" && (
        <Link
          to="/dashboard-turf-owner"
          className={className}
          onClick={handleClick}
        >
          Home
        </Link>
      )}
      {/* About - Common */}
      <Link to="/about" className={className} onClick={handleClick}>
        About
      </Link>

      {/* Contact - Common */}
      <Link to="/contact-us" className={className} onClick={handleClick}>
        Contact
      </Link>
    </>
  );
}

//  Auth Links (Login/Register)
function AuthLinks() {
  return (
    <div className="flex items-center space-x-3">
      <Link
        to="/login"
        className="px-3 py-1 bg-white text-green-800 rounded font-semibold hover:bg-gray-100 transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-3 py-1 bg-white text-green-800 rounded font-semibold hover:bg-gray-100 transition"
      >
        Register
      </Link>
    </div>
  );
}

//  User Dropdown
function UserDropdown({ user, onLogout, mobile = false }) {
  const [open, setOpen] = useState(false);

  const name = user.name || user.email.split("@")[0];
  const firstLetter = name.charAt(0).toUpperCase();
  const photoURL = user.profilePic || null;

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full border-2 border-white hover:scale-105 transition"
          />
        ) : (
          <div className="rounded-full w-9 h-9 flex items-center justify-center text-white font-semibold bg-gray-500">
            {firstLetter}
          </div>
        )}
        <span
          className={`${mobile ? "inline" : "hidden md:inline"} font-medium`}
        >
          {name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-green-900 rounded-md shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-green-100"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-green-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
