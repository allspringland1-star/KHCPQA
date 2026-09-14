# Operations QA Checklist

이 체크리스트는 운영자가 실제 검수 URL에서 배포, 인증, 법무, 외부 링크, 실기기 표시를 확인하기 위한 실행 순서다.

실제 운영 데이터 입력은 이 문서의 마지막 단계에서 진행한다.

## 1. Vercel 배포 확인

자동 기본 점검:

```bash
npm run qa:ops
QA_BASE_URL=https://검수도메인 npm run qa:ops
EXPECTED_DEPLOY_COMMIT=$(git rev-parse HEAD) QA_BASE_URL=https://검수도메인 npm run qa:ops
```

GitHub Actions > Operations QA에서 `qa_base_url`을 입력해 같은 점검을 수동 실행할 수 있다.

| 확인 항목 | 완료 기준 |
| --- | --- |
| GitHub branch | Vercel production deployment가 `main`을 사용한다. |
| 최신 커밋 | `/api/health`의 `commit`이 GitHub `main` 최신 커밋과 일치한다. |
| 환경변수 | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 Production에 등록되어 있다. |
| DB 마이그레이션 | `202609140001_create_certificate_templates.sql`까지 Supabase에 적용되어 있다. |
| 공개 라우트 | `/ko`, `/ko/curriculum`, `/ko/activities/notice`, `/ko/login`, `/ko/signup`, `/robots.txt`, `/sitemap.xml`이 200으로 응답한다. |
| 보호 라우트 | 비로그인 `/admin`, `/ko/account` 접근 시 로그인으로 이동한다. |

## 2. Supabase Auth 확인

Supabase Dashboard > Authentication > URL Configuration에서 확인한다.

| 확인 항목 | 완료 기준 |
| --- | --- |
| Site URL | 검수 URL 또는 운영 도메인으로 설정되어 있다. |
| Redirect URL | `https://검수도메인/auth/callback`이 등록되어 있다. |
| Email template | 회원가입/비밀번호 재설정 링크가 같은 도메인의 `/auth/callback`으로 돌아온다. |
| 회원가입 | `/ko/signup`에서 신규 테스트 회원 생성 또는 이메일 인증 안내가 정상 표시된다. |
| 로그인 | `/ko/login`에서 테스트 회원으로 로그인 후 `/ko/account` 진입이 가능하다. |
| 비밀번호 재설정 | 재설정 메일 링크 클릭 후 `/ko/account/security`에서 새 비밀번호 저장이 가능하다. |
| 관리자 접근 | 관리자 role/status가 있는 계정만 `/admin`에 진입한다. |
| 관리자 빈 상태 | 운영 테이블이 0건이면 데모 데이터가 아니라 빈 상태 안내가 보인다. |

주의:
- 실제 운영 개인정보로 테스트하지 않는다.
- 관리자 계정 비밀번호는 문서나 메신저 평문으로 공유하지 않는다.

## 3. 법무 문서 확인

| 확인 항목 | 완료 기준 |
| --- | --- |
| 개인정보처리방침 | 발주사/법무 제공 최종 원문이 `/ko/privacy`에 반영되어 있다. |
| 이용약관 | 발주사/법무 제공 최종 원문이 `/ko/terms`에 반영되어 있다. |
| Footer 링크 | Footer에서 개인정보처리방침/이용약관 접근이 가능하다. |
| 언어 정책 | 영어/스페인어 공개 여부와 번역 검수 상태가 확정되어 있다. |

원문 요청 템플릿: `docs/templates/legal-policy-request.md`

## 4. 외부 링크/SNS 확인

| 확인 항목 | 완료 기준 |
| --- | --- |
| 공식 SNS | Instagram, Kakao, YouTube 등 공식 URL이 있으면 Footer 또는 활동 페이지 링크로 교체한다. |
| 지도/전화 | 지점별 전화, 주소, 지도 링크가 실제 운영 정보와 일치한다. |
| 문의 CTA | 상담/문의 CTA가 `/ko/partner-inquiry` 또는 확정된 신청 링크로 이동한다. |
| 원본 출처 | 공개 게시글의 source URL이 실제 원본 URL로 입력되어 있다. |
| 대표 이미지 | CMS `image_url`에 사용 권리가 확인된 이미지 URL만 입력되어 있다. |

공식 SNS URL이 확정되지 않았으면 현재처럼 내부 활동 섹션 링크를 유지한다.

## 5. 실기기 모바일 확인

| 기기/브라우저 | 확인 항목 |
| --- | --- |
| iPhone Safari | 홈, 교육과정, 과정 상세, 문의, 로그인, 회원가입, 모바일 메뉴 |
| Android Chrome | 홈, 교육과정, 과정 상세, 문의, 로그인, 회원가입, 모바일 메뉴 |
| Tablet | 교육과정 목록, 관리자 표, 문의 완료 화면 |

공통 확인:
- 헤더와 모바일 메뉴가 화면 밖으로 밀리지 않는다.
- 버튼 텍스트가 잘리지 않는다.
- 폼 입력과 자동완성이 동작한다.
- 과정 카드와 활동 카드 이미지 비율이 깨지지 않는다.
- 관리자 표는 가로 스크롤로 읽을 수 있다.

## 6. 자격증 다운로드 디자인 확인

| 확인 항목 | 완료 기준 |
| --- | --- |
| 템플릿 업로드 | `/admin/certifications`에서 텍스트 없는 자격증 배경 이미지를 업로드할 수 있다. |
| 위치 조정 | 성명, 자격명, 자격번호, 발급일, 상태, 검증코드의 위치/크기/색상/정렬을 저장할 수 있다. |
| 회원 다운로드 | `/ko/account/certifications`에서 다운로드한 PNG에 최신 자격 데이터가 합성된다. |
| 기본 복원 | 기본 디자인으로 복원하면 업로드 배경 없이 기존 기본 자격증 디자인으로 다운로드된다. |
| 권한 | `certification_manager` 또는 `super_admin`만 템플릿을 저장할 수 있다. |

## 7. 마지막 단계: 실제 운영 데이터 입력

아래 작업은 배포/Auth/법무/SNS/실기기 검수가 끝난 뒤 진행한다.

| 데이터 | 입력 위치 | 기준 문서 |
| --- | --- | --- |
| 관리자 게시글 | `/admin` 콘텐츠 등록/수정 | `docs/cms-section-guide.md` |
| 교육과정 운영 문구 | `/admin` 교육과정 관리 | `docs/admin-cms.md` |
| 자격 데이터 CSV | Supabase import 또는 관리자 자격 데이터 등록 | `docs/data-import-runbook.md` |
| 자격증 디자인 | `/admin/certifications` 자격증 디자인 | 텍스트 없는 배경 이미지, 위치 조정 후 다운로드 확인 |
| 배너/팝업 | `/admin` 팝업/배너 등록 | `docs/admin-cms.md` |
| source URL | CMS `source_url` 필드 | `docs/source-url-inventory.md` |

입력 후 다시 확인할 것:
- 공개 페이지에 draft/검수용 문구가 노출되지 않는다.
- 자격 데이터는 로그인 사용자 본인에게만 보인다.
- 개인정보나 내부 메모가 공개 콘텐츠에 들어가지 않는다.
