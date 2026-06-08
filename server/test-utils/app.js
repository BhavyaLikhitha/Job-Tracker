// Test helper that builds the Express app and manages the DB connection using
// the SERVER's own mongoose instance (resolved from server/node_modules). This
// lives under server/ so the model registry and the connection share one
// mongoose — importing mongoose from the repo root would create a second,
// disconnected instance.
import express from "express";
import mongoose from "mongoose";
import userRoutes from "../routes/user-routes.js";
import jobRoutes from "../routes/jobs-routes.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/users", userRoutes);
  app.use("/api/jobs", jobRoutes);
  return app;
};

export const connectDb = (uri) => mongoose.connect(uri);

export const disconnectDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
