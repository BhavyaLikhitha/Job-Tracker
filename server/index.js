import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import jobRoutes from "./routes/jobs-routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors(
  {
    origin: "https://job-tracker-coop-search.vercel.app", // Allow only your frontend origin
    methods: ["GET", "POST", "PUT"], // Add all allowed HTTP methods
    credentials: true, // Allow cookies if needed
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
}
));
app.options("*", cors()); // Enable CORS preflight for all routes
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
