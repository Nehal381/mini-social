import React, { useState } from "react";
import { loginUser } from "../api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

/* Component: User Login */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  /* Handle Login */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email.trim() || !form.password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);
      // res = { message, token, user:{id, username} }
      login({ ...res.user, token: res.token });
      alert("Login successful.");
      navigate("/feed");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Login</h2>

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
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={styles.redirectText}>
        Don’t have an account?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/signup")}
        >
          Signup
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
