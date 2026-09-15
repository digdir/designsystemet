#!/usr/bin/env bash
# Stores the release version as the step output `value`.
# Package versions are fixed (see .changeset/config.json), so the CLI package's
# version is the release version.
#
# Do not run `changeset version` here: this runs on the release commit, where the
# versions are already bumped and no changesets remain. Since @changesets/cli v3,
# `changeset version` exits 1 in that case, which left the version empty and
# created a release tagged just "v".
set -euo pipefail

version=$(node -p "require('./packages/cli/package.json').version")

if [[ -z "$version" || "$version" == "undefined" ]]; then
  echo "::error::Could not determine release version"
  exit 1
fi

echo "value=${version}" >> "$GITHUB_OUTPUT"
