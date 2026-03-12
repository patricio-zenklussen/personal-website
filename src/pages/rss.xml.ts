import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';


export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
  const published = import.meta.env.PROD ? sorted.filter((p) => !p.data.draft) : sorted;

  return rss({
    title: 'Patricio Zenklussen Franco',
    description: 'Personal site and blog — Patricio Zenklussen Franco',
    site: context.site!.toString(),
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description ?? '',
      link: `/blog/${post.id}/`,
    })),
  });
}
