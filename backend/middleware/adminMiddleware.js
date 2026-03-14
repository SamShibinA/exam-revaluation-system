import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin role required" });
    }

    next();
  } catch (err) {
    console.error("Admin Middleware Error:", err.message);
    res.status(500).json({ message: "Server error verifying admin status" });
  }
};

export default adminMiddleware;
