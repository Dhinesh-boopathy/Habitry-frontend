import { API_BASE } from "../config/api";

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  // 🔐 CENTRALIZED AUTH HANDLING
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Force redirect (guarantees Navbar update)
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      throw new Error(data.message || data.error || "Request failed");
    } else {
      const text = await res.text();
      // If the response is HTML, don't show the raw HTML to the user
      if (text.trim().startsWith("<")) {
        throw new Error(`Server returned ${res.status}: Endpoint might be missing or incorrect.`);
      }
      throw new Error(text || "Request failed");
    }
  }

  return res.json();
}
