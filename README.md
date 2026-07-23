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

## Công nghệ

- Next.js 16 và React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Docker Compose


## Cài đặt

### Yêu cầu

- Node.js 24
- npm 11+
- Docker Desktop

### Chạy bằng Docker

```bash
docker compose up --build
```

PORT: [http://localhost:3000](http://localhost:3000).

### Chạy trực tiếp

Sao chép `.env.example` thành `.env`, sau đó:

```bash
docker compose up -d postgres
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

## Database

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


## Nguồn dữ liệu

Dữ liệu phim được cung cấp bởi OPhim. Repository này không tải xuống, sao chép
hoặc lưu trữ video.
