import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import bcrypt from "bcryptjs";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user role
export const updateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role || user.role;
    await user.save();
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("admin", "name email role").sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};