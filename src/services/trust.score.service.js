// src/services/trust.score.service.js
export function calculateTrustScore(stats) {
  let score = 0;

  // 1️⃣ quality (35%)
  score += Math.min(stats.avgQuality || 0, 100) * 0.35;

  // 2️⃣ consistency (20%)
  if (stats.totalContent > 20) score += 20;
  else score += stats.totalContent;

  // 3️⃣ duplication penalty (15%)
  score -= (stats.duplicateRate || 0) * 15;

  // 4️⃣ source diversity (15%)
  score += Math.min((stats.sources?.length || 1) * 5, 15);

  // 5️⃣ recency stability (15%)
  if (stats.lastPublishedAt) {
    const days = (Date.now() - new Date(stats.lastPublishedAt)) / 86400000;
    if (days < 30) score += 15;
    else if (days < 90) score += 8;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}