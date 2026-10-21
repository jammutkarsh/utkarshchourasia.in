function getDeploymentURL() {
	return process.env.NODE_ENV === 'production'
		? 'https://utkarshchourasia.in'
		: 'http://localhost:3000';
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
	resume: 'https://short.utkarshchourasia.in/resume',
	locale: 'en-US',
	ogLocale: 'en_US',
};

export default siteMetadata;
