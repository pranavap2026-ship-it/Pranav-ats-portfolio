'use client';

import { useEffect, useState } from 'react';
import {
  Home,
  User,
  Wrench,
  FolderGit2,
  Mail,
} from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'about', label: 'About', Icon: User },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'projects', label: 'Projects', Icon: FolderGit2 },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

export default function MobileNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visibleSections.length > 0) {
          setActive(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-zinc-200
        bg-white/90 backdrop-blur-xl
        md:hidden
        dark:border-zinc-800
        dark:bg-zinc-950/90
      "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <ul className="mx-auto flex max-w-md justify-around px-2 py-1.5">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;

          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`
                  relative flex min-h-12 flex-col
                  items-center justify-center
                  gap-0.5 rounded-xl
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-accent
                  ${
                    isActive
                      ? 'font-semibold text-accent'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }
                `}
              >
                <span
                  aria-hidden="true"
                  className={`
                    absolute inset-0 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'scale-100 bg-blue-500/10 opacity-100'
                        : 'scale-95 opacity-0'
                    }
                  `}
                />

                <span
                  className={`
                    relative transition-transform duration-200
                    ${isActive ? '-translate-y-0.5' : ''}
                  `}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                </span>

                <span className="relative text-[11px]">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}