import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;
      if (!response.ok || !data?.message) {
        throw new Error(
          data?.message || "Password reset is temporarily unavailable. Please try again later."
        );
      }
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-100 dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <h1 className="text-center text-2xl font-bold">Reset your password</h1>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Enter your email and we’ll send a verification code.</p>
        {error && <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
        <label className="mt-5 block text-sm font-medium">Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" />
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">{loading ? "Sending…" : "Send reset link"}</button>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400"><Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Back to login</Link></p>
      </form>
    </div>
  );
}
