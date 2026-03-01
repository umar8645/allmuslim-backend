import AuditLog from "../models/AuditLog.js";

export const auditLogger = (action) => {
  return async (req, res, next) => {
    try {
      await AuditLog.create({
        user: req.user?._id,
        action,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
      });
    } catch (err) {
      console.error("Audit log failed");
    }
    next();
  };
};