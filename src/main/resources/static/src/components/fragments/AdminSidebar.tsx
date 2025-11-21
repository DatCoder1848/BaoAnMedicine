import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from 'lucide-react';
import logo from 'figma:asset/35c2f50c011ce133af3d1a6cca020e4454ff72ad.png';

interface AdminSidebarProps {
  user: any;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
  ];

  return (
    <aside className="w-64 bg-[#001a4d] text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-cyan-800">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Bảo An Medicine" className="h-12 w-12 object-contain" />
          <div>
            <div className="tracking-wider">BẢO AN</div>
            <div className="text-xs tracking-widest opacity-90">ADMIN</div>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-cyan-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="text-sm">{user?.name}</div>
            <div className="text-xs opacity-75">Administrator</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'hover:bg-cyan-900 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-cyan-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 text-gray-300 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;