import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, PackageX } from 'lucide-react';
import OrderListItem from '../../fragments/OrderListItem';
import { OrderService } from '../../../services/orderService';
import { Order } from '../../../types/order';

interface OrdersListPageProps {
  user: any;
}

const OrdersListPage: React.FC<OrdersListPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await OrderService.getMyOrders(0, 50); // Lấy 50 đơn gần nhất
        // data trả về có thể là array hoặc object Page.
        // Nếu service trả về content array thì dùng luôn, nếu không check lại service
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'NEW', label: 'Chờ xác nhận' }, // Map với Enum Backend
    { id: 'SHIPPING', label: 'Đang giao' },
    { id: 'COMPLETED', label: 'Hoàn thành' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  // Logic lọc Client-side (Hoặc gọi API có tham số status nếu backend hỗ trợ)
  const filteredOrders = filter === 'ALL'
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 text-2xl font-bold">Lịch sử đơn hàng</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow mb-6 p-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max">
              {filters.map((f) => (
                  <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap font-medium text-sm ${
                          filter === f.id
                              ? 'bg-cyan-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {f.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
              </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="text-gray-300 mb-4 flex justify-center">
                  <PackageX className="w-24 h-24" />
                </div>
                <h3 className="text-gray-900 mb-2 font-bold">Không có đơn hàng nào</h3>
                <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong danh mục này</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-bold shadow-lg shadow-cyan-200"
                >
                  Mua sắm ngay
                </button>
              </div>
          )}

          {/* Orders List */}
          {!loading && filteredOrders.length > 0 && (
              <div className="space-y-4">
                {filteredOrders.map((order) => {

                  // --- QUAN TRỌNG: MAPPING DỮ LIỆU ---
                  // Chuyển đổi dữ liệu API (Order) sang cấu trúc mà OrderListItem cũ mong đợi
                  // Giả sử OrderListItem mong đợi: { id, date, status, total, items: [{name, quantity, price}] }
                  const mappedOrderForUI = {
                    id: order.orderId, // UI cũ dùng id string/number
                    date: new Date(order.orderDate).toLocaleDateString('vi-VN'), // Format ngày
                    status: order.orderStatus,
                    total: order.totalAmount,
                    // Map items để OrderListItem hiển thị tên thuốc
                    items: order.items.map(i => ({
                      name: i.product.name,
                      quantity: i.quantity,
                      price: i.priceAtPurchase
                    }))
                  };

                  return (
                      // Truyền prop order đã được map
                      <OrderListItem key={order.orderId} order={mappedOrderForUI} />
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
};

export default OrdersListPage;