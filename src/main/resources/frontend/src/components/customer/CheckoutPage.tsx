import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, FileText } from 'lucide-react';

interface CheckoutPageProps {
  cart: any[];
  updateCart: (cart: any[]) => void;
  user: any;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, updateCart, user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: user.phone || '',
    paymentMethod: 'cod',
    notes: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200000 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order (mock)
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      items: cart,
      total,
      status: 'pending',
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
    };

    // Clear cart
    updateCart([]);
    
    // Redirect to order detail
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-gray-900 mb-8">Thanh toán</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Địa chỉ' },
              { num: 2, label: 'Thanh toán' },
              { num: 3, label: 'Xác nhận' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.num
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={step >= s.num ? 'text-cyan-600' : 'text-gray-500'}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-20 h-1 ${step > s.num ? 'bg-cyan-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-gray-900">Địa chỉ giao hàng</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Thành phố</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                      <option value="dn">Đà Nẵng</option>
                      <option value="ct">Cần Thơ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-gray-900">Phương thức thanh toán</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-3">Thanh toán khi nhận hàng (COD)</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-3">Chuyển khoản ngân hàng</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={formData.paymentMethod === 'momo'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-3">Ví MoMo</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-gray-900">Ghi chú</h2>
                </div>

                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={4}
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-gray-900 mb-6">Đơn hàng</h2>

              <div className="space-y-3 mb-6 pb-6 border-b max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <div className="text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-2xl text-cyan-600">{total.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
