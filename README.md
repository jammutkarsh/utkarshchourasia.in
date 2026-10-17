# utkarshchourasia.in ⚡️

- **Framework**: [Next.js](https://nextjs.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: [MDX](https://mdxjs.com/) via [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Lint/Format**: [Biome](https://biomejs.dev/)

Based on [dlarroder/dalelarroder](https://github.com/dlarroder/dalelarroder). See [SYNCING.md](./SYNCING.md) for pulling in upstream updates.

## Running Locally

1. Clone this repo and install dependencies

```bash
git clone https://github.com/jammutkarsh/fork-portfolio
cd fork-portfolio
bun install
```

2. Run the development server

```bash
bun run dev
```

## Writing content

- Blog posts: `content/blog/*.mdx` (frontmatter: `title`, `date`, `tags`, `draft`, `summary`)
- Home page story: `content/story.mdx` (one `## Title` section per phase, one sentence per line, as phones split long chapters into pages between sentences; each phase's year, sketch and colour, plus the closing thesis, live in the frontmatter)
- Uses page: `app/uses/content.mdx`
- Projects: `content/projects/*.mdx`, one file per project (images go in `public/static/images/project/<name>/`)
- Blog posts are served at `/blogs/<slug>`; old `/blog/...` links redirect there (`next.config.ts`)

## Licence

[MIT](./LICENSE)
