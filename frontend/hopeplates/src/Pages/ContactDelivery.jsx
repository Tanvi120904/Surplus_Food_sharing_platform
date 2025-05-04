import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReceiverSidebar from "../Components/ReceiverSidebar";

const ContactDelivery = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const donorFromState = state?.donor || JSON.parse(localStorage.getItem("donor"));
  const shelterFromState = state?.shelter || JSON.parse(localStorage.getItem("shelter"));

  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!donorFromState || !shelterFromState) {
      alert("Donor or shelter information is missing.");
      navigate("/confirm-donation");
      return;
    }

    const currentDonor = localStorage.getItem("donor");
    const currentShelter = localStorage.getItem("shelter");

    if (
      JSON.stringify(donorFromState) !== currentDonor ||
      JSON.stringify(shelterFromState) !== currentShelter
    ) {
      localStorage.setItem("donor", JSON.stringify(donorFromState));
      localStorage.setItem("shelter", JSON.stringify(shelterFromState));
    }

    const fetchDeliveryPartners = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("receiverToken");
        if (!token) throw new Error("Authentication token is missing.");

        const res = await fetch("http://127.0.0.1:8000/api/receiver-delivery-partners/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch delivery partners. Please re-login.");
        }

        const data = await res.json();
        setDeliveryPartners(data?.partners || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPartners();
  }, [navigate]);

  const handleNotify = async () => {
    if (!selectedPartnerId) {
      alert("Please select a delivery partner.");
      return;
    }

    const payload = {
      shelter_id: shelterFromState?.id,
      donor_id: donorFromState?.id,
      delivery_partner_id: selectedPartnerId,
    };

    try {
      setNotificationLoading(true);
      const token = localStorage.getItem("receiverToken");

      // Step 1: Send Notification
      const res = await fetch("http://127.0.0.1:8000/api/send-notification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.message !== "Notification sent successfully") {
        throw new Error(data.message || "Notification failed.");
      }

      // ✅ Step 2: Mark donation and delivery partner unavailable
      const confirmRes = await fetch(`http://127.0.0.1:8000/api/confirm-donation/${donorFromState.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          delivery_partner_id: selectedPartnerId,
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.message || "Failed to confirm donation.");
      }

      alert("✅ Notification sent & donation confirmed!");
      navigate("/receiver-home");
    } catch (err) {
      alert(err.message || "Failed to send notification.");
    } finally {
      setNotificationLoading(false);
    }
  };

  return (
    <div className="flex">
      <ReceiverSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Contact Delivery Partner</h2>

        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Selected Shelter</h3>
          <p>{shelterFromState?.name || "N/A"} – {shelterFromState?.address || "N/A"}</p>
        </div>

        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Donor Info</h3>
          <p><strong>{donorFromState?.donor_name || "Unknown Donor"}</strong></p>
          <p>📍 {donorFromState?.donor_location || "No location"}</p>
          <p>🍱 {donorFromState?.food_item}</p>
          <p>Quantity: {donorFromState?.quantity}</p>
        </div>

        <div className="flex justify-between items-center mt-6 mb-2">
          <h3 className="font-semibold text-lg">Choose a Delivery Partner</h3>
          <button
            onClick={() => navigate("/add-delivery-partner")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            ➕ Add Delivery Partner
          </button>
        </div>

        {loading && <p>Loading delivery partners...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && deliveryPartners.length === 0 && (
          <div className="bg-yellow-100 p-4 rounded-lg shadow mt-4">
            <p className="mb-2">No delivery partners found.</p>
            <button
              onClick={() => navigate("/add-delivery-partner")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Add Delivery Partner
            </button>
          </div>
        )}

        <ul className="space-y-4 mt-4">
          {deliveryPartners.map((partner) => (
            <li
              key={partner.id}
              className={`cursor-pointer p-4 rounded-lg border ${
                selectedPartnerId === partner.id
                  ? "bg-green-100 border-green-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedPartnerId(partner.id)}
            >
              <strong>{partner.name}</strong> – 📞 {partner.contact_number} –{" "}
              <span className={partner.is_available ? "text-green-600" : "text-red-600"}>
                {partner.is_available ? "Available" : "Unavailable"}
              </span>
            </li>
          ))}
        </ul>

        {selectedPartnerId && (
          <button
            onClick={handleNotify}
            className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
            disabled={notificationLoading}
          >
            {notificationLoading ? "Sending Notification..." : "Send Notification"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactDelivery;
