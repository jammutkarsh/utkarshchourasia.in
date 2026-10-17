import { projectItems, rssResponse } from '../../lib/rss';
import siteMetadata from '../../site-metadata';

export const dynamic = 'force-static';

export function GET() {
	return rssResponse(
		'/projects/rss.xml',
		`${siteMetadata.title} — Projects`,
		'Open-source projects and tools.',
		projectItems(),
	);
}
