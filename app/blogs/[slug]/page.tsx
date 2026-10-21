import type { Metadata } from 'next';
import JsonLd from '../../components/json-ld';
import Tag from '../../components/tag';
import { createMetadata } from '../../lib/create-metadata';
import siteMetadata from '../../site-metadata';
import { kebabCase } from '../kebab-case';
import { formatDate, getPostFromSlug, getPosts, getTagBadges } from '../utils';
import PageTitle from './page-title';

export const dynamicParams = false;

export function generateStaticParams() {
	return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const { metadata } = await getPostFromSlug(params.slug);

	return createMetadata({
		title: metadata.title,
		description: metadata.summary,
		path: `/blogs/${params.slug}`,
		type: 'article',
		publishedTime: metadata.publishedAt,
		authors: [metadata.author ?? siteMetadata.author],
		tags: metadata.tags,
	});
}

export default async function Blog(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;

	const { metadata, content, readingTime } = await getPostFromSlug(params.slug);
	const tagBadges = getTagBadges(getPosts());

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: metadata.title,
		description: metadata.summary,
		datePublished: metadata.publishedAt,
		author: {
			'@type': 'Person',
			name: metadata.author ?? siteMetadata.author,
		},
		keywords: metadata.tags.join(', '),
		url: `${siteMetadata.siteUrl}/blogs/${params.slug}`,
		mainEntityOfPage: `${siteMetadata.siteUrl}/blogs/${params.slug}`,
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			{/* vinext's metadata doesn't emit openGraph.tags; React moves these
			    into <head>. */}
			{metadata.tags.map((tag) => (
				<meta key={tag} property='article:tag' content={tag} />
			))}
			<section>
				<PageTitle>{metadata.title}</PageTitle>
				<div className='meta mt-4'>
					<time dateTime={metadata.publishedAt}>
						{formatDate(metadata.publishedAt)}
					</time>
					<span aria-hidden className='sep'>
						|
					</span>
					<span>{readingTime}</span>
				</div>
			</section>
			<article className='ds-prose min-w-0 break-words'>{content}</article>
			{metadata.tags.length > 0 && (
				<div className='mt-8 flex flex-wrap justify-center gap-2'>
					{metadata.tags.map((tag) => (
						<Tag key={tag} text={tag} badge={tagBadges[kebabCase(tag)]} />
					))}
				</div>
			)}
		</>
	);
}
