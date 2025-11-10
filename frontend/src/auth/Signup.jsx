import React, { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";

/* Component: User Signup */
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  /* Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email.trim() || !form.username.trim() || !form.password.trim()) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await signupUser(form);
      alert("Signup successful. Please login to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Try again with valid details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Create Account</h2>

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        style={styles.input}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        style={styles.input}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p style={styles.redirectText}>
        Already have an account?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </form>
  );
}

/* Inline Styles */
const styles = {
  form: {
    maxWidth: 380,
    margin: "60px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    marginTop: 4,
  },
  redirectText: {
    marginTop: 16,
    textAlign: "center",
    color: "#555",
    fontSize: "0.9rem",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "underline",
  },
};
