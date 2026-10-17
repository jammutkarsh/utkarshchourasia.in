import { postItems, rssResponse } from '../../lib/rss';
import siteMetadata from '../../site-metadata';

export const dynamic = 'force-static';

export function GET() {
	return rssResponse(
		'/blogs/rss.xml',
		`${siteMetadata.title} — Blog`,
		'Posts on Linux, Go and self-hosting.',
		postItems(),
	);
}
