#!/usr/bin/env bash
# Deletes the preview Container Apps belonging to a closed PR.
# Required env: PR_NUMBER, RESOURCE_GROUP, PREVIEW_APPS
set -euo pipefail

echo "Starting cleanup for PR #${PR_NUMBER} in resource group ${RESOURCE_GROUP}" | tee -a "$GITHUB_STEP_SUMMARY"
ANY_DELETED=0
for base in $PREVIEW_APPS; do
  APP_NAME="${base}-pr-${PR_NUMBER}"
  echo "Checking ${APP_NAME}" | tee -a "$GITHUB_STEP_SUMMARY"
  if az containerapp show -n "${APP_NAME}" -g "${RESOURCE_GROUP}" >/dev/null 2>&1; then
    echo "Deleting ${APP_NAME}" | tee -a "$GITHUB_STEP_SUMMARY"
    az containerapp delete -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --yes
    echo "Deleted ${APP_NAME}" | tee -a "$GITHUB_STEP_SUMMARY"
    ANY_DELETED=1
  else
    echo "Not found: ${APP_NAME} (skipping)" | tee -a "$GITHUB_STEP_SUMMARY"
  fi
done
if [ "$ANY_DELETED" = "0" ]; then
  echo "No preview container apps found for PR #${PR_NUMBER}" | tee -a "$GITHUB_STEP_SUMMARY"
else
  echo "Cleanup complete for PR #${PR_NUMBER}" | tee -a "$GITHUB_STEP_SUMMARY"
fi
