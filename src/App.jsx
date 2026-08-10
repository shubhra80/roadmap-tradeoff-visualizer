import { useMemo, useState } from "react";
import { features as initialFeatures } from "./data/features.js";
import { buildRoadmap, CAPACITY_PER_QUARTER } from "./lib/roadmap.js";
import FeatureCard from "./components/FeatureCard.jsx";

function CapacityBar({ usedEffort, capacity }) {
  const pct = Math.min(100, (usedEffort / capacity) * 100);
  const overCapacity = usedEffort > capacity;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${pct}%`,
            backgroundColor: overCapacity ? "#d03b3b" : "#0ca30c",
          }}
        />
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400">
        {usedEffort.toFixed(1)}/{capacity} pts
      </span>
    </div>
  );
}

function Column({ title, subtitle, children, capacityBar }) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 sm:w-80">
      <div className="sticky top-0 z-10 -mx-1 bg-neutral-50/95 px-1 pb-2 pt-1 backdrop-blur dark:bg-neutral-950/95">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
          {subtitle ? (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</span>
          ) : null}
        </div>
        {capacityBar}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function App() {
  const [features, setFeatures] = useState(initialFeatures);

  const handleChange = (id, field, value) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleReset = () => setFeatures(initialFeatures);

  const { quarters, later } = useMemo(() => buildRoadmap(features), [features]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-neutral-900/80">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Roadmap Tradeoff Visualizer</h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Adjust reach, impact, confidence, and effort — the RICE score and quarterly plan re-rank live.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Reset to defaults
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="flex gap-5 overflow-x-auto pb-4">
          {quarters.map((quarter) => (
            <Column
              key={quarter.label}
              title={quarter.label}
              subtitle={`${quarter.items.length} feature${quarter.items.length === 1 ? "" : "s"}`}
              capacityBar={<CapacityBar usedEffort={quarter.usedEffort} capacity={quarter.capacity} />}
            >
              {quarter.items.map(({ feature, score }) => (
                <FeatureCard key={feature.id} feature={feature} score={score} onChange={handleChange} />
              ))}
              {quarter.items.length === 0 ? (
                <p className="text-xs italic text-neutral-400 dark:text-neutral-600">No capacity used yet.</p>
              ) : null}
            </Column>
          ))}

          <Column
            title="Later"
            subtitle={`${later.length} feature${later.length === 1 ? "" : "s"}`}
          >
            {later.map(({ feature, score }) => (
              <FeatureCard key={feature.id} feature={feature} score={score} onChange={handleChange} />
            ))}
            {later.length === 0 ? (
              <p className="text-xs italic text-neutral-400 dark:text-neutral-600">
                Everything fits within {CAPACITY_PER_QUARTER * 4} effort points across four quarters.
              </p>
            ) : null}
          </Column>
        </div>
      </main>
    </div>
  );
}
