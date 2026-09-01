#!/usr/bin/env bash
# Creates or updates a PR comment listing the published snapshot packages.
# Required env: GH_TOKEN, BRANCH, TAG, PACKAGES
set -euo pipefail

PR=$(gh pr list --head "$BRANCH" --state open --json number --jq '.[0].number // empty')
if [ -z "$PR" ]; then
  echo "No open PR found for branch $BRANCH, skipping comment."
  exit 0
fi
MARKER="<!-- snapshot-release-comment -->"
PUBLISHED_AT="$(TZ='Europe/Oslo' date '+%d.%m.%Y %H:%M:%S')"
{
  echo "$MARKER"
  echo "### 📦 Snapshot release published"
  echo
  echo "Published at \`$PUBLISHED_AT\` to npm with tag \`$TAG\`:"
  echo
  echo "$PACKAGES" | while IFS= read -r pkg; do
    if [ -n "$pkg" ]; then
      name="${pkg%@*}"
      version="${pkg##*@}"
      echo "- [\`$pkg\`](https://www.npmjs.com/package/$name/v/$version)"
    fi
  done
  echo
  echo "Install with:"
  echo "$PACKAGES" | while IFS= read -r pkg; do
    if [ -n "$pkg" ]; then
      echo '```sh'
      echo "npm install ${pkg%@*}@$TAG"
      echo '```'
    fi
  done
} > comment.md
# Find an existing snapshot-release comment to update, otherwise create a new one
COMMENT_ID=$(gh api "repos/${GITHUB_REPOSITORY}/issues/${PR}/comments" --paginate \
  --jq "[.[] | select(.body | contains(\"$MARKER\"))] | last | .id // empty")
if [ -n "$COMMENT_ID" ]; then
  echo "Updating existing comment $COMMENT_ID"
  gh api --method PATCH "repos/${GITHUB_REPOSITORY}/issues/comments/${COMMENT_ID}" \
    -F body=@comment.md > /dev/null
else
  echo "No existing comment found, creating a new one"
  gh pr comment "$PR" --body-file comment.md
fi
