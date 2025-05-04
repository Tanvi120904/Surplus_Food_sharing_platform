import { Routes, Route } from "react-router-dom";
import DonorLogin from "./Pages/DonorLogin";
import DonorRegister from "./Pages/DonorRegister";
import DonorHome from "./Pages/DonorHome";
import ReceiverLogin from "./Pages/ReceiverLogin";
import ReceiverHome from "./Pages/ReceiverHome";
import Welcome from "./Pages/Welcome";
import AddDonation from "./Pages/AddDonation";
import ImpactTracker from "./Pages/ImpactTracker";
import CommunityFeed from "./Pages/CommunityFeed";
import ReceiverRegister from "./Pages/ReceiverRegister"; 
import ConfirmDonation from "./Pages/ConfirmDonation";
import AddShelter from "./Pages/AddShelter";
import ContactDelivery from "./Pages/ContactDelivery";
import AddDeliveryPartner from "./Pages/AddDeliveryPartner";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route path="/donor-register" element={<DonorRegister />} />
        <Route path="/donor-home" element={<DonorHome />} />
        <Route path="/receiver-register" element={<ReceiverRegister />} />
        <Route path="/receiver-login" element={<ReceiverLogin />} />
        <Route path="/receiver-home" element={<ReceiverHome />} />
        <Route path="/add-donation" element={<AddDonation />} />
        <Route path="/impact-tracker" element={<ImpactTracker />} />
        <Route path="/community-feed" element={<CommunityFeed />} />
        <Route path="/confirm-donation" element={<ConfirmDonation />} />
        <Route path="/confirm-donation/:donationId" element={<ConfirmDonation />} />
        <Route path="/add-shelter" element={<AddShelter />} />
        <Route path="/contact-delivery" element={<ContactDelivery />} />
        <Route path="/add-delivery-partner" element={<AddDeliveryPartner />} />
      </Routes>

      {/* ✅ ToastContainer placed correctly outside Routes */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}


export default App;
