#!/usr/bin/env bash
set -euo pipefail
echo 'Automatic deployment of this inactive service is disabled. See deploy/MIGRATION.md; no broker or ambient AWS credential fallback is allowed.' >&2
exit 1
