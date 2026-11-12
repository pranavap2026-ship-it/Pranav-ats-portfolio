'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-semibold">Something went wrong</h1><p className="my-3 text-sm text-zinc-500">The page could not be loaded. Please try again.</p><button className="btn-primary" onClick={() => reset()}>Try again</button></main>;
}
