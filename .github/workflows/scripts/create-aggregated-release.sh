#!/usr/bin/env bash
# Creates one aggregated GitHub release (vX.Y.Z), with the version's changes from
# apps/www/app/content/changelog/changelog.json as its notes. There, each change is listed once with
# the packages it affects. The release PR adds the version, see scripts/group-changelogs.js.
#
# If the version is missing, the notes are collected from the published packages' changelogs
# instead, one section per package.
# Required env: GH_TOKEN, TAG, PUBLISHED_PACKAGES
set -euo pipefail

if ! node scripts/group-changelogs.js --release "${TAG#v}" > release-notes.md; then
  echo "::warning::No ${TAG#v} in changelog.json, using the package changelogs for the release notes"
  node scripts/aggregate-changelogs.js "$PUBLISHED_PACKAGES" > release-notes.md
fi
gh release create "$TAG" \
  --title "$TAG" \
  --notes-file release-notes.md \
  --target "$GITHUB_SHA"
