import { themeColor } from "../lib/theme.js";

const SLIDER_FIELDS = [
  { key: "reach", label: "Reach", min: 0, max: 100, step: 1, hint: "users / quarter" },
  { key: "impact", label: "Impact", min: 0, max: 3, step: 0.25 },
  { key: "confidence", label: "Confidence", min: 0.05, max: 1, step: 0.05, format: (v) => `${Math.round(v * 100)}%` },
  { key: "effort", label: "Effort", min: 0.5, max: 8, step: 0.5, hint: "person-quarters" },
];

export default function FeatureCard({ feature, score, onChange }) {
  const accent = themeColor(feature.theme);

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-black/10 bg-white pl-4 pr-3 py-3 shadow-sm dark:border-white/10 dark:bg-neutral-900"
      style={{ "--accent-light": accent.light, "--accent-dark": accent.dark }}
    >
      <div className="accent-bar absolute inset-y-0 left-0 w-1" aria-hidden="true" />

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          {feature.title}
        </h3>
        <span
          className="shrink-0 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-bold tabular-nums text-white dark:bg-neutral-100 dark:text-neutral-900"
          title="RICE score = (Reach × Impact × Confidence) / Effort"
        >
          {score.toFixed(1)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="theme-dot inline-block h-2 w-2 rounded-full" aria-hidden="true" />
        <span>{feature.theme}</span>
      </div>

      <p className="mt-1.5 text-xs leading-snug text-neutral-600 dark:text-neutral-400">
        {feature.blurb}
      </p>

      <div className="mt-3 space-y-2">
        {SLIDER_FIELDS.map(({ key, label, min, max, step, hint, format }) => (
          <div key={key}>
            <div className="flex items-baseline justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <label htmlFor={`${feature.id}-${key}`} className="font-medium text-neutral-700 dark:text-neutral-300">
                {label}
                {hint ? <span className="font-normal text-neutral-400 dark:text-neutral-500"> ({hint})</span> : null}
              </label>
              <span className="tabular-nums">{format ? format(feature[key]) : feature[key]}</span>
            </div>
            <input
              id={`${feature.id}-${key}`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={feature[key]}
              onChange={(e) => onChange(feature.id, key, Number(e.target.value))}
              className="mt-0.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-neutral-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
