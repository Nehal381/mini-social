import jwt from "jsonwebtoken";

/* Authentication Middleware */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    // Check for Bearer token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded; // contains { id, email, username }
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
