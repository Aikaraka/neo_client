# AGENTS.md  (프로젝트 루트)

## Setup
# 1) pnpm 자체가 없을 수 있으므로 corepack으로 활성화
corepack enable
corepack prepare pnpm@8 --activate

# 2) 의존성 설치 (네트워크 허용 단계에서 실행됨)
pnpm install --frozen-lockfile --strict-peer-dependencies

## Test
# Codex가 PR 올리기 전 반드시 통과해야 하는 명령
pnpm run lint
pnpm run test -- --runInBand

## Conventions
- 커밋 메시지: `feat|fix(scope): title`
- 코딩 스타일: ESLint + Prettier, `pnpm run lint --fix`로 자동수정
