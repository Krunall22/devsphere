import { useState } from "react";
import { Card, Badge, Button, Form, Image } from "react-bootstrap";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Bookmark, Send, Trash2 } from "lucide-react"; // Added Trash2
import moment from "moment";
import axios from "axios";

const PostCard = ({ post, refreshFeed }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Get User Logic
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const token = user?.token;
  const userId = user?._id;

  // Check States
  const isBookmarked = user?.bookmarks?.includes(post._id);
  const isLiked = post.upvotes.includes(userId);
  const isDisliked = post.downvotes.includes(userId);

  // --- ACTIONS ---

  const handleVote = async (action) => {
    if (!token) return alert("Please login!");
    try {
      await axios.put(`https://devsphere-gz00.onrender.com/api/content/posts/${post._id}/vote`, { action }, { headers: { Authorization: `Bearer ${token}` } });
      refreshFeed(); 
    } catch (err) { alert("Error voting"); }
  };

  const handleBookmark = async () => {
    if (!token) return alert("Please login!");
    try {
      const { data: updatedBookmarks } = await axios.put(`https://devsphere-gz00.onrender.com/api/content/posts/${post._id}/bookmark`, {}, { headers: { Authorization: `Bearer ${token}` } });
      
      const updatedUser = { ...user, bookmarks: updatedBookmarks };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser); 
    } catch (err) { alert("Error bookmarking"); }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`https://devsphere-gz00.onrender.com/api/content/posts/${post._id}/comment`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText("");
      refreshFeed();
    } catch (err) { alert("Error commenting"); }
  };

  const handleShare = () => {
    const link = `${window.location.origin}/view/${post._id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard! Share it with anyone.");
  };

  // 🗑️ DELETE FUNCTION (Added Back)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`https://devsphere-gz00.onrender.com/api/content/${post._id}`, { headers: { Authorization: `Bearer ${token}` } });
        refreshFeed();
      } catch (err) { alert("Error deleting post"); }
    }
  };

  return (
    <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      <Card.Body>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex gap-2">
            <img 
              src={post.user?.profilePic || `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`} 
              className="rounded-circle" width="40" height="40" alt="avatar"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <h6 className="m-0 fw-bold">{post.user?.name}</h6>
              <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
             {/* Bookmark Button */}
             <Button variant="link" className="text-dark p-0 me-2" onClick={handleBookmark}>
               <Bookmark size={24} fill={isBookmarked ? "black" : "none"} color="black" />
             </Button>

             {/* 🗑️ DELETE BUTTON (Only for Owner or Admin) */}
             {(userId === post.user?._id || user?.role === 'admin') && (
               <Button variant="link" className="text-danger p-0" onClick={handleDelete}>
                 <Trash2 size={24} />
               </Button>
             )}
          </div>
        </div>

        {/* Post Content */}
        <h5 className="mt-2">{post.title}</h5>
        <Card.Text>{post.description}</Card.Text>

        {post.image && (
          <div className="mb-3">
            <Image src={post.image} fluid rounded style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
          </div>
        )}

        {/* Tags */}
        <div className="mb-3">
          {post.tags && post.tags.map((tag, idx) => <Badge key={idx} bg="light" text="dark" className="me-1 border">#{tag.trim()}</Badge>)}
        </div>

        <hr className="my-2"/>

        {/* --- ACTION BUTTONS --- */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            
            {/* LIKE */}
            <Button 
              variant="light" size="sm" onClick={() => handleVote('upvote')} 
              className={`d-flex align-items-center gap-1 ${isLiked ? "text-primary fw-bold" : "text-secondary"}`}
            >
              <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> {post.upvotes.length}
            </Button>

            {/* DISLIKE */}
            <Button 
              variant="light" size="sm" onClick={() => handleVote('downvote')} 
              className={`d-flex align-items-center gap-1 ${isDisliked ? "text-danger fw-bold" : "text-secondary"}`}
            >
              <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} /> {post.downvotes.length}
            </Button>

          </div>
          
          <div className="d-flex gap-2">
            {/* COMMENT TOGGLE */}
            <Button variant="light" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageSquare size={18}/> {post.comments.length}
            </Button>
            
            {/* SHARE */}
            <Button variant="light" size="sm" onClick={handleShare} className="d-flex align-items-center gap-1">
              <Share2 size={18}/> Share
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 bg-light p-3 rounded">
            {post.comments.map((c, i) => (
              <div key={i} className="mb-2 border-bottom pb-1">
                <small className="fw-bold">{c.user?.name}</small>
                <p className="m-0 small">{c.text}</p>
              </div>
            ))}
            <Form onSubmit={submitComment} className="mt-2 d-flex gap-2">
              <Form.Control size="sm" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
              <Button type="submit" size="sm"><Send size={14}/></Button>
            </Form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PostCard;