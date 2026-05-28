const express = require("express");
const cors = require("cors");
require("dotenv").config();
const emailRoutes = require("./routes/emailRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,        // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
}));

app.use(express.json());
app.use("/api", emailRoutes);

// Health check — Render and UptimeRobot ping this to keep the server warm
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("AI Email Assistant API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
