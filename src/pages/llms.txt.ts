import { siteData } from '../lib/site';
import { discoveryFiles } from '../lib/discovery.mjs';
export async function GET() {
  return new Response(discoveryFiles(await siteData())['llms.txt'], { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
