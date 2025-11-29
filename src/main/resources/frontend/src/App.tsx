import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/fragments/Header';
import Footer from './components/fragments/Footer';
import HomePage from './components/customer/HomePage';
import ProductsPage from './components/customer/ProductsPage';
import ProductDetailPage from './components/customer/ProductDetailPage';
import CartPage from './components/customer/CartPage';
import CheckoutPage from './components/customer/CheckoutPage';
import ProfilePage from './components/customer/ProfilePage';
import ProfileEditPage from './components/customer/ProfileEditPage';
import AddressesPage from './components/customer/AddressesPage';
import PaymentMethodsPage from './components/customer/PaymentMethodsPage';
import OrdersListPage from './components/customer/orders/OrdersListPage';
import OrderDetailPage from './components/customer/orders/OrderDetailPage';
import PrescriptionsPage from './components/customer/orders/PrescriptionsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminSidebar from './components/fragments/AdminSidebar';
import Chatbox from './components/Chatbox';
import ChatWidget from './components/ui/ChatWidget';
// Import Service Giỏ hàng và Auth
import { CartService } from './services/cartService';
import { AuthService } from './services/authService';

function App() {
  const [user, setUser] = useState<any>(null);
  // cartItems bây giờ sẽ chứa mảng items lấy từ API
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Hàm tải giỏ hàng từ API
  const fetchCart = useCallback(async () => {
    // Chỉ gọi API nếu đã có User (đã đăng nhập)
    const token = localStorage.getItem('accessToken');
    if (token) {
      const cartData = await CartService.getCart();
      if (cartData) {
        setCartItems(cartData.items);
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    // 1. Kiểm tra User đăng nhập
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        // 2. Nếu đã login thì tải giỏ hàng luôn
        await fetchCart();
      }
    };
    initAuth();
  }, [fetchCart]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Sau khi login, tải ngay giỏ hàng của user đó
    fetchCart();
  };

  const handleLogout = () => {
    AuthService.logout(); // Xóa token
    setUser(null);
    setCartItems([]); // Xóa giỏ hàng trên UI
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Hàm này được truyền xuống các trang con.
  // Khi trang con (VD: CartPage, ProductDetail) thay đổi giỏ hàng qua API,
  // họ sẽ gọi hàm này để App cập nhật lại số lượng trên Header.
  const handleRefreshCart = async () => {
    await fetchCart();
  };

  const isAdmin = user?.role === 'admin' || (user?.roles && user.roles.includes('ROLE_ADMIN'));

  return (
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />)} />
          <Route path="/register" element={!user ? <RegisterPage onLogin={handleLogin} /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />)} />

          {/* Admin Routes */}
          {isAdmin ? (
              <Route path="/*" element={
                <div className="flex min-h-screen bg-gray-100">
                  <AdminSidebar user={user} onLogout={handleLogout} />
                  <div className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Navigate to="/admin" />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="*" element={<Navigate to="/admin" />} />
                    </Routes>
                  </div>
                </div>
              } />
          ) : (
              /* Customer Routes */
              <Route path="/*" element={
                <>
                  {/* Truyền cartItems.length để hiển thị số lượng trên Header */}
                  <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />

                      {/* Truyền handleRefreshCart vào prop updateCart */}
                      <Route path="/products/:id" element={<ProductDetailPage cart={cartItems} updateCart={handleRefreshCart} />} />

                      <Route path="/cart" element={<CartPage cart={cartItems} updateCart={handleRefreshCart} />} />

                      <Route path="/checkout" element={user ? <CheckoutPage cart={cartItems} updateCart={handleRefreshCart} user={user} /> : <Navigate to="/login" />} />
                      <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/profile/edit" element={user ? <ProfileEditPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                      <Route path="/profile/addresses" element={user ? <AddressesPage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/profile/payment-methods" element={user ? <PaymentMethodsPage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/orders" element={user ? <OrdersListPage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/orders/:id" element={user ? <OrderDetailPage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/prescriptions" element={user ? <PrescriptionsPage user={user} /> : <Navigate to="/login" />} />
                      <Route path="/admin/*" element={<Navigate to="/login" />} />
                    </Routes>
                  </main>
                  <Chatbox />
                  <Footer />
                </>
              } />
          )}
        </Routes>
        <ChatWidget />
      </Router>
  );
}

export default App;