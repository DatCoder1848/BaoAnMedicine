import React, { useState, useEffect } from 'react';
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

function App() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const updateCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />)} />
        <Route path="/register" element={!user ? <RegisterPage onLogin={handleLogin} /> : (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />)} />

        {/* Admin Routes - Separate layout */}
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
          /* Customer Routes - With Header and Footer */
          <Route path="/*" element={
            <>
              <Header user={user} onLogout={handleLogout} cartCount={cart.length} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage cart={cart} updateCart={updateCart} />} />
                  <Route path="/cart" element={<CartPage cart={cart} updateCart={updateCart} />} />
                  <Route path="/checkout" element={user ? <CheckoutPage cart={cart} updateCart={updateCart} user={user} /> : <Navigate to="/login" />} />
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
              <Footer />
            </>
          } />
        )}
      </Routes>
    </Router>
  );
}

export default App;