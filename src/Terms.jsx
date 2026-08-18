export default function Terms() {
  return (
    <div className="min-h-screen bg-transparent px-6 py-10 text-[#DCE8F5]">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-xs text-ink underline hover:text-ink/80">
          ← Back to Roadmap Tradeoff Visualizer
        </a>

        <h1 className="font-heading mt-4 text-2xl font-bold text-ink">Terms of Service</h1>
        <p className="mt-1 text-xs text-[#7C93AD]">Last updated: August 2026</p>

        <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-[#DCE8F5]">
          <p>
            These Terms of Service ("Terms") govern your use of Roadmap Tradeoff Visualizer
            (the "Service"). By using the Service, you agree to these Terms. If you don't agree,
            please don't use the Service.
          </p>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              1. What the Service Does
            </h2>
            <p>
              Roadmap Tradeoff Visualizer is a tool for exploring product roadmap prioritization
              using scoring frameworks such as RICE. It's intended to support your own product
              planning judgment, not to replace it — you remain responsible for decisions made
              using the tool.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              2. Accounts
            </h2>
            <p>
              You're responsible for maintaining the security of your account and password. You
              must provide accurate information when creating an account, and you're responsible
              for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              3. Your Content
            </h2>
            <p>
              Any backlog data, feature names, or other information you upload or enter remains
              yours. We don't claim ownership of it. You're responsible for making sure you have
              the right to upload any data you enter, and for not including anything unlawful,
              harmful, or that infringes on others' rights.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              4. Acceptable Use
            </h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5 text-[#C3D2E3]">
              <li>Attempt to disrupt, overload, or gain unauthorized access to the Service</li>
              <li>Use the Service to violate any applicable law</li>
              <li>Attempt to reverse-engineer or resell the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              5. Fees and Payment
            </h2>
            <p>
              Some features of the Service may require payment, as described at the time of
              purchase. Fees are billed as stated during checkout. If you're not satisfied with a
              purchase, you may request a refund within 14 days of purchase by contacting us —
              refunds beyond that window are considered at our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              6. Disclaimer
            </h2>
            <p>
              The Service is provided "as is," without warranties of any kind. Scoring outputs
              (such as RICE rankings) are a decision-support aid based on the inputs you provide
              — we don't guarantee their accuracy or suitability for any particular business
              decision, and you use them at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, we are not liable for any indirect,
              incidental, or consequential damages arising from your use of the Service. Our
              total liability for any claim relating to the Service is limited to the amount you
              paid us in the 12 months before the claim arose.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              8. Termination
            </h2>
            <p>
              You may stop using the Service and delete your account at any time. We may suspend
              or terminate access if these Terms are violated, or if needed to protect the
              Service or other users.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. If changes are significant, we'll try
              to notify you by email where practical. Continued use of the Service after changes
              means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              10. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the State of Nebraska, without regard to
              its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-1.5 text-base font-semibold text-ink">
              11. Contact
            </h2>
            <p>
              Questions about these Terms? Reach us at{" "}
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