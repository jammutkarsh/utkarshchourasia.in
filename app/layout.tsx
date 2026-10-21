import JsonLd from 'app/components/json-ld';
import LenisProvider from 'app/components/providers/LenisProvider';
import ThemeProvider from 'app/components/providers/ThemeProvider';
import { createMetadata } from 'app/lib/create-metadata';
import siteMetadata from 'app/site-metadata';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { getPosts } from './blogs/utils';
import CommandMenu from './components/command-menu';
import { AmbienceProvider } from './components/layouts/ambience';
import { FrameProvider } from './components/layouts/frame';
import SiteFooter from './components/layouts/site-footer';
import SiteNav from './components/layouts/site-nav';
import PageTransitions from './components/page-transitions';
import { ViewTransition } from './components/view-transition';
import { inter, jetbrainsMono } from './fonts';
import { getProjects } from './projects/utils';
import './tailwind.css';
import './utc-ds.css';
import './site.css';

export const metadata: Metadata = {
	...createMetadata({
		title: siteMetadata.title,
		description: siteMetadata.homeDescription,
		path: '/',
	}),
	title: {
		template: `%s | ${siteMetadata.title}`,
		default: siteMetadata.title,
	},
	creator: siteMetadata.author,
	metadataBase: new URL(siteMetadata.siteUrl),
};

const personJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: siteMetadata.author,
	url: siteMetadata.siteUrl,
	jobTitle: siteMetadata.bio,
	sameAs: [siteMetadata.github, siteMetadata.linkedin, siteMetadata.twitter],
};

const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: siteMetadata.title,
	url: siteMetadata.siteUrl,
	description: siteMetadata.homeDescription,
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	const commandMenuPosts = getPosts().map((post) => ({
		slug: post.slug,
		title: post.metadata.title,
	}));

	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={`${inter.variable} ${jetbrainsMono.variable}`}
		>
			<head>
				<link
					rel='icon'
					type='image/svg+xml'
					href='/static/favicons/favicon.svg'
				/>
				<link
					rel='apple-touch-icon'
					sizes='76x76'
					href='/static/favicons/favicon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/static/favicons/favicon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/static/favicons/favicon.png'
				/>
				<link rel='manifest' href='/static/favicons/site.webmanifest' />
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='theme-color' content='#000000' />
				<JsonLd data={personJsonLd} />
				<JsonLd data={websiteJsonLd} />
			</head>
			<body className='antialiased'>
				<Script id='gtm-init'>
					{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});`}
				</Script>
				<Script src='https://www.googletagmanager.com/gtm.js?id=G-65F69D270G' />
				<ThemeProvider
					attribute={['class', 'data-theme']}
					defaultTheme='dark'
					themes={['dark', 'light']}
				>
					<LenisProvider>
						<FrameProvider>
							<AmbienceProvider>
								<div className='flex min-h-svh flex-col'>
									<SiteNav />
									{/* Page content crossfades on navigation; nav/footer stay put. */}
									<ViewTransition default='page'>
										<div className='flex flex-1 flex-col' data-vt='page'>
											{children}
										</div>
									</ViewTransition>
									<SiteFooter />
								</div>
								<PageTransitions />
								<CommandMenu
									posts={commandMenuPosts}
									projects={getProjects().map(({ slug, name }) => ({
										slug,
										name,
									}))}
								/>
							</AmbienceProvider>
						</FrameProvider>
					</LenisProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
