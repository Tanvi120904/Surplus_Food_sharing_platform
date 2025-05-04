import SubmitFeedback from '../components/feedback/SubmitFeedback';

function RecipientDashboard() {
  const token = localStorage.getItem('token');  // or however you're storing it
  const donationId = selectedDonation?.id;      // based on what you display

  return (
    <div>
      <h2>Donation Details</h2>
      {/* ...donation info here... */}

      <h3>Leave Feedback</h3>
      <SubmitFeedback donationId={donationId} token={token} />
    </div>
  );
}
