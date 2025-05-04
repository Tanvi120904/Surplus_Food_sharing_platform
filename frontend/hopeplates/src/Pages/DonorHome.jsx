import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DonorSidebar from "../Components/DonorSidebar";
import axios from "axios";

const DonorHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    donations_made: 0,
    people_served: 0,
    meals_served_today: 0,
    average_rating: 0,
    recent_donations: [],
  });

  useEffect(() => {
    const donorId = localStorage.getItem("donor_id");
    const token = localStorage.getItem("token");

    if (!donorId || !token) {
      console.log("No donor ID or token found. Redirecting to login.");
      navigate("/donor-login"); // ✅ Updated this line
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/donor-dashboard-combined/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/donor-login");
        }
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <DonorSidebar />
      <div className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-[#3a003c] mb-2">
          Welcome Back, Donor!
        </h1>
        <p className="text-lg text-[#3a003c] mb-6">Want to donate today?</p>
        <button
          onClick={() => navigate("/add-donation")}
          className="bg-[#3a003c] text-white px-5 py-2 rounded-md mb-10"
        >
          Enable Donation
        </button>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-3xl font-bold text-[#3a003c]">
              {stats.meals_served_today}
            </h2>
            <p>Meals Served Today</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-3xl font-bold text-[#3a003c]">
              {stats.people_served}+
            </h2>
            <p>People Helped</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-3xl font-bold text-[#3a003c]">
              {stats.average_rating} ⭐
            </h2>
            <p>Average Rating</p>
          </div>
        </div>

        {/* Optional: Recent Donations */}
        <h2 className="text-2xl font-semibold text-[#3a003c] mb-4">
          Recent Donations
        </h2>
        <ul>
          {stats.recent_donations?.map((d, index) => (
            <li key={index} className="bg-white p-4 mb-2 rounded shadow">
              <strong>{d.food_item}</strong> – {d.quantity} units –{" "}
              {d.status.toUpperCase()} on {d.created_at}
            </li>
          ))}
        </ul>

        {/* Quick Access Section */}
        <h2 className="text-2xl font-semibold text-[#3a003c] mt-10 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-[#3a003c]">🌍 View Impact</h3>
            <p className="text-gray-600">
              See how your donations have made a difference.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-[#3a003c]">💬 Community Feed</h3>
            <p className="text-gray-600">
              See messages and updates from NGOs and other donors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorHome;