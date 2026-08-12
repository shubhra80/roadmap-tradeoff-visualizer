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
        style={accent ? { "--thumb-color": accent } : undefined}
        className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 sm:mt-0.5 sm:h-1.5"
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

// Live standing by score, distinct from the row's fixed `id` — styled like
// CoursePanel's "Pending" tag (muted border, steel-blue text) rather than
// ScoreBadge's cyan fill, so it doesn't get mistaken for the score itself.
// Recomputed on every slider change, but the row it sits in never moves.
function RankBadge({ rank, total }) {
  return (
    <span
      className="shrink-0 rounded-sm border border-white/15 bg-navy/40 px-1 py-0.5 font-mono text-[9px] font-semibold tabular-nums text-[#8CA3BC]"
      title={`Live rank: ${rank} of ${total} by RICE score — updates as you edit`}
    >
      {rank}/{total}
    </span>
  );
}

function TitleBlock({ feature }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-normal break-normal text-sm font-medium leading-snug text-[#DCE8F5]">
        {feature.title}
      </p>
      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8CA3BC]">
        <span className="theme-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
        <span className="truncate">{feature.theme}</span>
      </div>
    </div>
  );
}

// Uses aria-disabled rather than the native `disabled` attribute: a truly
// disabled button stops receiving hover/mouseover in most browsers, which
// would kill the "why is this greyed out" tooltip right when it's needed
// most. The click handler still no-ops when diverged, so the affordance is
// inert without going invisible to hover or a screen reader's focus order.
function WhyTrigger({ isOpen, disabled, onClick }) {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      aria-label="Why this ranking?"
      title={
        disabled
          ? "Edit values changed — reset to baseline to see the original reasoning"
          : "Why this ranking?"
      }
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold leading-none transition-colors ${
        disabled
          ? "cursor-not-allowed border-dashed border-[#8CA3BC] bg-navy/70 text-[#8CA3BC]"
          : isOpen
            ? "cursor-pointer border-ink bg-ink text-navy"
            : "cursor-pointer border-ink bg-ink/20 text-ink hover:bg-ink hover:text-navy"
      }`}
    >
      ?
      {disabled ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[1.5px] w-[18px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#8CA3BC]"
        />
      ) : null}
    </button>
  );
}

// Annotation callout: a leader-line tick into a dashed note-tab box, styled
// to match the corner-mark/grid-paper blueprint aesthetic used elsewhere.
// Rendered inline below the row (not a floating popover) so it can't be
// clipped by the Backlog list's overflow-y-auto container.
function WhyPanel({ explanation, isDiverged, onClose }) {
  return (
    <div className="px-3 pb-3 sm:px-2">
      <div className="ml-3 h-2 w-px bg-ink/40" aria-hidden="true" />
      <div className="relative rounded-sm border border-dashed border-ink/40 bg-navy/60 px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="rounded-sm border border-ink/40 bg-ink/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-ink">
            Why this ranking
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close explanation"
            className="leading-none text-[#8CA3BC] hover:text-ink"
          >
            ×
          </button>
        </div>
        <p className={`text-xs leading-relaxed ${isDiverged ? "italic text-[#8CA3BC]" : "text-[#DCE8F5]"}`}>
          {isDiverged
            ? "This feature's values have changed — the original reasoning no longer applies. Reset to baseline to see it again."
            : explanation}
        </p>
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
export default function ManifestRow({
  feature,
  onChange,
  isDiverged,
  isOpen,
  onToggle,
  explanation,
  rank,
  totalCount,
}) {
  const accent = themeColor(feature.theme);
  const score = riceScore(feature);
  const accentVars = { "--accent": accent };
  const handle = (key) => (e) => onChange(feature.id, key, Number(e.target.value));
  const handleTriggerClick = () => onToggle(feature.id);

  return (
    <div className="border-b border-ink/10 last:border-b-0" style={accentVars}>
      <div className="flex flex-col gap-3 px-3 py-3 sm:hidden">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-[#7C93AD]">{feature.id}</span>
          <TitleBlock feature={feature} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
        <div className="flex items-center justify-between border-t border-ink/10 pt-2.5">
          <div className="flex items-center gap-2">
            <RankBadge rank={rank} total={totalCount} />
            <WhyTrigger isOpen={isOpen} disabled={isDiverged} onClick={handleTriggerClick} />
          </div>
          <ScoreBadge score={score} />
        </div>
      </div>

      <div
        className="hidden items-center gap-x-2 px-2 py-2 sm:grid"
        style={{ gridTemplateColumns: MANIFEST_GRID_TEMPLATE }}
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
        <div className="flex items-center justify-self-end gap-2">
          <div className="flex items-center gap-1">
            <RankBadge rank={rank} total={totalCount} />
            <WhyTrigger isOpen={isOpen} disabled={isDiverged} onClick={handleTriggerClick} />
          </div>
          <span className="h-5 w-px shrink-0 bg-ink/60" aria-hidden="true" />
          <ScoreBadge score={score} />
        </div>
      </div>

      {isOpen ? <WhyPanel explanation={explanation} isDiverged={isDiverged} onClose={handleTriggerClick} /> : null}
    </div>
  );
}
