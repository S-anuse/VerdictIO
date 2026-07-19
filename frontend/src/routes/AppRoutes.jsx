import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProblemList from "../pages/ProblemList";
import ProblemDetails from "../pages/ProblemDetails";
import SubmissionHistory from "../pages/SubmissionHistory";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

import Layout from "../components/Layout";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/problems" element={<ProblemList />} />

          <Route path="/problems/:id" element={<ProblemDetails />} />

          <Route path="/submissions" element={<SubmissionHistory />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
