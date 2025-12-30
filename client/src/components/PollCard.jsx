import { Card, ProgressBar, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";

const PollCard = ({ poll, refreshFeed }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Calculate Total Votes
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);

  // --- VOTE FUNCTION ---
  const handleVote = async (index) => {
    if (!token) return alert("Please login to vote!");
    try {
      await axios.put(
        `https://devsphere-gz00.onrender.com/api/content/polls/${poll._id}/vote`,
        { optionIndex: index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshFeed();
    } catch (err) {
      alert(err.response?.data?.message || "Error voting");
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        await axios.delete(`https://devsphere-gz00.onrender.com/api/content/${poll._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.reload(); // Refresh to see changes
      } catch (err) {
        alert("Error deleting poll");
      }
    }
  };

  return (
    <Card className="mb-3 border-primary shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5>📊 {poll.question}</h5>
            <Card.Subtitle className="mb-2 text-muted">
              @{poll.user?.name || "Unknown"} • {moment(poll.createdAt).fromNow()}
            </Card.Subtitle>
          </div>

          {/* 🗑️ DELETE BUTTON (Only shows if YOU are Owner OR Admin) */}
          {userInfo && (userInfo._id === poll.user?._id || userInfo.role === 'admin') && (
            <Button variant="outline-danger" size="sm" onClick={handleDelete} style={{ border: "none" }}>
              🗑️
            </Button>
          )}
        </div>

        {/* OPTIONS LIST */}
        <div className="mt-3">
            {poll.options.map((opt, idx) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
            return (
                <div key={idx} className="mb-3" onClick={() => handleVote(idx)} style={{ cursor: "pointer" }}>
                <div className="d-flex justify-content-between">
                    <span>{opt.optionText}</span>
                    <span className="fw-bold">{percentage}%</span>
                </div>
                <ProgressBar now={percentage} variant="info" style={{ height: "10px" }} />
                <small className="text-muted">{opt.votes} votes</small>
                </div>
            );
            })}
        </div>

        <small className="text-muted mt-2 d-block">{totalVotes} Total Votes</small>
      </Card.Body>
    </Card>
  );
};

export default PollCard;