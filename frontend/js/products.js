const products = [
  {
    id: 1,
    name: "Thuốc Panadol cảm cúm giảm các triệu chứng sốt đau",
    sku: "PAN001",
    price: 200000,
    cost_price: 180000,
    stock_quantity: 50,
    category: "pain",
    is_prescription: false,
    image_url: "./assets/img/product1.jpg",
    is_active: true,
    unit: "Hộp",
    package_info: "Hộp 15 vỉ x 12 viên",
    ingredients: "Paracetamol 500mg",
    usage: "Người lớn: 1-2 viên mỗi 4-6 giờ khi cần thiết. Tối đa 8 viên/ngày",
    side_effects: "Hiếm khi xảy ra, có thể gây buồn nôn, phát ban da",
    manufacturer: "Công ty Dược phẩm GlaxoSmithKline",
    expiry_date: "12/2027",
    description:
      "Giảm đau, hạ sốt hiệu quả cho các triệu chứng cảm cúm thông thường",
  },
  {
    id: 2,
    name: "Thuốc Lorastad D trị viêm mũi dị ứng, mày đay",
    sku: "LOR002",
    price: 40000,
    cost_price: 30000,
    stock_quantity: 30,
    category: "allergy",
    is_prescription: true,
    image_url: "./assets/img/product2.jpg",
    is_active: true,
    unit: "Hộp",
    package_info: "Hộp 3 vỉ x 10 viên",
    ingredients: "Loratadine 10mg",
    usage: "Người lớn và trẻ em trên 12 tuổi: 1 viên/ngày",
    side_effects: "Buồn ngủ nhẹ, khô miệng, nhức đầu",
    manufacturer: "Công ty Cổ phần Dược phẩm Stada",
    expiry_date: "06/2027",
    description:
      "Điều trị viêm mũi dị ứng, mày đay và các triệu chứng dị ứng khác",
  },
  {
    id: 3,
    name: "Viên sủi Efferalgan 500mg giúp giảm đau, hạ sốt",
    sku: "EFF003",
    price: 45000,
    cost_price: 28000,
    stock_quantity: 25,
    category: "pain",
    is_prescription: false,
    image_url: "./assets/img/product3.jpg",
    is_active: true,
    unit: "Hộp",
    package_info: "4 vỉ * 4 viên",
    ingredients: "Paracetamol 500mg",
    usage: "Hòa tan 1 viên trong 1 ly nước, uống mỗi 4-6 giờ khi cần",
    side_effects: "Buồn nôn, đau bụng trong trường hợp hiếm",
    manufacturer: "Công ty Dược phẩm Bristol-Myers Squibb",
    expiry_date: "10/2025",
    description: "Giảm đau, hạ sốt nhanh chóng với dạng sủi dễ uống",
  },
  {
    id: 4,
    name: "Thuốc Berberin trị tiêu chảy, kiết lỵ",
    sku: "BER004",
    price: 100000,
    cost_price: 60000,
    stock_quantity: 40,
    category: "digestive",
    is_prescription: false,
    image_url: "./assets/img/product4.jpg",
    is_active: true,
    unit: "Hộp",
    package_info: "Hộp 10 vỉ x 10 viên",
    ingredients: "Berberin chloride 50mg",
    usage:
      "Người lớn: 2-4 viên/lần, 2 lần/ngày. Trẻ em: 1-2 viên/lần, 2 lần/ngày",
    side_effects: "Táo bón nhẹ, vàng nước tiểu",
    manufacturer: "Công ty Cổ phần Dược phẩm Trung ương 3",
    expiry_date: "03/2026",
    description: "Điều trị tiêu chảy, kiết lỵ cấp và mãn tính",
  },
  {
    id: 5,
    name: "Gạc y tế Bảo Thạch túi 10 miếng",
    sku: "GAC005",
    price: 15000,
    cost_price: 10000,
    stock_quantity: 100,
    category: "firstaid",
    is_prescription: false,
    image_url: "./assets/img/product5.jpg",
    is_active: true,
    unit: "túi",
    package_info: "5cm x 6.5cm x 12 lớp",
    ingredients: "Vải không dệt, bông thấm hút",
    usage: "Dùng để băng bó vết thương, thấm dịch",
    side_effects: "Không có tác dụng phụ",
    manufacturer: "Công ty TNHH Thiết bị Y tế Bảo Thạch",
    expiry_date: "12/2027",
    description: "Gạc y tế vô trùng dùng để băng bó vết thương",
  },
  {
    id: 6,
    name: "Kem dưỡng ẩm CeraVe phục hồi cho da khô và nhạy cảm",
    sku: "KEM006",
    price: 140000,
    cost_price: 112000,
    stock_quantity: 20,
    category: "cosmetics",
    is_prescription: false,
    image_url: "./assets/img/product6.jpg",
    is_active: true,
    unit: "Tuýp",
    package_info: "Tuýp 100g",
    ingredients: "Ceramide, Hyaluronic Acid, Glycerin",
    usage: "Thoa đều lên da sạch 2 lần/ngày, sáng và tối",
    side_effects: "Hiếm khi gây kích ứng da",
    manufacturer: "Công ty Dược mỹ phẩm CeraVe",
    expiry_date: "08/2027",
    description: "Kem dưỡng ẩm chuyên sâu cho da khô và nhạy cảm",
  },
  {
    id: 7,
    name: "Vitamin tổng hợp Centrum Silver Adults cho người trưởng thành 50+",
    sku: "VIT007",
    price: 600000,
    cost_price: 480000,
    stock_quantity: 15,
    category: "supplements",
    is_prescription: false,
    image_url: "./assets/img/product7.jpg",
    is_active: true,
    unit: "Lọ",
    package_info: "325 viên của Mỹ",
    ingredients: "Vitamin A, C, D, E, B1, B2, B6, B12, Canxi, Sắt, Kẽm, Selen",
    usage: "Uống 1 viên/ngày sau bữa ăn",
    side_effects: "Nước tiểu có thể chuyển màu vàng do vitamin B2",
    manufacturer: "Pfizer Consumer Healthcare (Mỹ)",
    expiry_date: "11/2026",
    description:
      "Bổ sung vitamin và khoáng chất cho người trưởng thành trên 50 tuổi",
  },
  {
    id: 8,
    name: "Nhiệt kế điện tử đo trán không tiếp xúc",
    sku: "NHI008",
    price: 350000,
    cost_price: 280000,
    stock_quantity: 30,
    category: "equipment",
    is_prescription: false,
    image_url: "./assets/img/product8.jpg",
    is_active: true,
    unit: "Cái",
    package_info: "Đo trán không tiếp xúc",
    ingredients: "Không áp dụng",
    usage: "Hướng về trán, cách 3-5cm, nhấn nút đo",
    side_effects: "Không có",
    manufacturer: "Công ty TNHH Thiết bị Y tế Omron",
    expiry_date: "05/2028",
    description:
      "Nhiệt kế hồng ngoại đo trán không tiếp xúc, cho kết quả nhanh trong 1 giây",
  },
  {
    id: 9,
    name: "Thuốc bôi Tinfozol điều trị nhiễm trùng da, viêm da",
    sku: "TIN009",
    price: 95000,
    cost_price: 76000,
    stock_quantity: 35,
    category: "skin",
    is_prescription: false,
    image_url: "./assets/img/product9.jpg",
    is_active: true,
    unit: "Tuýp",
    package_info: "Tuýp 10g",
    ingredients: "Fusidic Acid 2%, Betamethasone Valerate 0.1%",
    usage:
      "Bôi một lớp mỏng lên vùng da tổn thương 2 lần/ngày (sáng và tối). Các bước sử dụng: Vệ sinh vùng da cần điều trị, lau khô. Lấy một lượng thuốc vừa đủ thoa đều lên da. Massage nhẹ nhàng cho thuốc thấm đều.",
    side_effects:
      "Có thể gây kích ứng nhẹ, khô da, nóng rát tại chỗ trong một số trường hợp",
    manufacturer: "Công ty Dược phẩm Engelhard Arzneimittel (Đức)",
    expiry_date: "09/2027",
    description:
      "Thuốc Tinfozol được chỉ định điều trị các nhiễm trùng da do vi khuẩn và tình trạng viêm da như viêm da tiết bã, viêm da tiếp xúc, chàm, vẩy nến và các tổn thương da có nhiễm khuẩn.",
  },
  {
    id: 10,
    name: "Kem chống nắng dạng sữa SPF 50+ PA++++",
    sku: "KEM010",
    price: 400000,
    cost_price: 2900000,
    stock_quantity: 25,
    category: "cosmetics",
    is_prescription: false,
    image_url: "./assets/img/product10.jpg",
    is_active: true,
    unit: "Chai",
    package_info: "Chai 50g",
    ingredients: "Ethylhexyl Methoxycinnamate, Zinc Oxide, Titanium Dioxide",
    usage: "Thoa đều lên da 15-20 phút trước khi ra nắng, thoa lại sau 2-3 giờ",
    side_effects: "Có thể gây bít lỗ chân lông với da dầu",
    manufacturer: "Công ty Mỹ phẩm La Roche-Posay",
    expiry_date: "07/2026",
    description: "Kem chống nắng bảo vệ da toàn diện khỏi tia UVA/UVB",
  },
  {
    id: 11,
    name: "Dầu gió xanh nguyên chất giảm đau nhức",
    sku: "DAU011",
    price: 35000,
    cost_price: 28000,
    stock_quantity: 60,
    category: "pain",
    is_prescription: false,
    image_url: "./assets/img/product11.jpg",
    is_active: true,
    unit: "Chai",
    package_info: "Chai 20ml",
    ingredients: "Menthol, Methyl Salicylate, Camphor, Eucalyptus Oil",
    usage: "Thoa một lượng nhỏ lên vùng da bị đau nhức, xoa bóp nhẹ nhàng",
    side_effects: "Kích ứng da ở người nhạy cảm",
    manufacturer: "Công ty Cổ phần Dược phẩm OPC",
    expiry_date: "12/2028",
    description: "Dầu gió giảm đau nhức, cảm mạo, sổ mũi",
  },
  {
    id: 12,
    name: "Băng cá nhân không thấm nước bảo vệ vết thương",
    sku: "BAN012",
    price: 55000,
    cost_price: 44000,
    stock_quantity: 80,
    category: "firstaid",
    is_prescription: false,
    image_url: "./assets/img/product12.jpg",
    is_active: true,
    unit: "Hộp",
    package_info: "Hộp 100 miếng",
    ingredients: "Vải không dệt, keo y tế, miếng pad kháng khuẩn",
    usage: "Dán trực tiếp lên vết thương sạch",
    side_effects: "Kích ứng da ở người nhạy cảm với keo dán",
    manufacturer: "Công ty TNHH Thiết bị Y tế Bandaid",
    expiry_date: "10/2027",
    description: "Băng cá nhân không thấm nước, bảo vệ vết thương hiệu quả",
  },
];

// Hàm lấy sản phẩm theo ID
function getProductById(id) {
  return products.find((product) => product.id === parseInt(id));
}

// Hàm lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
  if (category === "all") return products;
  if (category === "others") {
    return products.filter(
      (product) => !["pain", "allergy", "firstaid"].includes(product.category)
    );
  }
  return products.filter((product) => product.category === category);
}

// Hàm lấy sản phẩm bán chạy (giả định)
function getBestSellers() {
  return products.filter((product) =>
    [1, 2, 3, 9, 10, 11].includes(product.id)
  );
}

// Hàm định dạng giá
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Hàm thêm vào giỏ hàng
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === parseInt(productId));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = getProductById(productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        unit: product.unit,
        quantity: 1,
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Đã thêm sản phẩm vào giỏ hàng!");
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
  });
}

// Hàm hiển thị thông báo
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: all 0.3s ease;
`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Hàm hiển thị sản phẩm theo danh mục
function displayProducts(category = "all") {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : category === "others"
      ? getProductsByCategory("others")
      : products.filter((product) => product.category === category);

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--muted);">
        <div style="font-size: 48px; margin-bottom: 16px;">😔</div>
        <h3>Không có sản phẩm nào</h3>
        <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
    </div>
    `;
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "grid-product-card";
    productCard.setAttribute("data-id", product.id);
    productCard.innerHTML = `
    ${
      product.is_prescription
        ? '<div class="prescription-badge">Kê đơn</div>'
        : ""
    }
    <img src="${product.image_url}" alt="${
      product.name
    }" class="grid-product-img">
    <div class="grid-product-info">
        <div class="grid-product-title">${product.name}</div>
        <div class="grid-product-price">${formatPrice(product.price)}</div>
        <div class="grid-product-meta">
        <span class="stock-info ${getStockClass(product.stock_quantity)}">
            ${getStockText(product.stock_quantity)}
        </span>
        <span class="unit-info">${product.unit}</span>
        </div>
        <div class="grid-product-actions">
        <button class="add-to-cart-btn" data-id="${product.id}" ${
      product.stock_quantity === 0 ? "disabled" : ""
    }>
            ${product.stock_quantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
        </div>
    </div>
    `;

    productsGrid.appendChild(productCard);
  });

  // Gắn sự kiện cho nút thêm vào giỏ hàng
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const productId = this.getAttribute("data-id");
      addToCart(productId);
    });
  });

  // Gắn sự kiện click cho card sản phẩm
  initProductCardClicks();
}

// Hàm hiển thị sản phẩm bán chạy
function displayBestSellers() {
  const container = document.getElementById("best-sellers-container");
  if (!container) return;

  const bestSellers = getBestSellers();

  container.innerHTML = bestSellers
    .map(
      (product) => `
        <div class="product-card" data-product="${product.id}">
        <img src="${product.image_url}" alt="${product.name}">
        <div class="pc-title">${product.name}</div>
        <div class="pc-sub muted">${formatPrice(product.price)} • ${
        product.unit
      }</div>
        </div>
    `
    )
    .join("");

  // Thêm sự kiện click cho sản phẩm bán chạy
  container.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      window.location.href = `product_detail.html?id=${productId}`;
    });
  });
}

// Hàm xử lý scroll cho best sellers
function initScrollButtons() {
  const container = document.getElementById("best-sellers-container");
  const leftBtn = document.querySelector('.scroll-btn[data-dir="left"]');
  const rightBtn = document.querySelector('.scroll-btn[data-dir="right"]');

  if (!container || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -300, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    container.scrollBy({ left: 300, behavior: "smooth" });
  });
}

// Hàm trợ giúp - Lấy class cho hiển thị tồn kho
function getStockClass(quantity) {
  if (quantity === 0) return "stock-out";
  if (quantity < 10) return "stock-low";
  return "stock-in";
}

// Hàm trợ giúp - Lấy text cho hiển thị tồn kho
function getStockText(quantity) {
  if (quantity === 0) return "Hết hàng";
  if (quantity < 10) return `Còn ${quantity} sản phẩm`;
  return "Còn hàng";
}

// Hàm xử lý click vào card sản phẩm
function initProductCardClicks() {
  document.querySelectorAll(".grid-product-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Nếu người dùng click vào nút thêm vào giỏ, thì không chuyển trang
      if (e.target.closest(".add-to-cart-btn")) {
        return;
      }
      const productId = this.getAttribute("data-id");
      window.location.href = `product_detail.html?id=${productId}`;
    });
  });
}

// Khởi tạo khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  // Chỉ chạy các hàm này nếu đang ở trang products
  if (document.getElementById("products-grid")) {
    displayProducts();
    displayBestSellers();
    initScrollButtons();

    // Xử lý click vào danh mục
    document.querySelectorAll(".cat-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        const category = this.getAttribute("data-category");
        displayProducts(category);

        // Thêm class active cho danh mục được chọn
        document.querySelectorAll(".cat-card").forEach((c) => {
          c.classList.remove("active");
        });
        this.classList.add("active");
      });
    });

    // Xử lý nút "Xem tất cả sản phẩm"
    const viewAllBtn = document.getElementById("view-all-products");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", function (e) {
        e.preventDefault();
        displayProducts("all");
        document.querySelectorAll(".cat-card").forEach((c) => {
          c.classList.remove("active");
        });
      });
    }
  }

  // Luôn cập nhật số lượng giỏ hàng
  updateCartCount();
});
