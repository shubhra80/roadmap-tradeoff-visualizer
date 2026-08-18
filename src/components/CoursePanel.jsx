import { useMemo, useState } from "react";
import { buildRoadmap, CAPACITY_PER_QUARTER } from "../lib/roadmap.js";
import { downloadRoadmapCSV } from "../lib/exportRoadmap.js";
import RoadmapCard from "./RoadmapCard.jsx";
import CapacityBar from "./CapacityBar.jsx";
import CornerMarks from "./CornerMarks.jsx";

function QuarterColumn({ title, subtitle, capacityBar, children, empty }) {
  return (
    <div className="relative flex min-w-0 flex-col gap-2.5 rounded-sm border border-ink/25 bg-navy/30 p-2.5">
      <CornerMarks />
      <div className="sticky top-0 z-10 -mx-1 bg-navy/95 px-1 pb-2 pt-1 backdrop-blur">
        <div className="flex items-baseline justify-between">
          <h3 className="font-heading text-sm font-bold text-ink">{title}</h3>
          {subtitle ? <span className="text-xs text-[#8CA3BC]">{subtitle}</span> : null}
        </div>
        {capacityBar}
      </div>
      <div className="flex flex-col gap-2.5">
        {children}
        {empty ? <p className="text-xs italic text-[#7C93AD]">{empty}</p> : null}
      </div>
    </div>
  );
}

function quarterColumnProps(quarter) {
  return {
    title: quarter.label,
    subtitle: `${quarter.items.length} feature${quarter.items.length === 1 ? "" : "s"}`,
    capacityBar: <CapacityBar usedEffort={quarter.usedEffort} capacity={quarter.capacity} />,
    empty: quarter.items.length === 0 ? "No capacity used yet." : null,
    children: quarter.items.map(({ feature, score }) => (
      <RoadmapCard key={feature.id} feature={feature} score={score} />
    )),
  };
}

// Live-reranking view: re-derives the whole board from `features` every
// render, so any Backlog edit is reflected here immediately — this is the
// only panel allowed to reorder as scores change.
export default function CoursePanel({ features, capacityPerQuarter = CAPACITY_PER_QUARTER }) {
  const { quarters, later } = useMemo(
    () => buildRoadmap(features, capacityPerQuarter),
    [features, capacityPerQuarter]
  );
  const [activeQuarter, setActiveQuarter] = useState(0);

  return (
    <section className="relative flex min-w-0 flex-col overflow-hidden rounded border border-ink/25 bg-surface shadow-sm lg:h-[calc(100vh-9.5rem)]">
      <CornerMarks />
      <div className="shrink-0 border-b border-ink/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-sm font-bold tracking-tight text-ink">Recommended Roadmap</h2>
            <p className="mt-0.5 text-xs text-[#8CA3BC]">
              Live plan, ranked by RICE score and packed into quarters by effort. Re-ranks as you edit.
            </p>
          </div>
          <button
            onClick={() => downloadRoadmapCSV(quarters, later)}
            className="shrink-0 rounded-sm border border-ink bg-ink/15 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink hover:bg-ink/25"
          >
            Export
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Mobile: a 4-up grid has no room on a phone-width screen, so one
            quarter shows at a time, switched via pill tabs — a vertical
            stack fits the blueprint's instrument-panel feel better than a
            swipeable carousel, and guarantees no horizontal scrolling. */}
        <div className="p-4 sm:hidden">
          <div className="mb-3 flex gap-1.5" role="tablist" aria-label="Quarter">
            {quarters.map((quarter, i) => (
              <button
                key={quarter.label}
                type="button"
                role="tab"
                aria-selected={activeQuarter === i}
                onClick={() => setActiveQuarter(i)}
                className={`flex-1 rounded-sm border px-2 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeQuarter === i
                    ? "border-ink bg-ink/15 text-ink"
                    : "border-white/15 text-[#8CA3BC] hover:border-ink/40"
                }`}
              >
                {quarter.label}
              </button>
            ))}
          </div>
          <QuarterColumn {...quarterColumnProps(quarters[activeQuarter])} />
        </div>

        {/* sm and up: all four quarters side by side. */}
        <div className="hidden gap-4 p-4 sm:grid sm:grid-cols-4">
          {quarters.map((quarter) => (
            <QuarterColumn key={quarter.label} {...quarterColumnProps(quarter)} />
          ))}
        </div>

        <div className="px-4 pb-4 pt-1">
          <div className="relative rounded-sm border border-dashed border-white/15 bg-transparent p-2.5">
            <div className="mb-2.5 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7C93AD]">Later</h3>
                <span className="rounded-sm border border-white/15 px-1 font-mono text-[9px] uppercase text-[#7C93AD]">
                  Pending
                </span>
              </div>
              <span className="text-xs text-[#8CA3BC]">
                {later.length} feature{later.length === 1 ? "" : "s"}
              </span>
            </div>
            {later.length === 0 ? (
              <p className="text-xs italic text-[#7C93AD]">
                Everything fits within {capacityPerQuarter * 4} effort points across four quarters.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                {later.map(({ feature, score }) => (
                  <RoadmapCard key={feature.id} feature={feature} score={score} muted />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}