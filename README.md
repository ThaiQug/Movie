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
- Metadata động, canonical URL, Open Graph, `robots.txt` và `noindex` cho route
  riêng tư.
- Vercel Web Analytics và Speed Insights để theo dõi lượt truy cập, Core Web
  Vitals và hiệu năng production.
- Timeout, retry, schema validation và cache theo từng request OPhim.


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

Test hiện có bao phủ schema/adapter/client OPhim, sanitize nội dung, auth
validation, password hashing, favorite repository/API, URL allowlist, lựa chọn
nguồn player, SearchBar và optimistic favorite.

## Deploy với Neon và Vercel

1. Tạo Neon project và lấy pooled PostgreSQL connection string.
2. Đặt connection string vào `DATABASE_URL` trong terminal cục bộ, rồi chạy
   `npm run db:deploy` trước lần deploy production đầu tiên.
3. Import repository vào Vercel.
4. Thiết lập toàn bộ biến trong bảng trên cho môi trường Production. Đặt
   `NEXT_PUBLIC_APP_URL` bằng domain production, ví dụ
   `https://cinematic.example.com`.
5. Bật Web Analytics và Speed Insights trong Vercel Dashboard.
6. Deploy và kiểm tra `/robots.txt`, metadata trang phim, đăng ký/đăng nhập,
   player và favorite trên domain production.
7. Sau mỗi migration mới, chạy `npm run db:deploy` với production
   `DATABASE_URL` trước khi phát hành version sử dụng schema mới.

## Giới hạn

- Không lưu lịch sử hoặc tiến độ xem và không đồng bộ đa thiết bị.
- Không tự động chuyển tập và không có custom video control bar.
- Không có recommendation engine, analytics nghiệp vụ hoặc dashboard quản trị;
  chỉ dùng telemetry tổng hợp của Vercel cho lượt truy cập và hiệu năng.
- Chỉ hỗ trợ đăng nhập email/mật khẩu; không có OAuth, magic link hay email
  verification.
- Không dùng Redis. Rate limiting nếu bổ sung ở bản portfolio chỉ phù hợp một
  instance, không phải distributed rate limiting cho hệ thống nhiều region.
- Chất lượng và tính sẵn sàng của metadata, poster và nguồn phát phụ thuộc nhà
  cung cấp bên thứ ba.

## Dữ liệu và bản quyền

Dữ liệu phim được tổng hợp từ OPhim và các nguồn bên thứ ba. Cinematic là dự án
học tập/portfolio, không sở hữu, sao chép hoặc lưu trữ nội dung video. Chủ sở hữu
repository có trách nhiệm tuân thủ điều khoản của nhà cung cấp dữ liệu và quy định
bản quyền tại nơi triển khai.
