import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // CREATE / UPDATE / DELETE
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ip: String,
  device: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditLogSchema);