import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">VerdictIO</h1>

      <div className="flex gap-6 items-center">
        <NavLink to="/problems">Problems</NavLink>

        <NavLink to="/submissions">My Submissions</NavLink>

        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/profile">Profile</NavLink>

        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
