import type { ReactNode } from 'react';
import Image from 'next/image';

import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Download,
} from 'lucide-react';

import { API, get } from '@/lib/api';
import Reveal from '@/components/Reveal';
import MobileNav from '@/components/MobileNav';
import ProjectGrid from '@/components/ProjectGrid';
import ContactForm from '@/components/ContactForm';
import ThemeToggle from '@/components/ThemeToggle';
import { Item, Stagger, ScrollProgress } from '@/components/Motion';

export const revalidate = 60;

const links = [
  'About',
  'Skills',
  'Experience',
  'Projects',
  'Education',
  'Contact',
];

type SectionHeadingProps = {
  n: string;
  children: ReactNode;
};

const H = ({ n, children }: SectionHeadingProps) => (
  <Item className="mb-6">
    <p className="mb-1 text-xs font-medium tracking-widest text-accent">
      {n}
    </p>

    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
      {children}
    </h2>
  </Item>
);

export default async function Home() {
  // Fetch all portfolio data concurrently.
  const [
    profile,
    projects,
    skills,
    experience,
    education,
    certifications,
    resume,
    settings,
  ] = await Promise.all([
    get('/profile'),
    get('/projects'),
    get('/skills'),
    get('/experience'),
    get('/education'),
    get('/certifications'),
    get('/resume'),
    get('/settings'),
  ]);

  // Group skills by category.
  const skillGroups: Record<string, string[]> = {};

  (skills || []).forEach((skill: any) => {
    if (!skill.category || !skill.name) return;

    (skillGroups[skill.category] ||= []).push(skill.name);
  });

  const name = profile?.fullName || 'Pranav';

  // Resume download component.
  const Resume = ({ ghost = false }: { ghost?: boolean }) => {
    if (!resume?.exists) return null;

    return (
      <a
        href={`${API}/resume/download`}
        className={ghost ? 'btn-ghost' : 'btn-primary'}
        aria-label="Download resume"
      >
        <Download size={16} />
        Download resume
      </a>
    );
  };

  // Portfolio statistics.
  const stats = [
    ['Projects', projects?.length || 0],
    [
      'Featured',
      projects?.filter((project: any) => project.featured).length || 0,
    ],
    ['Skills', skills?.length || 0],
  ].filter(([, count]) => Number(count) > 0);

  return (
    <>
      <ScrollProgress />

      {/* Desktop Header */}
      <header className="sticky top-0 z-30 hidden border-b border-zinc-200 bg-white/80 backdrop-blur-md md:block dark:border-zinc-800 dark:bg-zinc-950/80">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3"
        >
          <a href="#home" className="font-semibold">
            {name}
          </a>

          <div className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="transition-colors hover:text-accent"
              >
                {link}
              </a>
            ))}

            <Resume />

            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-5 py-2.5 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
        <a href="#home" className="font-semibold">
          {name}
        </a>

        <ThemeToggle />
      </header>

      <div className="relative">
        {/* Background effect */}
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        />

        <main className="mx-auto max-w-5xl space-y-20 px-5 pb-28 pt-10 md:space-y-24 md:px-6 md:pb-16 md:pt-24">

          {/* ================= HERO ================= */}
          <section
            id="home"
            className="flex scroll-mt-24 flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10"
          >
            {/* Profile Image */}
            <Stagger className="md:order-2">
              <Item>
                {profile?.image ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-zinc-200 md:h-52 md:w-52 dark:ring-zinc-800">
                    <Image
                      src={profile.image}
                      alt={`Portrait of ${name}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 96px, 208px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-100 text-2xl font-semibold text-zinc-500 ring-1 ring-zinc-200 md:h-52 md:w-52 md:text-6xl dark:bg-zinc-800 dark:ring-zinc-700"
                  >
                    {name
                      .split(' ')
                      .map((x: string) => x[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                )}
              </Item>
            </Stagger>

            {/* Hero Content */}
            <Stagger className="w-full max-w-xl space-y-5">
              {profile?.available && (
                <Item>
                  <span className="tag inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-green-500" />
                    </span>
                    Open to work
                  </span>
                </Item>
              )}

              <Item>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                  {name}
                </h1>
              </Item>

              {profile?.title && (
                <Item>
                  <p className="text-lg font-medium text-accent md:text-xl">
                    {profile.title}
                  </p>
                </Item>
              )}

              {profile?.intro && (
                <Item>
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {profile.intro}
                  </p>
                </Item>
              )}

              {profile?.location && (
                <Item>
                  <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <MapPin size={14} />
                    {profile.location}
                  </p>
                </Item>
              )}

              {/* Hero Actions */}
              <Item className="flex flex-wrap gap-2">
                <a href="#projects" className="btn-primary">
                  View projects
                </a>

                <Resume ghost />

                <a href="#contact" className="btn-ghost">
                  Contact me
                </a>
              </Item>

              {/* Social Links */}
              <Item className="flex gap-4 text-zinc-500">
                {profile?.github && (
                  <a
                    href={profile.github}
                    aria-label="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:-translate-y-0.5 hover:text-accent"
                  >
                    <Github size={21} />
                  </a>
                )}

                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:-translate-y-0.5 hover:text-accent"
                  >
                    <Linkedin size={21} />
                  </a>
                )}

                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                    className="transition hover:-translate-y-0.5 hover:text-accent"
                  >
                    <Mail size={21} />
                  </a>
                )}
              </Item>

              {/* Statistics */}
              {!!stats.length && (
                <Item className="flex flex-wrap gap-8 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                  {stats.map(([label, count]) => (
                    <div key={String(label)}>
                      <p className="text-2xl font-semibold">{count}</p>
                      <p className="text-sm text-zinc-500">{label}</p>
                    </div>
                  ))}
                </Item>
              )}
            </Stagger>
          </section>

          {/* ================= ABOUT ================= */}
          <Reveal id="about">
            <H n="01">About</H>

            <Item className="max-w-2xl space-y-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
              {[profile?.bio, profile?.summary, profile?.objectives]
                .filter(Boolean)
                .map((text: string, index: number) => (
                  <p key={index}>{text}</p>
                ))}
            </Item>
          </Reveal>

          {/* ================= SKILLS ================= */}
          <Reveal id="skills">
            <H n="02">Skills</H>

            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(skillGroups).map(([category, items]) => (
                <Item
                  key={category}
                  className="card p-4"
                >
                  <h3 className="mb-3 text-sm font-semibold">
                    {category}
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span key={skill} className="tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Item>
              ))}
            </div>
          </Reveal>

          {/* ================= EXPERIENCE ================= */}
          <Reveal id="experience">
            <H n="03">Experience</H>

            <ol className="space-y-5 border-l border-zinc-200 pl-6 dark:border-zinc-800">
              {(experience || []).map((item: any) => (
                <Item
                  as="li"
                  key={item._id}
                  className="relative"
                >
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-white dark:ring-zinc-950" />

                  <h3 className="font-semibold">
                    {item.role}{' '}
                    <span className="font-normal text-zinc-500">
                      at {item.company}
                    </span>
                  </h3>

                  <p className="text-sm text-zinc-500">
                    {[
                      item.type,
                      item.mode,
                      item.duration,
                      item.startDate && `Started ${item.startDate}`,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>

                  {!!item.description?.length && (
                    <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description.map((description: string) => (
                        <li key={description}>{description}</li>
                      ))}
                    </ul>
                  )}

                  {!!item.tech?.length && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tech.map((technology: string) => (
                        <span key={technology} className="tag">
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
                </Item>
              ))}
            </ol>
          </Reveal>

          {/* ================= PROJECTS ================= */}
          <Reveal id="projects">
            <H n="04">Projects</H>

            <ProjectGrid projects={projects || []} />
          </Reveal>

          {/* ================= EDUCATION ================= */}
          <Reveal id="education">
            <H n="05">Education</H>

            <div className="space-y-3">
              {(education || []).map((item: any) => (
                <Item key={item._id} className="card p-4">
                  <h3 className="font-semibold">
                    {item.degree}, {item.department}
                  </h3>

                  <p className="text-sm text-zinc-500">
                    {item.institution}
                    {item.startYear &&
                      `, ${item.startYear} to ${item.endYear || 'present'}`}
                  </p>
                </Item>
              ))}

              {/* Certifications */}
              {!!certifications?.length && (
                <>
                  <Item>
                    <h3 className="pt-4 font-semibold">
                      Certifications
                    </h3>
                  </Item>

                  {certifications.map((certificate: any) => (
                    <Item
                      key={certificate._id}
                      className="card flex items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {certificate.title}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {[
                            certificate.issuer,
                            certificate.date,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>

                      {certificate.url && (
                        <a
                          href={certificate.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost shrink-0"
                        >
                          View credential
                        </a>
                      )}
                    </Item>
                  ))}
                </>
              )}
            </div>

            {/* Resume Update Date */}
            {resume?.exists && resume?.updatedAt && (
              <p className="mt-6 text-sm text-zinc-500">
                Resume last updated{' '}
                {new Date(resume.updatedAt).toLocaleDateString('en-IN', {
                  dateStyle: 'medium',
                  timeZone: 'Asia/Kolkata',
                })}
                .
              </p>
            )}
          </Reveal>

          {/* ================= CONTACT ================= */}
          <Reveal id="contact">
            <H n="06">Contact</H>

            <Item className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
              <ul className="space-y-3 text-sm">
                {profile?.email && (
                  <li>
                    <a
                      className="transition-colors hover:text-accent"
                      href={`mailto:${profile.email}`}
                    >
                      {profile.email}
                    </a>
                  </li>
                )}

                {profile?.linkedin && (
                  <li>
                    <a
                      className="transition-colors hover:text-accent"
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}

                {profile?.github && (
                  <li>
                    <a
                      className="transition-colors hover:text-accent"
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                )}

                {profile?.location && (
                  <li className="text-zinc-500">
                    {profile.location}
                  </li>
                )}
              </ul>

              <ContactForm />
            </Item>
          </Reveal>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-200 py-6 pb-24 text-center text-sm text-zinc-500 md:pb-6 dark:border-zinc-800">
        {settings?.footer}
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </>
  );
}