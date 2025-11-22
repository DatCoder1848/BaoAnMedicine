import React, { useState } from 'react';
import { Search, Eye, Printer } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    { id: 'ORD123456', customer: 'Nguyễn Văn A', email: 'nguyenvana@email.com', total: 245000, status: 'pending', date: '21/11/2025' },
    { id: 'ORD123455', customer: 'Trần Thị B', email: 'tranthib@email.com', total: 180000, status: 'shipping', date: '21/11/2025' },
    { id: 'ORD123454', customer: 'Lê Văn C', email: 'levanc@email.com', total: 350000, status: 'completed', date: '20/11/2025' },
    { id: 'ORD123453', customer: 'Phạm Thị D', email: 'phamthid@email.com', total: 120000, status: 'cancelled', date: '20/11/2025' },
    { id: 'ORD123452', customer: 'Hoàng Văn E', email: 'hoangvane@email.com', total: 560000, status: 'processing', date: '19/11/2025' },
    { id: 'ORD123451', customer: 'Võ Thị F', email: 'vothif@email.com', total: 95000, status: 'completed', date: '19/11/2025' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-gray-900 mb-8">Quản lý đơn hàng</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-cyan-600">{order.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                    <td className="px-6 py-4 text-sm">{order.total.toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700" title="In đơn hàng">
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Tổng đơn hàng</div>
            <div className="text-2xl text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Chờ xử lý</div>
            <div className="text-2xl text-yellow-600">
              {orders.filter((o) => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Đang giao</div>
            <div className="text-2xl text-purple-600">
              {orders.filter((o) => o.status === 'shipping').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">Hoàn thành</div>
            <div className="text-2xl text-green-600">
              {orders.filter((o) => o.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
