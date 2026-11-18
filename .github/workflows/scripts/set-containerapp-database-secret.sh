#!/usr/bin/env bash
# Saves the database URL as a secret on the Container App, and outputs the environment
# variable that points the app to it. The URL itself is never an environment variable in
# the app's configuration, where it could be read by anyone who can view the app.
# Without a database URL nothing is saved or output, and the app is deployed without a database.
# Required env: APP_NAME, RESOURCE_GROUP
# Optional env: DATABASE_URL
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "No database URL is set, so themes cannot be shared in this deploy."
  exit 0
fi

az containerapp secret set -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --secrets "database-url=${DATABASE_URL}" --output none
echo "env=DATABASE_URL=secretref:database-url" >> "$GITHUB_OUTPUT"
