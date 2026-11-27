#!/usr/bin/env bash
# Creates one aggregated GitHub release (vX.Y.Z), with the version's changes from
# changelog.json as its notes. There, each change is listed once with the packages it affects.
# The release PR adds the version, see scripts/group-changelogs.ts.
# Required env: GH_TOKEN, TAG
set -euo pipefail

# The packages are already published here, so the release and its tag are made also when the
# notes can't be: without them, the deploys are skipped and the version can't be dated.
if ! node scripts/group-changelogs.ts --release "${TAG#v}" > release-notes.md; then
  echo "::warning::Could not read ${TAG#v} from changelog.json, so the release has no notes. Edit them in afterwards."
  printf '_No changelog entry found. See the changelog of each package._\n' > release-notes.md
fi
gh release create "$TAG" \
  --title "$TAG" \
  --notes-file release-notes.md \
  --target "$GITHUB_SHA"
