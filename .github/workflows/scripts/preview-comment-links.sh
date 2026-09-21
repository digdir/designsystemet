#!/usr/bin/env bash
# Builds the preview-deployments PR comment body, replacing the link for the
# current deployment type and keeping existing links for the other types.
# Required env: DEPLOYMENT_TYPE, DEPLOYMENT_URL, FORMATTED_TIME,
#               STORYBOOK_EXISTING, THEME_EXISTING, WWW_EXISTING
set -euo pipefail

STORYBOOK=""
THEME=""
WWW=""

if [ "$DEPLOYMENT_TYPE" = "storybook" ]; then
  STORYBOOK="[storybook]($DEPLOYMENT_URL) - \`$FORMATTED_TIME\`"
elif [ "$DEPLOYMENT_TYPE" = "theme" ]; then
  THEME="[themebuilder]($DEPLOYMENT_URL) - \`$FORMATTED_TIME\`"
elif [ "$DEPLOYMENT_TYPE" = "www" ]; then
  WWW="[www]($DEPLOYMENT_URL) - \`$FORMATTED_TIME\`"
fi

if [ "$DEPLOYMENT_TYPE" != "storybook" ] && [ -n "$STORYBOOK_EXISTING" ]; then
  STORYBOOK="$STORYBOOK_EXISTING"
fi
if [ "$DEPLOYMENT_TYPE" != "theme" ] && [ -n "$THEME_EXISTING" ]; then
  THEME="$THEME_EXISTING"
fi
if [ "$DEPLOYMENT_TYPE" != "www" ] && [ -n "$WWW_EXISTING" ]; then
  WWW="$WWW_EXISTING"
fi

{
  echo "body<<EOF"
  echo "**Preview deployments for this pull request:**"
  if [ -n "$STORYBOOK" ]; then
    echo ""
    printf '%s\n' "$STORYBOOK"
  fi
  if [ -n "$THEME" ]; then
    echo ""
    printf '%s\n' "$THEME"
  fi
  if [ -n "$WWW" ]; then
    echo ""
    printf '%s\n' "$WWW"
  fi
  echo "EOF"
} >> "$GITHUB_OUTPUT"
