// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import user from '../models/User.js';

// export const signup = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new user({ username, email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: "Error signing up" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await user.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ message: "Login successful", token, userId: user._id });
//   } catch (error) {
//     console.log("--------------------")

//     console.log(error)
//     res.status(500).json({ error: "Error logging in" });
//   }
// };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword }); // Use 'User' here
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Error signing up" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email }); // Use 'User' here

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password matches
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "365d" });

    res.status(200).json({ message: "Login successful", token, userId: user._id, username: user.username });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
