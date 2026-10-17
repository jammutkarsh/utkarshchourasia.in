# Syncing with upstream

This site is a fork of [dlarroder/dalelarroder](https://github.com/dlarroder/dalelarroder).
Everything below exists so that pulling in upstream fixes and dependency bumps
stays a small, mostly automatic merge.

## How to sync

```bash
git checkout -b sync/upstream-$(date +%Y%m%d)   # work on a branch, not the live one
scripts/sync-upstream.sh                        # fetch + merge, leaves it uncommitted
# resolve anything it lists, then:
bun install
bun run check && bunx tsc --noEmit && bun run build
git commit                                      # finish the merge, then open a PR
```

Don't use GitHub's **Sync fork** button: it merges straight into the default
branch and can't apply the rules below.

### What the script handles for you

| Situation | What happens |
| --- | --- |
| Upstream edits a file this fork deleted | Kept deleted |
| Upstream adds or edits files under a removed feature (`.upstream-exclude`) | Dropped |
| Both sides edit a fork-owned file (`merge=ours` in `.gitattributes`) | Our version is kept |
| `bun.lock` conflicts | Regenerated with `bun install` (after `package.json` is resolved) |
| Upstream edits `app/thoughts/*` | Git follows the rename into `app/blogs/*` |

Anything else that conflicts is listed at the end for you to resolve by hand.
Usually that's `package.json` (dependency bumps next to ours), `app/layout.tsx`
or `app/components/mdx.tsx`.

## Where this fork differs from upstream

**Only ours: upstream never touches these, so they never conflict**

- `app/site-metadata.ts`: name, links, bio
- `content/`: blog posts (`content/blog`), home page story (`content/story.mdx`), projects (`content/projects`)
- `app/site.css`: fork-only styles (view transitions)
- `app/utc-ds.css`: the utc-ds design system (vendored from jammutkarsh/design-system)
- `app/fonts.ts`: Inter and JetBrains Mono (utc-ds fonts)
- `app/components/layouts/site-nav.tsx`, `site-footer.tsx`, `command-menu.tsx`,
  `blog-explorer.tsx`, `tag.tsx`, `og/`, `story/`
- `app/blogs/[slug]/toc-inline.tsx`, `app/blogs/[slug]/extract-headings.ts`
  (rewritten; port upstream changes to it by hand if they matter), `app/blogs/kebab-case.ts`,
  `app/components/layouts/theme-switch/switch-theme.ts`
- `assets/fonts/`, `public/images/`, `scripts/`, this file

**Fork-owned copies of upstream files (`merge=ours`)**

`README.md`, `LICENSE`, `.env.example`, `app/projects/constants.ts`,
`app/uses/content.mdx`, `app/robots.ts`, `app/sitemap.ts`, `app/components/header.tsx`

**Upstream files we edit: review these on every sync**

`app/layout.tsx`, `app/page.tsx`, `app/blogs/utils.ts` (upstream `app/thoughts/utils.ts`),
`app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`, `app/components/blog-posts.tsx`
(upstream `thoughts.tsx`), `app/components/mdx.tsx`, `app/components/layouts/page-container.tsx`,
`app/components/layouts/theme-switch/theme-switch.tsx`, `app/components/analytics/analytics.tsx`,
`app/not-found.tsx`, `app/projects/page.tsx`, `app/uses/page.tsx`, `app/uses/uses-title.tsx`,
`next.config.ts`, `package.json`, `app/tailwind.css` (only the `@theme` colours: primary,
gray and black map onto the utc-ds tokens)

**Removed upstream features:** see `.upstream-exclude`.

## Keeping future syncs easy

- Put personal data in `app/site-metadata.ts` or `content/`, not inline in components.
- Build new features as **new files** and hook them in with a line or two, instead
  of rewriting upstream files.
- Add styles to `app/site.css`. In `app/tailwind.css`, only the `@theme` colours differ
  from upstream (they come from utc-ds); leave the rest identical.
- Don't reformat or reorder upstream files. Biome uses upstream's config, so
  `bun run lint` keeps the formatting the same.
- If you drop another upstream feature, add its paths to `.upstream-exclude`.
  If you take over an upstream file completely, add it to `.gitattributes` with `merge=ours`.
