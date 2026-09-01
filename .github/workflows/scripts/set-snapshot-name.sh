#!/usr/bin/env bash
# Derives a changeset snapshot name from the branch name.
# Required env: BRANCH
set -euo pipefail

NAME="${BRANCH//\//-}"
echo "name=${NAME}" >> "$GITHUB_OUTPUT"
