// src/services/language.service.js (update)
export function detectLanguage(text = "") {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/(wa'azi|hausa|karatu|tafseer)/i.test(text)) return "ha";
  if (/(qur'an|recitation)/i.test(text)) return "ar";
  return "en";
}