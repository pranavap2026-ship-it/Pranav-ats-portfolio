import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pranav A P | Portfolio',
  description: 'Personal portfolio of Pranav A P.',
};

const themeScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem('portfolio-theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    var isDark = savedTheme === 'dark' ||
      (savedTheme !== 'light' && systemDark);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.classList.toggle(
      'dark',
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}