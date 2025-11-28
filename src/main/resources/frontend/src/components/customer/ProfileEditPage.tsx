import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { UserService } from '../../services/userService';
import { User } from '../../types/user';

interface ProfileEditPageProps {
  user: User;
  setUser: (user: User) => void;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', content: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });

  // Load dữ liệu khi vào trang
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', content: '' });

    try {
      // 1. Gọi API Backend
      const updatedUser = await UserService.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });

      // 2. Logic quan trọng: Cập nhật State VÀ LocalStorage
      // Phải merge với user cũ để không mất các trường như id, roles...
      const mergedUser = { ...user, ...updatedUser };

      setUser(mergedUser); // Cập nhật state React
      localStorage.setItem('user', JSON.stringify(mergedUser)); // Cập nhật bộ nhớ trình duyệt (Fix lỗi reload mất data)

      setMsg({ type: 'success', content: 'Cập nhật thông tin thành công!' });

      setTimeout(() => navigate('/profile'), 1000);

    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      setMsg({ type: 'error', content: 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 text-2xl font-bold">Chỉnh sửa thông tin</h1>
          </div>

          {msg.content && (
              <div className={`p-4 rounded-lg mb-6 ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {msg.content}
              </div>
          )}

          <div className="bg-white rounded-xl shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ví dụ: 0912345678"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                Để quản lý địa chỉ giao hàng, vui lòng truy cập mục
                <span className="font-bold cursor-pointer ml-1 underline" onClick={() => navigate('/profile/addresses')}>Sổ địa chỉ</span>.
              </div>

              <div className="pt-4 flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-grow bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 font-bold disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Lưu thay đổi</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ProfileEditPage;