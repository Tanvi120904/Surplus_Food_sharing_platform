import React from "react";
import { BadgeCheck, MapPin, Utensils } from "lucide-react";

const DonorCard = ({ donor, onClick }) => {
  const isActive = donor.status === "active";

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4 flex items-start space-x-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
      title="Click to view details"
    >
      <div
        className={`w-3 h-3 mt-1 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
        title={isActive ? "Active" : "Inactive"}
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{donor.donor_name}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <MapPin size={16} className="mr-1" />
          {donor.donor_address || "Unknown location"}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Utensils size={16} className="mr-1" />
            Food Items: {donor.food_item || "N/A"}
          </div>
          <div>
            Status:{" "}
            <span className={isActive ? "text-green-600" : "text-gray-600"}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      <BadgeCheck className="text-blue-500 mt-1" />
    </div>
  );
};

export default DonorCard;
