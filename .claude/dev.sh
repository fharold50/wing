#!/bin/bash
export PATH="/private/tmp/node-v22.11.0-darwin-x64/bin:$PATH"
cd /Users/harold/wing-app
exec npm run dev -- --port "${PORT:-3000}"
