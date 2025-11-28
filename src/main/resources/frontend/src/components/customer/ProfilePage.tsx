import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, CreditCard, Package, FileText, Gift, LogOut } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProfilePageProps {
  user: any; // User từ App.tsx (đã lấy từ API)
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  // Menu điều hướng
  const menuItems = [
    {
      icon: User,
      title: 'Thông tin cá nhân',
      description: 'Chỉnh sửa thông tin tài khoản',
      link: '/profile/edit',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Package,
      title: 'Đơn hàng của tôi',
      description: 'Xem lịch sử mua hàng',
      link: '/orders',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: MapPin,
      title: 'Sổ địa chỉ',
      description: 'Quản lý địa chỉ giao hàng',
      link: '/profile/addresses',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileText,
      title: 'Đơn thuốc',
      description: 'Đơn thuốc đã tải lên',
      link: '/prescriptions',
      color: 'from-teal-500 to-cyan-500',
    }
  ];

  const getDefaultAddress = () => {
    if (!user?.addresses || user.addresses.length === 0) return "Chưa cập nhật";
    // Tìm địa chỉ mặc định, nếu không có thì lấy cái đầu tiên
    const addr = user.addresses.find((a: any) => a.isDefault) || user.addresses[0];
    return `${addr.specificAddress}, ${addr.city}`;
  };

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Header Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
              {/* Nếu có avatar thì hiện, không thì hiện chữ cái đầu */}
              {user?.avatar ? (
                  <ImageWithFallback src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                  <span className="text-3xl font-bold text-cyan-600">
                        {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                    </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.fullName || "Chưa cập nhật tên"}</h1>
              <p className="text-gray-500 mb-2">{user?.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                Thành viên {user?.memberLevel || 'Đồng'}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                  <Link
                      key={index}
                      to={item.link}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 group border border-transparent hover:border-cyan-100"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </Link>
              );
            })}
          </div>

          {/* Thông tin nhanh */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Thông tin liên hệ</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Số điện thoại:</span>
                  <span className="font-medium">{user?.phoneNumber || "Chưa cập nhật"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Địa chỉ mặc định:</span>
                  <span className="font-medium text-right max-w-[60%] truncate">{getDefaultAddress()}</span>
                </li>
              </ul>
            </div>

            {/* Có thể thêm banner quảng cáo hoặc thống kê điểm thưởng ở đây */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow p-6 text-white flex flex-col justify-center items-center text-center">
              <Gift className="w-10 h-10 mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-1">Ưu đãi thành viên</h3>
              <p className="text-cyan-100 text-sm">Tích điểm đổi quà cho mỗi đơn hàng thành công.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;