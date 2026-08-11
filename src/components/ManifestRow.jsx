import { themeColor } from "../lib/theme.js";
import { riceScore } from "../lib/roadmap.js";
import { MANIFEST_GRID_TEMPLATE } from "./manifestGrid.js";

const SLIDER_FIELDS = [
  { key: "reach", label: "Reach", min: 0, max: 100, step: 1 },
  { key: "impact", label: "Impact", min: 0, max: 3, step: 0.25 },
  {
    key: "confidence",
    label: "Conf.",
    min: 0.05,
    max: 1,
    step: 0.05,
    format: (v) => `${Math.round(v * 100)}%`,
    accent: "#5FA8A3",
  },
  { key: "effort", label: "Effort", min: 0.5, max: 8, step: 0.5 },
];

function Slider({ id, label, min, max, step, value, format, accent, onChange }) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between text-[10px] text-[#8CA3BC]">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <span className="font-mono tabular-nums">{format ? format(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={accent ? { accentColor: accent } : undefined}
        className="mt-0.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10"
      />
    </div>
  );
}

function ScoreBadge({ score }) {
  return (
    <span
      className="shrink-0 rounded-sm border border-ink/40 bg-ink/10 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-ink"
      title="RICE score = (Reach × Impact × Confidence) / Effort"
    >
      {score.toFixed(1)}
    </span>
  );
}

function TitleBlock({ feature }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-normal break-words text-sm font-medium leading-snug text-[#DCE8F5]">
        {feature.title}
      </p>
      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8CA3BC]">
        <span className="theme-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
        <span className="truncate">{feature.theme}</span>
      </div>
    </div>
  );
}

// Two render branches, not one reflowed DOM tree: below `sm` there isn't
// room for a 7-column spreadsheet row (id + title + 4 sliders + score) no
// matter how the tracks are sized, so the row becomes a stacked mini-card
// instead. Above `sm` it's a true grid row aligned with ManifestPanel's
// header. Slider ids get a branch suffix so only one (visible) input owns
// each id at a time.
export default function ManifestRow({ feature, onChange }) {
  const accent = themeColor(feature.theme);
  const score = riceScore(feature);
  const accentVars = { "--accent": accent };
  const handle = (key) => (e) => onChange(feature.id, key, Number(e.target.value));

  return (
    <>
      <div className="flex flex-col gap-2.5 border-b border-ink/10 px-3 py-3 last:border-b-0 sm:hidden" style={accentVars}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-[#7C93AD]">{feature.id}</span>
            <TitleBlock feature={feature} />
          </div>
          <ScoreBadge score={score} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {SLIDER_FIELDS.map(({ key, ...field }) => (
            <Slider
              key={key}
              id={`manifest-m-${feature.id}-${key}`}
              value={feature[key]}
              onChange={handle(key)}
              {...field}
            />
          ))}
        </div>
      </div>

      <div
        className="hidden items-center gap-x-2 border-b border-ink/10 px-2 py-2 last:border-b-0 sm:grid"
        style={{ gridTemplateColumns: MANIFEST_GRID_TEMPLATE, ...accentVars }}
      >
        <span className="font-mono text-[11px] tabular-nums text-[#7C93AD]">{feature.id}</span>
        <TitleBlock feature={feature} />
        {SLIDER_FIELDS.map(({ key, ...field }) => (
          <Slider
            key={key}
            id={`manifest-d-${feature.id}-${key}`}
            value={feature[key]}
            onChange={handle(key)}
            {...field}
          />
        ))}
        <div className="justify-self-end">
          <ScoreBadge score={score} />
        </div>
      </div>
    </>
  );
}
