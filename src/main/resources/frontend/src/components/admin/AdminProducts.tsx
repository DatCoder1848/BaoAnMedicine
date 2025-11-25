import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const AdminProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formStep, setFormStep] = useState(1);

  // Form state for basic info
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    category: "otc",
    price: "",
    originalPrice: "",
    stock: "",
    brand: "",
    unit: "",
    image: "",
  });

  // Form state for detailed info
  const [detailedInfo, setDetailedInfo] = useState({
    ingredients: "",
    uses: "",
    dosage: "",
    sideEffects: "",
    storage: "",
    expiry: "",
  });

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailedInfoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetailedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Product Data:", { basicInfo, detailedInfo });
    // Reset form
    setBasicInfo({
      name: "",
      category: "otc",
      price: "",
      originalPrice: "",
      stock: "",
      brand: "",
      unit: "",
      image: "",
    });
    setDetailedInfo({
      ingredients: "",
      uses: "",
      dosage: "",
      sideEffects: "",
      storage: "",
      expiry: "",
    });
    setFormStep(1);
    setShowAddModal(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormStep(1);
    setBasicInfo({
      name: "",
      category: "otc",
      price: "",
      originalPrice: "",
      stock: "",
      brand: "",
      unit: "",
      image: "",
    });
    setDetailedInfo({
      ingredients: "",
      uses: "",
      dosage: "",
      sideEffects: "",
      storage: "",
      expiry: "",
    });
  };

  const products = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Thuốc không kê đơn",
      price: 15000,
      stock: 150,
      status: "active",
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      category: "Thực phẩm chức năng",
      price: 120000,
      stock: 85,
      status: "active",
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      category: "Thuốc kê đơn",
      price: 45000,
      stock: 60,
      status: "active",
    },
    {
      id: 4,
      name: "Omega-3 Fish Oil",
      category: "Thực phẩm chức năng",
      price: 250000,
      stock: 45,
      status: "active",
    },
    {
      id: 5,
      name: "Ibuprofen 400mg",
      category: "Thuốc không kê đơn",
      price: 25000,
      stock: 120,
      status: "active",
    },
    {
      id: 6,
      name: "Multivitamin Premium",
      category: "Thực phẩm chức năng",
      price: 350000,
      stock: 30,
      status: "low",
    },
    {
      id: 7,
      name: "Cetirizine 10mg",
      category: "Thuốc không kê đơn",
      price: 30000,
      stock: 95,
      status: "active",
    },
    {
      id: 8,
      name: "Collagen Beauty Plus",
      category: "Thực phẩm chức năng",
      price: 450000,
      stock: 5,
      status: "low",
    },
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
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{product.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={product.stock < 10 ? "text-red-600" : ""}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status === "active" ? "Hoạt động" : "Sắp hết"}
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl text-gray-900">
                {formStep === 1
                  ? "Thêm sản phẩm - Bước 1: Thông tin cơ bản"
                  : "Thêm sản phẩm - Bước 2: Thông tin chi tiết"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {formStep === 1 ? (
                // Form 1: Basic Information
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sản phẩm *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={basicInfo.name}
                        onChange={handleBasicInfoChange}
                        placeholder="VD: Paracetamol 500mg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục *
                      </label>
                      <select
                        name="category"
                        value={basicInfo.category}
                        onChange={handleBasicInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="otc">Thuốc không kê đơn</option>
                        <option value="prescription">Thuốc kê đơn</option>
                        <option value="supplement">Thực phẩm chức năng</option>
                        <option value="healthcare">Chăm sóc sức khỏe</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá hiện tại (đ) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={basicInfo.price}
                        onChange={handleBasicInfoChange}
                        placeholder="15000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá gốc (đ)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={basicInfo.originalPrice}
                        onChange={handleBasicInfoChange}
                        placeholder="20000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tồn kho *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={basicInfo.stock}
                        onChange={handleBasicInfoChange}
                        placeholder="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thương hiệu *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={basicInfo.brand}
                        onChange={handleBasicInfoChange}
                        placeholder="VD: DHG Pharma"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn vị *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={basicInfo.unit}
                      onChange={handleBasicInfoChange}
                      placeholder="VD: Hộp 100 viên"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL ảnh sản phẩm
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={basicInfo.image}
                      onChange={handleBasicInfoChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              ) : (
                // Form 2: Detailed Information
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phần *
                    </label>
                    <textarea
                      name="ingredients"
                      value={detailedInfo.ingredients}
                      onChange={handleDetailedInfoChange}
                      placeholder="VD: Paracetamol 500mg"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Công dụng *
                    </label>
                    <textarea
                      name="uses"
                      value={detailedInfo.uses}
                      onChange={handleDetailedInfoChange}
                      placeholder="Mô tả công dụng chi tiết sản phẩm"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liều dùng *
                    </label>
                    <textarea
                      name="dosage"
                      value={detailedInfo.dosage}
                      onChange={handleDetailedInfoChange}
                      placeholder="Hướng dẫn sử dụng chi tiết"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tác dụng phụ
                    </label>
                    <textarea
                      name="sideEffects"
                      value={detailedInfo.sideEffects}
                      onChange={handleDetailedInfoChange}
                      placeholder="Liệt kê các tác dụng phụ có thể xảy ra"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cách bảo quản *
                    </label>
                    <textarea
                      name="storage"
                      value={detailedInfo.storage}
                      onChange={handleDetailedInfoChange}
                      placeholder="Hướng dẫn bảo quản sản phẩm"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hạn sử dụng *
                    </label>
                    <textarea
                      name="expiry"
                      value={detailedInfo.expiry}
                      onChange={handleDetailedInfoChange}
                      placeholder="VD: 36 tháng kể từ ngày sản xuất"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={() => {
                  if (formStep === 2) setFormStep(1);
                  else closeModal();
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {formStep === 1 ? "Hủy" : "Quay lại"}
              </button>
              <button
                onClick={() => {
                  if (formStep === 1) setFormStep(2);
                  else handleSubmit();
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 flex items-center gap-2"
              >
                {formStep === 1 ? (
                  <>
                    Tiếp tục
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  "Thêm sản phẩm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
