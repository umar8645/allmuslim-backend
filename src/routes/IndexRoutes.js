// routes/index.js
import express from "express";

// ✅ Import sub-routes
import lectureRoutes from "./lectureRoutes.js";
import scholarRoutes from "./scholarRoutes.js";
import globalSearchRoutes from "./globalSearchRoutes.js";
import topRoutes from "./topRoutes.js";

const router = express.Router();

// ✅ Main API routes
router.use("/lectures", lectureRoutes);
router.use("/scholars", scholarRoutes);
router.use("/search", globalSearchRoutes);
router.use("/top", topRoutes);

export default router;
