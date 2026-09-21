#!/usr/bin/env bash
# Fetches ACR admin credentials, masks them in the log and exposes them as
# step outputs for the container-apps deploy action.
# Required env: ACR_NAME
set -euo pipefail

az acr update -n "${ACR_NAME}" --admin-enabled true >/dev/null
USER=$(az acr credential show -n "${ACR_NAME}" --query username -o tsv)
PASS=$(az acr credential show -n "${ACR_NAME}" --query 'passwords[0].value' -o tsv)
echo "::add-mask::${USER}"
echo "::add-mask::${PASS}"
echo "user=${USER}" >> "$GITHUB_OUTPUT"
echo "pass=${PASS}" >> "$GITHUB_OUTPUT"
