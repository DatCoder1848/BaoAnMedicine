import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Home, Briefcase } from 'lucide-react';

interface AddressesPageProps {
  user: any;
}

const AddressesPage: React.FC<AddressesPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Nhà riêng',
      icon: Home,
      name: user.name,
      phone: '0912345678',
      address: '123 Nguyễn Trãi, Phường Bến Thành',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Văn phòng',
      icon: Briefcase,
      name: user.name,
      phone: '0987654321',
      address: '456 Lê Lợi, Phường Bến Nghé',
      city: 'TP. Hồ Chí Minh',
      isDefault: false,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900">Địa chỉ giao hàng</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm địa chỉ
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-gray-900 mb-6">Thêm địa chỉ mới</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Họ tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={user.name}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Số nhà, tên đường"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Thành phố</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Loại địa chỉ</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" value="home" className="w-4 h-4 text-cyan-600" defaultChecked />
                    <span className="ml-2">Nhà riêng</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" value="office" className="w-4 h-4 text-cyan-600" />
                    <span className="ml-2">Văn phòng</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-grow bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Lưu địa chỉ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-8 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => {
            const Icon = address.icon;
            return (
              <div key={address.id} className="bg-white rounded-xl shadow p-6 relative">
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
                    Mặc định
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-cyan-600" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm">{address.label}</h3>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{address.name} | {address.phone}</div>
                    <div className="text-sm text-gray-600">
                      {address.address}, {address.city}
                    </div>

                    <div className="flex gap-4 mt-4">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          Đặt làm mặc định
                        </button>
                      )}
                      <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1">
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
