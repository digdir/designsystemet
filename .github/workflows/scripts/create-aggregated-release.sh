#!/usr/bin/env bash
# Creates one aggregated GitHub release (vX.Y.Z). The notes are
# RELEASE_NOTES.md from the release pull request, which may have been edited
# there, or are collected from the published packages' changelogs if that
# file isn't for this release.
# Required env: GH_TOKEN, TAG, PUBLISHED_PACKAGES
set -euo pipefail

if [ -f RELEASE_NOTES.md ] && head -n 1 RELEASE_NOTES.md | grep -qxF "<!-- release: $TAG -->"; then
  echo "Using RELEASE_NOTES.md from the release pull request"
  cp RELEASE_NOTES.md release-notes.md
else
  echo "::warning::RELEASE_NOTES.md isn't for $TAG, so the notes are collected from the changelogs"
  node scripts/aggregate-changelogs.js "$PUBLISHED_PACKAGES" > release-notes.md
fi

gh release create "$TAG" \
  --title "$TAG" \
  --notes-file release-notes.md \
  --target "$GITHUB_SHA"
