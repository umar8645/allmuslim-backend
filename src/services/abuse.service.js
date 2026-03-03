// src/services/abuse.service.js
import User from "../models/User.js";

export async function flagAbuse(userId) {
  await User.updateOne(
    { _id: userId },
    { $set: { blocked: true } }
  );
}