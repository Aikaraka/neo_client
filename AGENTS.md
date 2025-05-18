# AGENTS.md

── Codex(또는 CI) 실행 순서: Setup → Test → Build(옵션) → Conventions ──

## Setup
```bash
# pnpm 준비 (빌트-인 버전 사용, 네트워크 X)
corepack enable

# pnpm 스토어 압축 풀기
if [ ! -d .pnpm-store ]; then
  echo "Reassembling pnpm store parts"
  cat .store-split/pnpm-store.part.* > .pnpm-store.tar.gz
  tar -xzf .pnpm-store.tar.gz
fi
export PNPM_HOME=$PWD/.pnpm-store

# 의존성 설치: 오프라인 → 온라인
pnpm install --offline --frozen-lockfile --strict-peer-dependencies \
  || pnpm install  --frozen-lockfile --strict-peer-dependencies
```

## Test
```bash
Lint
   pnpm run lint

Unit 및 Integration Tests
   pnpm run test -- --runInBand
```
## Build (옵션)
```bash
Next.js 프로덕션 빌드
   pnpm run build
```
## Conventions

* 커밋 메시지: `feat|fix(scope): 제목`
* 코드 스타일: ESLint + Prettier, `pnpm run lint --fix` 로 자동 정렬
* 브랜칭: `feature/*`, `bugfix/*`, `hotfix/*`
* CI 배포: `main` 및 `release/*` 브랜치만 프로덕션 배포

## 캐시 갱신 방법

1. 로컬에서 `pnpm fetch --store-dir .pnpm-store`
2. `tar -I zstd -cf .pnpm-store.tar.zst .pnpm-store`
3. `git add .pnpm-store.tar.zst && git commit && git push`

── End of AGENTS.md ──
