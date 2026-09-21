import { siteData } from '../lib/site';
import { discoveryFiles } from '../lib/discovery.mjs';
export async function GET() {
  return new Response(discoveryFiles(await siteData())['feed.xml'], { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
