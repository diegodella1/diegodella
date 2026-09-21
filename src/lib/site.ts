import { getCollection } from 'astro:content';
import profile from '../data/site.json';

export async function siteData() {
  const entries = (await getCollection('writing')).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
  const writing = entries.map(({ id, data }) => ({
    slug: id,
    title: data.title,
    description: data.description,
    datePublished: data.datePublished,
    url: new URL(`${id}.html`, profile.site.url).href,
    tags: data.tags,
    dateModified: data.dateModified,
  }));
  const pages = { ...profile.pages, ...Object.fromEntries(writing.map(article => [
    `${article.slug}.html`, { dateModified: article.dateModified },
  ])) };
  return { ...profile, pages, writing };
}

export function slugFromUrl(url: URL) {
  return url.pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';
}
