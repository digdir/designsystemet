#!/usr/bin/env bash
# Creates one aggregated GitHub release (vX.Y.Z), with the version's changes from
# changelog.json as its notes. There, each change is listed once with the packages it affects.
# The release PR adds the version, see scripts/group-changelogs.js.
# Required env: GH_TOKEN, TAG
set -euo pipefail

node scripts/group-changelogs.js --release "${TAG#v}" > release-notes.md
gh release create "$TAG" \
  --title "$TAG" \
  --notes-file release-notes.md \
  --target "$GITHUB_SHA"
