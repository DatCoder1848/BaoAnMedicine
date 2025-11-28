import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductService } from "../../services/productService";
import { Product } from "../../types/product";

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  // 1. STATE QUẢN LÝ DỮ LIỆU TỪ API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State bộ lọc giao diện
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả sản phẩm" },
    { id: "prescription", name: "Thuốc kê đơn" }, // Cần map với CategoryId của DB sau này
    { id: "otc", name: "Thuốc không kê đơn" },
    { id: "supplement", name: "Thực phẩm chức năng" },
    { id: "healthcare", name: "Chăm sóc sức khỏe" },
  ];

  // 2. GỌI API KHI TRANG VỪA TẢI (useEffect)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi Service đã viết
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // [] nghĩa là chỉ chạy 1 lần khi mount

  // Hàm chuyển đổi tồn kho (Backend trả số -> Frontend hiển thị chữ)
  const getStockStatus = (qty: number) => {
    if (qty > 10) return "Còn hàng";
    if (qty > 0) return "Sắp hết";
    return "Hết hàng";
  };

  // 3. LOGIC LỌC DỮ LIỆU (Client-side filtering)
  // Tạm thời lọc trên client để giữ logic cũ của bạn Frontend
  const filteredProducts = products.filter((product) => {
    // Logic lọc Category (Tạm thời map lỏng lẻo vì DB chưa chắc khớp ID text)
    // Sau này nên đổi logic này sang gọi API search theo categoryId
    const matchCategory = selectedCategory === "all" ||
        (selectedCategory === 'prescription' && product.prescriptionRequired) ||
        (selectedCategory === 'otc' && !product.prescriptionRequired);
    // Logic tạm: bạn có thể tùy chỉnh thêm

    const matchSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Logic lọc giá
    let matchPrice = true;
    if (priceRange === "under50") matchPrice = product.price < 50000;
    else if (priceRange === "50to200") matchPrice = product.price >= 50000 && product.price <= 200000;
    else if (priceRange === "200to500") matchPrice = product.price > 200000 && product.price <= 500000;
    else if (priceRange === "over500") matchPrice = product.price > 500000;

    return matchCategory && matchSearch && matchPrice;
  });

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-4">Sản phẩm</h1>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - GIỮ NGUYÊN */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-cyan-600" />
                  <h2 className="text-gray-900">Bộ lọc</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm text-gray-700 mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex items-center cursor-pointer"
                        >
                          <input
                              type="radio"
                              name="category"
                              value={cat.id}
                              checked={selectedCategory === cat.id}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                        {cat.name}
                      </span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm text-gray-700 mb-3">Khoảng giá</h3>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "Tất cả" },
                      { id: "under50", label: "Dưới 50,000đ" },
                      { id: "50to200", label: "50,000đ - 200,000đ" },
                      { id: "200to500", label: "200,000đ - 500,000đ" },
                      { id: "over500", label: "Trên 500,000đ" },
                    ].map((range) => (
                        <label
                            key={range.id}
                            className="flex items-center cursor-pointer"
                        >
                          <input
                              type="radio"
                              name="price"
                              value={range.id}
                              checked={priceRange === range.id}
                              onChange={(e) => setPriceRange(e.target.value)}
                              className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                        {range.label}
                      </span>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-gray-600">
                {loading ? "Đang tải dữ liệu..." : `Hiển thị ${filteredProducts.length} sản phẩm`}
              </div>

              {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
                  </div>
              ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <Link
                            // LƯU Ý: Sửa id -> productId
                            key={product.productId}
                            to={`/products/${product.productId}`}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group"
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <ImageWithFallback
                                src={product.imageUrl || "placeholder.jpg"} // Sửa image -> imageUrl
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <div className={`text-xs mb-2 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {getStockStatus(product.stockQuantity)}
                            </div>
                            <h3 className="text-sm mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-[40px]">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                        <span className="text-cyan-600 font-bold">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-600 transition-colors">
                                Mua
                              </button>
                            </div>
                          </div>
                        </Link>
                    ))}
                  </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductsPage;