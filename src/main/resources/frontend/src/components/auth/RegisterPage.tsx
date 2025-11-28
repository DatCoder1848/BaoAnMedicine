import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../../assets/35c2f50c011ce133af3d1a6cca020e4454ff72ad.png'; // Kiểm tra lại đường dẫn ảnh
import { AuthService } from '../../services/authService';

interface RegisterPageProps {
  onLogin: (user: any) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      // Mapping dữ liệu Form -> API RegisterDto
      // Lưu ý: Backend yêu cầu 'username', ta tạm dùng email làm username
      await AuthService.register({
        username: formData.email, // Dùng email làm username
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        // phoneNumber: formData.phone // Bỏ comment nếu Backend bạn đã thêm trường này vào RegisterDto
      });

      // Đăng ký thành công -> Tự động đăng nhập luôn (Trải nghiệm người dùng tốt hơn)
      const token = await AuthService.login({
        usernameOrEmail: formData.email,
        password: formData.password
      });

      if (token) {
        const userData = await AuthService.getCurrentUser();
        onLogin(userData); // Cập nhật state App
        navigate('/'); // Về trang chủ
      }

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        // Backend trả về chuỗi lỗi (String) hoặc Object lỗi
        setError(typeof err.response.data === 'string' ? err.response.data : 'Đăng ký thất bại, email có thể đã tồn tại.');
      } else {
        setError('Có lỗi xảy ra, vui lòng kiểm tra kết nối.');
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
            <h1 className="text-3xl text-gray-900 mb-2">Đăng ký tài khoản</h1>
            <p className="text-gray-600">Trở thành thành viên của Bảo An Medicine</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Họ và tên</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                    required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Số điện thoại</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="0912345678"
                    required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

              <div>
                <label className="block text-sm text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                />
              </div>

              <div className="flex items-start">
                <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                    required
                />
                <span className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với{' '}
                  <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  Điều khoản dịch vụ
                </a>{' '}
                  và{' '}
                  <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  Chính sách bảo mật
                </a>
              </span>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Đăng ký'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-cyan-600 hover:text-cyan-700">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;