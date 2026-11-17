const PRODUCTION_URL = 'https://utkarshchourasia.in';
const PRODUCTION_BRANCH = 'utkarshchourasia-in';

function getBranch(url: string) {
	// fork-portfolio-git-prod-env-urls-jammutkarshs-projects.vercel.app
	const startIndex = url.search('git-');
	const endIndex = url.search('-jammutkarshs-projects.vercel.app');
	return url.substring(startIndex + 4, endIndex);
}

function getDeploymentURL() {
	if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
		return 'http://localhost:3000';
	}
	if (getBranch(process.env.VERCEL_BRANCH_URL || '') === PRODUCTION_BRANCH) {
		return PRODUCTION_URL;
	}
	return process.env.NEXT_PUBLIC_VERCEL_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
		: PRODUCTION_URL;
}

const siteMetadata = {
	title: 'Utkarsh Chourasia',
	author: 'Utkarsh Chourasia',
	headerTitle: '@jammutkarsh',
	description: 'I build stuff in the backend.',
	bio: 'Server Side Engineer',
	// A longer, search/social-friendly description for the home page's meta
	// and Open Graph tags (the on-page bio above stays short for the UI).
	homeDescription:
		'Utkarsh Chourasia is a server-side engineer building backend systems and open-source tools, writing about Linux, Go, and self-hosting along the way.',
	language: 'en-us',
	siteUrl: getDeploymentURL(),
	siteRepo: 'https://github.com/jammutkarsh/fork-portfolio',
	siteLogo: '/static/favicons/favicon.png',
	image: '/images/avatar.png',
	email: 'mail@utkarshchourasia.in',
	github: 'https://github.com/jammutkarsh',
	twitter: 'https://twitter.com/jammutkarsh',
	twitterHandle: '@jammutkarsh',
	linkedin: 'https://www.linkedin.com/in/jammutkarsh',
	resume: 'https://resume.utkarshchourasia.in',
	locale: 'en-US',
	ogLocale: 'en_US',
};

export default siteMetadata;
