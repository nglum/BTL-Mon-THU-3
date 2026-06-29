/* LumStore Admin/Customer — Core Logic + Cinematic VFX Engine */

const STORAGE_KEY = "fashionstore_db";
const SESSION_KEY = "fashionstore_session";

const defaultDb = {
  TaiKhoan: [
    { MaTK: "TK001", TenDangNhap: "admin", MatKhau: "123456", VaiTro: "Quản trị viên" },
    { MaTK: "TK002", TenDangNhap: "nhanvien", MatKhau: "123456", VaiTro: "Nhân viên bán hàng" },
    { MaTK: "TK003", TenDangNhap: "kh001", MatKhau: "123456", VaiTro: "Khách hàng", MaKH: "KH001" },
    { MaTK: "TK004", TenDangNhap: "kh002", MatKhau: "123456", VaiTro: "Khách hàng", MaKH: "KH002" }
  ],
  KhachHang: [
    { MaKH: "KH001", HoTen: "Nguyễn Thị Lan", SoDienThoai: "0901234567", DiaChi: "Quận 1, TP.HCM" },
    { MaKH: "KH002", HoTen: "Trần Minh Khoa", SoDienThoai: "0912345678", DiaChi: "Hải Châu, Đà Nẵng" },
    { MaKH: "KH003", HoTen: "Lê Hoài An", SoDienThoai: "0987654321", DiaChi: "Ninh Kiều, Cần Thơ" },
    { MaKH: "KH004", HoTen: "Phạm Ngọc Hà", SoDienThoai: "0977123456", DiaChi: "Ba Đình, Hà Nội" }
  ],
  SanPham: [
    { MaSP: "SP001", TenSP: "Áo thun basic trắng", Gia: 199000, SoLuong: 45, MoTa: "Cotton 100%, form unisex, thoáng mát." },
    { MaSP: "SP002", TenSP: "Quần jean slim fit xanh", Gia: 459000, SoLuong: 30, MoTa: "Co giãn nhẹ, tôn dáng, phong cách Hàn Quốc." },
    { MaSP: "SP003", TenSP: "Váy hoa vintage", Gia: 529000, SoLuong: 22, MoTa: "Thiết kế nữ tính, chất voan cao cấp." },
    { MaSP: "SP004", TenSP: "Áo khoác bomber đen", Gia: 699000, SoLuong: 18, MoTa: "Phong cách streetwear, giữ ấm tốt." },
    { MaSP: "SP005", TenSP: "Sơ mi linen be", Gia: 389000, SoLuong: 26, MoTa: "Thoáng mát, phù hợp mùa hè và công sở." },
    { MaSP: "SP006", TenSP: "Chân váy chữ A", Gia: 349000, SoLuong: 28, MoTa: "Dễ phối đồ, công sở năng động." },
    { MaSP: "SP007", TenSP: "Áo len cổ lọ", Gia: 429000, SoLuong: 20, MoTa: "Len mềm mại, giữ ấm mùa đông." },
    { MaSP: "SP008", TenSP: "Quần tây ống suông", Gia: 499000, SoLuong: 15, MoTa: "Phom dáng thanh lịch, vải chống nhăn." }
  ],
  DonHang: [
    { MaDH: "DH001", MaKH: "KH001", NgayDat: "2026-06-20", TongTien: 937000, TrangThai: "Chờ xác nhận" },
    { MaDH: "DH002", MaKH: "KH002", NgayDat: "2026-06-21", TongTien: 699000, TrangThai: "Đang giao" },
    { MaDH: "DH003", MaKH: "KH003", NgayDat: "2026-06-22", TongTien: 529000, TrangThai: "Hoàn thành" }
  ],
  ChiTietDonHang: [
    { MaCTDH: "CT001", MaDH: "DH001", MaSP: "SP001", SoLuong: 1, DonGia: 199000 },
    { MaCTDH: "CT002", MaDH: "DH001", MaSP: "SP005", SoLuong: 1, DonGia: 389000 },
    { MaCTDH: "CT003", MaDH: "DH001", MaSP: "SP006", SoLuong: 1, DonGia: 349000 },
    { MaCTDH: "CT004", MaDH: "DH002", MaSP: "SP004", SoLuong: 1, DonGia: 699000 },
    { MaCTDH: "CT005", MaDH: "DH003", MaSP: "SP003", SoLuong: 1, DonGia: 529000 }
  ],
  NhanVien: [
    { MaNV: "NV001", HoTen: "Phạm Thu Trang", SoDienThoai: "0933000111", DiaChi: "Cầu Giấy, Hà Nội" },
    { MaNV: "NV002", HoTen: "Đỗ Quốc Bảo", SoDienThoai: "0944000222", DiaChi: "Biên Hòa, Đồng Nai" }
  ]
};

const statusList = ["Chờ xác nhận", "Đang giao", "Hoàn thành"];

const imagePool = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1624378515194-6bbdb73f2194?auto=format&fit=crop&w=600&q=80"
];

const pageTitleMap = {
  dashboard: "Dashboard",
  products: "Quản lý sản phẩm",
  catalog: "Xem sản phẩm",
  "create-order": "Đặt hàng",
  orders: "Quản lý đơn hàng",
  customers: "Khách hàng",
  "my-orders": "Đơn hàng của tôi"
};

let db = loadDb();
ensureDefaultAccounts();
const state = { productKeyword: "", currentUser: null };

/* ─── DATA PERSISTENCE ─── */
function loadDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(defaultDb);
  } catch {
    return structuredClone(defaultDb);
  }
}

function saveDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function loadSession() {
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function ensureDefaultAccounts() {
  let changed = false;
  db.TaiKhoan = Array.isArray(db.TaiKhoan) ? db.TaiKhoan : [];
  db.KhachHang = Array.isArray(db.KhachHang) ? db.KhachHang : [];

  defaultDb.TaiKhoan.forEach((account) => {
    const existing = db.TaiKhoan.find((a) => a.TenDangNhap === account.TenDangNhap);
    if (existing) {
      if (account.MaKH && !existing.MaKH) {
        existing.MaKH = account.MaKH;
        changed = true;
      }
      return;
    }
    db.TaiKhoan.push(structuredClone(account));
    changed = true;
  });

  defaultDb.KhachHang.forEach((customer) => {
    if (!db.KhachHang.some((c) => c.MaKH === customer.MaKH)) {
      db.KhachHang.push(structuredClone(customer));
      changed = true;
    }
  });

  if (changed) saveDb();
}

/* ─── UTILITIES ─── */
function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")} đ`;
}

function getCustomerById(id) {
  return db.KhachHang.find((c) => c.MaKH === id);
}

function isCustomer() {
  return Boolean(state.currentUser?.MaKH);
}

function getProductImage(index) {
  return imagePool[index % imagePool.length];
}

function generateCode(prefix, list, key) {
  const max = list.reduce((m, item) => {
    const n = Number(String(item[key]).replace(prefix, "")) || 0;
    return Math.max(m, n);
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

/* ─── VFX: PARTICLE SYSTEM ─── */
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.resize();
    this.init();
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 38 : 350
      });
    }
  }

  animate() {
    const { ctx, canvas, particles, mouse } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.x -= dx * 0.002;
        p.y -= dy * 0.002;
      }

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 169, 110, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ─── VFX HELPERS ─── */
function cameraShake(el) {
  el.classList.remove("camera-shake");
  void el.offsetWidth;
  el.classList.add("camera-shake");
  setTimeout(() => el.classList.remove("camera-shake"), 500);
}

function motionBlurBrief(el) {
  el.classList.add("motion-blur-active");
  setTimeout(() => el.classList.remove("motion-blur-active"), 300);
}

function animateCounter(el, target, isCurrency) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(from + (target - from) * eased);
    el.textContent = isCurrency ? formatCurrency(current) : current.toLocaleString("vi-VN");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

let toastTimer;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  document.getElementById("toastMessage").textContent = message;
  document.getElementById("toastIcon").textContent = type === "success" ? "✓" : "✕";
  toast.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}

function openDetailModal(html) {
  document.getElementById("detailContent").innerHTML = html;
  document.getElementById("detailModal").classList.remove("hidden");
}

function closeDetailModal() {
  document.getElementById("detailModal").classList.add("hidden");
}

/* ─── DOM REFS ─── */
const ui = {
  homePage: document.getElementById("homePage"),
  loginPage: document.getElementById("loginPage"),
  registerPage: document.getElementById("registerPage"),
  appLayout: document.getElementById("appLayout"),
  loginForm: document.getElementById("loginForm"),
  loginError: document.getElementById("loginError"),
  registerForm: document.getElementById("registerForm"),
  registerError: document.getElementById("registerError"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  regUsername: document.getElementById("regUsername"),
  regPassword: document.getElementById("regPassword"),
  regConfirmPassword: document.getElementById("regConfirmPassword"),
  regFullName: document.getElementById("regFullName"),
  regPhone: document.getElementById("regPhone"),
  regAddress: document.getElementById("regAddress"),
  logoutBtn: document.getElementById("logoutBtn"),
  userRole: document.getElementById("userRole"),
  welcomeText: document.getElementById("welcomeText"),
  menuItems: [...document.querySelectorAll(".menu-item")],
  pageTitle: document.getElementById("pageTitle"),
  pages: [...document.querySelectorAll(".page")],
  totalProducts: document.getElementById("totalProducts"),
  totalOrders: document.getElementById("totalOrders"),
  totalCustomers: document.getElementById("totalCustomers"),
  totalRevenue: document.getElementById("totalRevenue"),
  recentOrders: document.getElementById("recentOrders"),
  topProducts: document.getElementById("topProducts"),
  productsTableBody: document.getElementById("productsTableBody"),
  productSearch: document.getElementById("productSearch"),
  addProductBtn: document.getElementById("addProductBtn"),
  productModal: document.getElementById("productModal"),
  productModalTitle: document.getElementById("productModalTitle"),
  productForm: document.getElementById("productForm"),
  productId: document.getElementById("productId"),
  productCode: document.getElementById("productCode"),
  productName: document.getElementById("productName"),
  productPrice: document.getElementById("productPrice"),
  productStock: document.getElementById("productStock"),
  productDesc: document.getElementById("productDesc"),
  productError: document.getElementById("productError"),
  cancelProductBtn: document.getElementById("cancelProductBtn"),
  catalogGrid: document.getElementById("catalogGrid"),
  orderForm: document.getElementById("orderForm"),
  orderProduct: document.getElementById("orderProduct"),
  orderQuantity: document.getElementById("orderQuantity"),
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  orderTotal: document.getElementById("orderTotal"),
  orderError: document.getElementById("orderError"),
  ordersTableBody: document.getElementById("ordersTableBody"),
  myOrdersTableBody: document.getElementById("myOrdersTableBody"),
  customersTableBody: document.getElementById("customersTableBody"),
  closeDetailBtn: document.getElementById("closeDetailBtn"),
  adminOnlyItems: [...document.querySelectorAll(".admin-only")],
  customerOnlyItems: [...document.querySelectorAll(".customer-only")],
  goLoginBtn: document.getElementById("goLoginBtn"),
  heroLoginBtn: document.getElementById("heroLoginBtn"),
  ctaLoginBtn: document.getElementById("ctaLoginBtn"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  goToRegisterBtn: document.getElementById("goToRegisterBtn"),
  backToLoginBtn: document.getElementById("backToLoginBtn"),
  homeFeaturedGrid: document.getElementById("homeFeaturedGrid"),
  homeStatProducts: document.getElementById("homeStatProducts"),
  userRole: document.getElementById("userRole"),
  welcomeText: document.getElementById("welcomeText")
};

/* ─── RENDER FUNCTIONS ─── */
function renderHomeFeatured() {
  if (!ui.homeFeaturedGrid) return;
  const featured = db.SanPham.slice(0, 4);
  ui.homeFeaturedGrid.innerHTML = featured
    .map(
      (p, i) => `
    <article class="home-featured-card glass-panel">
      <img src="${getProductImage(i)}" alt="${escapeHtml(p.TenSP)}" loading="lazy" />
      <div class="home-featured-body">
        <h4>${escapeHtml(p.TenSP)}</h4>
        <div class="featured-price">${formatCurrency(p.Gia)}</div>
      </div>
    </article>`
    )
    .join("");
  if (ui.homeStatProducts) {
    ui.homeStatProducts.textContent = `${db.SanPham.length}+`;
  }
}

function showLoginPage() {
  ui.homePage.classList.add("hidden");
  ui.registerPage.classList.add("hidden");
  ui.loginPage.classList.remove("hidden");
  ui.loginError.textContent = "";
  ui.registerError.textContent = "";
  motionBlurBrief(ui.loginPage);
}

function showRegisterPage() {
  ui.homePage.classList.add("hidden");
  ui.loginPage.classList.add("hidden");
  ui.registerPage.classList.remove("hidden");
  ui.loginError.textContent = "";
  ui.registerError.textContent = "";
  motionBlurBrief(ui.registerPage);
}

function showHomePage() {
  ui.loginPage.classList.add("hidden");
  ui.registerPage.classList.add("hidden");
  ui.appLayout.classList.add("hidden");
  ui.homePage.classList.remove("hidden");
  ui.loginForm.reset();
  ui.registerForm.reset();
  renderHomeFeatured();
}

function renderDashboard() {
  const revenue = db.DonHang.reduce((s, o) => s + Number(o.TongTien), 0);
  animateCounter(ui.totalProducts, db.SanPham.length, false);
  animateCounter(ui.totalOrders, db.DonHang.length, false);
  animateCounter(ui.totalCustomers, db.KhachHang.length, false);
  animateCounter(ui.totalRevenue, revenue, true);

  const recent = [...db.DonHang].sort((a, b) => b.NgayDat.localeCompare(a.NgayDat)).slice(0, 5);
  ui.recentOrders.innerHTML = recent.length
    ? recent.map((o) => {
        const kh = getCustomerById(o.MaKH);
        return `<div class="recent-item" style="cursor:pointer" onclick="viewOrder('${o.MaDH}')"><span>${o.MaDH} — ${kh ? kh.HoTen : "?"}</span><span>${formatCurrency(o.TongTien)}</span></div>`;
      }).join("")
    : '<p style="color:var(--text-muted)">Chưa có đơn hàng</p>';

  const salesMap = {};
  db.ChiTietDonHang.forEach((ct) => {
    salesMap[ct.MaSP] = (salesMap[ct.MaSP] || 0) + ct.SoLuong;
  });
  const top = Object.entries(salesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  ui.topProducts.innerHTML = top.length
    ? top.map(([maSP, qty]) => {
        const sp = db.SanPham.find((p) => p.MaSP === maSP);
        return `<div class="recent-item" style="cursor:pointer" onclick="viewProductDetail('${maSP}')"><span>${sp ? sp.TenSP : maSP}</span><span>${qty} đã bán</span></div>`;
      }).join("")
    : '<p style="color:var(--text-muted)">Chưa có dữ liệu</p>';
}

function renderProducts() {
  const kw = state.productKeyword.trim().toLowerCase();
  const filtered = db.SanPham.filter((p) => {
    if (!kw) return true;
    return p.TenSP.toLowerCase().includes(kw) || p.MaSP.toLowerCase().includes(kw);
  });

  ui.productsTableBody.innerHTML = filtered.length
    ? filtered.map((p) => `
      <tr>
        <td><strong>${escapeHtml(p.MaSP)}</strong></td>
        <td>${escapeHtml(p.TenSP)}</td>
        <td>${formatCurrency(p.Gia)}</td>
        <td>${p.SoLuong}</td>
        <td>${escapeHtml(p.MoTa)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-ghost btn-sm" onclick="openEditProduct('${p.MaSP}')">Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.MaSP}')">Xóa</button>
          </div>
        </td>
      </tr>`).join("")
    : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">Không tìm thấy sản phẩm</td></tr>';
}

function renderCatalog() {
  ui.catalogGrid.innerHTML = db.SanPham.map((p, i) => {
    const img = getProductImage(i);
    const stockClass = p.SoLuong > 10 ? "stock-ok" : "stock-low";
    const stockText = p.SoLuong > 10 ? `Còn ${p.SoLuong} sp` : `Sắp hết (${p.SoLuong})`;
    return `
      <article class="product-card glass-panel" onclick="viewProductDetail('${p.MaSP}')">
        <div class="card-image-wrap">
          <img src="${img}" alt="${escapeHtml(p.TenSP)}" loading="lazy" />
          <div class="card-overlay"></div>
          <div class="card-flare"></div>
        </div>
        <div class="product-body">
          <h4>${escapeHtml(p.TenSP)}</h4>
          <div class="product-code">${escapeHtml(p.MaSP)}</div>
          <p>${escapeHtml(p.MoTa)}</p>
          <div class="price">${formatCurrency(p.Gia)}</div>
          <span class="stock-badge ${stockClass}">${stockText}</span>
          <br/><br/>
          <button class="btn btn-primary btn-glow btn-sm" onclick="event.stopPropagation();goToOrder('${p.MaSP}')">
            <span>Xem chi tiết</span><div class="btn-shine"></div>
          </button>
        </div>
      </article>`;
  }).join("");
}

function renderOrderProductOptions() {
  ui.orderProduct.innerHTML = db.SanPham.map(
    (p) => `<option value="${p.MaSP}">${p.MaSP} — ${p.TenSP} (${formatCurrency(p.Gia)})</option>`
  ).join("");
}

function renderOrders() {
  if (isCustomer()) {
    ui.ordersTableBody.innerHTML = "";
    return;
  }

  ui.ordersTableBody.innerHTML = db.DonHang.length
    ? db.DonHang.map((o) => {
        const kh = getCustomerById(o.MaKH);
        const sc = o.TrangThai === "Hoàn thành" ? "done" : o.TrangThai === "Đang giao" ? "processing" : "pending";
        const opts = statusList.map((s) => `<option value="${s}" ${s === o.TrangThai ? "selected" : ""}>${s}</option>`).join("");
        return `
          <tr>
            <td><strong>${o.MaDH}</strong></td>
            <td>${kh ? escapeHtml(kh.HoTen) : "—"}</td>
            <td>${o.NgayDat}</td>
            <td>${formatCurrency(o.TongTien)}</td>
            <td><span class="status ${sc}">${o.TrangThai}</span></td>
            <td>
              <div class="table-actions">
                <button class="btn btn-ghost btn-sm" onclick="viewOrder('${o.MaDH}')">Xem</button>
                <select onchange="updateOrderStatus('${o.MaDH}', this.value)">${opts}</select>
                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${o.MaDH}')">Xóa</button>
              </div>
            </td>
          </tr>`;
      }).join("")
    : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">Chưa có đơn hàng</td></tr>';
}

function renderMyOrders() {
  if (!ui.myOrdersTableBody) return;
  const customerId = state.currentUser?.MaKH;
  if (!customerId) {
    ui.myOrdersTableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">Không có dữ liệu khách hàng</td></tr>';
    return;
  }

  const myOrders = db.DonHang.filter((o) => o.MaKH === customerId);
  ui.myOrdersTableBody.innerHTML = myOrders.length
    ? myOrders
        .map((o) => {
          const statusClass =
            o.TrangThai === "Hoàn thành" ? "done" : o.TrangThai === "Đang giao" ? "processing" : "pending";
          return `
      <tr>
        <td><strong>${o.MaDH}</strong></td>
        <td>${o.NgayDat}</td>
        <td>${formatCurrency(o.TongTien)}</td>
        <td><span class="status ${statusClass}">${o.TrangThai}</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="viewOrder('${o.MaDH}')">Xem</button></td>
      </tr>`;
        })
        .join("")
    : '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">Bạn chưa có đơn hàng</td></tr>';
}

function renderCustomers() {
  ui.customersTableBody.innerHTML = db.KhachHang.map((c) => `
    <tr>
      <td><strong>${escapeHtml(c.MaKH)}</strong></td>
      <td>${escapeHtml(c.HoTen)}</td>
      <td>${escapeHtml(c.SoDienThoai)}</td>
      <td>${escapeHtml(c.DiaChi)}</td>
    </tr>`).join("");
}

function recalcOrderTotal() {
  const p = db.SanPham.find((x) => x.MaSP === ui.orderProduct.value);
  const qty = Number(ui.orderQuantity.value) || 0;
  ui.orderTotal.textContent = formatCurrency(p ? p.Gia * qty : 0);
}

function switchPage(pageId) {
  motionBlurBrief(ui.appLayout);
  ui.pages.forEach((p) => p.classList.toggle("active", p.id === pageId));
  
  // Update both old menu items and new nav items
  ui.menuItems.forEach((m) => m.classList.toggle("active", m.dataset.page === pageId));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.page === pageId));
  
  ui.pageTitle.textContent = pageTitleMap[pageId] || "LumStore";

  // Show/hide customer guide based on user role and current page
  const customerGuide = document.getElementById("customerGuide");
  if (customerGuide) {
    if (isCustomer() && pageId === "catalog") {
      customerGuide.style.display = "block";
    } else {
      customerGuide.style.display = "none";
    }
  }
}

function openProductModal(isEdit, product) {
  ui.productModal.classList.remove("hidden");
  ui.productModalTitle.textContent = isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm";
  ui.productError.textContent = "";
  if (isEdit && product) {
    ui.productId.value = product.MaSP;
    ui.productCode.value = product.MaSP;
    ui.productCode.disabled = true;
    ui.productName.value = product.TenSP;
    ui.productPrice.value = product.Gia;
    ui.productStock.value = product.SoLuong;
    ui.productDesc.value = product.MoTa;
  } else {
    ui.productForm.reset();
    ui.productId.value = "";
    ui.productCode.value = generateCode("SP", db.SanPham, "MaSP");
    ui.productCode.disabled = false;
  }
}

function closeProductModal() {
  ui.productModal.classList.add("hidden");
}

function renderAll() {
  if (!isCustomer()) {
    renderDashboard();
    renderProducts();
    renderOrders();
    renderCustomers();
  }
  renderCatalog();
  renderOrderProductOptions();
  recalcOrderTotal();
  renderMyOrders();
  saveDb();
}

function showApp(user) {
  state.currentUser = user;
  ui.homePage.classList.add("hidden");
  ui.loginPage.classList.add("hidden");
  ui.appLayout.classList.remove("hidden");
  ui.userRole.textContent = user.VaiTro;
  ui.welcomeText.textContent = `Xin chào, ${user.TenDangNhap}!`;

  const customer = user.MaKH ? getCustomerById(user.MaKH) : null;
  if (customer) {
    ui.customerName.value = customer.HoTen;
    ui.customerPhone.value = customer.SoDienThoai;
    ui.customerName.readOnly = true;
    ui.customerPhone.readOnly = true;
  } else {
    ui.customerName.readOnly = false;
    ui.customerPhone.readOnly = false;
  }

  ui.adminOnlyItems.forEach((el) => el.classList.toggle("hidden", isCustomer()));
  ui.customerOnlyItems.forEach((el) => el.classList.toggle("hidden", !isCustomer()));

  switchPage(isCustomer() ? "catalog" : "dashboard");
  renderAll();
  cameraShake(ui.appLayout);
}

/* ─── EVENT HANDLERS ─── */
[ui.goLoginBtn, ui.heroLoginBtn, ui.ctaLoginBtn].forEach((btn) => {
  if (btn) btn.addEventListener("click", showLoginPage);
});

if (ui.backHomeBtn) {
  ui.backHomeBtn.addEventListener("click", showHomePage);
}

if (ui.goToRegisterBtn) {
  ui.goToRegisterBtn.addEventListener("click", showRegisterPage);
}

if (ui.backToLoginBtn) {
  ui.backToLoginBtn.addEventListener("click", showLoginPage);
}

// Homepage navigation buttons
document.querySelectorAll(".nav-link-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    const scrollTarget = btn.dataset.scroll;
    
    if (page === "dashboard" || page === "catalog") {
      // Navigate to login first, user will be redirected after login
      showLoginPage();
      showToast("Vui lòng đăng nhập để xem trang này", "success");
    } else if (scrollTarget) {
      // Scroll to target section on homepage
      const targetSection = document.getElementById(scrollTarget);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

ui.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = ui.username.value.trim();
  const pass = ui.password.value.trim();

  if (!user || !pass) {
    ui.loginError.textContent = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.";
    cameraShake(ui.loginForm);
    return;
  }

  const account = db.TaiKhoan.find((a) => a.TenDangNhap === user && a.MatKhau === pass);
  if (!account) {
    ui.loginError.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
    cameraShake(ui.loginForm);
    return;
  }

  ui.loginError.textContent = "";
  saveSession(account);
  showApp(account);
  showToast(`Chào mừng ${account.TenDangNhap}!`);
});

ui.registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = ui.regUsername.value.trim();
  const password = ui.regPassword.value.trim();
  const confirmPassword = ui.regConfirmPassword.value.trim();
  const fullName = ui.regFullName.value.trim();
  const phone = ui.regPhone.value.trim();
  const address = ui.regAddress.value.trim();

  if (!username || !password || !confirmPassword || !fullName || !phone || !address) {
    ui.registerError.textContent = "Vui lòng nhập đầy đủ thông tin.";
    cameraShake(ui.registerForm);
    return;
  }

  if (password.length < 6) {
    ui.registerError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
    cameraShake(ui.registerForm);
    return;
  }

  if (password !== confirmPassword) {
    ui.registerError.textContent = "Mật khẩu xác nhận không khớp.";
    cameraShake(ui.registerForm);
    return;
  }

  if (db.TaiKhoan.some((a) => a.TenDangNhap === username)) {
    ui.registerError.textContent = "Tên đăng nhập đã tồn tại.";
    cameraShake(ui.registerForm);
    return;
  }

  const newCustomerId = generateCode("KH", db.KhachHang, "MaKH");
  const newAccountId = generateCode("TK", db.TaiKhoan, "MaTK");

  const newCustomer = {
    MaKH: newCustomerId,
    HoTen: fullName,
    SoDienThoai: phone,
    DiaChi: address
  };

  const newAccount = {
    MaTK: newAccountId,
    TenDangNhap: username,
    MatKhau: password,
    VaiTro: "Khách hàng",
    MaKH: newCustomerId
  };

  db.KhachHang.push(newCustomer);
  db.TaiKhoan.push(newAccount);
  saveDb();

  ui.registerError.textContent = "";
  ui.registerForm.reset();
  showToast("Đăng ký thành công! Đang đăng nhập...");
  
  setTimeout(() => {
    saveSession(newAccount);
    showApp(newAccount);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 800);
});

ui.logoutBtn.addEventListener("click", () => {
  clearSession();
  state.currentUser = null;
  ui.customerName.readOnly = false;
  ui.customerPhone.readOnly = false;
  showHomePage();
  showToast("Đã đăng xuất", "error");
});

// Handle both .menu-item and .nav-item clicks
document.querySelectorAll(".menu-item, .nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;
    if (page) switchPage(page);
  });
});

ui.productSearch.addEventListener("input", (e) => {
  state.productKeyword = e.target.value;
  renderProducts();
});

ui.addProductBtn.addEventListener("click", () => openProductModal(false));
ui.cancelProductBtn.addEventListener("click", closeProductModal);
ui.closeDetailBtn.addEventListener("click", closeDetailModal);

ui.productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const currentId = ui.productId.value;
  const product = {
    MaSP: ui.productCode.value.trim(),
    TenSP: ui.productName.value.trim(),
    Gia: Number(ui.productPrice.value),
    SoLuong: Number(ui.productStock.value),
    MoTa: ui.productDesc.value.trim()
  };

  if (!product.MaSP || !product.TenSP || product.Gia <= 0 || product.SoLuong < 0 || !product.MoTa) {
    ui.productError.textContent = "Vui lòng nhập đầy đủ thông tin sản phẩm hợp lệ.";
    return;
  }

  if (!currentId) {
    if (db.SanPham.some((p) => p.MaSP === product.MaSP)) {
      ui.productError.textContent = "Mã sản phẩm đã tồn tại.";
      return;
    }
    db.SanPham.push(product);
    showToast("Đã thêm sản phẩm mới!");
  } else {
    const idx = db.SanPham.findIndex((p) => p.MaSP === currentId);
    db.SanPham[idx] = product;
    showToast("Đã cập nhật sản phẩm!");
  }

  closeProductModal();
  renderAll();
});

ui.orderProduct.addEventListener("change", recalcOrderTotal);
ui.orderQuantity.addEventListener("input", recalcOrderTotal);

ui.orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ui.orderError.textContent = "";

  const product = db.SanPham.find((p) => p.MaSP === ui.orderProduct.value);
  const qty = Number(ui.orderQuantity.value);
  const name = ui.customerName.value.trim();
  const phone = ui.customerPhone.value.trim();

  if (!product || qty <= 0 || !name || !phone) {
    ui.orderError.textContent = "Vui lòng nhập đủ thông tin đặt hàng hợp lệ.";
    return;
  }
  if (product.SoLuong < qty) {
    ui.orderError.textContent = "Số lượng tồn kho không đủ để đặt hàng.";
    return;
  }

  let customer = isCustomer() && state.currentUser?.MaKH
    ? getCustomerById(state.currentUser.MaKH)
    : db.KhachHang.find((c) => c.SoDienThoai === phone);
  if (!customer) {
    customer = { MaKH: generateCode("KH", db.KhachHang, "MaKH"), HoTen: name, SoDienThoai: phone, DiaChi: "Chưa cập nhật" };
    db.KhachHang.push(customer);
  }

  const orderId = generateCode("DH", db.DonHang, "MaDH");
  const detailId = generateCode("CT", db.ChiTietDonHang, "MaCTDH");
  const total = product.Gia * qty;

  db.DonHang.push({ MaDH: orderId, MaKH: customer.MaKH, NgayDat: new Date().toISOString().slice(0, 10), TongTien: total, TrangThai: "Chờ xác nhận" });
  db.ChiTietDonHang.push({ MaCTDH: detailId, MaDH: orderId, MaSP: product.MaSP, SoLuong: qty, DonGia: product.Gia });
  product.SoLuong -= qty;

  ui.orderForm.reset();
  ui.orderQuantity.value = 1;
  renderAll();
  cameraShake(ui.appLayout);
  showToast(`Đặt hàng thành công! Mã: ${orderId}`);
});

/* ─── GLOBAL ACTIONS ─── */
window.openEditProduct = function (id) {
  if (isCustomer()) {
    showToast("Bạn không có quyền sửa sản phẩm", "error");
    return;
  }
  const p = db.SanPham.find((x) => x.MaSP === id);
  if (p) openProductModal(true, p);
};

window.deleteProduct = function (id) {
  if (isCustomer()) {
    showToast("Bạn không có quyền xóa sản phẩm", "error");
    return;
  }
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  db.SanPham = db.SanPham.filter((p) => p.MaSP !== id);
  db.ChiTietDonHang = db.ChiTietDonHang.filter((ct) => ct.MaSP !== id);
  renderAll();
  showToast("Đã xóa sản phẩm", "error");
};

window.viewProductDetail = function (id) {
  const p = db.SanPham.find((x) => x.MaSP === id);
  if (!p) return;
  const idx = db.SanPham.indexOf(p);
  openDetailModal(`
    <img class="detail-product-img" src="${getProductImage(idx)}" alt="${escapeHtml(p.TenSP)}" />
    <div class="detail-info">
      <div class="product-code">${escapeHtml(p.MaSP)}</div>
      <h3>${escapeHtml(p.TenSP)}</h3>
      <div class="detail-price">${formatCurrency(p.Gia)}</div>
      <p>${escapeHtml(p.MoTa)}</p>
      <p>Tồn kho: <strong>${p.SoLuong}</strong> sản phẩm</p>
      <button class="btn btn-primary btn-glow" onclick="closeDetailModal();goToOrder('${p.MaSP}')">
        <span>Đặt hàng ngay</span><div class="btn-shine"></div>
      </button>
    </div>`);
};

window.goToOrder = function (id) {
  switchPage("create-order");
  ui.orderProduct.value = id;
  recalcOrderTotal();
};

window.viewOrder = function (id) {
  const order = db.DonHang.find((o) => o.MaDH === id);
  if (!order) return;
  if (isCustomer() && order.MaKH !== state.currentUser?.MaKH) {
    showToast("Bạn chỉ xem được đơn của chính mình", "error");
    return;
  }
  const kh = getCustomerById(order.MaKH);
  const details = db.ChiTietDonHang.filter((ct) => ct.MaDH === id);
  const items = details.map((d) => {
    const sp = db.SanPham.find((p) => p.MaSP === d.MaSP);
    return `<li>${sp ? escapeHtml(sp.TenSP) : d.MaSP} — SL: ${d.SoLuong} × ${formatCurrency(d.DonGia)}</li>`;
  }).join("");

  openDetailModal(`
    <div class="detail-info">
      <h3>Đơn hàng ${order.MaDH}</h3>
      <p><strong>Khách hàng:</strong> ${kh ? escapeHtml(kh.HoTen) : "—"}</p>
      <p><strong>SĐT:</strong> ${kh ? escapeHtml(kh.SoDienThoai) : "—"}</p>
      <p><strong>Ngày đặt:</strong> ${order.NgayDat}</p>
      <p><strong>Trạng thái:</strong> ${order.TrangThai}</p>
      <div class="detail-price">${formatCurrency(order.TongTien)}</div>
      <h4>Chi tiết sản phẩm:</h4>
      <ul class="detail-order-list">${items}</ul>
    </div>`);
};

window.updateOrderStatus = function (id, status) {
  if (isCustomer()) {
    showToast("Bạn không có quyền cập nhật trạng thái đơn", "error");
    return;
  }
  const order = db.DonHang.find((o) => o.MaDH === id);
  if (!order) return;
  order.TrangThai = status;
  saveDb();
  renderOrders();
  showToast(`Cập nhật trạng thái: ${status}`);
};

window.deleteOrder = function (id) {
  if (isCustomer()) {
    showToast("Bạn không có quyền xóa đơn hàng", "error");
    return;
  }
  if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
  db.DonHang = db.DonHang.filter((o) => o.MaDH !== id);
  db.ChiTietDonHang = db.ChiTietDonHang.filter((ct) => ct.MaDH !== id);
  renderAll();
  showToast("Đã xóa đơn hàng", "error");
};

window.closeDetailModal = closeDetailModal;

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Optional: stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-reveal class
  document.querySelectorAll(".scroll-reveal").forEach((el) => {
    observer.observe(el);
  });
}

/* ─── INIT ─── */
const particleCanvas = document.getElementById("particleCanvas");
if (particleCanvas) new ParticleEngine(particleCanvas);

const session = loadSession();
if (session) {
  const account = db.TaiKhoan.find((a) => a.MaTK === session.MaTK);
  if (account) showApp(account);
} else {
  renderHomeFeatured();
}

// Initialize scroll animations
initScrollAnimations();

document.querySelectorAll(".modal-backdrop").forEach((el) => {
  el.addEventListener("click", () => {
    closeProductModal();
    closeDetailModal();
  });
});
