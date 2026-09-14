# Tech Stack

KHCPQA 글로벌 웹앱의 권장 기술 스택과 개발 구조를 정의한다.

## 1. 기본 추천안

1차 개발은 빠른 구현, 관리자 기능, 인증, 데이터베이스, 파일 저장, 배포 편의성을 우선한다.

| 영역 | 추천 기술 | 이유 |
| --- | --- | --- |
| Framework | Next.js App Router | SEO, 다국어 라우팅, 서버 컴포넌트, Vercel 배포에 적합 |
| Language | TypeScript | 데이터 모델과 관리자 기능 안정성 확보 |
| Styling | Tailwind CSS | 빠른 반응형 UI와 일관된 디자인 토큰 적용 |
| UI Base | shadcn/ui 또는 Radix UI | 접근성 있는 폼, Dialog, Select, Tabs, Dropdown 구현에 유리 |
| Icons | lucide-react | 관리자/공개 UI 아이콘 일관성 |
| i18n | next-intl | `/ko`, `/en`, `/es` 라우팅과 메시지 관리에 적합 |
| Auth | Supabase Auth | 이메일 로그인, 세션 관리, RLS와 연동 쉬움 |
| Database | Supabase Postgres | 콘텐츠, 회원, 자격 데이터 관리에 적합 |
| Storage | Supabase Storage | 이미지, 갤러리, 첨부 파일 관리 |
| Hosting | Vercel | Next.js 배포, 프리뷰 URL, 환경변수 관리 편리 |
| Analytics | GA4 + Search Console | 기본 트래픽/검색 성과 확인 |

## 2. 대안

Firebase도 가능하지만, 이 프로젝트는 관리자 CMS와 자격 데이터처럼 관계형 데이터가 중요하므로 Supabase를 기본 추천한다.

| 영역 | 대안 | 사용할 경우 |
| --- | --- | --- |
| Backend/Auth/DB | Firebase | 팀이 Firebase 운영에 익숙하거나 실시간 기능이 중요할 때 |
| CMS | Headless CMS | 내부 관리자를 직접 만들지 않고 콘텐츠 운영을 외부 CMS에 맡길 때 |
| Hosting | Netlify/Cloudflare Pages | Vercel 사용이 어려운 경우 |

## 3. 권장 패키지

```txt
next
react
react-dom
typescript
tailwindcss
postcss
autoprefixer
next-intl
@supabase/supabase-js
@supabase/ssr
zod
react-hook-form
@hookform/resolvers
lucide-react
clsx
tailwind-merge
class-variance-authority
```

선택 패키지:

```txt
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-select
@radix-ui/react-tabs
@radix-ui/react-toast
date-fns
```

## 4. 현재 폴더 구조

```txt
src/
  app/
    [locale]/
      page.tsx
      about/
        greeting/
        history/
        instructors/
        organization/
      curriculum/
        [courseSlug]/
      activities/
        [activityKey]/
      partner-inquiry/
      contact/
      login/
      signup/
      privacy/
      terms/
      account/
        page.tsx
        profile/
        certifications/
        inquiries/
    auth/
      callback/
    admin/
      page.tsx
      actions.ts
  components/
    *.tsx
  lib/
    supabase/
    seo/
    content.ts
    admin-data.ts
    public-content.ts
    inquiry-actions.ts
  styles/
    globals.css
supabase/
  migrations/
  seed.sql
docs/
  templates/
```

## 5. 라우팅 규칙

- 공개 페이지는 `/[locale]/...` 구조를 사용한다.
- 지원 언어는 `ko`, `en`, `es`다.
- 기본 언어는 `ko`로 둔다.
- 언어 선택기는 풀네임 드롭다운으로 제공하고, 현재 페이지와 대응되는 같은 slug의 언어 페이지로 이동한다.
- 번역이 없는 페이지나 검수 중 콘텐츠는 기본 언어로 강제 이동하지 말고 준비 중/검수 중 상태를 표시한다.
- 관리자 페이지는 `/admin`으로 두고 locale prefix를 붙이지 않는다.

## 6. 인증/권한

인증:
- Supabase Auth 사용
- 이메일/비밀번호 로그인 기본
- 비밀번호 찾기 제공
- 회원가입은 공개 가입 방식으로 운영하며, 가입 사용자는 기본 `user` role로 생성

권한:
- `user`
- `viewer`
- `content_manager`
- `course_manager`
- `certification_manager`
- `inquiry_manager`
- `super_admin`

보호 라우트:
- `/[locale]/account/**`
- `/admin/**`

보안 원칙:
- 관리자와 My Page는 서버 측에서 인증 확인
- 관리자 API 또는 server action은 role 확인
- 자격 데이터는 본인 또는 권한 있는 관리자만 접근
- 로그인 후 페이지는 `noindex`

## 7. 데이터베이스 선택 기준

Supabase Postgres를 기본으로 한다.

필수 테이블은 `docs/data-model.md`를 기준으로 한다.

권장 추가 컬럼:
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `deleted_at`

삭제 정책:
- 운영 콘텐츠는 실제 삭제보다 `archived` 또는 `deleted_at` 처리 우선
- 자격 데이터는 감사 이력이 필요하므로 물리 삭제를 제한

## 8. 파일 저장

현재 1차 구현은 `public/assets`의 정적 이미지와 기존 출처 URL을 함께 사용한다. Supabase Storage는 운영자가 이미지 업로드까지 확장할 때 아래 bucket 구조를 기준으로 추가한다.

Supabase Storage bucket 후보:

| Bucket | 용도 |
| --- | --- |
| `public-images` | 공개 페이지 이미지 |
| `course-images` | 과정 대표 이미지 |
| `gallery` | 갤러리 이미지 |
| `admin-uploads` | 관리자 콘텐츠 이미지, PDF 첨부, 자격증 배경 디자인 |

주의:
- 기존 SMC365 이미지 URL을 그대로 참조할지, 신규 스토리지로 복사할지는 발주사 권리 확인 후 결정한다.
- 공개 이미지에는 alt text를 언어별로 저장한다.
- 개인정보가 포함된 파일은 공개 bucket에 넣지 않는다.
- 자격증 배경 디자인은 개인별 텍스트 없이 공통 요소만 포함하고, 회원명/자격번호/발급일은 DB 데이터로 합성한다.

## 9. 환경변수

```txt
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEFAULT_LOCALE=ko
NEXT_PUBLIC_SUPPORTED_LOCALES=ko,en,es,zh-CN
GA_MEASUREMENT_ID=
GOOGLE_SITE_VERIFICATION=
NAVER_SITE_VERIFICATION=
```

주의:
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 클라이언트에 노출 금지.
- 배포 환경과 로컬 환경의 값을 분리한다.
- 로컬 개발용 예시는 `.env.example`을 기준으로 한다.

## 10. SEO/메타데이터

Next.js Metadata API를 사용한다.

필수:
- 언어별 title
- 언어별 description
- canonical
- hreflang
- Open Graph
- sitemap.xml
- robots.txt

비공개:
- `/[locale]/account/**`
- `/admin/**`

## 11. 폼 처리

권장:
- `react-hook-form`
- `zod`

적용 대상:
- 로그인
- 회원가입
- 비밀번호 찾기
- 파트너 문의
- 교육생 문의
- 관리자 콘텐츠 작성
- 자격 데이터 등록

폼 원칙:
- 모든 입력에 라벨 제공
- 언어별 오류 메시지 제공
- 개인정보 동의 체크 필수
- 제출 후 관리자에서 확인 가능

## 12. 배포

기본 배포:
- Vercel

현재 배포 인계 기준:
1. GitHub `main`을 Vercel 프로젝트에 연결한다.
2. `docs/deployment-handoff.md`의 환경변수를 Vercel에 등록한다.
3. 생성된 검수 URL을 Supabase Auth Site URL/Redirect URL에 등록한다.
4. `docs/qa-release.md` 기준으로 검수 URL QA를 수행한다.

이 작업 환경에서는 Vercel 직접 배포가 정책상 차단될 수 있으므로, 운영자 계정에서 위 인계 절차를 수행한다.

## 13. 개발 품질 기준

필수:
- TypeScript strict 지향
- ESLint 적용
- Prettier 적용
- 공통 UI 컴포넌트 재사용
- 서버/클라이언트 컴포넌트 역할 분리
- 관리자 권한 체크를 UI와 서버 양쪽에서 수행

권장 검증:
- `npm run lint`
- `npm run build`
- 주요 화면 Playwright smoke test

## 14. 1차에서 구현하지 않는 기술 기능

- 결제 연동
- 문자/카카오 알림
- 실시간 채팅
- 네이티브 앱
- 푸시 알림
- 자동 번역
- 증명서 PDF 자동 발급
- 고급 통계 대시보드
- 대량 엑셀 업로드 자동화
- 외부 CRM/ERP 연동

위 기능은 후속 단계 또는 별도 견적으로 분리한다.
