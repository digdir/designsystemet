#!/usr/bin/env bash
# Frees up disk space on the GitHub-hosted runner.
set -euo pipefail

sudo rm -rf /usr/share/dotnet
sudo rm -rf /opt/ghc
sudo rm -rf /usr/local/share/boost
sudo rm -rf "${AGENT_TOOLSDIRECTORY:-}"
df -h
