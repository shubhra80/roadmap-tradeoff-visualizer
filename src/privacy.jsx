export default function Privacy() {
  return (
    <div className="min-h-screen bg-transparent px-6 py-10 text-[#DCE8F5]">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-xs text-ink underline hover:text-ink/80">
          ← Back to Roadmap Tradeoff Visualizer
        </a>

        <h1 className="font-heading mt-4 text-2xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-1 text-xs text-[#7C93AD]">Last updated: August 2026</p>

        <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-[#DCE8F5]">
          <p>
            Roadmap Tradeoff Visualizer ("we," "our," or "the app") is a tool for exploring
            product roadmap prioritization. This policy explains what information we collect,
            how it's used, and how you can control it.
          </p>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              1. Information We Collect
            </h2>
            <p className="mb-2">We collect only what's needed to operate the app:</p>
            <ul className="list-disc space-y-1 pl-5 text-[#C3D2E3]">
              <li>
                <span className="font-semibold text-[#DCE8F5]">Account information:</span> your
                email address and password, used solely to create and secure your account.
              </li>
              <li>
                <span className="font-semibold text-[#DCE8F5]">Backlog data you upload or enter:</span>{" "}
                feature names, descriptions, and scoring inputs (reach, impact, confidence,
                effort) that you type in or upload via CSV. This is business/product planning
                data — we don't ask for or require personal information about you or others
                within it.
              </li>
            </ul>
            <p className="mt-2">
              We do not use analytics, advertising trackers, or cookies beyond what's strictly
              necessary to keep you logged in.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-[#C3D2E3]">
              <li>To create and authenticate your account</li>
              <li>To save and load your backlog data across sessions</li>
              <li>To respond if you contact us for support</li>
            </ul>
            <p className="mt-2">We do not sell your data, and we do not share it with advertisers.</p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              3. Where Your Data Is Stored
            </h2>
            <p>
              Your account and backlog data are stored using Supabase, a third-party
              infrastructure provider that hosts our database and handles authentication.
              Supabase acts as our data processor and does not use your data for its own
              purposes. Access to your backlog data is restricted to your account through
              database-level security rules, meaning no other user can read or modify your data.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              4. Your Choices
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-[#C3D2E3]">
              <li>You can update or delete your backlog data at any time within the app.</li>
              <li>
                You can request full account deletion, including removal of your email and any
                saved backlog data, by emailing us (below).
              </li>
              <li>You can log out at any time, ending your active session.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              5. Data Retention
            </h2>
            <p>
              We retain your account and backlog data for as long as your account is active. If
              you request deletion, we will remove your data within a reasonable time, typically
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              6. Changes to This Policy
            </h2>
            <p>
              If this policy changes, we'll update the "Last updated" date above. Significant
              changes will be communicated via email where practical.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              7. Contact
            </h2>
            <p>
              Questions, data deletion requests, or anything else — reach us at{" "}
              <a href="mailto:shubhra80@gmail.com" className="text-ink underline hover:text-ink/80">
                shubhra80@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
