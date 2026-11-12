import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { get } from '@/lib/api';
export const revalidate = 60;
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await get(`/projects/${params.slug}`);
  return p ? { title: p.title, description: p.short, alternates: { canonical: `/projects/${p.slug}` }, openGraph: { title: p.title, description: p.short, images: p.thumbnail ? [p.thumbnail] : [] } } : {};
}
const Block = ({ title, children }: { title: string; children?: React.ReactNode }) => children ? <section><h2 className="mb-2 text-lg font-semibold">{title}</h2><div className="text-zinc-600 dark:text-zinc-400">{children}</div></section> : null;
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const p = await get(`/projects/${params.slug}`); if (!p) notFound();
  return (<main className="mx-auto max-w-3xl space-y-8 px-5 py-10">
    <Link href="/#projects" className="btn-ghost"><ArrowLeft size={14} />All projects</Link>
    <header className="space-y-3"><h1 className="text-3xl font-bold tracking-tight">{p.title}</h1><p className="text-zinc-600 dark:text-zinc-400">{p.short}</p>
      <div className="flex flex-wrap gap-1.5">{p.tech?.map((t: string) => <span key={t} className="tag">{t}</span>)}</div>
      <div className="flex gap-2">{p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><ExternalLink size={14} />Live demo</a>}
        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost"><Github size={14} />GitHub</a>}</div></header>
    {p.thumbnail && <img src={p.thumbnail} alt={`${p.title} preview`} className="w-full rounded-xl" />}
    <Block title="Overview">{p.overview && <p>{p.overview}</p>}</Block>
    <Block title="Problem">{p.problem && <p>{p.problem}</p>}</Block>
    <Block title="Solution">{p.solution && <p>{p.solution}</p>}</Block>
    <Block title="Features">{!!p.features?.length && <ul className="list-disc pl-5">{p.features.map((f: string) => <li key={f}>{f}</li>)}</ul>}</Block>
    <Block title="Architecture">{p.architecture && <p>{p.architecture}</p>}</Block>
    <Block title="Challenges">{p.challenges && <p>{p.challenges}</p>}</Block>
    <Block title="My contribution">{p.contribution && <p>{p.contribution}</p>}</Block>
    {!!p.screenshots?.length && <section className="grid gap-3 sm:grid-cols-2">{p.screenshots.map((s: string) => <img key={s} src={s} alt={`${p.title} screenshot`} loading="lazy" className="rounded-lg" />)}</section>}
  </main>);
}
