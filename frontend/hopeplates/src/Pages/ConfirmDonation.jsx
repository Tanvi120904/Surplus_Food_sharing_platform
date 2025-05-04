import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReceiverSidebar from "../Components/ReceiverSidebar";

const ConfirmDonation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const donor = state?.donor;

  const [shelters, setShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("✅ Received donor in ConfirmDonation:", donor);

    // Check if donor data exists
    if (!donor) {
      setError("❌ No donor data provided.");
      console.error("❌ Donor data is missing.");
      return;
    }

    // Check if donor location is valid
    if (!donor.pickup_latitude || !donor.pickup_longitude) {
      setError("❌ Invalid or missing donor location data.");
      console.error("❌ Donor location missing:", donor);
      return;
    }

    // Fetch shelters based on donor location
    const fetchShelters = async () => {
      const token = localStorage.getItem("receiverToken");
      setError("");

      try {
        const res = await fetch(
          `http://localhost:8000/api/my-shelters/?lat=${donor.pickup_latitude}&lon=${donor.pickup_longitude}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        // Navigate to Add Shelter page if no shelters are found
        if (data.message === "You have not added any shelters yet.") {
          navigate("/add-shelter");
          return;
        }

        console.log("✅ All shelters fetched:", data);
        setShelters(data);

        // Filter shelters within 50 km of donor
        const nearby = data.filter((shelter) => {
          return (
            shelter.latitude &&
            shelter.longitude &&
            getDistanceFromLatLonInKm(
              donor.pickup_latitude,
              donor.pickup_longitude,
              shelter.latitude,
              shelter.longitude
            ) <= 50
          );
        });

        console.log("✅ Nearby shelters (≤ 50km):", nearby);
        setFilteredShelters(nearby);
      } catch (err) {
        console.error("❌ Error fetching shelters:", err);
        setError("Failed to fetch shelters: " + err.message);
      }
    };

    fetchShelters();
  }, [donor, navigate]);

  // Function to calculate the distance between donor and shelter in km
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Handle the confirm action (select shelter and proceed)
  const handleConfirm = () => {
    if (!selectedShelterId) {
      alert("Please select a shelter.");
      return;
    }

    const selectedShelter = filteredShelters.find(
      (shelter) => String(shelter.id) === String(selectedShelterId)
    );

    if (!selectedShelter) {
      alert("Selected shelter not found.");
      return;
    }

    console.log("✅ Confirming donation with shelter:", selectedShelter);

    // Navigate to the Contact Delivery page with the donor and selected shelter
    navigate("/contact-delivery", {
      state: {
        donor,
        shelter: selectedShelter,
      },
    });
  };

  return (
    <div className="flex">
      <ReceiverSidebar />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Confirm Donation</h2>

        {/* Donor Info */}
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-bold mb-3">Donor Info</h3>
          <p className="text-lg font-semibold">{donor?.donor_name || "No Name Provided"}</p>
          <p>📍 {donor?.donor_location || "Location not provided"}</p>
          <p>🍱 {donor?.food_item || "Food Item not provided"}</p>
          <p>Quantity: {donor?.quantity || "Not specified"}</p>
        </div>

        {/* Shelter Selection */}
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-bold mb-3 text-center">Nearby Shelters</h3>

          {filteredShelters.length === 0 ? (
            <div className="bg-yellow-100 p-4 rounded text-yellow-800 border border-yellow-400 text-center">
              <p>No shelters found nearby (within 50km).</p>
              <button
                onClick={() => navigate("/add-shelter")}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                ➕ Add Shelter
              </button>
            </div>
          ) : (
            <div>
              <ul className="space-y-2">
                {filteredShelters.map((shelter, index) => (
                  <li
                    key={shelter.id || `${shelter.name}-${index}`} // fallback key
                    className={`border p-3 rounded cursor-pointer transition ${
                      selectedShelterId === shelter.id
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      console.log("✅ Shelter clicked:", shelter);
                      setSelectedShelterId(shelter.id);
                    }}
                  >
                    <strong>{shelter.name}</strong>
                    <p>📍 {shelter.address}</p>
                    {shelter.number_of_people && <p>👥 People: {shelter.number_of_people}</p>}
                    {shelter.contact_number && <p>📞 Contact: {shelter.contact_number}</p>}
                  </li>
                ))}
              </ul>

              <button
                className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                onClick={handleConfirm}
                disabled={!selectedShelterId}
              >
                ✅ Confirm
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ConfirmDonation;
