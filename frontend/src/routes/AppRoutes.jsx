import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProblemList from "../pages/ProblemList";
import ProblemDetails from "../pages/ProblemDetails";
import SubmissionHistory from "../pages/SubmissionHistory";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/problems" element={<ProblemList />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />
      <Route path="/submissions" element={<SubmissionHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
