import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CartPageProps {
  cart: any[];
  updateCart: (cart: any[]) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, updateCart }) => {
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (cart.length === 0) {
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <Link to={`/products/${item.id}`} className="hover:text-cyan-600 transition-colors">
                        <h3 className="text-sm">{item.name}</h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">{item.unit || 'Hộp'}</div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-cyan-600">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.price.toLocaleString('vi-VN')}đ / đơn vị
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
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-2xl text-cyan-600">{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-center shadow-lg hover:shadow-xl mb-4"
              >
                Thanh toán
              </Link>

              <Link
                to="/products"
                className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
