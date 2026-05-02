import jwt from "jsonwebtoken";

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // ✅ Check for Authorization header
      const authHeader = req.headers?.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      // ✅ Extract token
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Invalid token format" });
      }

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;

      // ✅ Role-based access control
      if (roles.length && !roles.includes(req.userRole)) {
        return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges" });
      }

      next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
};
