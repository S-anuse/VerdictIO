import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-white px-8 py-4 flex flex-wrap justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <NavLink to="/problems" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">VerdictIO</span>
        </NavLink>
        {user?.role && (
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? "bg-purple-900/80 text-purple-200 border-purple-600"
                : "bg-slate-700 text-slate-200 border-slate-600"
            }`}
          >
            {isAdmin ? "🛡️ ADMIN" : "👤 USER"}
          </span>
        )}
      </div>

      <div className="flex gap-6 items-center font-medium">
        <NavLink
          to="/problems"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "hover:text-slate-300 transition"
          }
        >
          Problems
        </NavLink>

        <NavLink
          to="/submissions"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "hover:text-slate-300 transition"
          }
        >
          My Submissions
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "hover:text-slate-300 transition"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-blue-400 font-semibold" : "hover:text-slate-300 transition"
          }
        >
          Profile
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${
                isActive
                  ? "bg-purple-600 border-purple-500 text-white shadow-sm"
                  : "bg-purple-950/60 text-purple-200 border-purple-700 hover:bg-purple-900/80"
              }`
            }
          >
            <span>⚡ Admin Portal</span>
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition font-medium text-sm shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
