import React, { useState } from "react";
import { createPost } from "../api";

/* Component: Create a new post */
export default function CreatePost({ token, onPostCreated }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* Handle post creation */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!text.trim() && !imageUrl.trim()) {
      alert("Please add text or an image before posting.");
      return;
    }

    setLoading(true);
    try {
      const newPost = await createPost({ text, imageUrl }, token);

      // Ensure post fields are safe and consistent
      const safePost = {
        _id: newPost._id,
        authorName: newPost.authorName || "Unknown",
        text: newPost.text || "",
        imageUrl: newPost.imageUrl || "",
        likes: newPost.likes || [],
        comments: newPost.comments || [],
        createdAt: newPost.createdAt || new Date().toISOString(),
      };

      onPostCreated(safePost);
      setText("");
      setImageUrl("");
    } catch (error) {
      console.error("Create post error:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Create Post</h3>

      <textarea
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Optional image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={styles.input}
        disabled={loading}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

/* Inline Styles */
const styles = {
  form: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "1rem",
    marginBottom: "1rem",
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
    height: "80px",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    resize: "none",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
