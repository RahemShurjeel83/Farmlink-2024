// Mock farms are seeded with no real photography, so the UI falls back to
// letter-avatars and flat color banners.
// These helpers generate small theme-matched SVG logos/covers instead — the
// palette + icon are picked from keywords in the farm's name (e.g. "Dairy" gets
// a blue palette and a milk icon, "Mango & Orchard" gets orange and a mango),
// so each farm reads as visually distinct and on-brand without depending on any
// external image host.

const FARM_THEMES = [
  { test: /dairy|milk/i, from: "#4a7fb5", to: "#aed4ec", icon: "🥛" },
  { test: /poultry|chicken|egg/i, from: "#d98c2b", to: "#f3cf8e", icon: "🐔" },
  { test: /rabbit|meat|livestock/i, from: "#8a5a3c", to: "#d8b08c", icon: "🐇" },
  { test: /mango|orchard|fruit|citrus/i, from: "#e07b30", to: "#f6c596", icon: "🥭" },
  { test: /organic|valley|fresh|produce|agro|bazaar|kissan|farm/i, from: "#3f7d4f", to: "#a8d6ad", icon: "🌾" },
];
const DEFAULT_THEME = { from: "#3f7d4f", to: "#a8d6ad", icon: "🌱" };

const themeForFarm = (farmName = "") =>
  FARM_THEMES.find((theme) => theme.test.test(farmName)) || DEFAULT_THEME;

const initialsOf = (farmName = "") =>
  farmName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "F";

const escapeXml = (value = "") =>
  String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&apos;",
    '"': "&quot;",
  }[char]));

const buildFarmLogoSvg = (farmName) => {
  const { from, to, icon } = themeForFarm(farmName);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <circle cx="120" cy="120" r="117" fill="url(#g)" stroke="#ffffff" stroke-width="6"/>
  <text x="120" y="110" font-family="'Segoe UI', Arial, sans-serif" font-size="70" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${escapeXml(initialsOf(farmName))}</text>
  <text x="120" y="176" font-size="42" text-anchor="middle" dominant-baseline="central">${icon}</text>
</svg>`;
};

const buildFarmCoverSvg = (farmName, city) => {
  const { from, to, icon } = themeForFarm(farmName);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="360" fill="url(#g)"/>
  <text x="1040" y="70" font-size="190" opacity="0.16" text-anchor="middle" dominant-baseline="central">${icon}</text>
  <text x="190" y="76" font-size="72" text-anchor="middle" dominant-baseline="central">${icon}</text>
  <text x="64" y="246" font-family="'Segoe UI', Arial, sans-serif" font-size="54" font-weight="700" fill="#ffffff">${escapeXml(farmName)}</text>
  <text x="64" y="296" font-family="'Segoe UI', Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.88)">📍 ${escapeXml(city)}, Pakistan</text>
</svg>`;
};

module.exports = { buildFarmLogoSvg, buildFarmCoverSvg };
