import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    category: z.enum(['notes', 'fiction', 'image', 'lists']).default('notes'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
