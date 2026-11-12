'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  AnimatePresence,
  motion,
  MotionConfig,
} from 'framer-motion';

import {
  Github,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';

const filters = [
  'All',
  'Full Stack',
  'Frontend',
  'AI',
  'Web Applications',
];

type Project = {
  _id: string;
  title: string;
  slug: string;
  short?: string;
  categories?: string[];
  tech?: string[];
  thumbnail?: string;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
};

export default function ProjectGrid({
  projects,
}: {
  projects: Project[];
}) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const list = useMemo(() => {
    return (projects || []).filter((project) => {
      const matchesFilter =
        filter === 'All' ||
        project.categories?.includes(filter);

      const searchableText = [
        project.title,
        project.short || '',
        ...(project.categories || []),
        ...(project.tech || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, normalizedQuery]);

  return (
    <MotionConfig reducedMotion="user">
      <section aria-label="Portfolio projects">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            {filters.map((item) => {
              const isActive = filter === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={isActive}
                  className={`
                    btn relative overflow-hidden border
                    transition-colors duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-accent
                    ${
                      isActive
                        ? 'border-transparent text-white'
                        : 'border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 35,
                      }}
                      className="absolute inset-0 rounded-lg bg-accent"
                    />
                  )}

                  <span className="relative z-10">
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 sm:max-w-sm">
            <label className="relative block flex-1">
              <Search
                size={17}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <span className="sr-only">
                Search projects
              </span>

              <input
                type="search"
                className="input w-full pl-9 pr-9"
                placeholder="Search projects, skills or technology..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search projects"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </label>
          </div>
        </div>

        {/* Project Count */}
        <p
          className="mb-4 text-xs text-zinc-500"
          aria-live="polite"
        >
          Showing {list.length} of {projects.length} projects
        </p>

        {/* Empty State */}
        {list.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-12 text-center dark:border-zinc-700">
            <Search
              size={28}
              className="mx-auto mb-3 text-zinc-400"
            />

            <h3 className="font-semibold">
              No projects found
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Try another filter or search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setFilter('All');
                setQuery('');
              }}
              className="btn-ghost mt-4"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Project Cards */}
        <motion.div
  layout
  className="grid grid-cols-1 gap-7 px-4 sm:grid-cols-2 sm:gap-6 sm:px-2 lg:grid-cols-3 lg:gap-7"
>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((project) => (
              <motion.article
                layout
                key={project._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="card group mx-auto flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-xl sm:max-w-[420px]"
              >
                {/* Thumbnail */}
                {project.thumbnail && (
                  <Link
                    href={`/projects/${project.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="relative block aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900"
                  >
                    <Image
                      src={project.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">
                      {project.title}
                    </h3>

                    {project.featured && (
                      <span className="tag shrink-0 text-accent">
                        Featured
                      </span>
                    )}
                  </div>

                  {project.short && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {project.short}
                    </p>
                  )}

                  {/* Technologies */}
                  {!!project.tech?.length && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((technology) => (
                        <span
                          key={technology}
                          className="tag"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="btn-primary"
                    >
                      View details
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                      >
                        <ExternalLink size={14} />
                        Live demo
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </MotionConfig>
  );
}