#!/bin/sh
# Publish the current dist/ to the gh-pages branch (GitHub Pages "Deploy from a branch").
# Run `npm run build` and `npm run check:release` first.
set -e
cd "$(dirname "$0")/.."
REMOTE=$(git remote get-url origin)
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
touch "$TMP/.nojekyll"   # keeps the _astro/ folder from being dropped by Jekyll
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git -c credential.helper= -c credential.helper="!gh auth git-credential" push -q -f "$REMOTE" gh-pages
rm -rf "$TMP"
echo "Deployed to gh-pages"
