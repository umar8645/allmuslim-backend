import AuditLog from "../models/AuditLog.js";

export const logAction = (actionType) => {
  return async (req, res, next) => {
    try {
      const adminId = req.user._id;
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const device = req.headers["user-agent"] || "unknown";

      await AuditLog.create({
        admin: adminId,
        action: actionType,
        targetUser: req.params.id || null,
        ip,
        device
      });

      next();
    } catch (err) {
      console.error("Audit log error:", err.message);
      next();
    }
  };
};