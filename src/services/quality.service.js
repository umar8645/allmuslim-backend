// src/services/quality.service.js
export function calculateQuality({ title, description, publishedAt }) {
  let score = 0;

  if (title && title.length > 20) score += 20;
  if (description && description.length > 100) score += 20;

  const ageDays =
    (Date.now() - new Date(publishedAt).getTime()) / 86400000;
  if (ageDays < 365) score += 20;

  if (/wa'azi|tafseer|quran|khutbah/i.test(title)) score += 30;

  return score;
}