# Data Model

현재 Supabase 마이그레이션 기준 데이터 모델 요약이다. 실제 적용 SQL은 `supabase/migrations`와 `docs/supabase-migration-runbook.md`를 기준으로 한다.

## locales

지원 언어:
- `ko`
- `en`
- `es`

## admin_content_items

| 필드 | 설명 |
| --- | --- |
| id | UUID 고유 ID |
| content_type | `Page`/`Course`/`Activity`/`Review` |
| locale | `ko`/`en`/`es` |
| slug | URL 또는 CMS 섹션 식별자 |
| title | 제목 |
| status | `draft`/`translated`/`reviewed`/`published`/`archived` |
| source_url | 기존 사이트 원본 URL |
| image_url | 대표 이미지 URL 또는 공개 asset 경로 |
| summary | 목록/카드/SEO 보조 요약 |
| body | 공개 상세 본문 또는 섹션 본문 |
| created_by | 작성자 auth user ID |
| created_at | 생성일 |
| updated_at | 수정일 |

## users

| 필드 | 설명 |
| --- | --- |
| id | Auth user ID |
| name | 이름 |
| email | 이메일 |
| phone | 휴대폰/연락처 |
| country | 국가 |
| interested_course | 관심 과정 |
| marketing_opt_in | 교육/상담 안내 수신 동의 여부 |
| preferred_locale | 선호 언어 |
| role | `user`/`viewer`/`content_manager`/`course_manager`/`certification_manager`/`inquiry_manager`/`super_admin` |
| status | `active`/`suspended`/`deleted` |
| created_at | 가입일 |
| updated_at | 수정일 |

## certifications

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| user_id | 사용자 ID |
| course_title | 과정명 |
| certificate_number | 자격 번호 |
| issued_at | 발급일 |
| expires_at | 만료일 |
| status | `issued`/`expired`/`revoked` |
| verification_code | 검증 코드 |
| admin_note | 관리자 메모 |
| created_at | 생성일 |
| updated_at | 수정일 |

## certificate_templates

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| name | 템플릿 이름 |
| background_image_url | 텍스트가 없는 자격증 배경 이미지 URL |
| layout_json | 성명, 자격명, 자격번호, 발급일, 상태, 검증코드의 좌표/글자 설정 |
| status | `draft`/`published`/`archived` |
| created_by | 생성 관리자 |
| created_at | 생성일 |
| updated_at | 수정일 |

## inquiries

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| inquiry_type | `general`/`course`/`certification`/`partnership` |
| locale | ko/en/es |
| name | 이름 |
| organization | 기관명 |
| email | 이메일 |
| phone | 연락처 |
| country | 국가 |
| message | 메시지 |
| status | `new`/`in_review`/`answered`/`closed` |
| manager_note | 담당자 메모 |
| created_at | 생성일 |
| updated_at | 수정일 |

## banners

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| title | 제목 |
| placement | `home`/`curriculum`/`activities`/`global` |
| status | `draft`/`published`/`archived` |
| starts_at | 시작일 |
| ends_at | 종료일 |
| image_url | 배너 이미지 URL 또는 공개 asset 경로 |
| target_url | 연결 URL |
| created_by | 작성자 auth user ID |
| created_at | 생성일 |
| updated_at | 수정일 |

## admin_publish_events

| 필드 | 설명 |
| --- | --- |
| id | 고유 ID |
| item_type | `content`/`banner` |
| item_id | 대상 항목 ID |
| action | `created`/`updated`/`deleted`/`published`/`archived` |
| title | 이벤트 제목 |
| status | 이벤트 시점 상태 |
| actor_id | 작업자 auth user ID |
| created_at | 이벤트 생성일 |
