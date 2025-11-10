import React, { useEffect, useState } from "react";
import { fetchPosts, createPost } from "../api";
import { useAuth } from "../auth/AuthContext";
import PostCard from "./PostCard";

/* Component: Feed (Post list + create new post) */
export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  /* Fetch all posts on mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Update a post when liked/commented */
  const onPostUpdated = (updated) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  /* Remove post when deleted */
  const onPostDeleted = (id) =>
    setPosts((prev) => prev.filter((p) => p._id !== id));

  /* Create a new post */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first.");
    if (!text.trim() && !imageUrl.trim())
      return alert("Please add text or an image before posting.");

    try {
      setBusy(true);
      const newPost = await createPost({ text, imageUrl }, user.token);
      setPosts((prev) => [newPost, ...prev]);
      setText("");
      setImageUrl("");
    } catch (error) {
      console.error("Create post error:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p style={styles.loading}>Loading posts...</p>;

  return (
    <div style={styles.container}>
      {/* Create Post Section */}
      {user && (
        <form onSubmit={handleCreate} style={styles.createForm}>
          <h3 style={styles.heading}>Create Post</h3>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something..."
            style={styles.textarea}
            disabled={busy}
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Optional image URL"
            style={styles.input}
            disabled={busy}
          />

          <button type="submit" disabled={busy} style={styles.postButton}>
            {busy ? "Posting..." : "Post"}
          </button>
        </form>
      )}

      {/* Feed Section */}
      {posts.length === 0 ? (
        <p style={styles.empty}>No posts yet. Be the first to share something 👍</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostUpdated={onPostUpdated}
            onPostDeleted={onPostDeleted}
          />
        ))
      )}
    </div>
  );
}

/* Inline Styles */
const styles = {
  container: {
    maxWidth: 640,
    margin: "20px auto",
    padding: "0 12px",
  },
  createForm: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  heading: {
    margin: "0 0 10px 0",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    height: 80,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 8,
    fontSize: "1rem",
    resize: "none",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 8,
  },
  postButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  loading: {
    textAlign: "center",
    marginTop: 40,
    fontSize: "1.1rem",
    color: "#555",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
    fontSize: "1rem",
  },
};
