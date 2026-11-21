#!/bin/sh
set -e

echo "🌟 Syncing database schema with Prisma..."
npx prisma db push --skip-generate

echo "📚 Seeding default school subjects..."
npx tsx prisma/seed.ts || true

echo "🚀 Starting Meri Padhai Tracker on http://0.0.0.0:3000 ..."
exec npm start

