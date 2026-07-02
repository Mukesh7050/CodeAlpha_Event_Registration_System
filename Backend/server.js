const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();


const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.post("/test", (req, res) => {
  console.log("TEST BODY =", req.body);
  res.json(req.body);
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Event Registration API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});