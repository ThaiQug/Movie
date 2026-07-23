# Cinematic

Cinematic là ứng dụng web khám phá phim được xây dựng với Next.js, TypeScript,
PostgreSQL và OPhim API. Ứng dụng chuẩn hóa dữ liệu từ nguồn bên ngoài qua một
lớp tích hợp độc lập, giúp giao diện không phụ thuộc trực tiếp vào cấu trúc
response của API.

## Tính năng hiện có

- Hiển thị danh sách phim mới từ OPhim
- Chuẩn hóa thông tin phim, thể loại, quốc gia và tập phim
- Hỗ trợ truy vấn danh sách, tìm kiếm và bộ lọc
- Xử lý URL ảnh tuyệt đối và tương đối
- Timeout, retry và cache cho request đến OPhim
- PostgreSQL schema cho người dùng, phim yêu thích và tiến độ xem
- Docker Compose cho môi trường phát triển local
- Unit test cho adapter, query builder và image resolver

## Công nghệ

- Next.js 16 và React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Zod
- Vitest
- Docker Compose

## Cấu trúc chính

```text
src/
  app/                  Next.js App Router
  lib/
    db/                 Prisma client
    ophim/              API client, schema, adapter và internal types
prisma/
  migrations/           Database migrations
  schema.prisma         Database schema
```

Mọi response từ OPhim được xem là `unknown`, kiểm tra bằng Zod và chuyển sang
model nội bộ trước khi được ứng dụng sử dụng.

## Cài đặt

### Yêu cầu

- Node.js 24
- npm 11+
- Docker Desktop

### Chạy bằng Docker

```bash
docker compose up --build
```

Ứng dụng hoạt động tại [http://localhost:3000](http://localhost:3000).
PostgreSQL được khởi động tự động và migration sẽ được áp dụng trước khi
development server chạy.

### Chạy trực tiếp

Sao chép `.env.example` thành `.env`, sau đó:

```bash
docker compose up -d postgres
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

## Biến môi trường

| Biến | Mục đích |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Khóa ký session |
| `NEXT_PUBLIC_APP_URL` | URL của ứng dụng |
| `OPHIM_BASE_URL` | Base URL của OPhim API |
| `OPHIM_IMAGE_BASE_URL` | CDN ảnh mặc định |
| `REDIS_URL` | Redis connection string nếu sử dụng |

File `.env` không được commit vào repository.

## Database

Schema gồm ba model chính:

- `User`
- `Favorite`
- `WatchProgress`

Tạo migration mới:

```bash
npm run db:migrate -- --name ten_migration
```

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Unit test sử dụng fixture local và không gọi OPhim API thật.

### Kiểm chứng contract OPhim

Contract dữ liệu được đối chiếu trực tiếp ngày 23/07/2026 với các endpoint:

- `/v1/api/home`
- `/v1/api/danh-sach/phim-bo`
- `/v1/api/tim-kiem`
- `/v1/api/the-loai` và `/v1/api/the-loai/{slug}`
- `/v1/api/quoc-gia` và `/v1/api/quoc-gia/{slug}`
- `/v1/api/phim/{slug}`

Các response mẫu đã được rút gọn và làm sạch trong
`src/lib/ophim/__tests__/fixtures`. Unit test luôn dùng fixture local để tránh
phụ thuộc vào mạng và dữ liệu phim thay đổi theo thời gian.

## Nguồn dữ liệu

Dữ liệu phim được cung cấp bởi OPhim. Repository này không tải xuống, sao chép
hoặc lưu trữ video. Việc triển khai và sử dụng phải tuân thủ điều khoản của
nguồn dữ liệu cũng như các quy định liên quan đến bản quyền nội dung.
