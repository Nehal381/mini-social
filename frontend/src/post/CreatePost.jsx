import React, { useState } from "react";
import { createPost } from "../api";
import { useAuth } from "../auth/AuthContext";

/* Component: Create a new post */
export default function CreatePost() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* Handle post submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in first.");
      return;
    }

    if (!text.trim()) {
      alert("Post cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await createPost({ text }, user.token);
      alert("Post created successfully!");
      setText("");
    } catch (error) {
      console.error("Create post error:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
        disabled={loading}
      />
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

/* Inline styling for simplicity (can move to CSS or MUI later) */
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    maxWidth: "400px",
    margin: "20px auto",
  },
  textarea: {
    padding: "10px",
    minHeight: "80px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none",
    fontFamily: "inherit",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color 0.3s ease",
  },
};
