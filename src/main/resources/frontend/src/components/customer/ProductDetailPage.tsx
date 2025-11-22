import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, Clock, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductDetailPageProps {
  cart: any[];
  updateCart: (cart: any[]) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ cart, updateCart }) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock product data
  const product = {
    id: Number(id),
    name: 'Paracetamol 500mg',
    price: 15000,
    originalPrice: 20000,
    description: 'Thuốc giảm đau, hạ sốt hiệu quả',
    image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Thuốc không kê đơn',
    brand: 'DHG Pharma',
    stock: 150,
    unit: 'Hộp 100 viên',
    details: {
      ingredients: 'Paracetamol 500mg',
      uses: 'Giảm đau, hạ sốt trong các trường hợp đau đầu, đau răng, đau cơ, sốt do cảm cúm',
      dosage: 'Người lớn: 1-2 viên/lần, 3-4 lần/ngày. Không quá 8 viên/ngày',
      sideEffects: 'Hiếm gặp: buồn nôn, nôn, phát ban da',
      storage: 'Bảo quản nơi khô ráo, thoáng mát, nhiệt độ dưới 30°C',
      expiry: '36 tháng kể từ ngày sản xuất',
    },
  };

  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    updateCart(newCart);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-cyan-600 hover:text-cyan-700">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-cyan-600 hover:text-cyan-700">Sản phẩm</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            Đã thêm vào giỏ hàng!
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden border-2 border-cyan-500 cursor-pointer">
                  <ImageWithFallback
                    src={product.image}
                    alt={`${product.name} ${i}`}
                    className="w-full aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              <h1 className="text-gray-900 mb-4">{product.name}</h1>
              <div className="text-sm text-gray-600 mb-6">
                Thương hiệu: <span className="text-cyan-600">{product.brand}</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-3xl text-cyan-600">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -25%
                  </span>
                </div>
                <div className="text-sm text-gray-600">{product.unit}</div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-xs text-gray-600">Chính hãng 100%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs text-gray-600">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-xs text-gray-600">Hỗ trợ 24/7</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3">Số lượng:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Buy Now */}
              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all text-center"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Thông tin chi tiết</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm mb-2">Thành phần:</h3>
              <p className="text-gray-600">{product.details.ingredients}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Công dụng:</h3>
              <p className="text-gray-600">{product.details.uses}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Liều dùng:</h3>
              <p className="text-gray-600">{product.details.dosage}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Tác dụng phụ:</h3>
              <p className="text-gray-600">{product.details.sideEffects}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Bảo quản:</h3>
              <p className="text-gray-600">{product.details.storage}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Hạn sử dụng:</h3>
              <p className="text-gray-600">{product.details.expiry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
