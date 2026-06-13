import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  /* -------------------- SYNC USER -------------------- */
  function syncUser() {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }

  useEffect(() => {
    syncUser();
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleStorageChange() {
      syncUser();
    }
    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* -------------------- LOCK SCROLL (MOBILE) -------------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  /* -------------------- ACTIVE LINK -------------------- */
  function navLinkClass(path) {
    const active = location.pathname === path;

    return `
      ${active ? "text-blue-600 font-semibold" : ""}
      text-slate-700 dark:text-slate-300
      hover:text-blue-600
      transition
    `;
  }

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" />
      )}

      <nav
        className="relative z-50 px-4 sm:px-6 py-3
                   bg-white dark:bg-slate-900
                   border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Brand */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold
                       text-blue-600"
          >
            The Habitry
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className={navLinkClass("/")}>Home</Link>
            <Link to="/routine" className={navLinkClass("/routine")}>Routine</Link>
            <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>

            <ThemeToggle />

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg border border-blue-600
                             text-blue-600 hover:bg-blue-600
                             hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-blue-600
                             text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative flex items-center" ref={profileDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen(!profileMenuOpen);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Hi, <span className="font-semibold">{user.name || user.email || "User"}</span>
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {profileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profile Settings
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-2xl text-slate-700 dark:text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out
            ${menuOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-3 font-medium">
            <Link to="/" className={navLinkClass("/")} onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/routine" className={navLinkClass("/routine")} onClick={() => setMenuOpen(false)}>
              Routine
            </Link>

            <Link to="/contact" className={navLinkClass("/contact")} onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            <ThemeToggle />

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg border border-blue-600
                             text-blue-600 text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-blue-600
                             text-white text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="px-1 mb-3 flex items-center justify-between cursor-pointer" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Hi, <span className="font-semibold">{user.name || user.email || "User"}</span>
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
                
                {profileMenuOpen && (
                  <div className="flex flex-col gap-2 pl-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-left font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
                {!profileMenuOpen && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-red-500 text-white text-center font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
