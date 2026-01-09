import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import jobRoutes from "./routes/jobs-routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://job-tracker-coop-search.vercel.app", // Your frontend origin
  // origin : "http://localhost:5173", // For local testing
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Handle OPTIONS requests explicitly
// modified this part to handle multiple origins on 1/7/26
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://job-tracker-coop-search.vercel.app");
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200); // Explicitly return HTTP 200 OK
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
