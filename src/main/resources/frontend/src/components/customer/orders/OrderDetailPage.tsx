import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { OrderService } from '../../../services/orderService';
import { Order } from '../../../types/order';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface OrderDetailPageProps {
  user: any;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await OrderService.getOrderById(Number(id));
        setOrder(data);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
        </div>
    );
  }

  if (!order) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-700">Không tìm thấy đơn hàng</h2>
          <button onClick={() => navigate('/orders')} className="mt-4 text-cyan-600 hover:underline">
            Quay lại danh sách
          </button>
        </div>
    );
  }

  // Helper: Dịch trạng thái & Xác định timeline
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      'NEW': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
  };

  // Logic hiển thị Timeline dựa trên status hiện tại
  const steps = [
    { key: 'NEW', label: 'Đặt hàng thành công' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao hàng' },
    { key: 'COMPLETED', label: 'Hoàn thành' }
  ];

  // Tìm index của status hiện tại để biết step nào đã hoàn thành
  const currentStepIndex = steps.findIndex(s => s.key === order.orderStatus);
  // Nếu status là CANCELLED thì hiển thị kiểu khác, không theo timeline này
  const isCancelled = order.orderStatus === 'CANCELLED';

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
              <h1 className="text-gray-900 text-2xl font-bold">Chi tiết đơn hàng</h1>
              <p className="text-gray-600">Mã đơn hàng: #{order.orderId} - <span className="text-cyan-600 font-medium">{getStatusLabel(order.orderStatus)}</span></p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Timeline: Ẩn nếu đơn hàng bị hủy */}
              {!isCancelled && (
                  <div className="bg-white rounded-xl shadow p-8">
                    <h2 className="text-gray-900 mb-6 font-bold">Trạng thái đơn hàng</h2>
                    <div className="relative flex justify-between">
                      {/* Line kết nối */}
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0"></div>
                      <div
                          className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500 -z-0"
                          style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                      ></div>

                      {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        return (
                            <div key={step.key} className="flex flex-col items-center z-10 bg-white px-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                  isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'
                              }`}>
                                <CheckCircle className="w-6 h-6" />
                              </div>
                              <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                            </div>
                        );
                      })}
                    </div>
                  </div>
              )}

              {/* Thông báo hủy đơn */}
              {isCancelled && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="text-red-700 font-bold">Đơn hàng đã bị hủy</h3>
                      <p className="text-red-600 text-sm">Nếu có thắc mắc, vui lòng liên hệ bộ phận CSKH.</p>
                    </div>
                  </div>
              )}

              {/* Danh sách sản phẩm */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-gray-900 mb-6 font-bold">Sản phẩm</h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                      <div key={item.orderItemId} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                          <ImageWithFallback
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm font-bold text-gray-800 mb-1">{item.product.name}</h3>
                          <div className="text-sm text-gray-500">Số lượng: x{item.quantity}</div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {(item.priceAtPurchase * item.quantity).toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột bên phải: Thông tin & Thanh toán */}
            <div className="lg:col-span-1 space-y-6">
              {/* Địa chỉ giao hàng */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4 text-cyan-700">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold">Địa chỉ nhận hàng</h3>
                </div>
                <div className="text-sm space-y-2 text-gray-700">
                  <div className="font-bold">{user?.name}</div>
                  <div>{order.shippingPhone}</div>
                  <div className="text-gray-600 leading-relaxed">
                    {order.shippingAddress}
                  </div>
                </div>
              </div>

              {/* Thanh toán */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4 text-cyan-700">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="font-bold">Thanh toán</h3>
                </div>
                <div className="text-sm flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-bold">{order.paymentMethod}</span>
                </div>
                <div className="text-sm flex justify-between items-center mt-2 p-3 rounded-lg">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                 </span>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-gray-900 mb-4 font-bold">Tổng quan</h3>
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{order.originalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {order.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
                      </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Tổng cộng:</span>
                  <span className="text-2xl text-cyan-600 font-bold">
                  {order.totalAmount.toLocaleString('vi-VN')}đ
                </span>
                </div>
              </div>

              <button className="w-full bg-cyan-100 text-cyan-700 py-3 rounded-lg hover:bg-cyan-200 transition-colors font-bold">
                Mua lại đơn này
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default OrderDetailPage;