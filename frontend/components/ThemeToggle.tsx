'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Read the theme applied by the root layout initialization script
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');

    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // Toggle theme
  function toggleTheme() {
    if (!theme) return;

    const newTheme: Theme =
      theme === 'dark' ? 'light' : 'dark';

    const isDark = newTheme === 'dark';

    // Update HTML theme immediately
    document.documentElement.classList.toggle('dark', isDark);

    // Update browser color scheme
    document.documentElement.style.colorScheme = newTheme;

    // Update React state
    setTheme(newTheme);

    // Save preference
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Theme remains functional without localStorage.
    }
  }

  // Prevent incorrect icon before initialization
  if (!theme) {
    return (
      <button
        type="button"
        className="btn-ghost !px-2"
        aria-label="Loading theme preference"
        disabled
      >
        <Sun size={18} />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-ghost !px-2 transition-all duration-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}