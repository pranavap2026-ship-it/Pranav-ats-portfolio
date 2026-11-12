export default function Loading() {
  return (
    <main
      className="mx-auto min-h-[70vh] max-w-5xl space-y-8 px-5 py-16"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <span className="sr-only" role="status">
        Loading portfolio content...
      </span>

      {/* Heading skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />

        <div className="h-5 w-80 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-7 px-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl
              border border-zinc-200 bg-white shadow-sm
              dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20
            "
          >
            {/* Image placeholder */}
            <div className="relative aspect-video animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 motion-reduce:animate-none" />

            <div className="space-y-4 p-5">
              {/* Title */}
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/80 motion-reduce:animate-none" />
                <div className="h-3.5 w-5/6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/80 motion-reduce:animate-none" />
              </div>

              {/* Technology tags */}
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />
              </div>

              {/* Button */}
              <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}