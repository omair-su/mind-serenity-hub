const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export default function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("test_")) return null;

  return (
    <div className="w-full bg-gold/15 border-b border-gold/40 px-4 py-2 text-center text-xs sm:text-sm text-foreground font-body">
      <strong className="text-gold-dark">Test mode</strong> — payments in the preview use test cards (no real money).{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-semibold"
      >
        Learn more
      </a>
    </div>
  );
}
