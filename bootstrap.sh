#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "🔄 Installing dependencies..."
npm install

echo "🚀 Starting containers..."
docker-compose up -d --build

echo "⏳ Waiting for the database to be ready..."

until docker exec mcp-postgres psql -U postgres -d mcp -c "SELECT 1;" > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Database is ready!"

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🌱 Running DB migrations..."
npx prisma migrate dev --name init

echo "✅ Bootstrap complete!"

