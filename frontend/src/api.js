/* Base API URL */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/* Helper: Parse JSON and handle HTTP errors */
const handleJSON = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }
  return res.json();
};

/* Auth: Signup */
export async function signupUser(data) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleJSON(res);
}

/* Auth: Login */
export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleJSON(res);
}

/* Posts: Fetch all */
export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return handleJSON(res);
}

/* Posts: Create new */
export async function createPost(data, token) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleJSON(res);
}

/* Posts: Like / Unlike */
export async function likePost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleJSON(res);
}

/* Posts: Add comment */
export async function addComment(id, text, token) {
  const res = await fetch(`${API_BASE}/posts/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  return handleJSON(res);
}

/* Posts: Delete (Author only) */
export async function deletePost(id, token) {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
