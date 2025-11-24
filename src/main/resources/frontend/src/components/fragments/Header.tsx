import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Phone, MapPin } from 'lucide-react';
import logo from 'figma:asset/35c2f50c011ce133af3d1a6cca020e4454ff72ad.png';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-[#001a4d] text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#00132e] py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>1800-6969</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>123 Nguyễn Trãi, Q.1, TP.HCM</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Giao hàng nhanh 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Bảo An Medicine" className="h-20 w-20 object-contain" />
            <div className="hidden md:block">
              <div className="text-xl tracking-wider">BẢO AN</div>
              <div className="text-xs tracking-widest opacity-90">MEDICINE</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm thuốc, thực phẩm chức năng..."
                className="w-full px-4 py-2.5 pr-12 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-md transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-cyan-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">
                    Tài khoản của tôi
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    Đơn hàng
                  </Link>
                  <button onClick={onLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <User className="w-6 h-6" />
                <span className="hidden md:inline">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm thuốc..."
              className="w-full px-4 py-2 pr-12 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-md">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#002055] border-t border-cyan-800">
        <div className="container mx-auto px-4">
          <ul className={`md:flex md:items-center md:gap-8 py-3 ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
            <li>
              <Link to="/" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/products" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/products?category=prescription" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Thuốc kê đơn
              </Link>
            </li>
            <li>
              <Link to="/products?category=otc" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Thuốc không kê đơn
              </Link>
            </li>
            <li>
              <Link to="/products?category=supplement" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Thực phẩm chức năng
              </Link>
            </li>
            <li>
              <Link to="/prescriptions" className="block py-2 md:py-0 hover:text-cyan-400 transition-colors">
                Đơn thuốc của tôi
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;