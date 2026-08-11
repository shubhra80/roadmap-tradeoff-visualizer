import { useState } from "react";
import { features as initialFeatures } from "./data/features.js";
import ManifestPanel from "./components/ManifestPanel.jsx";
import CoursePanel from "./components/CoursePanel.jsx";

export default function App() {
  const [features, setFeatures] = useState(initialFeatures);

  const handleChange = (id, field, value) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleReset = () => setFeatures(initialFeatures);

  return (
    <div className="min-h-screen bg-transparent text-[#DCE8F5]">
      <header className="border-b border-ink/20 bg-navy/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-ink">Roadmap Tradeoff Visualizer</h1>
            <p className="mt-0.5 text-sm text-[#8CA3BC]">
              Edit reach, impact, confidence, and effort in the Backlog — watch the Recommended Roadmap re-rank live.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-sm border border-ink/30 bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-sm hover:bg-ink/10"
          >
            Reset to defaults
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:w-[38rem] lg:shrink-0">
            <ManifestPanel features={features} onChange={handleChange} />
          </div>
          <div className="min-w-0 flex-1">
            <CoursePanel features={features} />
          </div>
        </div>
      </main>
    </div>
  );
}
