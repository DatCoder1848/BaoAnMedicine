import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '125,500,000đ',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Đơn hàng',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Khách hàng',
      value: '856',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Sản phẩm',
      value: '2,456',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const recentOrders = [
    { id: 'ORD123456', customer: 'Nguyễn Văn A', total: 245000, status: 'pending', date: '21/11/2025' },
    { id: 'ORD123455', customer: 'Trần Thị B', total: 180000, status: 'shipping', date: '21/11/2025' },
    { id: 'ORD123454', customer: 'Lê Văn C', total: 350000, status: 'completed', date: '20/11/2025' },
    { id: 'ORD123453', customer: 'Phạm Thị D', total: 120000, status: 'cancelled', date: '20/11/2025' },
  ];

  const topProducts = [
    { name: 'Paracetamol 500mg', sold: 456, revenue: 6840000 },
    { name: 'Vitamin C 1000mg', sold: 234, revenue: 28080000 },
    { name: 'Amoxicillin 500mg', sold: 189, revenue: 8505000 },
    { name: 'Omega-3 Fish Oil', sold: 156, revenue: 39000000 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      shipping: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels = {
      pending: 'Chờ xử lý',
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
        <h1 className="text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">Đơn hàng gần đây</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <div className="text-sm mb-1">#{order.id}</div>
                      <div className="text-xs text-gray-500">{order.customer}</div>
                      <div className="text-xs text-gray-400">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm mb-2">{order.total.toLocaleString('vi-VN')}đ</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">Sản phẩm bán chạy</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm mb-1">{product.name}</div>
                      <div className="text-xs text-gray-500">Đã bán: {product.sold}</div>
                    </div>
                    <div className="text-sm text-cyan-600">
                      {product.revenue.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-900 mb-6">Doanh thu theo tháng</h2>
          <div className="h-64 bg-gradient-to-t from-cyan-50 to-transparent rounded-lg flex items-end justify-center">
            <div className="text-gray-400 mb-8">Biểu đồ doanh thu</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
