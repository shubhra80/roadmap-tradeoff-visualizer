// Fixed categorical assignment (never cycled/generated) — one hue per theme,
// in a stable order so a theme's color never shifts when the dataset changes.
// Tuned to sit on the navy (#0E1A2B) blueprint background.
export const THEME_COLORS = {
  "AI/Automation": "#5B9BE0", // slot 1 blue
  Growth: "#E08A4E", // slot 2 orange
  "Enterprise/Compliance": "#3FB88F", // slot 3 aqua
  Retention: "#D9A441", // slot 4 amber
  "Tech Debt": "#D9739E", // slot 5 magenta
};

export const FALLBACK_THEME_COLOR = "#7C93AD";

export function themeColor(theme) {
  return THEME_COLORS[theme] ?? FALLBACK_THEME_COLOR;
}
