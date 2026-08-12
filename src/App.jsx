import { useState } from "react";
import { features as initialFeatures } from "./data/features.js";
import ManifestPanel from "./components/ManifestPanel.jsx";
import CoursePanel from "./components/CoursePanel.jsx";

export default function App() {
  const [features, setFeatures] = useState(initialFeatures);
  // Mobile-only: which panel is showing (desktop always shows both side by
  // side, so this is ignored above the lg breakpoint). Backlog first since
  // editing is the primary mobile action.
  const [activeTab, setActiveTab] = useState("backlog");
  // Set on any edit while the Roadmap tab isn't the active view, so a
  // mobile user knows the re-ranked plan changed without switching tabs
  // to check. Cleared the moment they do switch.
  const [roadmapHasUpdates, setRoadmapHasUpdates] = useState(false);

  const handleChange = (id, field, value) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    setRoadmapHasUpdates((prev) => prev || activeTab !== "roadmap");
  };

  const handleReset = () => {
    setFeatures(initialFeatures);
    setRoadmapHasUpdates((prev) => prev || activeTab !== "roadmap");
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === "roadmap") setRoadmapHasUpdates(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#DCE8F5]">
      <header className="border-b border-ink/20 bg-navy/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="font-heading text-lg font-bold tracking-tight text-ink">Roadmap Tradeoff Visualizer</h1>
          <p className="mt-0.5 text-sm text-[#8CA3BC]">
            Edit reach, impact, confidence, and effort in the Backlog — watch the Recommended Roadmap re-rank live.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-4 flex gap-1.5 lg:hidden" role="tablist" aria-label="Panel">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "backlog"}
            onClick={() => handleSelectTab("backlog")}
            className={`flex-1 rounded-sm border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "backlog"
                ? "border-ink bg-ink/15 text-ink"
                : "border-white/15 text-[#8CA3BC] hover:border-ink/40"
            }`}
          >
            Backlog
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "roadmap"}
            onClick={() => handleSelectTab("roadmap")}
            className={`relative flex-1 rounded-sm border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "roadmap"
                ? "border-ink bg-ink/15 text-ink"
                : "border-white/15 text-[#8CA3BC] hover:border-ink/40"
            }`}
          >
            Roadmap
            {roadmapHasUpdates ? (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-teal px-1 font-mono text-[8px] font-bold leading-none text-navy">
                <span className="sr-only">Updated</span>
                <span aria-hidden="true">&bull;</span>
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className={`lg:w-[38rem] lg:shrink-0 ${activeTab === "backlog" ? "block" : "hidden"} lg:block`}>
            <ManifestPanel
              features={features}
              originalFeatures={initialFeatures}
              onChange={handleChange}
              onReset={handleReset}
            />
          </div>
          <div className={`min-w-0 flex-1 ${activeTab === "roadmap" ? "block" : "hidden"} lg:block`}>
            <CoursePanel features={features} />
          </div>
        </div>
      </main>
    </div>
  );
}
