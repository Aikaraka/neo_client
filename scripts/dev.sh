#!/bin/bash

echo "🚀 Neo Client 개발 환경을 시작합니다..."

# 권한 문제 해결
echo "🔧 권한 문제를 해결합니다..."
sudo rm -rf .next 2>/dev/null || true
sudo chown -R $USER:$USER . 2>/dev/null || true

# 기존 프로세스 정리
echo "🧹 기존 프로세스를 정리합니다..."
pkill -f "next dev" 2>/dev/null || true

# 개발 서버 시작
echo "🔨 개발 서버를 시작합니다..."
pnpm dev

echo "✅ 개발 환경이 시작되었습니다!"
echo "📍 접속 주소: http://localhost:3000"
echo "📝 코드 변경사항이 자동으로 반영됩니다."
