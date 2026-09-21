import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const writing = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: date,
    dateModified: date,
    tags: z.array(z.string()),
    presentation: z.string().optional(),
    order: z.number().default(999),
    listing: z.object({
      group: z.number().int().min(0).max(3),
      order: z.number(),
      topics: z.string(),
      label: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { writing };
