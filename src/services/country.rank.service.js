// src/services/country.rank.service.js
export function applyCountryBoost({ country, language, baseScore }) {
  let score = baseScore;

  // 🇳🇬 Nigeria first
  if (country === "NG") score += 20;

  // language preference for Nigeria
  if (country === "NG" && ["ha", "yo", "ig"].includes(language)) {
    score += 15;
  }

  return Math.min(100, score);
}