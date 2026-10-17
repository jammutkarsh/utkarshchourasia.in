#!/usr/bin/env bash
# Merge the latest dlarroder/dalelarroder into the current branch.
#
#   scripts/sync-upstream.sh [upstream-branch]   (default: main)
#
# Leaves the merge uncommitted so you can review, test and commit it.
# See SYNCING.md for the full workflow.
set -euo pipefail

UPSTREAM_URL="https://github.com/dlarroder/dalelarroder.git"
UPSTREAM_BRANCH="${1:-main}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
	echo "✗ Working tree has uncommitted changes. Commit or stash them first." >&2
	exit 1
fi

git remote get-url upstream >/dev/null 2>&1 || git remote add upstream "$UPSTREAM_URL"
# Enables `merge=ours` in .gitattributes (keep our version of fork-owned files).
git config merge.ours.driver true

echo "→ Fetching upstream/$UPSTREAM_BRANCH"
git fetch upstream "$UPSTREAM_BRANCH"

if git merge-base --is-ancestor "upstream/$UPSTREAM_BRANCH" HEAD; then
	echo "✓ Already up to date with upstream/$UPSTREAM_BRANCH."
	exit 0
fi

echo "→ Merging upstream/$UPSTREAM_BRANCH (not committing yet)"
git merge --no-ff --no-commit "upstream/$UPSTREAM_BRANCH" || true

# 1. Files we deleted that upstream changed ("deleted by us"): keep them deleted.
git status --porcelain | awk '$1 == "DU" { print substr($0, 4) }' |
	while IFS= read -r path; do
		git rm -q -- "$path"
		echo "  kept deleted: $path"
	done

# 2. Drop anything upstream added/changed under paths this fork removed.
pathspecs=()
while IFS= read -r line; do
	[[ -z "$line" || "$line" == \#* ]] && continue
	pathspecs+=("$line")
done < .upstream-exclude
if ((${#pathspecs[@]})); then
	# Put these paths back exactly as they are on our branch: upstream additions
	# are removed, upstream edits are dropped, our own files there are kept.
	git ls-files -- "${pathspecs[@]}" | sort -u | while IFS= read -r path; do
		if git cat-file -e "HEAD:$path" 2>/dev/null; then
			git checkout HEAD -- "$path"
		else
			git rm -q -f -- "$path"
			echo "  dropped upstream file: $path"
		fi
	done
fi

# 3. Regenerate the lockfile instead of hand-merging it.
if git diff --name-only --diff-filter=U | grep -qx 'bun.lock'; then
	if git diff --name-only --diff-filter=U | grep -qx 'package.json'; then
		echo "  bun.lock: resolve package.json first, then run: bun install && git add bun.lock"
	else
		git checkout --ours -- bun.lock
		bun install --lockfile-only >/dev/null
		git add bun.lock
		echo "  regenerated bun.lock"
	fi
fi

conflicts="$(git diff --name-only --diff-filter=U)"
echo
if [[ -n "$conflicts" ]]; then
	echo "⚠ Resolve these conflicts, then \`git add\` them:"
	echo "$conflicts" | sed 's/^/    /'
	echo
fi
cat <<'NEXT'
Next steps:
  bun install
  bun run check && bunx tsc --noEmit && bun run build
  git commit          # completes the merge
  (or `git merge --abort` to undo)
NEXT
