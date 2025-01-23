import dotenv from "dotenv";
import express from "express";
// import initialize from "./services/app.js"; // Correct import for initialize function

dotenv.config();

const app = express();
const port = process.env.PORT;

// Initialize application settings, including routes and middlewares
// initialize(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
