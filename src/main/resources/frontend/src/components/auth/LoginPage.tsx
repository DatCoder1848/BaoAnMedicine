import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../../assets/35c2f50c011ce133af3d1a6cca020e4454ff72ad.png'; // Bạn kiểm tra lại đường dẫn ảnh nhé
import { AuthService } from '../../services/authService';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi API Login -> Lấy Token
      await AuthService.login({
        usernameOrEmail: email,
        password: password
      });

      // 2. Dùng Token vừa có -> Gọi API lấy thông tin User (Role, Name...)
      const userData = await AuthService.getCurrentUser();

      // 3. Cập nhật vào State chung của App
      onLogin(userData);

      // 4. Chuyển hướng (nếu cần, nhưng App.tsx thường sẽ tự render lại)
      // navigate('/');

    } catch (err: any) {
      console.error(err);
      // Xử lý thông báo lỗi từ Backend
      if (err.response && err.response.status === 401) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="Bảo An Medicine" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">Chào mừng bạn trở lại Bảo An Medicine</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email / Tên đăng nhập</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Nhập email hoặc username"
                    required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-cyan-600 hover:text-cyan-700">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;