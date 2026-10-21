import matter from 'gray-matter';
import type { Diagram, Project } from './types';

// Bundled at build time: a Worker has no filesystem to read content from.
const projectFiles = import.meta.glob('/content/projects/*.mdx', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

/** Markdown to plain text: drop code ticks, emphasis and link targets. */
function plain(markdown: string) {
	return markdown
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[`*_]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function readProject([path, raw]: [string, string]): Project {
	const file = path.slice(path.lastIndexOf('/') + 1);
	const slug = file.slice(0, -'.mdx'.length);
	const { data, content } = matter(raw);

	const missing = [
		!data.name && 'name',
		!data.hero && 'hero',
		!data.repo && 'repo',
		!data.website && !data.install && 'website or install',
		!(Array.isArray(data.stack) && data.stack.length) && 'stack',
		!content.trim() && 'description (the body)',
	].filter(Boolean);
	if (missing.length) {
		throw new Error(
			`content/projects/${file} is missing: ${missing.join(', ')}`,
		);
	}

	return {
		slug,
		name: data.name,
		hero: data.hero,
		repo: data.repo,
		website: data.website,
		install: data.install,
		stack: data.stack,
		description: content.trim(),
		summary: data.summary ?? plain(content.trim().split(/\n\s*\n/)[0]),
		order: data.order,
		demo: data.demo,
		screenshots: data.screenshots,
		architecture: diagrams(data.architecture),
	};
}

/**
 * `architecture` is one Mermaid source, or a list of them, each either a
 * source or `{ title, source }`.
 */
function diagrams(value: unknown): Diagram[] | undefined {
	if (!value) return undefined;
	const list = Array.isArray(value) ? value : [value];
	const out: Diagram[] = list
		.map((item) =>
			typeof item === 'string'
				? { source: item }
				: { title: item?.title, source: item?.source ?? '' },
		)
		.filter((diagram) => diagram.source.trim());
	return out.length ? out : undefined;
}

/** All projects, by `order` and then by name. */
export function getProjects(): Project[] {
	return Object.entries(projectFiles)
		.filter(([path]) => !path.includes('/_'))
		.map(readProject)
		.sort(
			(a, b) =>
				(a.order ?? Number.POSITIVE_INFINITY) -
					(b.order ?? Number.POSITIVE_INFINITY) || a.name.localeCompare(b.name),
		);
}

export function getProject(slug: string): Project | undefined {
	return getProjects().find((project) => project.slug === slug);
}
