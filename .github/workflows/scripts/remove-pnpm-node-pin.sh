#!/usr/bin/env bash
# Drops useNodeVersion from pnpm-workspace.yaml so pnpm won't hijack the
# node version installed by setup-node.
set -euo pipefail

sed -i '/^useNodeVersion:/d' pnpm-workspace.yaml || true
awk 'BEGIN{skip=0}/^useNodeVersion:/{skip=1;next} skip&&NF==0{skip=0;next}!skip{print}' pnpm-workspace.yaml \
  > pnpm-workspace.yaml.tmp && mv pnpm-workspace.yaml.tmp pnpm-workspace.yaml
