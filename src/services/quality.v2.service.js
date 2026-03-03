// src/services/quality.v2.service.js
export function qualityScoreV2({
  title,
  description,
  publishedAt,
  language,
}) {
  let score = 0;

  // relevance
  if (/(wa'azi|tafseer|quran|khutbah)/i.test(title)) score += 30;

  // content richness
  if (description && description.length > 120) score += 20;

  // freshness
  const days =
    (Date.now() - new Date(publishedAt).getTime()) / 86400000;
  if (days < 180) score += 15;
  else if (days < 365) score += 10;

  // language boost
  if (["ha", "ar"].includes(language)) score += 15;

  // penalty
  if (title.length < 15) score -= 20;

  return Math.max(0, Math.min(100, score));
}