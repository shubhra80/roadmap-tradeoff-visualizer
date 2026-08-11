import { useEffect, useMemo, useRef, useState } from "react";
import ManifestRow from "./ManifestRow.jsx";
import CornerMarks from "./CornerMarks.jsx";
import { MANIFEST_GRID_TEMPLATE } from "./manifestGrid.js";
import { explanations } from "../data/explanations.js";
import { riceScore } from "../lib/roadmap.js";

const HEADER_CELLS = ["ID", "Feature", "Reach", "Impact", "Conf.", "Effort", "Score"];
const TRACKED_FIELDS = ["reach", "impact", "confidence", "effort"];
// Range inputs snap to step multiples of `min`, but repeated float math can
// still land a hair off the original value — this keeps that noise from
// registering as a real edit.
const DIVERGENCE_EPSILON = 1e-9;

export default function ManifestPanel({ features, originalFeatures, onChange, onReset }) {
  // Fixed order, sorted by id only — this list must never re-sort on score
  // or slider changes. Editing happens here; ranking is shown in the
  // Recommended Roadmap panel, so a row can't jump out from under the cursor
  // mid-drag. Live rank is still surfaced per-row (see rankById below) —
  // it's just a number on a stationary row, not a reordering.
  const orderedFeatures = useMemo(() => [...features].sort((a, b) => a.id - b.id), [features]);

  // Score-based rank, recomputed from live `features` on every change —
  // drives the "#n/20" badge only. Never used to reorder `orderedFeatures`.
  const rankById = useMemo(() => {
    const byScore = [...features].sort((a, b) => riceScore(b) - riceScore(a));
    return new Map(byScore.map((feature, index) => [feature.id, index + 1]));
  }, [features]);

  const originalById = useMemo(
    () => new Map(originalFeatures.map((feature) => [feature.id, feature])),
    [originalFeatures],
  );

  // Derived every render from `features` vs. the original dataset — never
  // stored on its own, so it can't drift out of sync with the sliders.
  const divergedIds = useMemo(() => {
    const ids = new Set();
    for (const feature of features) {
      const original = originalById.get(feature.id);
      if (!original) continue;
      const changed = TRACKED_FIELDS.some(
        (key) => Math.abs(feature[key] - original[key]) > DIVERGENCE_EPSILON,
      );
      if (changed) ids.add(feature.id);
    }
    return ids;
  }, [features, originalById]);

  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef(null);
  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  useEffect(() => {
    if (openId === null) return undefined;
    const handlePointerDown = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openId]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-w-0 flex-col overflow-hidden rounded border border-ink/25 bg-surface shadow-sm lg:h-[calc(100vh-9.5rem)]"
    >
      <CornerMarks />
      <div className="shrink-0 border-b border-ink/20 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-sm font-bold tracking-tight text-ink">Backlog</h2>
            <p className="mt-0.5 text-xs text-[#8CA3BC]">
              All {orderedFeatures.length} features, fixed order by id. Edit here — see the consequence in the
              Recommended Roadmap.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 rounded-sm border border-ink/30 bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink shadow-sm hover:bg-ink/10"
          >
            Reset to baseline
          </button>
        </div>
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
          <ManifestRow
            key={feature.id}
            feature={feature}
            onChange={onChange}
            isDiverged={divergedIds.has(feature.id)}
            isOpen={openId === feature.id}
            onToggle={handleToggle}
            explanation={explanations[feature.id]}
            rank={rankById.get(feature.id)}
            totalCount={features.length}
          />
        ))}
      </div>
    </section>
  );
}
