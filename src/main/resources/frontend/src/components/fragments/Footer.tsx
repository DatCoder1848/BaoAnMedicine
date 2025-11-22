import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import logo from 'figma:asset/35c2f50c011ce133af3d1a6cca020e4454ff72ad.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001a4d] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Bảo An Medicine" className="h-12 w-12 object-contain" />
              <div>
                <div className="tracking-wider">BẢO AN</div>
                <div className="text-xs tracking-widest opacity-90">MEDICINE</div>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Nhà thuốc uy tín hàng đầu Việt Nam, cung cấp thuốc chính hãng và dịch vụ chăm sóc sức khỏe tận tâm.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-400 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-cyan-400 transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-cyan-400 transition-colors">
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-cyan-400 transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>1800-6969</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@baoanmedicine.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-800 mt-8 pt-6 text-center text-sm opacity-90">
          <p>&copy; 2025 Bảo An Medicine. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
