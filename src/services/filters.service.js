// src/services/filters.service.js
export function passFilters({ title = "", description = "" }) {
  const block = /(music|song|mix|prank|shorts|comedy|politics)/i;
  if (block.test(title) || block.test(description)) return false;

  const allow = /(wa'azi|tafseer|qur'an|quran|khutbah|lecture|recitation)/i;
  return allow.test(title + " " + description);
}