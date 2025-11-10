import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { likePost, deletePost, addComment } from "../api";

/* Component: Single Post Card */
export default function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const isAuthor = user && user.username === post?.authorName;
  const hasLiked =
    user && post?.likes?.some((id) => String(id) === String(user.id));

  /* Like / Unlike Post */
  const handleLike = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    try {
      setBusy(true);
      const updated = await likePost(post._id, user.token);
      onPostUpdated(updated);
    } catch (error) {
      console.error("Like post error:", error);
      alert("Failed to update like.");
    } finally {
      setBusy(false);
    }
  };

  /* Add Comment */
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (!comment.trim()) return;
    try {
      setBusy(true);
      const updated = await addComment(post._id, comment.trim(), user.token);
      onPostUpdated(updated);
      setComment("");
    } catch (error) {
      console.error("Add comment error:", error);
      alert("Failed to add comment.");
    } finally {
      setBusy(false);
    }
  };

  /* Delete Post */
  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setBusy(true);
      await deletePost(post._id, user.token);
      onPostDeleted(post._id);
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Failed to delete post.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.card}>
      {/* Author Info */}
      <h4 style={styles.author}>@{post?.authorName || "Unknown"}</h4>

      {/* Post Text */}
      {post?.text && <p style={styles.text}>{post.text}</p>}

      {/* Post Image */}
      {post?.imageUrl && (
        <img src={post.imageUrl} alt="Post" style={styles.image} />
      )}

      {/* Timestamp */}
      <small style={styles.timestamp}>
        {new Date(post?.createdAt).toLocaleString()}
      </small>

      {/* Like / Comment / Delete Actions */}
      <div style={styles.actions}>
        <button
          onClick={handleLike}
          disabled={busy}
          style={{
            ...styles.iconButton,
            color: hasLiked ? "#1976d2" : "#555",
          }}
        >
          👍 {post?.likes?.length || 0}
        </button>

        <span style={styles.commentCount}>💬 {post?.comments?.length || 0}</span>

        {isAuthor && (
          <button onClick={handleDelete} disabled={busy} style={styles.deleteBtn}>
            Delete
          </button>
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleComment} style={styles.commentForm}>
        <input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.commentInput}
          disabled={busy}
        />
        <button type="submit" disabled={busy} style={styles.commentButton}>
          Post
        </button>
      </form>
    </div>
  );
}

/* Inline Styles */
const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  author: { margin: 0, fontWeight: 600 },
  text: { marginTop: 8, fontSize: "1rem", lineHeight: 1.5 },
  image: {
    width: "100%",
    borderRadius: 8,
    marginTop: 8,
    objectFit: "cover",
  },
  timestamp: { color: "#666", fontSize: "0.85rem" },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  iconButton: {
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: "1rem",
  },
  commentCount: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "1rem",
    color: "#555",
  },
  deleteBtn: {
    marginLeft: "auto",
    background: "#e11",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  commentForm: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  commentButton: {
    padding: "8px 12px",
    borderRadius: 6,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  },
};
