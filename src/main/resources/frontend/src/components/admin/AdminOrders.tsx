import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Loader2, X, Package, MapPin, User, Phone, Calendar } from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { Order } from '../../types/order';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const AdminOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal chi tiết
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Gọi API lấy danh sách
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getOrders(0, 100, statusFilter === 'ALL' ? undefined : statusFilter);
      // Backend trả về Page<Order> -> lấy content, hoặc List<Order> -> lấy trực tiếp
      setOrders(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Xử lý xem chi tiết
  const handleViewDetail = async (orderId: number) => {
    setShowModal(true);
    setLoadingDetail(true);
    try {
      const detail = await AdminService.getOrderById(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không thể tải chi tiết đơn hàng");
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Xử lý chuyển trạng thái
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    // Mapping tên trạng thái để hiển thị trong confirm cho dễ hiểu
    const statusName = newStatus === 'SHIPPING' ? 'ĐANG GIAO' : newStatus === 'COMPLETED' ? 'HOÀN THÀNH' : 'HỦY';

    if (confirm(`Xác nhận chuyển đơn #${orderId} sang trạng thái ${statusName}?`)) {
      try {
        await AdminService.updateOrderStatus(orderId, newStatus);
        alert("Cập nhật thành công!");

        // Refresh lại danh sách và modal (nếu đang mở)
        fetchOrders();
        if (selectedOrder && selectedOrder.orderId === orderId) {
          handleViewDetail(orderId);
        }
      } catch (e) {
        console.error(e);
        alert("Lỗi cập nhật trạng thái. Vui lòng kiểm tra quyền Admin hoặc trạng thái đơn hàng.");
      }
    }
  };

  // Helper hiển thị trạng thái đẹp
  const getStatusBadge = (status: string) => {
    const styles: any = {
      'NEW': 'bg-blue-100 text-blue-800 border border-blue-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'SHIPPING': 'bg-purple-100 text-purple-800 border border-purple-200',
      'COMPLETED': 'bg-green-100 text-green-800 border border-green-200',
      'CANCELLED': 'bg-red-100 text-red-800 border border-red-200',
    };
    const labels: any = {
      'NEW': 'Đơn mới',
      'PENDING': 'Chờ thanh toán',
      'SHIPPING': 'Đang giao',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Lọc client-side cho ô tìm kiếm
  const filteredOrders = orders.filter((order) =>
      order.orderId.toString().includes(searchQuery) ||
      (order.shippingPhone && order.shippingPhone.includes(searchQuery))
  );

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-gray-900 mb-8 font-bold text-2xl">Quản lý đơn hàng</h1>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm theo Mã đơn, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="NEW">Đơn mới</option>
                <option value="PENDING">Chờ thanh toán</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                  <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-600"/></div>
              ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Ngày đặt</th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-500 font-bold">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-cyan-700">#{order.orderId}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString('vi-VN')} <br/>
                            <span className="text-xs">{new Date(order.orderDate).toLocaleTimeString('vi-VN')}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">{order.shippingAddress}</div>
                            <div className="text-xs text-gray-500">{order.shippingPhone}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                          <td className="px-6 py-4">{getStatusBadge(order.orderStatus)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {/* Nút Xem Chi Tiết */}
                              <button
                                  onClick={() => handleViewDetail(order.orderId)}
                                  className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                  title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Các nút hành động nhanh */}
                              {order.orderStatus === 'NEW' && (
                                  <button
                                      onClick={() => handleUpdateStatus(order.orderId, 'SHIPPING')}
                                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                      title="Giao hàng"
                                  >
                                    <Truck className="w-4 h-4" />
                                  </button>
                              )}
                              {order.orderStatus === 'SHIPPING' && (
                                  <button
                                      onClick={() => handleUpdateStatus(order.orderId, 'COMPLETED')}
                                      className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                      title="Hoàn tất"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                              )}
                              {(order.orderStatus === 'NEW' || order.orderStatus === 'PENDING') && (
                                  <button
                                      onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')}
                                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                      title="Hủy đơn"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
          </div>
        </div>

        {/* MODAL CHI TIẾT ĐƠN HÀNG */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-cyan-600" />
                      Chi tiết đơn hàng #{selectedOrder?.orderId}
                    </h2>
                    <span className="text-sm text-gray-500">
                            Ngày đặt: {selectedOrder ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : '...'}
                        </span>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {loadingDetail || !selectedOrder ? (
                      <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-600"/></div>
                  ) : (
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Cột trái: Thông tin chung */}
                        <div className="md:col-span-1 space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" /> Khách hàng
                            </h3>
                            {/* Lưu ý: Backend cần trả về thông tin user hoặc lấy từ shippingAddress */}
                            <div className="text-sm space-y-2">
                              <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <span>{selectedOrder.shippingAddress}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{selectedOrder.shippingPhone}</span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <Truck className="w-4 h-4" /> Trạng thái
                            </h3>
                            <div className="mb-4">
                              {getStatusBadge(selectedOrder.orderStatus)}
                            </div>
                            <p className="text-sm text-gray-600">Thanh toán: <span className="font-bold">{selectedOrder.paymentMethod}</span></p>
                          </div>

                          {/* Action Buttons trong Modal */}
                          <div className="space-y-2">
                            {selectedOrder.orderStatus === 'NEW' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'SHIPPING')}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition-colors"
                                >
                                  Duyệt giao hàng
                                </button>
                            )}
                            {selectedOrder.orderStatus === 'SHIPPING' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'COMPLETED')}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-bold transition-colors"
                                >
                                  Xác nhận hoàn tất
                                </button>
                            )}
                          </div>
                        </div>

                        {/* Cột phải: Danh sách sản phẩm */}
                        <div className="md:col-span-2">
                          <h3 className="font-bold text-gray-800 mb-4">Danh sách sản phẩm</h3>
                          <div className="border rounded-xl overflow-hidden mb-6">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-4 py-3 text-left">Sản phẩm</th>
                                <th className="px-4 py-3 text-center">SL</th>
                                <th className="px-4 py-3 text-right">Đơn giá</th>
                                <th className="px-4 py-3 text-right">Thành tiền</th>
                              </tr>
                              </thead>
                              <tbody className="divide-y">
                              {selectedOrder.items?.map((item) => (
                                  <tr key={item.orderItemId}>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                                          <ImageWithFallback src={item.product.imageUrl} className="w-full h-full object-cover"/>
                                        </div>
                                        <span className="font-medium text-gray-700 line-clamp-2">{item.product.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">x{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">{item.priceAtPurchase.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-800">
                                      {(item.priceAtPurchase * item.quantity).toLocaleString('vi-VN')}đ
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Tổng tiền */}
                          <div className="space-y-2 text-right">
                            <div className="text-gray-600">Tạm tính: <span className="font-medium">{selectedOrder.originalAmount?.toLocaleString('vi-VN')}đ</span></div>
                            {selectedOrder.discountAmount > 0 && (
                                <div className="text-green-600">Giảm giá: <span className="font-medium">-{selectedOrder.discountAmount.toLocaleString('vi-VN')}đ</span></div>
                            )}
                            <div className="text-gray-600">Phí vận chuyển: <span className="font-medium">{selectedOrder.shippingFee.toLocaleString('vi-VN')}đ</span></div>
                            <div className="text-2xl font-bold text-cyan-700 mt-2">
                              {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminOrders;