# Cinematic

Cinematic là dự án cá nhân website khám phá và xem phim. Ứng dụng dùng Next.js, TypeScript, PostgreSQL và Auth.js; dữ liệu phim
được chuẩn hóa từ OPhim qua một lớp tích hợp riêng để UI không phụ thuộc trực tiếp
vào response của API bên thứ ba.

> **Demo:** [https://movie-iota-rust.vercel.app](https://movie-iota-rust.vercel.app)

## Tính năng

- Giao diện dark theme responsive cho mobile, tablet và desktop.
- Trang chủ, danh sách phim, phân trang, taxonomy và tìm kiếm debounce 400 ms.
- Chi tiết phim, tập phim và gợi ý phim cùng thể loại.
- Player hỗ trợ native HLS, `hls.js` và embed fallback.
- Kiểm tra HTTPS và allowlist hostname trước khi phát video hoặc tải iframe.
- Đăng ký, đăng nhập Credentials, JWT session và bảo vệ route tài khoản.
- Thêm/xóa phim yêu thích với optimistic update và rollback khi API lỗi.
- Vercel Web Analytics và Speed Insights để theo dõi lượt truy cập, Core Web


## Công nghệ

- Next.js 16, React 19 và TypeScript
- Tailwind CSS
- Auth.js Credentials và bcrypt
- PostgreSQL, Prisma ORM và `@prisma/adapter-pg`
- hls.js
- Vitest và React Testing Library
- Docker Compose
- Vercel Web Analytics và Speed Insights

## Chạy local

### Yêu cầu

- Node.js 24
- npm 11+
- Docker Desktop

### Cách 1: chạy toàn bộ bằng Docker

```bash
docker compose up --build
```

Mở [http://localhost:3000](http://localhost:3000). Compose tự khởi động
PostgreSQL, generate Prisma Client và chạy migration.

### Cách 2: chạy ứng dụng trực tiếp

Sao chép `.env.example` thành `.env`, tạo `AUTH_SECRET`, sau đó chạy:

```bash
docker compose up -d postgres
npm ci
npm run db:generate
npm run db:deploy
npm run dev
```

Có thể tạo secret bằng:

```bash
npx auth secret
```

## Database và migration

Tạo migration trong môi trường development:

```bash
npm run db:migrate -- --name ten_migration
```

Áp dụng migration đã có trong production:

```bash
npm run db:deploy
```

Không dùng `prisma migrate dev` trên database production.

## Testing và quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Coverage report:

```bash
npm run test:coverage
```

## Dữ liệu và bản quyền

Dữ liệu phim được tổng hợp từ OPhim và các nguồn bên thứ ba. Cinematic là dự án
học tập/portfolio, không sở hữu, sao chép hoặc lưu trữ nội dung video. Chủ sở hữu
repository có trách nhiệm tuân thủ điều khoản của nhà cung cấp dữ liệu và quy định
bản quyền tại nơi triển khai.
