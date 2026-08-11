import { themeColor } from "../lib/theme.js";

// Read-only — the Recommended Roadmap shows the consequence of edits made
// in the Backlog, it doesn't take input itself. `muted` marks a card sitting
// in the Later tray rather than a scheduled quarter sheet.
export default function RoadmapCard({ feature, score, muted = false }) {
  const accent = themeColor(feature.theme);

  return (
    <div
      className={`relative overflow-hidden rounded-sm border pl-4 pr-3 py-2.5 ${
        muted ? "border-white/10 bg-navy/40 opacity-75" : "border-ink/20 bg-surface shadow-sm"
      }`}
      style={{ "--accent": accent }}
    >
      <div className="accent-bar absolute inset-y-0 left-0 w-1" aria-hidden="true" />

      {/* Score sits in the meta row below, not beside the title — the title
          gets the card's full width so long single words (e.g. "Provisioning")
          have room to wrap at a space instead of overflowing the card. */}
      <h3 className="break-normal text-sm font-semibold leading-snug text-[#DCE8F5]">{feature.title}</h3>

      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#8CA3BC]">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="theme-dot inline-block h-2 w-2 shrink-0 rounded-full" aria-hidden="true" />
          <span className="truncate">{feature.theme}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="font-mono tabular-nums">
            {feature.effort} pt{feature.effort === 1 ? "" : "s"}
          </span>
          <span
            className="rounded-sm border border-ink/40 bg-ink/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-ink"
            title="RICE score = (Reach × Impact × Confidence) / Effort"
          >
            {score.toFixed(1)}
          </span>
        </span>
      </div>
    </div>
  );
}
