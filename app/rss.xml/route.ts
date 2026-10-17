import { postItems, projectItems, rssResponse } from '../lib/rss';
import siteMetadata from '../site-metadata';

export const dynamic = 'force-static';

export function GET() {
	return rssResponse('/rss.xml', siteMetadata.title, siteMetadata.description, [
		...postItems(),
		...projectItems(),
	]);
}
