// vinext's static export skips route handlers (the RSS feeds) and generated
// metadata routes (sitemap, robots, Open Graph images). Render them with the
// built server and write them next to the exported pages.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'dist/client';
const { default: handler } = await import(path.resolve('dist/server/index.js'));

// Open Graph images are found through the og:image tags of the exported pages.
const pages = fs
	.readdirSync(OUT, { recursive: true })
	.filter((file) => file.endsWith('.html'));
const ogImages = pages.flatMap((file) =>
	[
		...fs
			.readFileSync(path.join(OUT, file), 'utf-8')
			.matchAll(/property="og:image" content="https?:\/\/[^/]+(\/[^"?]*)/g),
	].map((match) => match[1]),
);

const paths = new Set([
	'/rss.xml',
	'/blogs/rss.xml',
	'/projects/rss.xml',
	'/sitemap.xml',
	'/robots.txt',
	...ogImages,
]);

for (const urlPath of paths) {
	const response = await handler(new Request(`http://localhost${urlPath}`));
	if (!response.ok) {
		throw new Error(`${urlPath} returned ${response.status}`);
	}
	const file = path.join(OUT, urlPath);
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
	console.log(`  exported ${urlPath}`);
}
