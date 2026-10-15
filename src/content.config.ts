import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    order: z.number(),
    title: z.string(), // <title> width 50-60 (Hangul = 2)
    h1: z.string(),
    description: z.string(), // width 150-160
    kicker: z.string(),
    question: z.string(),
    answer: z.string(), // direct answer rendered first
    data_asof: z.string(),
    published: z.string(),
    updated: z.string(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { guides };
