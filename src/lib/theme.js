// Fixed categorical assignment (never cycled/generated) — one hue per theme,
// in a stable order so a theme's color never shifts when the dataset changes.
export const THEME_COLORS = {
  "AI/Automation": { light: "#2a78d6", dark: "#3987e5" }, // slot 1 blue
  Growth: { light: "#eb6834", dark: "#d95926" }, // slot 2 orange
  "Enterprise/Compliance": { light: "#1baf7a", dark: "#199e70" }, // slot 3 aqua
  Retention: { light: "#eda100", dark: "#c98500" }, // slot 4 yellow
  "Tech Debt": { light: "#e87ba4", dark: "#d55181" }, // slot 5 magenta
};

export const FALLBACK_THEME_COLOR = { light: "#898781", dark: "#898781" };

export function themeColor(theme) {
  return THEME_COLORS[theme] ?? FALLBACK_THEME_COLOR;
}
