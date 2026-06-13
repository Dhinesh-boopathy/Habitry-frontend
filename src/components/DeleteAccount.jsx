import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

export default function DeleteAccount() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmationText !== "DELETE") {
      setError("Please type DELETE to confirm.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // NOTE: Using the correct backend route as analyzed from authRoute.js
      await authFetch("/auth/account", { method: "DELETE" });
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to home/login page after deletion
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8">
      <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-6 leading-relaxed">
              Once you delete your account, there is no going back. All your routines, streaks, and data will be permanently wiped. Please be certain.
            </p>

            {!isConfirming ? (
              <button
                onClick={() => setIsConfirming(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-500/20 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
              >
                Delete your account
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    To verify, type <span className="font-bold select-none text-red-600 dark:text-red-400">DELETE</span> below:
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => {
                      setConfirmationText(e.target.value);
                      setError(null);
                    }}
                    placeholder="DELETE"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    autoFocus
                  />
                  
                  {error && (
                    <p className="text-red-500 text-sm mt-3 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleDelete}
                    disabled={isLoading || confirmationText !== "DELETE"}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center min-w-[140px]"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsConfirming(false);
                      setConfirmationText("");
                      setError(null);
                    }}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
