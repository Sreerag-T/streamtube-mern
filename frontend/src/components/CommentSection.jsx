import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";
import { timeAgo } from "./VideoCard.jsx";

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState("");

  const loadComments = async () => {
    try {
      const { data } = await api.get(`/comments/video/${videoId}`);
      setComments(data);
    } catch (err) {
      setError("Could not load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      const { data } = await api.post("/comments", { videoId, text: newText });
      setComments((prev) => [data, ...prev]);
      setNewText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post comment.");
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const submitEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const { data } = await api.put(`/comments/${id}`, { text: editText });
      setComments((prev) => prev.map((c) => (c._id === id ? data : c)));
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update comment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment.");
    }
  };

  return (
    <div>
      <h3 className="comments-heading">{comments.length} Comments</h3>

      {error && <div className="form-error-banner">{error}</div>}

      {user ? (
        <form className="comment-form" onSubmit={handleAdd}>
          <div className="comment-avatar">{user.username?.[0]?.toUpperCase()}</div>
          <div className="comment-input-row">
            <textarea
              className="comment-textarea"
              rows={1}
              placeholder="Add a comment..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            {newText && (
              <div className="comment-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setNewText("")}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Comment
                </button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <p className="video-sub" style={{ marginBottom: 20 }}>
          Sign in to leave a comment.
        </p>
      )}

      {loading ? (
        <p className="loading-text">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="video-sub">No comments yet. Be the first to comment.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-avatar">{comment.user?.username?.[0]?.toUpperCase() || "?"}</div>
            <div className="comment-body">
              <div className="comment-meta">
                <span className="comment-username">{comment.user?.username || "Deleted user"}</span>
                <span className="comment-date">{timeAgo(comment.createdAt)}</span>
              </div>

              {editingId === comment._id ? (
                <div>
                  <textarea
                    className="comment-textarea"
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="comment-form-actions">
                    <button className="btn btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                    <button className="btn" onClick={() => submitEdit(comment._id)}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="comment-text">{comment.text}</p>
                  {user?.id === comment.user?._id && (
                    <div className="comment-actions">
                      <button className="comment-action-btn" onClick={() => startEdit(comment)}>
                        Edit
                      </button>
                      <button className="comment-action-btn" onClick={() => handleDelete(comment._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
