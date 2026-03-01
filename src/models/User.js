import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor"
    },

    // 🔐 refresh token (JWT refresh)
    refreshToken: {
      type: String,
      select: false
    },

    // 🔒 advanced security (za mu yi amfani da su daga baya)
    lastLoginAt: Date,
    lastLoginIp: String,
    device: String
  },
  { timestamps: true }
);

/**
 * =====================
 * HASH PASSWORD
 * =====================
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * =====================
 * COMPARE PASSWORD
 * =====================
 */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);