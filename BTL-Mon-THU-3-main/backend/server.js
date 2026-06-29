const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'lumstore_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Database setup
const db = new sqlite3.Database('./lumstore.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Accounts table
  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    customer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    order_date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Chờ xác nhận',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`);

  // Order details table
  db.run(`CREATE TABLE IF NOT EXISTS order_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Insert default data if empty
  insertDefaultData();
}

// Insert default data
function insertDefaultData() {
  // Check if accounts exist
  db.get("SELECT COUNT(*) as count FROM accounts", (err, row) => {
    if (err) return;
    
    if (row.count === 0) {
      const hashedPassword = bcrypt.hashSync('123456', 10);
      
      // Insert default accounts
      const accounts = [
        ['admin', hashedPassword, 'Quản trị viên', null],
        ['nhanvien', hashedPassword, 'Nhân viên bán hàng', null],
        ['kh001', hashedPassword, 'Khách hàng', 1],
        ['kh002', hashedPassword, 'Khách hàng', 2]
      ];

      accounts.forEach(([username, password, role, customerId]) => {
        db.run("INSERT INTO accounts (username, password, role, customer_id) VALUES (?, ?, ?, ?)", 
          [username, password, role, customerId]);
      });

      // Insert default customers
      const customers = [
        ['KH001', 'Nguyễn Thị Lan', '0901234567', 'Quận 1, TP.HCM'],
        ['KH002', 'Trần Minh Khoa', '0912345678', 'Hải Châu, Đà Nẵng'],
        ['KH003', 'Lê Hoài An', '0987654321', 'Ninh Kiều, Cần Thơ'],
        ['KH004', 'Phạm Ngọc Hà', '0977123456', 'Ba Đình, Hà Nội']
      ];

      customers.forEach(([code, name, phone, address]) => {
        db.run("INSERT INTO customers (customer_code, full_name, phone, address) VALUES (?, ?, ?, ?)", 
          [code, name, phone, address]);
      });

      // Insert default products
      const products = [
        ['SP001', 'Áo thun basic trắng', 199000, 45, 'Cotton 100%, form unisex, thoáng mát.'],
        ['SP002', 'Quần jean slim fit xanh', 459000, 30, 'Co giãn nhẹ, tôn dáng, phong cách Hàn Quốc.'],
        ['SP003', 'Váy hoa vintage', 529000, 22, 'Thiết kế nữ tính, chất voan cao cấp.'],
        ['SP004', 'Áo khoác bomber đen', 699000, 18, 'Phong cách streetwear, giữ ấm tốt.'],
        ['SP005', 'Sơ mi linen be', 389000, 26, 'Thoáng mát, phù hợp mùa hè và công sở.'],
        ['SP006', 'Chân váy chữ A', 349000, 28, 'Dễ phối đồ, công sở năng động.'],
        ['SP007', 'Áo len cổ lọ', 429000, 20, 'Len mềm mại, giữ ấm mùa đông.'],
        ['SP008', 'Quần tây ống suông', 499000, 15, 'Phom dáng thanh lịch, vải chống nhăn.']
      ];

      products.forEach(([code, name, price, qty, desc]) => {
        db.run("INSERT INTO products (product_code, name, price, quantity, description) VALUES (?, ?, ?, ?, ?)", 
          [code, name, price, qty, desc]);
      });

      // Insert default orders
      const orders = [
        ['DH001', 1, '2026-06-20', 937000, 'Chờ xác nhận'],
        ['DH002', 2, '2026-06-21', 699000, 'Đang giao'],
        ['DH003', 3, '2026-06-22', 529000, 'Hoàn thành']
      ];

      orders.forEach(([code, customerId, date, total, status]) => {
        db.run("INSERT INTO orders (order_code, customer_id, order_date, total_amount, status) VALUES (?, ?, ?, ?, ?)", 
          [code, customerId, date, total, status]);
      });

      // Insert default order details
      const orderDetails = [
        [1, 1, 1, 199000],
        [1, 5, 1, 389000],
        [1, 6, 1, 349000],
        [2, 4, 1, 699000],
        [3, 3, 1, 529000]
      ];

      orderDetails.forEach(([orderId, productId, qty, price]) => {
        db.run("INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", 
          [orderId, productId, qty, price]);
      });

      console.log('Default data inserted successfully');
    }
  });
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Admin middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'Quản trị viên' && req.user.role !== 'Nhân viên bán hàng') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ========== API ROUTES ==========

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM accounts WHERE username = ?", [username], (err, account) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, account.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: account.id, username: account.username, role: account.role, customerId: account.customer_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: account.id,
        username: account.username,
        role: account.role,
        customerId: account.customer_id
      }
    });
  });
});

// Register
app.post('/api/register', (req, res) => {
  const { username, password, fullName, phone, address } = req.body;

  if (!username || !password || !fullName || !phone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.get("SELECT COUNT(*) as count FROM customers", (err, countRow) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const customerCode = `KH${String(countRow.count + 1).padStart(3, '0')}`;
    
    db.run("INSERT INTO customers (customer_code, full_name, phone, address) VALUES (?, ?, ?, ?)", 
      [customerCode, fullName, phone, address], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create customer' });
        }

        const customerId = this.lastID;
        const accountCode = `TK${String(countRow.count + 4).padStart(3, '0')}`;

        db.run("INSERT INTO accounts (username, password, role, customer_id) VALUES (?, ?, ?, ?)", 
          [username, hashedPassword, 'Khách hàng', customerId], function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create account' });
            }

            const token = jwt.sign(
              { id: this.lastID, username, role: 'Khách hàng', customerId },
              JWT_SECRET,
              { expiresIn: '24h' }
            );

            res.status(201).json({
              token,
              user: {
                id: this.lastID,
                username,
                role: 'Khách hàng',
                customerId
              }
            });
          }
        );
      }
    );
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Create product (admin only)
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  const { productCode, name, price, quantity, description } = req.body;

  db.run("INSERT INTO products (product_code, name, price, quantity, description) VALUES (?, ?, ?, ?, ?)",
    [productCode, name, price, quantity, description], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create product' });
      }
      res.status(201).json({ id: this.lastID, productCode, name, price, quantity, description });
    }
  );
});

// Update product (admin only)
app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { productCode, name, price, quantity, description } = req.body;

  db.run("UPDATE products SET product_code = ?, name = ?, price = ?, quantity = ?, description = ? WHERE id = ?",
    [productCode, name, price, quantity, description, req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update product' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product (admin only)
app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Get all orders (admin only)
app.get('/api/orders', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT o.*, c.full_name as customer_name, c.phone as customer_phone 
          FROM orders o 
          LEFT JOIN customers c ON o.customer_id = c.id 
          ORDER BY o.created_at DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get customer orders
app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  const customerId = req.user.customerId;
  
  db.all(`SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`, 
    [customerId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { productId, quantity, customerName, customerPhone } = req.body;

  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Find or create customer
    let customerId = req.user.customerId;
    if (!customerId) {
      db.get("SELECT id FROM customers WHERE phone = ?", [customerPhone], (err, customer) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (customer) {
          customerId = customer.id;
          createOrder(customerId, product, quantity, res);
        } else {
          // Create new customer
          db.run("INSERT INTO customers (customer_code, full_name, phone, address) VALUES (?, ?, ?, ?)",
            [`KH${Date.now()}`, customerName, customerPhone, 'Chưa cập nhật'], function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to create customer' });
              }
              customerId = this.lastID;
              createOrder(customerId, product, quantity, res);
            }
          );
        }
      });
    } else {
      createOrder(customerId, product, quantity, res);
    }
  });
});

function createOrder(customerId, product, quantity, res) {
  const orderCode = `DH${Date.now()}`;
  const totalAmount = product.price * quantity;
  const orderDate = new Date().toISOString().slice(0, 10);

  db.run("INSERT INTO orders (order_code, customer_id, order_date, total_amount) VALUES (?, ?, ?, ?)",
    [orderCode, customerId, orderDate, totalAmount], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create order' });
      }

      const orderId = this.lastID;

      db.run("INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, product.id, quantity, product.price], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create order details' });
          }

          // Update product quantity
          db.run("UPDATE products SET quantity = quantity - ? WHERE id = ?", [quantity, product.id], function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to update stock' });
            }

            res.status(201).json({
              orderCode,
              orderId,
              totalAmount,
              message: 'Order created successfully'
            });
          });
        }
      );
    }
  );
}

// Update order status (admin only)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order status' });
    }
    res.json({ message: 'Order status updated' });
  });
});

// Get all customers (admin only)
app.get('/api/customers', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT * FROM customers ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get dashboard stats (admin only)
app.get('/api/stats/dashboard', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.products = row.count;

    db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.orders = row.count;

      db.get("SELECT COUNT(*) as count FROM customers", (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.customers = row.count;

        db.get("SELECT SUM(total_amount) as total FROM orders", (err, row) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          stats.revenue = row.total || 0;

          res.json(stats);
        });
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});