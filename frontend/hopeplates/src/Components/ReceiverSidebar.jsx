import React, { useCallback } from "react";
import { FaHome, FaCheckCircle, FaTruck, FaPlusSquare } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const ReceiverSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = () => {
    // Clear auth tokens or user session here
    localStorage.clear(); // or localStorage.removeItem("yourKey")
    navigate("/receiver-login");
  };

  return (
    <div className="w-64 bg-[#003c2f] text-white p-6 flex flex-col justify-between h-screen">
      <div>
        <div className="flex flex-col items-center">
          <img src="/logo1.png" alt="logo" className="w-20 h-20 mb-3" />
          <h1 className="text-white text-xl font-bold mb-10">HopePlates</h1>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleNavigate("/receiver-home")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/receiver-home")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaHome /> Dashboard
          </button>
          <button
            onClick={() => handleNavigate("/confirm-donation")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/confirm-donation")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaCheckCircle /> Confirm Donation
          </button>
          <button
            onClick={() => handleNavigate("/contact-delivery")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/contact-delivery")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaTruck /> Contact Delivery
          </button>
          <button
            onClick={() => handleNavigate("/add-shelter")}
            className={`flex items-center gap-3 py-2 px-4 rounded-md ${
              isActive("/add-shelter")
                ? "bg-white text-black"
                : "bg-transparent hover:bg-white hover:text-black"
            }`}
          >
            <FaPlusSquare /> Add Shelter
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-green-100 text-red-500 py-2 px-4 rounded-md mt-6 hover:bg-red-100 hover:text-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default ReceiverSidebar;
