import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccount from "../components/DeleteAccount";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">
          Personal Information
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={user.name || "N/A"}
              readOnly
              disabled
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email || "N/A"}
              readOnly
              disabled
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your profile information cannot be edited at this time.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone - The Delete Account Component */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Irreversible and destructive actions.
        </p>
        
        {/* We place the previously created DeleteAccount component here */}
        <div className="-mx-4 sm:mx-0">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
