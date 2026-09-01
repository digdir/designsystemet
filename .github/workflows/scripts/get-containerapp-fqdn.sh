#!/usr/bin/env bash
# Outputs the FQDN of the deployed Container App.
# Required env: APP_NAME, RESOURCE_GROUP
set -euo pipefail

FQDN=$(az containerapp show -n "${APP_NAME}" -g "${RESOURCE_GROUP}" --query properties.configuration.ingress.fqdn -o tsv)
echo "fqdn=${FQDN}" >> "$GITHUB_OUTPUT"
