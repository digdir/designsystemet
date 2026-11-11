#!/usr/bin/env bash
# Outputs whether the PR has a figma-ui-kit changeset (`has-changeset`), and
# whether it changes component styles or tokens (`changes-styles`), which may
# need the same change in Figma.
# Required env: BASE_REF
set -euo pipefail

# Folders with component styles and token generation
STYLE_PATHS=(
  packages/css/src
  packages/cli/src/tokens
  packages/cli/src/colors
)
# Files in those folders that don't change how anything looks
IGNORED_PATHS=(
  ':(exclude)*.test.ts'
  ':(exclude)*.snap'
  ':(exclude)**/__snapshots__/**'
  ':(exclude)*.md'
  ':(exclude)*.mdx'
)

# Changesets added or changed in this PR that bump figma-ui-kit
figma_changesets=$(git diff -z --name-only --diff-filter=AM "origin/$BASE_REF"...HEAD -- '.changeset/*.md' \
  | xargs -0 -r grep -l -E "^[\"']?figma-ui-kit[\"']?:" || true)
if [ -n "$figma_changesets" ]; then
  echo "has-changeset=true" >> "$GITHUB_OUTPUT"
else
  echo "has-changeset=false" >> "$GITHUB_OUTPUT"
fi

if git diff --quiet "origin/$BASE_REF"...HEAD -- "${STYLE_PATHS[@]}" "${IGNORED_PATHS[@]}"; then
  echo "changes-styles=false" >> "$GITHUB_OUTPUT"
else
  echo "changes-styles=true" >> "$GITHUB_OUTPUT"
fi
