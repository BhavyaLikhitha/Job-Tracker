import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log token to debug
    req.user = decoded; // { userId: "..." }
    next();
  } catch (err) {
    console.error("Error decoding token:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
};
