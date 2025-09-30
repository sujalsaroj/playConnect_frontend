import React, { useEffect, useState } from "react";
import loaderGif from "../loader/loading.gif";

// 🔹 Avatar with initials and consistent color
function getRandomColor(seed = null) {
  const colors = [
    "#F87171",
    "#FBBF24",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
    "#F472B6",
    "#FCD34D",
  ];
  if (seed) {
    const charCode = seed.toUpperCase().charCodeAt(0);
    return colors[charCode % colors.length];
  }
  return colors[Math.floor(Math.random() * colors.length)];
}

function Avatar({ name, photoURL, size = 112 }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt="Profile"
        width={size}
        height={size}
        className="rounded-full border-4 border-gray-200 object-cover"
      />
    );
  }

  // Show initials
  let initials = "?";
  if (name) {
    const parts = name.split(" ");
    initials =
      parts.length === 1
        ? parts[0].charAt(0).toUpperCase()
        : (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }

  const bgColor = getRandomColor(initials);

  return (
    <div
      style={{ backgroundColor: bgColor, width: size, height: size }}
      className="flex items-center justify-center rounded-full text-white font-bold text-4xl"
    >
      {initials}
    </div>
  );
}

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [previewPic, setPreviewPic] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("https://playconnect-backend.vercel.app/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setForm(data);
      setPreviewPic(
        data.profilePic
          ? `http://https://playconnect-backend.vercel.app/${data.profilePic}`
          : null
      );
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profilePic: file }); // file to send backend
      setPreviewPic(URL.createObjectURL(file)); // preview locally
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(form).forEach((key) => {
        formDataToSend.append(key, form[key]);
      });

      const res = await fetch(
        "https://playconnect-backend.vercel.app/api/update",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      // ✅ Fix: Always store full URL for profilePic
      const profilePicURL = updated.user.profilePic
        ? `http://https://playconnect-backend.vercel.app/${updated.user.profilePic}`
        : null;

      const updatedUser = { ...updated.user, profilePic: profilePicURL };

      // Update local state
      setProfile(updatedUser);
      setForm(updatedUser);
      setPreviewPic(profilePicURL);

      // Update localStorage so Navbar sees changes
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Dispatch event so Navbar updates immediately
      window.dispatchEvent(
        new CustomEvent("userUpdated", { detail: updatedUser })
      );

      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed!");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <img src={loaderGif} alt="Loading..." className="w-30 h-30" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <Avatar name={profile?.name} photoURL={previewPic} size={112} />
        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={handlePicChange}
            className="mt-3"
          />
        )}
      </div>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email || ""}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob ? form.dob.substring(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {profile?.address || "N/A"}
          </p>
          <p>
            <strong>DOB:</strong>{" "}
            {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Gender:</strong> {profile?.gender || "N/A"}
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setEditMode(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
