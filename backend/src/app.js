require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./config/db");
const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
