import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Phone, CreditCard } from 'lucide-react';

interface OrderDetailPageProps {
  user: any;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock order data
  const order = {
    id: id,
    date: '20/11/2025 14:30',
    status: 'shipping',
    total: 245000,
    subtotal: 215000,
    shipping: 30000,
    paymentMethod: 'cod',
    address: {
      name: user.name,
      phone: '0912345678',
      address: '123 Nguyễn Trãi, Phường Bến Thành',
      city: 'TP. Hồ Chí Minh',
    },
    items: [
      {
        id: 1,
        name: 'Paracetamol 500mg',
        quantity: 2,
        price: 15000,
        image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 2,
        name: 'Vitamin C 1000mg',
        quantity: 1,
        price: 120000,
        image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        id: 3,
        name: 'Omega-3 Fish Oil',
        quantity: 1,
        price: 95000,
        image: 'https://images.unsplash.com/photo-1706777227772-629b1cdb8a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYzNzM1MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
    timeline: [
      { status: 'Đơn hàng đã được đặt', date: '20/11/2025 14:30', completed: true },
      { status: 'Đã xác nhận', date: '20/11/2025 15:00', completed: true },
      { status: 'Đang chuẩn bị hàng', date: '20/11/2025 16:00', completed: true },
      { status: 'Đang giao hàng', date: '21/11/2025 09:00', completed: true },
      { status: 'Đã giao hàng', date: '', completed: false },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-gray-900">Chi tiết đơn hàng</h1>
            <p className="text-gray-600">Mã đơn hàng: {order.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-900 mb-6">Trạng thái đơn hàng</h2>
              <div className="space-y-4">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-grow pb-4">
                      <div className={step.completed ? 'text-gray-900' : 'text-gray-500'}>
                        {step.status}
                      </div>
                      {step.date && (
                        <div className="text-sm text-gray-500">{step.date}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-900 mb-6">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                      <h3 className="text-sm mb-1">{item.name}</h3>
                      <div className="text-sm text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="text-sm">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <h3 className="text-gray-900">Địa chỉ giao hàng</h3>
              </div>
              <div className="text-sm space-y-2">
                <div>{order.address.name}</div>
                <div className="text-gray-600">{order.address.phone}</div>
                <div className="text-gray-600">
                  {order.address.address}, {order.address.city}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-cyan-600" />
                <h3 className="text-gray-900">Thanh toán</h3>
              </div>
              <div className="text-sm">
                {order.paymentMethod === 'cod'
                  ? 'Thanh toán khi nhận hàng'
                  : 'Đã thanh toán'}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-900 mb-4">Tổng đơn hàng</h3>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{order.shipping.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-xl text-cyan-600">
                  {order.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                Mua lại
              </button>
              {order.status === 'pending' && (
                <button className="w-full border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition-colors">
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
