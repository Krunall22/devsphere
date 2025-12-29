import { Card, ProgressBar, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";

const PollCard = ({ poll, refreshFeed }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  // Calculate Total Votes
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);

  const handleVote = async (index) => {
    if (!token) return alert("Please login to vote!");
    try {
      await axios.put(
        `http://localhost:5000/api/content/polls/${poll._id}/vote`,
        { optionIndex: index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshFeed();
    } catch (err) {
      alert(err.response?.data?.message || "Error voting");
    }
  };

  return (
    <Card className="mb-3 border-primary shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <h5>📊 {poll.question}</h5>
          <small className="text-muted">{moment(poll.createdAt).fromNow()}</small>
        </div>
        <Card.Subtitle className="mb-3 text-muted">@{poll.user?.name}</Card.Subtitle>

        {poll.options.map((opt, idx) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
          return (
            <div key={idx} className="mb-2" onClick={() => handleVote(idx)} style={{ cursor: "pointer" }}>
              <div className="d-flex justify-content-between">
                <span>{opt.optionText}</span>
                <span>{percentage}% ({opt.votes})</span>
              </div>
              <ProgressBar now={percentage} variant="info" style={{ height: "10px" }} />
            </div>
          );
        })}
        <small className="text-muted">{totalVotes} Total Votes</small>
      </Card.Body>
    </Card>
  );
};

export default PollCard;