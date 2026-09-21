import { siteData } from '../lib/site';
import { discoveryFiles } from '../lib/discovery.mjs';
export async function GET() {
  return new Response(discoveryFiles(await siteData())['sitemap.xml'], { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
