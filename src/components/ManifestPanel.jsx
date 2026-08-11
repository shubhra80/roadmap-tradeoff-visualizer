import { useMemo } from "react";
import ManifestRow from "./ManifestRow.jsx";
import CornerMarks from "./CornerMarks.jsx";
import { MANIFEST_GRID_TEMPLATE } from "./manifestGrid.js";

const HEADER_CELLS = ["#", "Feature", "Reach", "Impact", "Conf.", "Effort", "Score"];

export default function ManifestPanel({ features, onChange }) {
  // Fixed order, sorted by id only — this list must never re-sort on score
  // or slider changes. Editing happens here; ranking is shown in the
  // Recommended Roadmap panel, so a row can't jump out from under the cursor
  // mid-drag.
  const orderedFeatures = useMemo(() => [...features].sort((a, b) => a.id - b.id), [features]);

  return (
    <section className="relative flex min-w-0 flex-col overflow-hidden rounded border border-ink/25 bg-surface shadow-sm lg:h-[calc(100vh-9.5rem)]">
      <CornerMarks />
      <div className="shrink-0 border-b border-ink/20 px-4 py-3">
        <h2 className="font-heading text-sm font-bold tracking-tight text-ink">Backlog</h2>
        <p className="mt-0.5 text-xs text-[#8CA3BC]">
          All {orderedFeatures.length} features, fixed order by id. Edit here — see the consequence in the
          Recommended Roadmap.
        </p>
      </div>

      <div
        className="hidden items-center gap-x-2 border-b border-ink/20 bg-navy/40 px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#8CA3BC] sm:grid"
        style={{ gridTemplateColumns: MANIFEST_GRID_TEMPLATE }}
      >
        {HEADER_CELLS.map((label, i) => (
          <span key={label} className={i === HEADER_CELLS.length - 1 ? "justify-self-end" : undefined}>
            {label}
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {orderedFeatures.map((feature) => (
          <ManifestRow key={feature.id} feature={feature} onChange={onChange} />
        ))}
      </div>
    </section>
  );
}
