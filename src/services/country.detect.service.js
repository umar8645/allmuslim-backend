// src/services/country.detect.service.js
const NIGERIA_KEYWORDS = [
  "nigeria", "abuja", "lagos", "ibadan", "ilorin",
  "zaria", "kano", "jos", "maiduguri",
  "hausa", "yoruba", "igbo",
];

const NIGERIA_CHANNEL_HINTS = [
  "ng", "naija", "arewa",
];

export function detectCountry({ title = "", description = "", channelTitle = "" }) {
  const text = `${title} ${description} ${channelTitle}`.toLowerCase();

  if (NIGERIA_KEYWORDS.some(k => text.includes(k))) return "NG";
  if (NIGERIA_CHANNEL_HINTS.some(k => channelTitle.toLowerCase().includes(k))) return "NG";

  return "GLOBAL";
}