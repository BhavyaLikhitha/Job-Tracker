// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import userRoutes from "./routes/user-routes.js";
// import jobRoutes from "./routes/jobs-routes.js";

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// // Middleware
// app.use(cors(
//   {
//     origin: "https://job-tracker-coop-search.vercel.app", // Allow only your frontend origin
//     methods: ["GET", "POST", "PUT"], // Add all allowed HTTP methods
//     credentials: true, // Allow cookies if needed
//     allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
// }
// ));
// app.options("*", cors()); // Enable CORS preflight for all routes
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // Serve uploaded files

// mongoose
//   .connect(process.env.MONGO_CONNECTION)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/jobs", jobRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import userRoutes from "./routes/user-routes.js";
// import jobRoutes from "./routes/jobs-routes.js";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;
// const corsOptions = {
//   origin: "https://job-tracker-coop-search.vercel.app", // Your frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Allow credentials
// };

// app.use(cors(corsOptions));

// app.use(express.json());

// app.use("/uploads", express.static("uploads")); // Serve uploaded files

// mongoose
//   .connect(process.env.MONGO_CONNECTION)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/jobs", jobRoutes);
// // Add a specific handler for OPTIONS requests

// // Handle OPTIONS requests explicitly
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "https://job-tracker-coop-search.vercel.app");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200); // Explicitly return HTTP 200 OK
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Grid from "gridfs-stream";
import userRoutes from "./routes/user-routes.js";
import jobRoutes from "./routes/jobs-routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Validate environment variables
if (!process.env.MONGO_CONNECTION) {
  console.error("Error: MONGO_CONNECTION is not defined in the environment variables");
  process.exit(1); // Exit if MongoDB connection string is missing
}

// Configure CORS
const corsOptions = {
  origin: [
    "https://job-tracker-coop-search.vercel.app", // Deployed frontend
    "http://localhost:3000", // Local frontend for development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Initialize GridFS
let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Match bucketName in multer-gridfs-storage
  console.log("GridFS initialized");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Handle OPTIONS requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200); // Explicitly return HTTP 200 OK
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

