import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Feedback({ session, onClose }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // '', 'sending', 'sent', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");

    const { error } = await supabase.from("feedback").insert({
      message: message.trim(),
      email: email.trim() || null,
      user_id: session?.user?.id || null,
    });

    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
      setMessage("");
      setEmail("");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-sm border border-ink/25 bg-navy p-4 text-sm text-[#DCE8F5] shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-heading text-sm font-bold text-ink">Send Feedback</h3>
          <button
            onClick={onClose}
            className="text-[#8CA3BC] hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {status === "sent" ? (
          <div>
            <p className="text-[#8CA3BC]">Thanks — this was received.</p>
            <button
              onClick={onClose}
              className="mt-3 rounded-sm border border-ink bg-ink/15 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/25"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              placeholder="What's on your mind — a bug, an idea, anything."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="resize-none rounded-sm border border-white/15 bg-transparent px-2 py-1.5 text-xs text-[#DCE8F5] placeholder:text-[#8CA3BC] focus:border-ink/50 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email (optional, if you'd like a reply)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-white/15 bg-transparent px-2 py-1.5 text-xs text-[#DCE8F5] placeholder:text-[#8CA3BC] focus:border-ink/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-1 rounded-sm border border-ink bg-ink/15 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/25 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-400">Something went wrong — please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}