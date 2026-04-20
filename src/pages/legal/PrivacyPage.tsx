import LegalLayout from "./LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="April 20, 2026">
      <p>
        Willow Vibes ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have. We comply with the EU General Data Protection Regulation (GDPR), the UK GDPR, and the California Consumer Privacy Act (CCPA/CPRA) where applicable.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> email address, display name, password (hashed).</li>
        <li><strong>Wellness data:</strong> mood entries, gratitude entries, journal entries, session completions, streak data, intentions.</li>
        <li><strong>Usage data:</strong> pages visited, features used, device type, approximate location (from IP), timezone.</li>
        <li><strong>Payment data:</strong> processed by our payment processor Paddle. We never see or store your full card number.</li>
        <li><strong>AI interactions:</strong> messages you send to the AI Coach and content used to generate AI Daily Insights.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and personalize the Service.</li>
        <li>To process payments and manage subscriptions.</li>
        <li>To generate AI insights, reflections, and narration on your behalf.</li>
        <li>To send service-related emails (e.g. password resets, receipts).</li>
        <li>To send marketing emails (only if you opt in — you can unsubscribe at any time).</li>
        <li>To detect fraud, abuse, and security incidents.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Legal Bases (GDPR)</h2>
      <ul>
        <li><strong>Contract:</strong> to provide the Service you signed up for.</li>
        <li><strong>Consent:</strong> for marketing emails and optional analytics.</li>
        <li><strong>Legitimate interests:</strong> to improve the Service and prevent abuse.</li>
        <li><strong>Legal obligation:</strong> tax, accounting, and regulatory compliance.</li>
      </ul>

      <h2>4. Sharing Your Information</h2>
      <p>We do not sell your personal information. We share it only with:</p>
      <ul>
        <li><strong>Paddle</strong> — Merchant of Record for payments, taxes, and invoicing.</li>
        <li><strong>Supabase</strong> — secure cloud database and authentication.</li>
        <li><strong>AI providers</strong> — Anthropic, Google, OpenAI, and ElevenLabs process AI requests on our behalf under data processing agreements. Inputs are not used to train their models.</li>
        <li><strong>Email providers</strong> — for transactional and marketing email delivery.</li>
        <li><strong>Legal authorities</strong> — when required by law.</li>
      </ul>

      <h2>5. Your Rights</h2>
      <p>Depending on your location, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccurate data.</li>
        <li>Delete your data ("right to be forgotten").</li>
        <li>Export your data in a portable format.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent at any time.</li>
        <li>Lodge a complaint with your local data protection authority.</li>
      </ul>
      <p>To exercise any of these rights, email <a href="mailto:privacy@willowvibes.com">privacy@willowvibes.com</a>. We respond within 30 days.</p>

      <h2>6. Data Retention</h2>
      <p>We keep your account data for as long as your account is active. If you delete your account, we delete your personal data within 30 days, except where we are required to retain certain records (e.g. tax invoices for 7 years).</p>

      <h2>7. Security</h2>
      <p>We use industry-standard encryption (TLS in transit, AES-256 at rest), Row-Level Security on our database, and follow security best practices. No system is 100% secure — please use a strong, unique password.</p>

      <h2>8. International Transfers</h2>
      <p>Your data may be processed in countries outside your own. We rely on Standard Contractual Clauses and equivalent safeguards for cross-border transfers.</p>

      <h2>9. Children</h2>
      <p>The Service is not directed to children under 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, contact us and we will delete it.</p>

      <h2>10. Cookies</h2>
      <p>We use essential cookies for authentication and session management. We do not use advertising cookies. With your consent, we use anonymized analytics to understand how the Service is used.</p>

      <h2>11. Changes to This Policy</h2>
      <p>We may update this Policy from time to time. Material changes will be communicated by email or in-app notice.</p>

      <h2>12. Contact</h2>
      <p>Privacy questions: <a href="mailto:privacy@willowvibes.com">privacy@willowvibes.com</a>.</p>
    </LegalLayout>
  );
}
