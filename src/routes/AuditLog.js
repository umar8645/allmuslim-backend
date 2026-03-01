import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: String,
    method: String,
    path: String,
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);