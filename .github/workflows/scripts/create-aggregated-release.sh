#!/usr/bin/env bash
# Creates one aggregated GitHub release (vX.Y.Z) with notes collected from
# the published packages' changelogs.
# Required env: GH_TOKEN, TAG, PUBLISHED_PACKAGES
set -euo pipefail

node scripts/aggregate-changelogs.js "$PUBLISHED_PACKAGES" > release-notes.md
gh release create "$TAG" \
  --title "$TAG" \
  --notes-file release-notes.md \
  --target "$GITHUB_SHA"
