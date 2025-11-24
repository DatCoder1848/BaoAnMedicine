import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm' },
    { id: 'prescription', name: 'Thuốc kê đơn' },
    { id: 'otc', name: 'Thuốc không kê đơn' },
    { id: 'supplement', name: 'Thực phẩm chức năng' },
    { id: 'healthcare', name: 'Chăm sóc sức khỏe' },
  ];

  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'otc',
      price: 15000,
      description: 'Giảm đau, hạ sốt',
      image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      category: 'supplement',
      price: 120000,
      description: 'Tăng cường sức đề kháng',
      image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 3,
      name: 'Amoxicillin 500mg',
      category: 'prescription',
      price: 45000,
      description: 'Kháng sinh',
      image: 'https://images.unsplash.com/photo-1630094539596-da3ab25241d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJlc2NyaXB0aW9ufGVufDF8fHx8MTc2MzY5NTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Cần đơn',
    },
    {
      id: 4,
      name: 'Omega-3 Fish Oil',
      category: 'supplement',
      price: 250000,
      description: 'Hỗ trợ tim mạch',
      image: 'https://images.unsplash.com/photo-1706777227772-629b1cdb8a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYzNzM1MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 5,
      name: 'Ibuprofen 400mg',
      category: 'otc',
      price: 25000,
      description: 'Giảm đau, chống viêm',
      image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 6,
      name: 'Multivitamin Premium',
      category: 'supplement',
      price: 350000,
      description: 'Vitamin tổng hợp',
      image: 'https://images.unsplash.com/photo-1706777227772-629b1cdb8a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYzNzM1MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 7,
      name: 'Cetirizine 10mg',
      category: 'otc',
      price: 30000,
      description: 'Thuốc dị ứng',
      image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
    {
      id: 8,
      name: 'Collagen Beauty Plus',
      category: 'supplement',
      price: 450000,
      description: 'Làm đẹp da',
      image: 'https://images.unsplash.com/photo-1706777227772-629b1cdb8a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYzNzM1MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Còn hàng',
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-4">Sản phẩm</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-cyan-600" />
                <h2 className="text-gray-900">Bộ lọc</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-700 mb-3">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory === cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm text-gray-700 mb-3">Khoảng giá</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'under50', label: 'Dưới 50,000đ' },
                    { id: '50to200', label: '50,000đ - 200,000đ' },
                    { id: '200to500', label: '200,000đ - 500,000đ' },
                    { id: 'over500', label: 'Trên 500,000đ' },
                  ].map((range) => (
                    <label key={range.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={range.id}
                        checked={priceRange === range.id}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-gray-600">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-2">{product.stock}</div>
                    <h3 className="text-sm mb-2 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-600">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-600 transition-colors">
                        Mua
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
