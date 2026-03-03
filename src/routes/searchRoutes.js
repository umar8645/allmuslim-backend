import express from "express";
const router = express.Router();

/**
 * GET /api/search
 * ?q=&lang=&country=
 */
router.get("/", (req, res) => {
  const { q, lang, country } = req.query;

  res.json({
    query: q || null,
    lang: lang || "any",
    country: country || "any",
    results: [],
    note: "Search engine coming next phase",
  });
});

export default router;