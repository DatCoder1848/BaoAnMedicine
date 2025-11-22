import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import OrderListItem from '../../fragments/OrderListItem';

interface OrdersListPageProps {
  user: any;
}

const OrdersListPage: React.FC<OrdersListPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Mock orders data
  const orders = [
    {
      id: 'ORD123456',
      date: '20/11/2025',
      status: 'shipping',
      total: 245000,
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 15000 },
        { name: 'Vitamin C 1000mg', quantity: 1, price: 120000 },
        { name: 'Omega-3 Fish Oil', quantity: 1, price: 95000 },
      ],
    },
    {
      id: 'ORD123455',
      date: '18/11/2025',
      status: 'completed',
      total: 180000,
      items: [
        { name: 'Amoxicillin 500mg', quantity: 2, price: 45000 },
        { name: 'Cetirizine 10mg', quantity: 3, price: 30000 },
      ],
    },
    {
      id: 'ORD123454',
      date: '15/11/2025',
      status: 'pending',
      total: 350000,
      items: [
        { name: 'Collagen Beauty Plus', quantity: 1, price: 350000 },
      ],
    },
    {
      id: 'ORD123453',
      date: '10/11/2025',
      status: 'cancelled',
      total: 120000,
      items: [
        { name: 'Vitamin C 1000mg', quantity: 1, price: 120000 },
      ],
    },
  ];

  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

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
          <h1 className="text-gray-900">Đơn hàng của tôi</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow mb-6 p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  filter === f.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">Không có đơn hàng</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào trong danh mục này</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersListPage;
