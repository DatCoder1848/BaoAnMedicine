import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, Loader2 } from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { DashboardStats } from '../../types/admin';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy số liệu thật
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AdminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-cyan-600"/></div>;
  }

  // Fallback nếu API chưa có số liệu
  const data = stats || { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 };

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: `${data.totalRevenue.toLocaleString('vi-VN')}đ`,
      change: '---', // Backend chưa có API so sánh tháng trước, để placeholder
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Đơn hàng',
      value: data.totalOrders.toLocaleString(),
      change: '---',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Khách hàng',
      value: data.totalUsers.toLocaleString(),
      change: '---',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Sản phẩm',
      value: data.totalProducts.toLocaleString(),
      change: '---',
      trend: 'down', // Ví dụ
      icon: Package,
      color: 'from-orange-500 to-red-600',
    },
  ];

  // Dữ liệu Top sản phẩm (Nếu backend chưa có API này thì để trống hoặc gọi API reports/top-selling)
  // Tạm thời giữ mock layout để không vỡ giao diện, bạn cần API /reports/top-selling để fill vào đây
  const topProducts = [
    { name: 'Dữ liệu mẫu 1', sold: 0, revenue: 0 },
    { name: 'Dữ liệu mẫu 2', sold: 0, revenue: 0 },
  ];

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-gray-900 mb-8 font-bold text-2xl">Dashboard Quản trị</h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                  <div key={index} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {/* <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </div> */}
                    </div>
                    <div className="text-2xl text-gray-900 mb-1 font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                  </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders - Tạm thời ẩn hoặc cần API riêng lấy 5 đơn mới nhất */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h2 className="text-gray-900 font-bold">Trạng thái hệ thống</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Kết nối máy chủ: <span className="text-green-600 font-bold">Ổn định</span></p>
                <p className="text-gray-600">Phiên bản API: <span className="text-blue-600 font-bold">v1.0.0</span></p>
              </div>
            </div>

            {/* Top Products Placeholder */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h2 className="text-gray-900 font-bold">Sản phẩm bán chạy</h2>
              </div>
              <div className="p-6 text-center text-gray-500">
                (Cần tích hợp API Báo cáo chi tiết)
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;