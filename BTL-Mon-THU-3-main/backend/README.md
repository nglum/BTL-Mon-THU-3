# LumStore Backend API

Backend server cho hệ thống quản lý cửa hàng thời trang LumStore.

## Công nghệ sử dụng

- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
# Development
npm run dev

# Production
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng (admin)
- `GET /api/orders/my-orders` - Lấy đơn hàng của tôi
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (admin)

### Customers
- `GET /api/customers` - Lấy danh sách khách hàng (admin)

### Stats
- `GET /api/stats/dashboard` - Lấy thống kê dashboard (admin)

## Database

Database sử dụng SQLite, file `lumstore.db` sẽ được tạo tự động khi chạy server lần đầu.

## Authentication

Sau khi đăng nhập, nhận được JWT token. Sử dụng token trong header:

```
Authorization: Bearer <token>
```

## Default Accounts

- **Admin**: `admin` / `123456`
- **Nhân viên**: `nhanvien` / `123456`
- **Khách hàng**: `kh001` / `123456` hoặc `kh002` / `123456`