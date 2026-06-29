-- ============================================
-- DATABASE SAMPLE: Cửa hàng bán hàng
-- Bao gồm 3 bảng: Khách hàng, Mặt hàng, Đơn hàng
-- ============================================

-------------------------------------------
-- 1. BẢNG KHÁCH HÀNG (customers)
-------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    customer_id     INTEGER PRIMARY KEY AUTO_INCREMENT,
    full_name       NVARCHAR(100) NOT NULL,
    email           NVARCHAR(150) NOT NULL UNIQUE,
    phone           NVARCHAR(20)  NOT NULL,
    address         NVARCHAR(250) NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------
-- 2. BẢNG MẶT HÀNG (products)
-------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id      INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_name    NVARCHAR(150) NOT NULL,
    category        NVARCHAR(100) NOT NULL,
    unit_price      DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
    stock_quantity  INTEGER        NOT NULL CHECK (stock_quantity >= 0),
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------
-- 3. BẢNG ĐƠN HÀNG (orders)
-------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id     INTEGER        NOT NULL,
    order_date      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          NVARCHAR(50)   NOT NULL DEFAULT 'pending',
    total_amount    DECIMAL(14, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-------------------------------------------
-- DỮ LIỆU MẪU
-------------------------------------------

-- Khách hàng
INSERT INTO customers (customer_id, full_name, email, phone, address, created_at) VALUES
(1, N'Nguyễn Văn An',     'nguyenvanan@email.com',     '0912-345-678', N'Hà Nội',           '2023-01-10 08:00:00'),
(2, N'Trần Thị Bình',     'tranthibinh@email.com',     '0987-654-321', N'Hồ Chí Minh',     '2023-02-15 09:30:00'),
(3, N'Lê Hoàng Cường',    'lehoangcuong@email.com',    '0903-456-789', N'Đà Nẵng',         '2023-03-20 14:00:00'),
(4, N'Phạm Thu Dung',     'phamthidung@email.com',     '0918-765-432', N'Hải Phòng',       '2023-04-05 11:20:00'),
(5, N'Vũ Minh Đức',       'vuminhduc@email.com',       '0934-567-890', N'Cần Thơ',         '2023-05-12 16:45:00');

-- Mặt hàng
INSERT INTO products (product_id, product_name, category, unit_price, stock_quantity, created_at) VALUES
(1, N'Áo thun cotton',         N'Thời trang',      150000.00, 200, '2023-01-01 10:00:00'),
(2, N'Quần jeans slim',        N'Thời trang',      450000.00, 120, '2023-01-01 10:00:00'),
(3, N'Giày sneaker',           N'Giày dép',        850000.00,  50, '2023-01-01 10:00:00'),
(4, N'Túi xách da',            N'Phụ kiện',       1200000.00,  30, '2023-01-01 10:00:00'),
(5, N'Đồng hồ thông minh',    N'Điện tử',        2500000.00,  20, '2023-01-01 10:00:00'),
(6, N'Tai nghe Bluetooth',     N'Điện tử',         650000.00,  75, '2023-01-01 10:00:00'),
(7, N'Balo du lịch',           N'Phụ kiện',        380000.00,  60, '2023-01-01 10:00:00'),
(8, N'Mũ lưỡi trai',          N'Thời trang',       120000.00, 150, '2023-01-01 10:00:00');

-- Đơn hàng
INSERT INTO orders (order_id, customer_id, order_date, status, total_amount) VALUES
(1, 1, '2023-06-01 10:15:00', N'completed',  2185000.00),
(2, 2, '2023-06-02 14:45:00', N'completed',  2050000.00),
(3, 3, '2023-06-03 09:00:00', N'shipping',   4850000.00),
(4, 1, '2023-06-05 16:30:00', N'pending',    6200000.00),
(5, 4, '2023-06-07 11:10:00', N'completed',  1700000.00),
(6, 5, '2023-06-08 13:20:00', N'cancelled',   650000.00),
(7, 2, '2023-06-10 15:50:00', N'completed',  1320000.00),
(8, 3, '2023-06-12 10:05:00', N'shipping',   3150000.00);



