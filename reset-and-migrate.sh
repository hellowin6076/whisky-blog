#!/bin/bash
echo "🗑️  Whisky 데이터 삭제 중..."
npx prisma db push --force-reset --skip-generate --accept-data-loss

echo "📊 스키마 적용 중..."
npx prisma db push

echo "📦 Contentful 마이그레이션 중..."
npx tsx prisma/migrate-contentful.ts

echo "✅ 완료!"
