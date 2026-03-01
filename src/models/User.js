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
      select: false // kada a dawo da password a queries
    },

    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor"
    },

    // 🔐 Refresh token (JWT refresh)
    refreshToken: {
      type: String,
      select: false // sensitive
    },

    // 🔒 Advanced security (IP lock, device tracking)
    lastLoginAt: Date,   // lokacin karshe da user ya shiga
    lastLoginIp: String, // IP da ya shiga
    device: String       // device/browser info
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

/**
 * =====================
 * UPDATE LOGIN INFO
 * =====================
 */
userSchema.methods.updateLoginInfo = async function (ip, device) {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ip;
  this.device = device;
  await this.save();
};

export default mongoose.model("User", userSchema);