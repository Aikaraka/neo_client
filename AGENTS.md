# AGENTS.md

── Codex(또는 CI) 실행 순서: Setup → Test → Build(옵션) → Conventions ──

## Setup

0. Node / pnpm 준비
      corepack enable
      corepack prepare pnpm\@8 --activate # pnpm 8 고정

1. pnpm 스토어 아카이브 해제
      .pnpm-store.tar.zst 는 Git LFS 로 커밋되어 있어야 함
      if \[ ! -d .pnpm-store ]; then
         echo "Extracting .pnpm-store.tar.zst"
         tar -I zstd -xf .pnpm-store.tar.zst
      fi

2. 스토어 경로 환경변수 지정
      export PNPM\_HOME=\$PWD/.pnpm-store

3. 의존성 설치 – 3단계 Fallback
      pnpm install --offline --frozen-lockfile --strict-peer-dependencies \\
        || pnpm install --frozen-lockfile --strict-peer-dependencies \\
        || npm ci --no-audit --fund=false

## Test

Lint
   pnpm run lint

Unit 및 Integration Tests
   pnpm run test -- --runInBand

## Build (옵션)

Next.js 프로덕션 빌드
   pnpm run build

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
