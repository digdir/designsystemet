#!/usr/bin/env bash
# Shows the new version's changes from changelog.json in the release PR, where each change is
# listed once with the packages it affects. changesets/action writes the PR body with one section
# per package; this keeps its introduction and replaces everything from "# Releases" on.
#
# Runs after changesets/action has created or updated the PR. It rewrites the body on every run,
# so this does too. If the version can't be found, the PR is left as changesets/action wrote it.
# Required env: GH_TOKEN, PR_NUMBER, BRANCH (the release PR's branch)
set -euo pipefail

CHANGELOG_JSON=changelog.json

keep_pr() {
  echo "::warning::$1, so the release PR keeps the changelogs per package"
  exit 0
}

# The new version and its changelog are only on the release PR's branch
git fetch --quiet origin "$BRANCH" || keep_pr "Could not fetch ${BRANCH}"
git show "FETCH_HEAD:${CHANGELOG_JSON}" > release-changelog.json 2> /dev/null || keep_pr "No changelog.json on ${BRANCH}"
version=$(git show FETCH_HEAD:packages/cli/package.json | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).version") ||
  keep_pr "Could not read the version on ${BRANCH}"

# Exits with 2 when the version is not there. Anything else, like a changelog.json that can't be
# read, fails this step, so it is seen.
status=0
node scripts/group-changelogs.js --release "$version" --file release-changelog.json > release-notes.md || status=$?
[ "$status" -eq 2 ] && keep_pr "No ${version} in changelog.json on ${BRANCH}"
[ "$status" -eq 0 ] || exit "$status"

# A PR body can be at most 65536 characters
if [ "$(wc -c < release-notes.md)" -gt 60000 ]; then
  printf '## designsystemet %s\n\nThe changes are too long to show here. See the changelog of each package under [Files changed](%s/%s/pull/%s/files).\n' \
    "$version" "$GITHUB_SERVER_URL" "$GITHUB_REPOSITORY" "$PR_NUMBER" > release-notes.md
fi

intro=$(gh pr view "$PR_NUMBER" --json body --jq .body | sed '/^# Releases/,$d')
{
  printf '%s\n\n# Releases\n\n' "$intro"
  cat release-notes.md
} > release-pr-body.md
gh pr edit "$PR_NUMBER" --body-file release-pr-body.md
