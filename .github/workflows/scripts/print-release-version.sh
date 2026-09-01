#!/usr/bin/env bash

set -e

# Running "changeset version" to know the new release version
pnpm changeset version &>/dev/null

# Packages-versions are fixed so we can safely get the bumped version from the cli-package
release_version=$(node -e "console.log(require('./packages/cli/package.json').version)")

git reset --hard &>/dev/null

echo "$release_version"
