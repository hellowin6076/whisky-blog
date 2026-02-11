# 🥃 LuvWhisky Blog

위스키 테이스팅 노트 & 컬렉션 블로그

## 🚀 빠른 시작

```bash
# 패키지 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션
npx prisma migrate dev

# Contentful 데이터 마이그레이션 (61개)
npm run migrate:contentful

# 개발 서버
npm run dev
```

## 📊 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Image Storage**: Vercel Blob
- **Styling**: Tailwind CSS
- **Image Compression**: browser-image-compression

## 🗄️ DB 스키마

### Whisky 테이블
```prisma
- id, name, slug
- distillery, type, age, abv, rating
- nose, palate, finish, impression
- price, purchaseDate
- description, notes
- tags (many-to-many)
```

### Tag 테이블 (Recipe + Whisky 공용)
```prisma
- id, name
- recipes, whiskies
```

## 📁 프로젝트 구조

```
whisky-blog/
├── app/
│   ├── whisky/[slug]/          # 사용자 상세 (slug)
│   ├── admin/
│   │   └── whisky/
│   │       ├── new/            # 새 위스키
│   │       └── [id]/           # 수정 (id)
│   ├── api/
│   │   ├── whiskies/           # GET/POST
│   │   └── upload/             # Vercel Blob
│   ├── blog/                   # 전체 목록
│   └── page.tsx                # 홈
├── prisma/
│   ├── schema.prisma           # Recipe + Whisky
│   └── migrate-contentful.ts   # Contentful → DB
├── components/
│   ├── Header.tsx
│   └── WhiskyCard.tsx
└── data/
    └── contentful-export.json  # 61개 데이터
```

## 🔄 Contentful 마이그레이션

### 1. DB 마이그레이션
```bash
npx prisma migrate dev
```

### 2. Contentful 데이터 이동
```bash
npm run migrate:contentful
```

### 매핑 규칙
```javascript
Contentful → Prisma
- title → name
- types → type
- years → age (NAS → null)
- price → price ("4000円" → 4000)
- content.impression → impression
- content.tags → WhiskyTag
```

## 🌐 배포 (Vercel)

### 1. GitHub에 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

### 2. Vercel 연결
- New Project
- Import Repository
- Environment Variables 추가:
  - `DATABASE_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `ADMIN_PASSWORD`
  - `NEXT_PUBLIC_BASE_URL`

### 3. DB 마이그레이션 (프로덕션)
```bash
npx prisma migrate deploy
npm run migrate:contentful
```

## 🔧 환경변수

```env
DATABASE_URL="postgresql://..."          # Neon DB
BLOB_READ_WRITE_TOKEN="vercel_blob_..."  # Vercel Blob
ADMIN_PASSWORD="your_password"
NEXT_PUBLIC_BASE_URL="https://..."
```

## 📝 사용법

### 위스키 추가
1. `/admin/whisky/new` 접속
2. 정보 입력
3. 이미지 업로드 (Vercel Blob)
4. 태그 추가
5. 저장

### URL 구조
```
사용자: /whisky/talisker-10years  (slug)
관리자: /admin/whisky/clxxx123    (id)
```

## 🎯 주요 기능

- ✅ 테이스팅 노트 (nose, palate, finish, impression)
- ✅ 평점 시스템 (0-5)
- ✅ 태그 시스템
- ✅ 이미지 압축 & 업로드
- ✅ 한글 slug 지원
- ✅ Admin 인증 (쿠키)
- ✅ Contentful 마이그레이션

## 📊 현재 데이터

- **총 61개** 위스키 (Contentful export)
- 타입: 싱글몰트, 블렌디드, 버번 등
- 가격: 엔화 기준

## 🔐 Admin 접속

1. `/admin/login` 접속
2. 비밀번호 입력: `gmlahr25`
3. 관리자 페이지 이동

---

Made with 🥃 by bufgix
