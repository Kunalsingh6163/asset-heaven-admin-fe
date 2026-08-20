"use client";

export default function GlobalError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="route-message">
      <h1>Something went wrong</h1>
      <p>We could not load this page. Please try again.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
