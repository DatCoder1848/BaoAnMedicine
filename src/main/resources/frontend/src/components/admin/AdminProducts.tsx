import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const products = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Thuốc không kê đơn', price: 15000, stock: 150, status: 'active' },
    { id: 2, name: 'Vitamin C 1000mg', category: 'Thực phẩm chức năng', price: 120000, stock: 85, status: 'active' },
    { id: 3, name: 'Amoxicillin 500mg', category: 'Thuốc kê đơn', price: 45000, stock: 60, status: 'active' },
    { id: 4, name: 'Omega-3 Fish Oil', category: 'Thực phẩm chức năng', price: 250000, stock: 45, status: 'active' },
    { id: 5, name: 'Ibuprofen 400mg', category: 'Thuốc không kê đơn', price: 25000, stock: 120, status: 'active' },
    { id: 6, name: 'Multivitamin Premium', category: 'Thực phẩm chức năng', price: 350000, stock: 30, status: 'low' },
    { id: 7, name: 'Cetirizine 10mg', category: 'Thuốc không kê đơn', price: 30000, stock: 95, status: 'active' },
    { id: 8, name: 'Collagen Beauty Plus', category: 'Thực phẩm chức năng', price: 450000, stock: 5, status: 'low' },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900">Quản lý sản phẩm</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Giá</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{product.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm">{product.price.toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={product.stock < 10 ? 'text-red-600' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {product.status === 'active' ? 'Hoạt động' : 'Sắp hết'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
