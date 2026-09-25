import { useState } from "react";
import authApi from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      login(response.data.token, response.data.user);
      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/problems");
      }
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600">
          VerdictIO
        </h1>

        <p className="text-center text-gray-500">Login to continue</p>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
          required
        />
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-password"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <hr />
        <p className="text-center text-gray-600">
          No Account yet?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
