#!/bin/bash

# Clear Next.js cache script
# Run this if you encounter loading issues or stale data

echo "🧹 Clearing Next.js cache..."

# Kill any running dev servers
echo "Stopping dev servers..."
pkill -f "next dev"

# Clear Next.js build cache
echo "Removing .next directory..."
rm -rf .next

# Clear node modules cache
echo "Removing node_modules cache..."
rm -rf node_modules/.cache

echo "✅ Cache cleared!"
echo ""
echo "To restart the dev server, run: npm run dev"
