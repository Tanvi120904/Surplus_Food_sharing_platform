import React from "react";
import DonorSidebar from "../Components/DonorSidebar";

const CommunityFeed = () => {
  return (
    <div className="flex w-full h-screen">
      <DonorSidebar />
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-2xl font-bold text-[#3a003c] mb-4">Community Feed</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          Updates and messages from NGOs will appear here.
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
