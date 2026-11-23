#!/usr/bin/env bash
# Outputs whether the PR has a changeset for the documentation, @web/www
# (`has-changeset`), and whether it changes documentation that must have one
# (`changes-docs`).
# Required env: BASE_REF
set -euo pipefail

# Documentation that users link to or copy, so they need to know when it changes
DOCS_PATHS=(
  apps/www/app/content/patterns
  apps/www/app/content/best-practices
)

# Changesets added or changed in this PR that bump @web/www
docs_changesets=$(git diff -z --name-only --diff-filter=AM "origin/$BASE_REF"...HEAD -- '.changeset/*.md' \
  | xargs -0 -r grep -l -E "^[\"']?@web/www[\"']?:" || true)
if [ -n "$docs_changesets" ]; then
  echo "has-changeset=true" >> "$GITHUB_OUTPUT"
else
  echo "has-changeset=false" >> "$GITHUB_OUTPUT"
fi

if git diff --quiet "origin/$BASE_REF"...HEAD -- "${DOCS_PATHS[@]}"; then
  echo "changes-docs=false" >> "$GITHUB_OUTPUT"
else
  echo "changes-docs=true" >> "$GITHUB_OUTPUT"
fi
