import { useState, useEffect, useRef } from "react";
import { features as initialFeatures } from "./data/features.js";
import ManifestPanel from "./components/ManifestPanel.jsx";
import CoursePanel from "./components/CoursePanel.jsx";
import Login from "./login.jsx";
import Feedback from "./Feedback.jsx";
import { supabase } from "./lib/supabaseClient";
import { parseBacklogCSV, generateSampleCSV } from "./lib/csvImport";

export default function App() {
  const [features, setFeatures] = useState(initialFeatures);
  const [activeTab, setActiveTab] = useState("backlog");
  const [roadmapHasUpdates, setRoadmapHasUpdates] = useState(false);
  const [capacityPerQuarter, setCapacityPerQuarter] = useState(8);

  const [session, setSession] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [importErrors, setImportErrors] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const loadBacklog = async () => {
      const { data, error } = await supabase
        .from("backlogs")
        .select("data")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) setFeatures(data.data);
    };
    loadBacklog();
  }, [session]);

  const handleChange = (id, field, value) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    setRoadmapHasUpdates((prev) => prev || activeTab !== "roadmap");
  };

  const handleReset = () => {
    setFeatures(initialFeatures);
    setImportErrors([]);
    setRoadmapHasUpdates((prev) => prev || activeTab !== "roadmap");
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === "roadmap") setRoadmapHasUpdates(false);
  };

  const handleSave = async () => {
    if (!session) return;
    setSaveStatus("saving");
    const { data: existing } = await supabase
      .from("backlogs")
      .select("id")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase.from("backlogs").update({ data: features }).eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("backlogs")
        .insert({ user_id: session.user.id, name: "My Backlog", data: features }));
    }
    setSaveStatus(error ? "error" : "saved");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const { features: parsed, errors } = parseBacklogCSV(event.target.result);
      setImportErrors(errors);
      if (parsed.length > 0) {
        setFeatures(parsed);
        setRoadmapHasUpdates((prev) => prev || activeTab !== "roadmap");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const handleDownloadSample = () => {
    const blob = new Blob([generateSampleCSV()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backlog_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("shubhra80@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#DCE8F5]">
      <Login session={session} />

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
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-sm border border-ink bg-ink/15 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/25"
              >
                Upload CSV
              </button>
              <button
                onClick={handleDownloadSample}
                className="text-xs text-[#8CA3BC] underline hover:text-ink"
              >
                Download sample template
              </button>
            </div>
            <p className="mb-3 text-xs text-[#7C93AD]">
              Supports up to 100 features per upload.
            </p>

            {importErrors.length > 0 && (
              <div className="mb-3 rounded-sm border border-red-400/40 bg-red-400/10 p-3 text-xs text-red-300">
                <p className="mb-1 font-semibold">
                  {importErrors.length} row{importErrors.length > 1 ? "s" : ""} skipped:
                </p>
                <ul className="list-disc space-y-0.5 pl-4">
                  {importErrors.map((err, i) => (
                    <li key={i}>{err.row ? `Row ${err.row}: ${err.message}` : err.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <ManifestPanel
              features={features}
              originalFeatures={initialFeatures}
              onChange={handleChange}
              onReset={handleReset}
            />
            {session && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                  className="rounded-sm border border-ink bg-ink/15 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/25 disabled:opacity-50"
                >
                  {saveStatus === "saving" ? "Saving…" : "Save Backlog"}
                </button>
                {saveStatus === "saved" && <span className="text-xs text-[#8CA3BC]">Saved ✓</span>}
                {saveStatus === "error" && <span className="text-xs text-red-400">Save failed</span>}
              </div>
            )}
          </div>
          <div className={`min-w-0 flex-1 ${activeTab === "roadmap" ? "block" : "hidden"} lg:block`}>
            <div className="mb-1.5 flex items-center gap-2 text-xs">
              <label htmlFor="capacity" className="text-[#8CA3BC]">
                Capacity per quarter (effort points):
              </label>
              <input
                id="capacity"
                type="number"
                min="1"
                value={capacityPerQuarter}
                onChange={(e) => setCapacityPerQuarter(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 rounded-sm border border-white/15 bg-transparent px-2 py-1 text-[#DCE8F5] focus:border-ink/50 focus:outline-none"
              />
            </div>
            <p className="mb-3 text-xs text-[#7C93AD]">
              Defaults to 8 — update to match your team's real quarterly capacity.
            </p>
            <CoursePanel features={features} capacityPerQuarter={capacityPerQuarter} />
          </div>
        </div>
      </main>

      <footer className="border-t border-ink/20 px-6 py-4 text-center text-xs text-[#7C93AD]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/privacy" className="underline hover:text-ink">
            Privacy Policy
          </a>
          <a href="/terms" className="underline hover:text-ink">
            Terms of Service
          </a>
          <button onClick={() => setShowFeedback(true)} className="underline hover:text-ink">
            Send Feedback
          </button>
          <button onClick={handleCopyEmail} className="underline hover:text-ink">
            {copiedEmail ? "Email copied ✓" : "Contact"}
          </button>
        </div>
      </footer>

      {showFeedback && <Feedback session={session} onClose={() => setShowFeedback(false)} />}
    </div>
  );
}