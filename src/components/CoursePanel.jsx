import { useMemo } from "react";
import { buildRoadmap, CAPACITY_PER_QUARTER } from "../lib/roadmap.js";
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

// Live-reranking view: re-derives the whole board from `features` every
// render, so any Backlog edit is reflected here immediately — this is the
// only panel allowed to reorder as scores change.
export default function CoursePanel({ features }) {
  const { quarters, later } = useMemo(() => buildRoadmap(features), [features]);

  return (
    <section className="relative flex min-w-0 flex-col overflow-hidden rounded border border-ink/25 bg-surface shadow-sm lg:h-[calc(100vh-9.5rem)]">
      <CornerMarks />
      <div className="shrink-0 border-b border-ink/20 px-4 py-3">
        <h2 className="font-heading text-sm font-bold tracking-tight text-ink">Recommended Roadmap</h2>
        <p className="mt-0.5 text-xs text-[#8CA3BC]">
          Live plan, ranked by RICE score and packed into quarters by effort. Re-ranks as you edit.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          {quarters.map((quarter) => (
            <QuarterColumn
              key={quarter.label}
              title={quarter.label}
              subtitle={`${quarter.items.length} feature${quarter.items.length === 1 ? "" : "s"}`}
              capacityBar={<CapacityBar usedEffort={quarter.usedEffort} capacity={quarter.capacity} />}
              empty={quarter.items.length === 0 ? "No capacity used yet." : null}
            >
              {quarter.items.map(({ feature, score }) => (
                <RoadmapCard key={feature.id} feature={feature} score={score} />
              ))}
            </QuarterColumn>
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
                Everything fits within {CAPACITY_PER_QUARTER * 4} effort points across four quarters.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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
