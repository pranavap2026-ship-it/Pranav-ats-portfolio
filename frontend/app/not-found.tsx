import Link from 'next/link';
export default function NotFound() {
  return <main className="mx-auto max-w-xl px-5 py-24 text-center"><p className="text-sm font-medium text-accent">404</p><h1 className="mt-2 text-3xl font-semibold">Page not found</h1><p className="my-3 text-sm text-zinc-500">The page may have moved or is no longer available.</p><Link href="/" className="btn-primary">Back to portfolio</Link></main>;
}
