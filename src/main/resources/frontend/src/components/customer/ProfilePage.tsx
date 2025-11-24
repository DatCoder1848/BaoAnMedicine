import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, CreditCard, Package, FileText, Settings, Gift } from 'lucide-react';
import ProfileSummary from '../fragments/ProfileSummary';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const menuItems = [
    {
      icon: User,
      title: 'Thông tin cá nhân',
      description: 'Quản lý thông tin tài khoản',
      link: '/profile/edit',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Package,
      title: 'Đơn hàng của tôi',
      description: 'Xem và quản lý đơn hàng',
      link: '/orders',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: MapPin,
      title: 'Địa chỉ giao hàng',
      description: 'Quản lý địa chỉ nhận hàng',
      link: '/profile/addresses',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: CreditCard,
      title: 'Phương thức thanh toán',
      description: 'Quản lý thẻ và tài khoản',
      link: '/profile/payment-methods',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: FileText,
      title: 'Đơn thuốc',
      description: 'Quản lý đơn thuốc của bạn',
      link: '/prescriptions',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Gift,
      title: 'Ưu đãi của tôi',
      description: 'Mã giảm giá và khuyến mãi',
      link: '/profile/rewards',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Summary */}
        <ProfileSummary user={user} />

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 my-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl text-cyan-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Đơn hàng</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl text-green-600 mb-2">8</div>
            <div className="text-sm text-gray-600">Đã giao</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl text-purple-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Đơn thuốc</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl text-orange-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Ưu đãi</div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.link}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="mb-2 group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-900 mb-6">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {[
              { action: 'Đơn hàng #ORD123 đã được giao', time: '2 giờ trước', icon: Package, color: 'text-green-500' },
              { action: 'Bạn đã tích được 50 điểm', time: '1 ngày trước', icon: Gift, color: 'text-orange-500' },
              { action: 'Đơn thuốc mới đã được tải lên', time: '3 ngày trước', icon: FileText, color: 'text-blue-500' },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
