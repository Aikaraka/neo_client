# AGENTS.md

── Codex(또는 CI) 실행 순서: Setup → Test → Build(옵션) → Conventions ──

## Setup
```bash
# node_modules 아카이브(분할 gzip) 복원 ─ 완전 오프라인
if [ ! -d node_modules ]; then
  echo "Reassembling node_modules parts"
  cat .store-split/nm.part.* > node_modules.tar.gz
  tar -xzf node_modules.tar.gz
fi

# pnpm/네트워크 불필요 → 바로 test 단계로 이동
+```

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

## 아카이브 갱신 방법

1. **네트워크 가능한 PC**에서  
   ```bash
   rm -rf node_modules && pnpm install              # 최신 의존성 반영
   tar -I 'gzip -9' -cf node_modules.tar.gz node_modules
   split -b 95m -d node_modules.tar.gz .store-split/nm.part.
   ```
2. 커밋 & 푸시  
   ```bash
   git add .store-split AGENTS.md
   git commit -m "chore: refresh offline node_modules archive"
   git push
   ```

── End of AGENTS.md ──
