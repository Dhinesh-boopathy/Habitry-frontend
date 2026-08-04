import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!token) return setError("This reset link is invalid or incomplete.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
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
      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-100 dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <h1 className="text-center text-2xl font-bold">Choose a new password</h1>
        {error && <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
        {message ? <p className="mt-5 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{message} <Link to="/login" className="font-semibold underline">Log in</Link></p> : <>
          <label className="mt-5 block text-sm font-medium">New password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" />
          <label className="mt-4 block text-sm font-medium">Confirm new password</label>
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength="6" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900" />
          <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">{loading ? "Resetting…" : "Reset password"}</button>
        </>}
      </form>
    </div>
  );
}
