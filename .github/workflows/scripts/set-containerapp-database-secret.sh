#!/usr/bin/env bash
# Gives the Container App its database: saves the database URL as a secret on the app, and outputs the
# environment variables that point the app to it. The URL itself is never an environment variable in
# the app's configuration, where it could be read by anyone who can view the app.
# Without a database URL nothing is saved or output, and the app is deployed without a database.
#
# The app signs in to the database with the password in the URL, or as a managed identity when
# DATABASE_IDENTITY is set. The URL then has no password, and the identity is added to the app.
# The identity is a user-assigned one, in the resource group of the app, and the database must
# have a user with the same name as it.
#
# A secret or an identity can only be added to an app that exists, and the preview app of a pull request
# does not exist before its first deploy. The script is therefore run twice:
# - before the deploy, without arguments: sets up the app when it exists, and outputs `env`
#   for the deploy. When the app does not exist yet it outputs `after_deploy=true` instead.
# - after the deploy, with `after-deploy`, when the first run asked for it: sets up the app and
#   points it to the database, which makes a new revision of the app.
#
# Required env: APP_NAME, RESOURCE_GROUP
# Optional env: DATABASE_URL, DATABASE_IDENTITY
set -euo pipefail

PHASE="${1:-before-deploy}"
ENV_VARS=("DATABASE_URL=secretref:database-url")

if [ -z "${DATABASE_URL:-}" ]; then
  echo "No database URL is set, so themes cannot be shared in this deploy."
  exit 0
fi

if [ "${PHASE}" != "after-deploy" ] && ! az containerapp show -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --output none 2>/dev/null; then
  echo "${APP_NAME} does not exist yet, so the database is set after the deploy."
  echo "after_deploy=true" >> "$GITHUB_OUTPUT"
  exit 0
fi

az containerapp secret set -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --secrets "database-url=${DATABASE_URL}" --output none

if [ -n "${DATABASE_IDENTITY:-}" ]; then
  IDENTITY_ID="$(az identity show -n "${DATABASE_IDENTITY}" -g "${RESOURCE_GROUP}" --query id --output tsv)"
  CLIENT_ID="$(az identity show -n "${DATABASE_IDENTITY}" -g "${RESOURCE_GROUP}" --query clientId --output tsv)"
  # The app only gets the identity in revisions made after this, which the deploy or the update below makes
  az containerapp identity assign -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --user-assigned "${IDENTITY_ID}" --output none
  # The app can have more identities, so it is told which one the database knows
  ENV_VARS+=("DATABASE_IDENTITY_CLIENT_ID=${CLIENT_ID}")
fi

if [ "${PHASE}" = "after-deploy" ]; then
  az containerapp update -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --set-env-vars "${ENV_VARS[@]}" --output none
else
  echo "env=${ENV_VARS[*]}" >> "$GITHUB_OUTPUT"
fi
