export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export async function get<T = any>(path: string): Promise<T | null> {
  try { const r = await fetch(API + path, { next: { revalidate: 60 } }); const j = await r.json(); return j.success ? j.data : null; }
  catch { return null; }
}
