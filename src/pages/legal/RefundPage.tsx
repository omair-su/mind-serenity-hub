import LegalLayout from "./LegalLayout";

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="April 20, 2026">
      <p>
        We want you to feel calm and confident about your purchase. This Refund Policy explains when you can request a refund and how to do so. Payments are processed by Paddle.com Market Limited, our Merchant of Record.
      </p>

      <h2>1. 7-Day Free Trial</h2>
      <p>All Plus subscriptions begin with a 7-day free trial. You will not be charged during the trial. Cancel anytime in your account settings before the trial ends to avoid being charged.</p>

      <h2>2. 14-Day Money-Back Guarantee</h2>
      <p>
        If you are not satisfied with Willow Plus, you may request a full refund within <strong>14 days of your initial purchase</strong> — no questions asked. This applies to:
      </p>
      <ul>
        <li>Plus Monthly subscriptions ($9.99/month)</li>
        <li>Plus Yearly subscriptions ($59.99/year)</li>
        <li>Lifetime access ($199 one-time)</li>
      </ul>

      <h2>3. Subscription Renewals</h2>
      <p>For automatic renewals (after the initial purchase), refunds are handled as follows:</p>
      <ul>
        <li><strong>Monthly renewals:</strong> we may issue a pro-rated refund for the unused portion of the current month if requested within 7 days of the renewal charge.</li>
        <li><strong>Yearly renewals:</strong> we may issue a pro-rated refund if requested within 30 days of the renewal charge, provided you have used the Service for less than 30 days in the new billing period.</li>
      </ul>

      <h2>4. Lifetime Purchases</h2>
      <p>The 14-day money-back guarantee applies to lifetime purchases. After 14 days, lifetime purchases are non-refundable, but your access is permanent.</p>

      <h2>5. Statutory Rights (EU / UK)</h2>
      <p>
        If you are a consumer in the EU, EEA, or UK, you have a statutory 14-day right of withdrawal under consumer protection law. By starting to use Plus content during this period, you may waive this right — but our 14-day money-back guarantee above provides equivalent or better protection.
      </p>

      <h2>6. How to Request a Refund</h2>
      <p>Email <a href="mailto:support@willowvibes.com">support@willowvibes.com</a> with:</p>
      <ul>
        <li>The email address on your account</li>
        <li>The order or transaction ID (from your Paddle receipt)</li>
        <li>A short reason (optional, helps us improve)</li>
      </ul>
      <p>We respond within 2 business days. Approved refunds are processed by Paddle to the original payment method within 5–10 business days.</p>

      <h2>7. Non-Refundable Situations</h2>
      <ul>
        <li>Requests made after the periods listed above.</li>
        <li>Accounts terminated for violation of our <a href="/legal/terms">Terms of Service</a>.</li>
        <li>Refunds for previous billing periods that have already been used.</li>
      </ul>

      <h2>8. Contact</h2>
      <p>Refund or billing questions: <a href="mailto:support@willowvibes.com">support@willowvibes.com</a>.</p>
    </LegalLayout>
  );
}
