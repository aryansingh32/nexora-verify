#!/usr/bin/env bash
set -e

echo "🔨 Building project..."
npm run build

echo "📦 Preparing Cloudflare Pages bundle..."

# Cloudflare Pages requires _worker.js inside the deployed public directory.
# Copy the nitro server entry as _worker.js and all its side chunks.

cp .output/server/index.mjs .output/public/_worker.js

# Copy all server-side chunks (imported by _worker.js at runtime)
for dir in _chunks _libs _ssr; do
  if [ -d ".output/server/$dir" ]; then
    cp -r ".output/server/$dir" ".output/public/"
  fi
done

# Copy any loose .mjs files from server root
for f in .output/server/*.mjs; do
  [ "$(basename "$f")" != "index.mjs" ] && cp "$f" ".output/public/$(basename "$f")" 2>/dev/null || true
done

echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .output/public \
  --project-name nexoradigitalsolutions \
  --branch main \
  --commit-dirty=true

echo "✅ Deployed! Visit: https://nexoradigitalsolutions.pages.dev"
