import type { Metadata } from 'next';
import siteMetadata from '../site-metadata';

interface CreateMetadataInput {
	title?: string;
	description: string;
	/** Route path, e.g. '/' or '/blogs/some-post'; resolved against metadataBase. */
	path: string;
	type?: 'website' | 'article';
	publishedTime?: string;
	authors?: string[];
	tags?: string[];
}

/**
 * Builds a page's full metadata (canonical, Open Graph, Twitter Card) from a
 * handful of page-specific fields. Next.js replaces `openGraph`/`twitter`
 * entirely when a route sets its own, rather than merging with the parent
 * layout, so every route needs siteName/locale/twitter:site included itself.
 */
export function createMetadata({
	title,
	description,
	path,
	type = 'website',
	publishedTime,
	authors,
	tags,
}: CreateMetadataInput): Metadata {
	const openGraph =
		type === 'article'
			? ({
					title,
					description,
					siteName: siteMetadata.title,
					locale: siteMetadata.ogLocale,
					type: 'article',
					url: path,
					publishedTime,
					authors,
					tags,
				} as const)
			: ({
					title,
					description,
					siteName: siteMetadata.title,
					locale: siteMetadata.ogLocale,
					type: 'website',
					url: path,
				} as const);

	return {
		title,
		description,
		alternates: {
			canonical: path,
			types: { 'application/rss+xml': '/rss.xml' },
		},
		openGraph,
		twitter: {
			card: 'summary_large_image',
			site: siteMetadata.twitterHandle,
			creator: siteMetadata.twitterHandle,
			title,
			description,
		},
	};
}
