import { get } from '@/lib/api';
export default async function sitemap() { const u = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ps = (await get('/projects')) || [];
  return [{ url: u, lastModified: new Date() }, ...ps.map((p: any) => ({ url: `${u}/projects/${p.slug}`, lastModified: p.updatedAt }))]; }
