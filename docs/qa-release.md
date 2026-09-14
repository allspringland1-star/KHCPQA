# QA and Release

## Current QA Snapshot

Last updated: 2026-07-22

| 항목 | 결과 |
| --- | --- |
| `npm run lint` | 통과 |
| `npm run build` | 통과, 137개 정적 페이지 생성 |
| GitHub Actions CI | 통과, run `29899703043`, commit `b2cd052` |
| GitHub Actions Operations QA | 통과, run `29899780669`, commit `b2cd052` |
| 공개 배포 URL | `https://khcpqa.vercel.app/ko`, `/ko/curriculum`, `/ko/curriculum/취업전문과정`, `/ko/login`, `/robots.txt`, `/sitemap.xml` 200 확인 |
| 주요 공개 라우트 | 로컬 프로덕션 모드에서 `/ko`, `/ko/curriculum`, `/ko/activities/notice`, `/ko/login`, `/ko/signup`, `/ko/about`, `/ko/about/greeting`, `/ko/about/instructors`, `/ko/contact`, `/en`, `/es`, `/en/curriculum`, `/es/activities/photo` 200 확인 |
| 교육과정 상세 라우트 | 공개 배포와 로컬 프로덕션 모드에서 `/ko/curriculum/취업전문과정` 200 확인 |
| 보호 라우트 | 비로그인 `/admin`, `/ko/account` 접근 시 `/ko/login?next=...` 리다이렉트 확인 |
| Supabase 연결 | `.env.local`의 공개 URL/anon key 존재, `admin_content_items`, `banners`, Auth settings 응답 200 확인 |
| 배포 커밋 확인 | `/api/health`에서 배포 커밋 확인 가능, `EXPECTED_DEPLOY_COMMIT` 지정 시 Operations QA가 불일치를 실패 처리 |
| 관리자 과정 관리 | 관리자 입력 폼에 교육과정 전용 탭 추가, Course 타입 저장 후 과정 목록/상세 재검증 적용 |
| 관리자 게시글 관리 | Page/Activity/Review 콘텐츠 등록/수정/삭제와 공개 게시글 읽기 흐름 유지 |
| 관리자 운영 안전성 | Supabase 연결 환경에서 DB 0건 시 데모 데이터 미노출, 환경변수 누락 시 저장 실패 처리, 회원 데이터 빈 상태 안내 표시 |
| 관리자 이미지 URL 관리 | 콘텐츠/배너 `image_url` 입력, 저장, 공개 과정/활동 화면 우선 적용 구현 |
| 관리자 자격증 디자인 관리 | 공통 자격증 배경 업로드, 텍스트 위치 조정, 회원 다운로드 합성 구현 |
| 이미지 참조 | 주요 콘텐츠/소개/인사말 asset 경로 존재 확인 |
| 프론트엔드 UX 보강 | 활동 상세 Preview 문구 제거, 폼 자동완성, 모바일 메뉴 닫기/현재 페이지 표시, 관리자 검색 적용 |
| 문의 제출 | `/ko/partner-inquiry` 제출 후 원격 `public.inquiries` 저장 확인 |
| Supabase 마이그레이션 | 원격 프로젝트는 최신 마이그레이션 적용 여부 재확인 필요, `202609140001_create_certificate_templates.sql`은 다음 배포 전 적용 필요 |
| Supabase RLS | 관련 테이블 정책 22개 확인 |
| 자격 조회 | E2E 테스트 회원의 자격번호/검증 코드 조회 성공 |
| 반응형 QA | 375px, 768px, 1440px에서 가로 넘침 없음 |
| 2026-07-22 로컬 재검증 | `npm run lint`, `npm run build`, `npm run qa:ops` 통과 |

검수 스크린샷 위치:

`/Users/manseokko/.codex/visualizations/2026/07/16/019f6955-2153-7c70-a092-f0be32903cfe`

## Remaining Before Client Review URL

- 운영자가 Vercel production 배포 상태를 확인하고 검수 URL 공유
- 발주사 제공 개인정보처리방침/이용약관 원문 반영
- 기존 SMC365 이미지, 후기, 보도자료, 강사 사진 사용 권리 확인
- 초기 관리자 계정과 권한 정책 확정
- Supabase Auth Site URL/Redirect URL 운영 도메인 기준 확인
- iPhone/Android 실기기 최종 확인
- 전체 운영 콘텐츠의 `source_url`, 실제 게시글, 자격 데이터, 배너/팝업 입력

발주사 확인 요청 문서는 `docs/client-review-request.md`, 운영 검수 순서는 `docs/operations-qa-checklist.md`, 출처 URL 정리 현황은 `docs/source-url-inventory.md`, 배포 인계 절차는 `docs/deployment-handoff.md`를 기준으로 한다.

## 검수 기준

| 항목 | 합격 기준 |
| --- | --- |
| 반응형 | 모바일 375px, 태블릿 768px, 데스크톱에서 주요 화면을 읽고 버튼 사용 가능 |
| 페이지 | 계약 범위의 주요 라우트가 존재하고 404 없이 접근 가능 |
| 콘텐츠 | 발주사가 제공하거나 기존 사이트에서 가져온 최종 문구와 이미지 반영 |
| 회원/자격 조회 | 테스트 계정과 샘플 자격 데이터 기준으로 기본 흐름 작동 |
| 관리자 | 관리자 전용 접근, 주요 콘텐츠 등록/수정/목록 확인 가능 |
| 다국어 | 한국어/영어/스페인어/중국 간체 라우트와 언어 선택기 작동 |
| 보안 | 관리자와 My Page는 비로그인 접근 차단 |

## 필수 테스트

- 홈 렌더링
- 공개 메뉴 이동
- 언어 전환
- 과정 목록/상세
- 활동 목록/상세
- 문의 폼 제출
- 회원가입
- 로그인
- 로그아웃
- My Page 접근 제어
- 자격 조회
- 관리자 로그인
- 관리자 콘텐츠 등록/수정
- 관리자 문의 확인
- 관리자 자격 데이터 등록/수정
- 관리자 자격증 디자인 업로드/위치 조정

## 반응형 테스트

필수 viewport:
- 375px
- 768px
- 1280px 이상

확인 항목:
- 헤더 깨짐 없음
- 메뉴 터치 가능
- 카드 텍스트 넘침 없음
- 버튼 텍스트 잘림 없음
- 이미지 비율 깨짐 없음
- 폼 입력 가능
- 관리자 표가 모바일에서 사용 가능하거나 데스크톱 우선 안내 제공

## SEO 테스트

- 공개 페이지 title 확인
- description 확인
- Open Graph 확인
- canonical 확인
- hreflang 확인
- sitemap.xml 확인
- robots.txt 확인
- 로그인 후 페이지 noindex 확인

## 검수 프로세스

1. 개발자가 검수 URL을 제공한다.
2. 발주사는 7영업일 이내 승인 또는 구체적 수정 요청을 전달한다.
3. 미응답 시 재요청한다.
4. 재요청 후 3영업일 내 응답이 없으면 조건부 승인으로 본다.
5. 수정 요청은 계약 범위 내 오류, 누락, 오탈자, 링크 오류, 반응형 표시 문제, 문구/이미지 교체에 한정한다.

## 릴리즈 전 금지 사항

- 실제 개인정보를 테스트 환경에 노출 금지
- 검수되지 않은 영어/스페인어/중국 간체를 최종 공개 금지
- 관리자 계정 정보를 평문 공유 금지
- 공개 페이지에서 자격 상세 개인정보 노출 금지
