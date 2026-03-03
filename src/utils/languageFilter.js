const LANGUAGE_HINTS = {
  en: /(islam|quran|lecture|hadith)/i,
  ar: /[ء-ي]/,
  ha: /(wa'azi|waazi|musulunci|allah)/i,
  ur: /[؀-ۿ]/,
  fr: /(islam|coran|prêche)/i,
  tr: /(islam|kuran|vaaz)/i,
  id: /(islam|kajian|ceramah)/i
};

export function isAllowedLanguage(text) {
  const allowed = (process.env.ALLOWED_LANGUAGES || "").split(",");
  return allowed.some(lang => LANGUAGE_HINTS[lang]?.test(text));
}