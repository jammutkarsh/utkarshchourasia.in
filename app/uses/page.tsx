import { Fragment } from 'react';
import { parseMdxSource } from '../blogs/utils';
import Header from '../components/header';
import { CustomMDX } from '../components/mdx';
import { createMetadata } from '../lib/create-metadata';
import source from './content.mdx?raw';
import UsesTitle from './uses-title';

const { content } = parseMdxSource(source);

export const metadata = createMetadata({
	title: 'Uses',
	description:
		'The hardware, editor, terminal and self-hosted tools Utkarsh Chourasia uses day to day.',
	path: '/uses',
});

export default function Page() {
	return (
		<Fragment>
			<Header title='Uses' />
			<UsesTitle />
			<CustomMDX source={content} />
		</Fragment>
	);
}
