import { getPosts } from '../blogs/utils';
import { getProjects } from '../projects/utils';
import siteMetadata from '../site-metadata';

export interface FeedItem {
	title: string;
	path: string;
	summary: string;
	/** Projects carry no date, so theirs is left out. */
	date?: string;
}

const xmlEscape = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

export function rssResponse(
	feedPath: string,
	title: string,
	description: string,
	items: FeedItem[],
) {
	const base = siteMetadata.siteUrl;
	const body = items
		.map(
			(i) => `
		<item>
			<title>${xmlEscape(i.title)}</title>
			<link>${base}${i.path}</link>
			<guid>${base}${i.path}</guid>${i.date ? `\n\t\t\t<pubDate>${new Date(i.date).toUTCString()}</pubDate>` : ''}
			<description>${xmlEscape(i.summary)}</description>
		</item>`,
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${xmlEscape(title)}</title>
		<link>${base}</link>
		<description>${xmlEscape(description)}</description>
		<language>${siteMetadata.language}</language>
		<atom:link href="${base}${feedPath}" rel="self" type="application/rss+xml" />${body}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
	});
}

export const postItems = (): FeedItem[] =>
	getPosts().map((p) => ({
		title: p.metadata.title,
		path: `/blogs/${p.slug}`,
		summary: p.metadata.summary,
		date: p.metadata.publishedAt,
	}));

export const projectItems = (): FeedItem[] =>
	getProjects().map((p) => ({
		title: p.name,
		path: `/projects/${p.slug}`,
		summary: p.summary,
	}));
