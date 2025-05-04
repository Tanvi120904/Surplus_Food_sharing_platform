import React from "react";
import { FaHome, FaPlus, FaChartBar, FaComments } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // ✅ Clear JWT tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Optionally, clear other session data
    sessionStorage.clear();

    // ✅ Redirect to welcome/login page
    navigate("/");
  };

  return (
    <div className="w-64 bg-[#3a003c] text-white p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center">
          <img src="/logo1.png" alt="logo" className="w-20 h-20 mb-3" />
          <h1 className="text-white text-xl font-bold mb-10">HopePlates</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/donor-home")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/donor-home")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaHome /> Dashboard
          </button>
          <button
            onClick={() => navigate("/add-donation")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/add-donation")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaPlus /> Add Donation
          </button>
          <button
            onClick={() => navigate("/impact-tracker")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/impact-tracker")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaChartBar /> Impact Tracker
          </button>
          <button
            onClick={() => navigate("/community-feed")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/community-feed")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaComments /> Community Feed
          </button>
        </div>
      </div>

      {/* ✅ Working Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-pink-100 text-red-500 py-2 px-4 rounded-md mt-6 hover:bg-red-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
