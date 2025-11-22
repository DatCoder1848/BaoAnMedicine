import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';

interface ProfileEditPageProps {
  user: any;
  setUser: (user: any) => void;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    birthday: user.birthday || '',
    gender: user.gender || 'male',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900">Chỉnh sửa thông tin</h1>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
            Cập nhật thông tin thành công!
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-8">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.charAt(0) || 'U'
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Giới tính</label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-2">Nam</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-2">Nữ</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-cyan-600"
                    />
                    <span className="ml-2">Khác</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-grow bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-8 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
