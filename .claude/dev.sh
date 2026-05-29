#!/bin/bash
export PATH="/private/tmp/node-v22.11.0-darwin-x64/bin:$PATH"
cd /Users/harold/wing-app
exec /private/tmp/node-v22.11.0-darwin-x64/bin/node node_modules/next/dist/bin/next dev --port "${PORT:-3000}"
