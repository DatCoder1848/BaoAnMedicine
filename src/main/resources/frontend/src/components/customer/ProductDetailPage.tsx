import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  Tag
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductService } from "../../services/productService";
import { Product } from "../../types/product";
import { CartService } from "../../services/cartService"; // Nhớ import

interface ProductDetailPageProps {
  cart: any[];
  updateCart: (cart: any[]) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
                                                               cart,
                                                               updateCart,
                                                             }) => {
  const { id } = useParams();

  // 1. State quản lý dữ liệu từ API
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // State giao diện
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // 2. Gọi API lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);

      const data = await ProductService.getProductById(Number(id));

      if (data) {
        setProduct(data);
        // Ưu tiên dùng ảnh đầu tiên trong danh sách images, nếu không thì dùng imageUrl
        const firstImage = (data.images && data.images.length > 0)
            ? data.images[0]
            : (data.imageUrl || "");
        setSelectedImage(firstImage);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;

    // Kiểm tra đăng nhập (đơn giản bằng cách check token)
    if (!localStorage.getItem('accessToken')) {
      alert("Vui lòng đăng nhập để mua hàng!");
      // Hoặc navigate('/login') nếu bạn import useNavigate
      return;
    }

    try {
      // 1. Gọi API thêm vào giỏ
      await CartService.addToCart(product.productId, quantity);

      // 2. Báo cho App biết để cập nhật Header (số lượng giỏ hàng)
      // updateCart bây giờ là hàm handleRefreshCart từ App.tsx
      updateCart([]); // Truyền mảng rỗng hay gì cũng được vì App.tsx sẽ ignore tham số này

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  // 3. Xử lý hiển thị khi đang tải hoặc lỗi
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
        </div>
    );
  }

  if (error || !product) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold">Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="mt-4 text-cyan-600 hover:underline">
            Quay lại danh sách
          </Link>
        </div>
    );
  }

  // --- LOGIC MỚI: Xử lý danh sách ảnh (Gallery) ---
  const productImages = (product.images && product.images.length > 0)
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);

  // --- LOGIC MỚI: Tính phần trăm giảm giá ---
  const discountPercentage = (product.originalPrice && product.originalPrice > product.price)
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link to="/" className="text-cyan-600 hover:text-cyan-700">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/products" className="text-cyan-600 hover:text-cyan-700">
              Sản phẩm
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 truncate max-w-xs inline-block align-bottom">{product.name}</span>
          </nav>

          {/* Success Message */}
          {showSuccess && (
              <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Đã thêm vào giỏ hàng!
              </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* CỘT TRÁI: HÌNH ẢNH */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 relative group">
                <ImageWithFallback
                    src={selectedImage}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-4" // Dùng object-contain để không bị cắt ảnh thuốc
                />
                {/* Badge giảm giá trên ảnh */}
                {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      -{discountPercentage}%
                    </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {productImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {productImages.map((imgSrc, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(imgSrc)}
                            className={`bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:opacity-100 ${
                                selectedImage === imgSrc
                                    ? "border-cyan-500 opacity-100 ring-2 ring-cyan-200"
                                    : "border-transparent opacity-70"
                            }`}
                        >
                          <ImageWithFallback
                              src={imgSrc}
                              alt={`${product.name} ${idx + 1}`}
                              className="w-full aspect-square object-contain p-1"
                          />
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN MUA HÀNG */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
                  {product.categoryName || "Dược phẩm"}
                </div>
                <h1 className="text-gray-900 mb-4 text-3xl font-bold leading-tight">{product.name}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div>Thương hiệu: <span className="text-cyan-600 font-bold">{product.manufacturer || "N/A"}</span></div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div>Mã SP: <span className="text-gray-900">#{product.productId}</span></div>
                </div>

                {/* Price Section Updated */}
                <div className="mb-6 pb-6 border-b bg-gray-50 -mx-8 px-8 py-4">
                  <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl text-cyan-600 font-bold">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                    {product.unit && (
                        <span className="text-gray-500 text-lg mb-1">/ {product.unit}</span>
                    )}
                  </div>

                  {/* Giá gốc (nếu có) */}
                  {product.originalPrice && product.originalPrice > product.price && (
                      <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 line-through text-lg">
                      {product.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                        <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-sm font-medium">
                      Tiết kiệm { (product.originalPrice - product.price).toLocaleString("vi-VN") }đ
                    </span>
                      </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                        {product.stockQuantity > 0 ? `Còn hàng (Tồn: ${product.stockQuantity})` : "Tạm hết hàng"}
                    </span>
                  </div>
                </div>

                {/* Features Icons */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-700">Chính hãng 100%</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-xl">
                    <Truck className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-700">Giao nhanh 2h</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-700">Đổi trả 30 ngày</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Số lượng mua:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                      <button
                          onClick={decreaseQuantity}
                          className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 text-gray-600"
                          disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[50px] text-center font-bold text-gray-800">
                      {quantity}
                    </span>
                      <button
                          onClick={increaseQuantity}
                          className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 text-gray-600"
                          disabled={quantity >= product.stockQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                      onClick={handleAddToCart}
                      disabled={product.stockQuantity === 0}
                      className={`flex-grow py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-bold text-lg
                    ${product.stockQuantity > 0
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-200/50'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {product.stockQuantity > 0 ? "Thêm Vào Giỏ" : "Hết Hàng"}
                  </button>

                  <button className="px-5 border-2 border-gray-200 text-gray-400 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* THÔNG TIN CHI TIẾT SẢN PHẨM (DỮ LIỆU ĐỘNG TỪ API) */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Tag className="w-6 h-6 text-cyan-600" />
              <h2 className="text-gray-900 text-xl font-bold">Thông tin chi tiết</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Cột chính (chiếm 2 phần) */}
              <div className="md:col-span-2 space-y-8">

                {/* Mô tả */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>

                {/* Thành phần (Mới) */}
                {product.ingredients && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-base font-bold text-blue-800 mb-2">Thành phần</h3>
                      <p className="text-blue-900 whitespace-pre-line">{product.ingredients}</p>
                    </div>
                )}

                {/* Công dụng */}
                {product.therapeuticClass && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Công dụng / Chỉ định</h3>
                      <p className="text-gray-600">{product.therapeuticClass}</p>
                    </div>
                )}

                {/* Hướng dẫn sử dụng */}
                {product.usageInstructions && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Hướng dẫn sử dụng</h3>
                      <p className="text-gray-600 whitespace-pre-line">{product.usageInstructions}</p>
                    </div>
                )}
              </div>

              {/* Cột phụ (chiếm 1 phần) - Thông tin cảnh báo */}
              <div className="space-y-6">
                {product.prescriptionRequired && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex gap-2 text-orange-800 font-bold mb-2">
                        <AlertCircle className="w-5 h-5" /> Thuốc kê đơn
                      </div>
                      <p className="text-sm text-orange-700">
                        Sản phẩm này chỉ được bán khi có chỉ định của bác sĩ. Vui lòng chuẩn bị đơn thuốc khi nhận hàng.
                      </p>
                    </div>
                )}

                {/* Tác dụng phụ (Mới) */}
                {product.sideEffects && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Tác dụng phụ</h3>
                      <p className="text-sm text-gray-600">{product.sideEffects}</p>
                    </div>
                )}

                {/* Bảo quản (Mới) */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Bảo quản</h3>
                  <p className="text-sm text-gray-600">
                    {product.storageInstructions || "Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetailPage;