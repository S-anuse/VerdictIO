require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./config/db");
const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const dashboardRoute = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const { client } = require("./config/redis");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testCaseRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
  });

client
  .connect()
  .then(() => {
    console.log("✅ Connected to Redis");
  })
  .catch((err) => {
    console.error("❌ Redis Connection Failed");
    console.error(err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
