#!/usr/bin/env bash
# Versions and publishes a changeset snapshot release, and outputs the
# published package names.
# Required env: SNAPSHOT_NAME, TAG
set -euo pipefail

pnpm changeset version --snapshot "$SNAPSHOT_NAME"
echo '---'
echo 'Detected Changes:'
git diff
echo '---'
pnpm run publish-packages --tag "$TAG" --no-git-tag | tee publish.log
{
  echo 'packages<<EOF'
  (grep -oE '@digdir/[^ ]+@[0-9][^ ]*' publish.log | sort -u || true)
  echo 'EOF'
} >> "$GITHUB_OUTPUT"
