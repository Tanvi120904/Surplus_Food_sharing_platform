import React, { useEffect, useState } from "react";
import DonorSidebar from "../Components/DonorSidebar";
import axios from "axios";
import { toast } from "react-toastify";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, LineChart as ChartIcon, Users } from "lucide-react";

const ImpactTracker = () => {
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    const fetchImpactData = async () => {
        const token = localStorage.getItem("token");


      try {
        const response = await axios.get("http://127.0.0.1:8000/api/impact/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImpactData(response.data);
      } catch (error) {
        console.error("Failed to fetch impact data", error);
        toast.error("Failed to load impact stats. Try logging in again.");
      }
    };

    fetchImpactData();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <DonorSidebar />
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#3a003c] mb-8">🌟 Impact Tracker</h1>

        {impactData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Total Donations */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition">
                <Box className="text-purple-700" size={36} />
                <div>
                  <p className="text-gray-500 text-sm">Total Donations</p>
                  <p className="text-3xl font-extrabold text-[#3a003c]">
                    <CountUp end={impactData.total_donations} duration={1.5} />
                  </p>
                </div>
              </div>

              {/* Monthly Growth */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition">
                <ChartIcon className="text-purple-700" size={36} />
                <div>
                  <p className="text-gray-500 text-sm">Monthly Growth (%)</p>
                  <p className="text-3xl font-extrabold text-[#3a003c]">
                    <CountUp
                      end={
                        typeof impactData.monthly_growth === "number"
                          ? impactData.monthly_growth
                          : 0
                      }
                      decimals={2}
                      duration={1.5}
                    />
                    %
                  </p>
                </div>
              </div>

              {/* People Helped */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition">
                <Users className="text-purple-700" size={36} />
                <div>
                  <p className="text-gray-500 text-sm">People Helped</p>
                  <p className="text-3xl font-extrabold text-[#3a003c]">
                    <CountUp end={impactData.people_helped} duration={1.5} />
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#3a003c] mb-4">
                📅 Monthly Donations Overview
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={impactData.monthly_chart_data}>
                  <defs>
                    <linearGradient id="colorDonate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6a0dad" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6a0dad" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
                    labelStyle={{ color: "#6a0dad" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#6a0dad"
                    fillOpacity={1}
                    fill="url(#colorDonate)"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">Loading stats...</p>
        )}
      </div>
    </div>
  );
};

export default ImpactTracker;
