import { siteData } from '../lib/site';
export async function GET() {
  return new Response(JSON.stringify(await siteData(), null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
