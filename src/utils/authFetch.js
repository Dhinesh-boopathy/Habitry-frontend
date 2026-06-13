import { API_BASE } from "../config/api";

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const url = `${API_BASE}${path}`;

  console.log("🚀 Request URL:", url);
  console.log("🔑 Token exists:", !!token);
  console.log("📦 Method:", options.method || "GET");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  console.log("📡 Response Status:", res.status);

  // Handle unauthorized
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const contentType = res.headers.get("content-type");

    console.error("❌ Request Failed");
    console.error("Status:", res.status);
    console.error("Content-Type:", contentType);

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      console.error("Response Body:", data);

      throw new Error(
        data.message ||
        data.error ||
        `Request failed (${res.status})`
      );
    }

    const text = await res.text();

    console.error("Response Text:", text);

    if (text.trim().startsWith("<")) {
      throw new Error(
        `Server returned ${res.status}: Endpoint might be missing or incorrect.`
      );
    }

    throw new Error(text || `Request failed (${res.status})`);
  }

  const data = await res.json();

  console.log("✅ Success:", data);

  return data;
}