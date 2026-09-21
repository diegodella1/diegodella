import { siteData } from '../lib/site';
const templates = import.meta.glob('../content/markdown/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export function getStaticPaths() {
  return Object.entries(templates).map(([path, template]) => ({ params: { document: path.split('/').pop()!.replace(/\.md$/, '') }, props: { template } }));
}
export async function GET({ props }: { props: { template: string } }) {
  const site = await siteData();
  const text = props.template.replace(/\{\{(.*?)\}\}/g, (_, token: string) => {
    const [type, name, field] = token.split('.');
    if (type === 'bio') return site.bios[name as keyof typeof site.bios];
    if (type === 'site') return String(site.site[name as keyof typeof site.site]);
    const article = site.writing.find(article => article.slug === name);
    if (!article || !['title', 'description'].includes(field)) throw new Error(`Invalid Markdown reference: ${token}`);
    return article[field as 'title' | 'description'];
  });
  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
