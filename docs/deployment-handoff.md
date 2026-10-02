# Deployment Handoff

현재 작업 환경에서는 외부 호스팅 서비스로 프로젝트를 직접 업로드하는 배포 작업이 정책상 차단되어 있다. 대신 운영자는 GitHub에 푸시된 `main` 브랜치를 기준으로 Vercel에서 배포를 연결하면 된다.

## Repository

- GitHub: `https://github.com/creatorkorea/KHCPQA`
- Branch: `main`
- Minimum verified deployment commit: `b2cd052`

## GitHub Actions Verification

검증 기준 커밋 이후 `main` 브랜치에서 GitHub Actions 검증을 완료했다.

| Workflow | Run | Result | Notes |
| --- | --- | --- | --- |
| CI | `29899703043` | 통과 | `npm run lint`, `npm run build`, commit `b2cd052` |
| Operations QA | `29899780669` | 통과 | GitHub repository secrets 등록 후 `npm run qa:ops` 실행 |

GitHub repository secrets에는 아래 공개 Supabase 값이 등록되어 있다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Current Public URL Check

작업 환경에서 `https://khcpqa.vercel.app`의 주요 공개 경로 응답은 확인했다.

- `/ko`: 200
- `/ko/curriculum`: 200
- `/ko/activities/notice`: 200
- `/ko/login`: 200
- `/ko/signup`: 200
- `/robots.txt`: 200
- `/sitemap.xml`: 200

단, 현재 연결된 Vercel 계정에서 `khcpqa` 프로젝트가 조회되지 않아 Vercel Dashboard의 production deployment commit ID는 운영자 계정에서 확인해야 한다.

최신 코드가 배포된 뒤에는 헬스 엔드포인트로 배포 커밋을 확인할 수 있다.

```bash
curl https://khcpqa.vercel.app/api/health
EXPECTED_DEPLOY_COMMIT=$(git rev-parse HEAD) npm run qa:ops
```

`/api/health`는 커밋, 브랜치, 배포 환경, 공개 Supabase 환경변수 구성 여부만 반환하며 비밀값은 노출하지 않는다.

## Vercel Project Setup

1. Vercel Dashboard에서 New Project를 선택한다.
2. GitHub repository `creatorkorea/KHCPQA`를 import한다.
3. Framework Preset은 `Next.js`로 설정한다.
4. Build Command는 기본값 `npm run build`를 사용한다.
5. Install Command는 기본값 `npm install`을 사용한다.
6. Output Directory는 비워둔다.

## Required Environment Variables

Vercel Project Settings > Environment Variables에 아래 값을 등록한다.

| Name | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | 배포 URL 또는 운영 도메인 |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only if needed | 서버 전용, 브라우저 노출 금지 |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Production, Preview | `ko` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Production, Preview | `ko,en,es,zh-CN` |
| `GA_MEASUREMENT_ID` | Production | 선택 |
| `GOOGLE_SITE_VERIFICATION` | Production | 선택 |
| `NAVER_SITE_VERIFICATION` | Production | 선택 |

GitHub Actions에서 CI와 Operations QA를 사용하려면 repository secrets에도 아래 값을 등록한다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Auth URL Settings

Vercel Preview URL 또는 운영 도메인이 생성되면 Supabase Dashboard > Authentication > URL Configuration에 추가한다.

- Site URL: 운영 도메인 또는 대표 검수 URL
- Redirect URL: `https://배포도메인/auth/callback`

Preview URL로 회원가입/로그인 검수를 진행할 경우 해당 Preview URL의 `/auth/callback`도 Redirect URL에 추가한다.

## Pre-Review Verification

배포 완료 후 아래를 확인한다. 상세 순서는 `docs/operations-qa-checklist.md`를 따른다.

- `/ko`, `/en`, `/es`, `/zh-CN` 접속
- `/ko/curriculum`에서 과정 상세 페이지 진입
- `/ko/partner-inquiry` 문의 제출 후 관리자 문의함 확인
- `/ko/login` 로그인
- `/ko/account/certifications` 자격 조회
- `/admin` 비로그인 접근 시 로그인 리다이렉트
- `/sitemap.xml`
- `/robots.txt`
- `/api/health`의 `commit`과 GitHub `main` 최신 커밋 일치

## Known Remaining Client Inputs

### 중국어 공개 반영 (2026-10-02)

- 일반 페이지의 중국 간체 본문, 연혁, 교통 안내, 회원/문의 화면 문구를 추가했다. 공통 본문은 `src/lib/content-zh-cn.ts`에서 관리한다.
- 중국어 전체를 가리던 준비 화면과 언어 단위 검색 차단을 제거했다. 회원 영역 및 법률 초안의 개별 `noIndex` 정책은 유지한다.
- 과정과 게시글은 해당 언어가 `published`인 데이터만 노출한다. 기존 게시글·배너·증서·조직도 이미지 자체에 포함된 글자는 자동 번역하지 않는다.
- **앱 배포 전에** `20261002043000_enable_chinese_member_locales.sql`을 적용해야 중국어 회원가입, 프로필 저장, 문의 저장을 허용한다. 이 변경은 `profiles.preferred_locale`와 `inquiries.locale`의 CHECK 조건만 확장하며 RLS는 변경하지 않는다.
- 운영 Supabase 연결 도구가 권한 오류를 반환하여 운영 제약 조회·마이그레이션 적용 및 실제 가입/문의 저장은 이 작업에서 확인하지 못했다. 배포 시 마이그레이션 적용과 중국어 가입/문의 저장을 함께 검증한다.
- 로컬 PostgreSQL 17의 별도 테스트 테이블에서는 기존 제약의 중국어 거부 → 마이그레이션 후 4개 언어 허용, 기존 데이터 보존 및 잘못된 언어값 거부를 확인했다. 이는 운영 가입·문의 저장 검증을 대신하지 않는다.

### 운영자 확정 항목

- 도메인, 호스팅, SSL 계정 명의 확정
- 개인정보처리방침과 이용약관 원문
- 기존 SMC365 이미지와 콘텐츠 사용 권리
- 전체 실운영 콘텐츠 `source_url`
- 실제 자격 데이터 샘플 및 운영 게시글/배너 입력은 최종 단계로 진행
