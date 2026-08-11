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
        <div className="mx-auto max-w-[1600px]">
          <h1 className="font-heading text-lg font-bold tracking-tight text-ink">Roadmap Tradeoff Visualizer</h1>
          <p className="mt-0.5 text-sm text-[#8CA3BC]">
            Edit reach, impact, confidence, and effort in the Backlog — watch the Recommended Roadmap re-rank live.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="lg:w-[38rem] lg:shrink-0">
            <ManifestPanel
              features={features}
              originalFeatures={initialFeatures}
              onChange={handleChange}
              onReset={handleReset}
            />
          </div>
          <div className="min-w-0 flex-1">
            <CoursePanel features={features} />
          </div>
        </div>
      </main>
    </div>
  );
}
