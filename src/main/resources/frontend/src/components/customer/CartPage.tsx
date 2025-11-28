import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartService } from '../../services/cartService';
import { MarketingService } from '../../services/marketingService'; // Import
import { AdSlot, Advertisement } from '../../types/marketing'; // Import

interface CartPageProps {
  cart: any[]; // Đây là danh sách items từ API
  updateCart: () => void; // Hàm refresh lại App
}

const CartPage: React.FC<CartPageProps> = ({ cart, updateCart }) => {
  const [loading, setLoading] = useState(false);
  const [ad, setAd] = useState<Advertisement | null>(null);

  // Lấy quảng cáo Cart
  useEffect(() => {
    const fetchAd = async () => {
      const ads = await MarketingService.getAds(AdSlot.CART_PAGE);
      if (ads.length > 0) setAd(ads[0]); // Lấy cái ưu tiên nhất
    };
    fetchAd();
  }, []);

  // Xử lý cập nhật số lượng
  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await CartService.updateQuantity(productId, newQuantity);
      updateCart(); // Gọi App cập nhật lại state
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = async (cartItemId: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    setLoading(true);
    try {
      await CartService.removeFromCart(cartItemId);
      updateCart(); // Gọi App cập nhật lại state
    } catch (error) {
      console.error("Lỗi xóa sản phẩm", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán tổng tiền (Client-side fallback)
  // Lưu ý: item.product.* là cấu trúc từ API CartItemDTO
  const subtotal = cart.reduce((sum, item) => {
    const price = item.priceAtAddition || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 200000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (!cart || cart.length === 0) {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-gray-900 mb-8">Giỏ hàng ({cart.length})</h1>

          {loading && (
              <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
              </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                  <div key={item.cartItemId} className="bg-white rounded-xl shadow p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <div className="flex justify-between mb-2">
                          <Link to={`/products/${item.product.productId}`} className="hover:text-cyan-600 transition-colors">
                            <h3 className="text-sm font-medium">{item.product.name}</h3>
                          </Link>
                          <button
                              onClick={() => handleRemoveItem(item.cartItemId)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Unit & Price info */}
                        <div className="text-sm text-gray-500 mb-4">
                          Đơn giá: {item.product.price.toLocaleString('vi-VN')}đ
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => handleUpdateQuantity(item.product.productId, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center text-sm">
                          {item.quantity}
                        </span>
                            <button
                                onClick={() => handleUpdateQuantity(item.product.productId, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Total Price for Item */}
                          <div className="text-right">
                            <div className="text-cyan-600 font-bold">
                              {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-24">
                <h2 className="text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}</span>
                  </div>
                  {shipping > 0 && (
                      <div className="text-sm text-cyan-600 bg-cyan-50 p-3 rounded-lg">
                        Mua thêm {(200000 - subtotal).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
                      </div>
                  )}
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-gray-900 font-bold">Tổng cộng:</span>
                  <span className="text-2xl text-cyan-600 font-bold">{total.toLocaleString('vi-VN')}đ</span>
                </div>

                <Link
                    to="/checkout"
                    className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-center shadow-lg hover:shadow-xl mb-4"
                >
                  Tiến hành thanh toán
                </Link>

                <Link
                    to="/products"
                    className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Tiếp tục mua sắm
                </Link>

                {/* --- QUẢNG CÁO CART (MỚI) --- */}
                {ad && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                      <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">Có thể bạn quan tâm</p>
                      <Link to={ad.targetUrl} className="block overflow-hidden rounded-lg group shadow-md hover:shadow-xl transition-all">
                        <ImageWithFallback
                            src={ad.contentUrl}
                            alt={ad.name}
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CartPage;