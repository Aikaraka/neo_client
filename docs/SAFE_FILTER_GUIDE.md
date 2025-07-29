# 보호필터 기능 가이드

## 개요
NEO 서비스의 보호필터는 성인 콘텐츠로부터 미성년자를 보호하기 위한 기능입니다.

## 동작 방식

### 1. 기본 상태
- **모든 사용자**: 보호필터 ON (성인 콘텐츠 차단)
- **비로그인 사용자**: 항상 보호필터 ON (변경 불가)

### 2. 보호필터 해제 조건
- **로그인 필수**: 비로그인 사용자는 보호필터 해제 불가
- **본인인증 필수**: PortOne을 통한 본인인증 완료 시에만 해제 가능
- **프로필 생년월일과 무관**: 프로필에 성인 생년월일이 입력되어 있어도 본인인증 필요

### 3. 인증 프로세스
1. 사용자가 보호필터를 끄려고 시도
2. 자동으로 `/verify-age` 페이지로 이동
3. PortOne 본인인증 진행
4. 인증 성공 시:
   - `is_adult = true` 설정
   - 보호필터 자동 해제
   - 이후 자유롭게 보호필터 ON/OFF 가능

### 4. 콘텐츠 필터링
보호필터가 켜져 있을 때:
- `hasAdultContent: true`인 소설 제외
- 모든 목록 (추천, 인기, 검색 결과 등)에서 성인 콘텐츠 필터링

## 기술적 구현

### 데이터베이스 스키마
```sql
-- users 테이블
is_adult: boolean DEFAULT false          -- 본인인증 완료 여부
safe_filter_enabled: boolean DEFAULT true -- 보호필터 활성화 상태

-- age_verifications 테이블
user_id: uuid                            -- 사용자 ID
verification_method: text                -- 'portone'
imp_uid: text                           -- PortOne 인증 ID
verified_at: timestamp                  -- 인증 시각
```

### API 엔드포인트
- `getUserSafeFilterStatus()`: 현재 보호필터 상태 조회
- `toggleSafeFilter()`: 보호필터 토글 (성인 인증 필요)
- `completeAgeVerification()`: 본인인증 완료 처리

## 보안 고려사항
1. 본인인증 결과는 서버에서 검증
2. 클라이언트 조작 방지를 위해 서버 측에서 필터링
3. 비로그인 사용자는 API 레벨에서 차단 