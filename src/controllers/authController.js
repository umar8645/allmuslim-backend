import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const signRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
};

// REFRESH ACCESS TOKEN
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const user = await User.findOne({ refreshToken }).select("+refreshToken");
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken });
};

// LOGOUT (REVOKE REFRESH TOKEN)
export const logout = async (req, res) => {
  const user = await User.findById(req.user.id).select("+refreshToken");

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({ message: "Logged out successfully" });
};