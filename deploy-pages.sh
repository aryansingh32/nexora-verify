#!/usr/bin/env bash
set -e

echo "🔨 Building project..."
npm run build

echo "📦 Preparing Cloudflare Pages bundle..."

# Cloudflare Pages requires _worker.js + all server chunks inside the public dir
# We copy the server worker entry and its chunks into .output/public

# Copy the main worker entry as _worker.js
cp .output/server/index.mjs .output/public/_worker.js

# Copy all server-side chunks (imported by _worker.js at runtime)
if [ -d ".output/server/_chunks" ]; then
  cp -r .output/server/_chunks .output/public/
fi

if [ -d ".output/server/_libs" ]; then
  cp -r .output/server/_libs .output/public/
fi

if [ -d ".output/server/_ssr" ]; then
  cp -r .output/server/_ssr .output/public/
fi

# Copy any other .mjs files
cp .output/server/_runtime.mjs .output/public/_runtime.mjs 2>/dev/null || true
for f in .output/server/*.mjs; do
  [ -f "$f" ] && cp "$f" ".output/public/$(basename "$f")" 2>/dev/null || true
done

echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .output/public \
  --project-name nexoradigitalsolutions \
  --compatibility-date 2026-08-11 \
  --compatibility-flag nodejs_compat \
  --no-bundle

echo "✅ Deployed! Visit: https://nexoradigitalsolutions.pages.dev"
