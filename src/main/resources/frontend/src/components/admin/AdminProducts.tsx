import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  UploadCloud,
  Loader2,
  AlertCircle
} from "lucide-react";

// Import Service và Type chuẩn từ dự án của bạn
import { AdminService } from "../../services/adminService";
import { Product } from "../../types/product";

const AdminProducts: React.FC = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE MODAL & FORM ---
  const [showModal, setShowModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create'); // Chế độ của Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Data State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    categoryId: 1,
    price: 0,
    originalPrice: 0,
    stockQuantity: 0,
    unit: "",
    imageUrl: "",
    description: "",
    ingredients: "",
    usageInstructions: "",
    storageInstructions: "",
    manufacturer: "",
    // expiryString... (Nếu backend có field này thì thêm vào type Product, tạm thời để string)
  });

  // --- 1. LOAD DANH SÁCH SẢN PHẨM ---
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Gọi qua AdminService
      const data = await AdminService.getProducts(0, 100, searchQuery);
      // Kiểm tra cấu trúc trả về (Page hoặc List)
      if (data.content) {
        setProducts(data.content);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search hoặc load lần đầu
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- 2. XỬ LÝ IMPORT EXCEL ---
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Bạn có chắc muốn import file: ${file.name}?`)) return;

    setIsImporting(true);
    try {
      // Gọi qua AdminService
      await AdminService.importProductsExcel(file);
      alert("✅ Import dữ liệu thành công!");
      fetchProducts(); // Refresh lại bảng
    } catch (error: any) {
      alert("❌ Lỗi Import: " + (error.response?.data || error.message));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- 3. XỬ LÝ XÓA ---
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.")) return;

    try {
      await AdminService.deleteProduct(id);
      alert("✅ Đã xóa sản phẩm!");
      setProducts(prev => prev.filter(p => p.productId !== id));
    } catch (error) {
      alert("❌ Không thể xóa (Sản phẩm có thể đang nằm trong đơn hàng).");
    }
  };

  // --- 4. MỞ MODAL (THÊM / SỬA / XEM) ---

  // Mở form Thêm mới
  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  // Mở form Sửa
  const openEditModal = (product: Product) => {
    setModalMode('edit');
    fillForm(product);
    setShowModal(true);
  };

  // Mở form Xem chi tiết
  const openViewModal = (product: Product) => {
    setModalMode('view'); // Chế độ chỉ đọc
    fillForm(product);
    setShowModal(true);
  };

  const fillForm = (product: Product) => {
    setFormData({
      ...product,
      categoryId: product.categoryId || 1 // Fallback nếu null
    });
  };

  const resetForm = () => {
    setFormStep(1);
    setFormData({
      name: "",
      categoryId: 1,
      price: 0,
      originalPrice: 0,
      stockQuantity: 0,
      unit: "",
      imageUrl: "",
      description: "",
      ingredients: "",
      usageInstructions: "",
      storageInstructions: "",
      manufacturer: ""
    });
  };

  // --- 5. SUBMIT FORM (LƯU) ---
  const handleSubmit = async () => {
    if (modalMode === 'view') {
      setShowModal(false);
      return;
    }

    // Validate đơn giản
    if (!formData.name || !formData.price) {
      alert("Vui lòng nhập Tên sản phẩm và Giá bán!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        await AdminService.createProduct(formData);
        alert("✅ Thêm mới thành công!");
      } else if (modalMode === 'edit' && formData.productId) {
        await AdminService.updateProduct(formData.productId, formData);
        alert("✅ Cập nhật thành công!");
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- XỬ LÝ INPUT ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stockQuantity' || name === 'categoryId'
          ? Number(value)
          : value
    }));
  };

  return (
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-7xl mx-auto">

          {/* --- HEADER & ACTIONS --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý kho thuốc</h1>
              <p className="text-gray-500 text-sm mt-1">Quản lý sản phẩm, tồn kho và danh mục</p>
            </div>

            <div className="flex gap-3">
              {/* Nút Import Excel - ÉP MÀU XANH LÁ BẰNG STYLE CỨNG */}
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportExcel}
                  accept=".xlsx, .xls"
                  className="hidden"
              />
              <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  // Style cứng để ép màu hiện ra
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                  className="px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md font-bold disabled:opacity-70 hover:opacity-90 transition-all"
              >
                {isImporting ? <Loader2 className="w-5 h-5 animate-spin"/> : <FileSpreadsheet className="w-5 h-5" />}
                Import Excel
              </button>

              {/* Nút Thêm Mới - ÉP MÀU XANH DƯƠNG BẰNG STYLE CỨNG */}
              <button
                  onClick={openCreateModal}
                  // Style cứng để ép màu hiện ra
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                  className="px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-5 h-5" />
                Thêm thuốc mới
              </button>
            </div>
          </div>

          {/* --- SEARCH BAR --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative max-w-lg">
              <input
                  type="text"
                  placeholder="Tìm kiếm theo tên thuốc, hoạt chất..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* --- TABLE --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                  <p>Đang tải dữ liệu từ hệ thống...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Giá bán</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tồn kho</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.productId} className="hover:bg-blue-50/50 transition-colors">
                              {/* Cột Sản phẩm */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <UploadCloud className="text-gray-400 w-6 h-6"/>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">{product.name}</div>
                                    <div className="text-xs text-gray-500">{product.unit || 'Đơn vị: --'}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Cột Danh mục */}
                              <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {product.categoryName || 'Chưa phân loại'}
                        </span>
                              </td>

                              {/* Cột Giá */}
                              <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right">
                                {product.price?.toLocaleString("vi-VN")}đ
                              </td>

                              {/* Cột Tồn kho */}
                              <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          (product.stockQuantity || 0) < 10
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                      }`}>
                        {product.stockQuantity || 0}
                      </span>
                              </td>

                              {/* Cột Hành động */}
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                      onClick={() => openViewModal(product)}
                                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                      title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                      onClick={() => openEditModal(product)}
                                      className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                      title="Chỉnh sửa"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                      onClick={() => handleDelete(product.productId)}
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))) : (
                        <tr>
                          <td colSpan={5} className="text-center py-16">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <AlertCircle className="w-12 h-12 mb-3 opacity-20"/>
                              <p className="text-lg font-medium text-gray-500">Chưa có dữ liệu thuốc</p>
                              <p className="text-sm">Hãy thử Import Excel hoặc thêm thủ công.</p>
                            </div>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>

        {/* --- MODAL CHUNG (Thêm / Sửa / Xem) --- */}
        {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">

                {/* Modal Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${
                    modalMode === 'view' ? 'bg-gray-100' : 'bg-white'
                }`}>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {modalMode === 'create' && <><Plus className="w-5 h-5 text-blue-600"/> Thêm thuốc mới</>}
                    {modalMode === 'edit' && <><Edit2 className="w-5 h-5 text-amber-600"/> Cập nhật thông tin</>}
                    {modalMode === 'view' && <><Eye className="w-5 h-5 text-gray-600"/> Chi tiết sản phẩm</>}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  {/* Thông báo chế độ xem */}
                  {modalMode === 'view' && (
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4"/>
                        Bạn đang xem ở chế độ chỉ đọc. Không thể chỉnh sửa.
                      </div>
                  )}

                  {/* Step Tabs */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                        onClick={() => setFormStep(1)}
                        className={`pb-2 px-4 text-sm font-medium transition-colors ${formStep === 1 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                      1. Thông tin cơ bản
                    </button>
                    <button
                        onClick={() => setFormStep(2)}
                        className={`pb-2 px-4 text-sm font-medium transition-colors ${formStep === 2 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                      2. Chi tiết y tế
                    </button>
                  </div>

                  {formStep === 1 ? (
                      /* --- FORM STEP 1 --- */
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc <span className="text-red-500">*</span></label>
                            <input
                                type="text" name="name"
                                value={formData.name} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="VD: Panadol Extra"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            >
                              <option value="1">Giảm đau & Hạ sốt</option>
                              <option value="2">Tiêu hóa</option>
                              <option value="3">Hô hấp</option>
                              <option value="4">Vitamin & Khoáng chất</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                            <input
                                type="number" name="price"
                                value={formData.price} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                            <input
                                type="number" name="originalPrice"
                                value={formData.originalPrice} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                            <input
                                type="number" name="stockQuantity"
                                value={formData.stockQuantity} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                            <input
                                type="text" name="unit"
                                value={formData.unit} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                placeholder="Hộp, Vỉ, Chai..."
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh (URL)</label>
                          <div className="flex gap-2">
                            <input
                                type="text" name="imageUrl"
                                value={formData.imageUrl} onChange={handleInputChange}
                                disabled={modalMode === 'view'}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="/images/products/..."
                            />
                            {formData.imageUrl && (
                                <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                                  <img src={formData.imageUrl} alt="Review" className="w-full h-full object-cover"/>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                  ) : (
                      /* --- FORM STEP 2 --- */
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Thành phần</label>
                          <textarea
                              name="ingredients" rows={2}
                              value={formData.ingredients} onChange={handleInputChange}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Công dụng (Mô tả)</label>
                          <textarea
                              name="description" rows={3}
                              value={formData.description} onChange={handleInputChange}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn sử dụng</label>
                          <textarea
                              name="usageInstructions" rows={2}
                              value={formData.usageInstructions} onChange={handleInputChange}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bảo quản</label>
                          <textarea
                              name="storageInstructions" rows={2}
                              value={formData.storageInstructions} onChange={handleInputChange}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                  )}
                </div>

                {/* Modal Footer */}
                {/* Modal Footer - Đã chỉnh lại màu nút */}
                <div className="p-6 border-t bg-gray-50 flex justify-between sticky bottom-0 rounded-b-2xl z-20">
                  <button
                      onClick={() => {
                        if (formStep === 2) setFormStep(1);
                        else setShowModal(false);
                      }}
                      // Nút Hủy: Màu trắng, viền xám
                      style={{ backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db' }}
                      className="px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:bg-gray-100"
                  >
                    {formStep === 1 ? (modalMode === 'view' ? "Đóng" : "Hủy bỏ") : "Quay lại"}
                  </button>

                  {modalMode !== 'view' && (
                      <button
                          onClick={() => {
                            if (formStep === 1) setFormStep(2);
                            else handleSubmit();
                          }}
                          disabled={isSubmitting}
                          // Nút Hành động: ÉP MÀU XANH DƯƠNG
                          style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                          className="px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md disabled:opacity-70 transition-all hover:opacity-90"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : (
                            formStep === 1 ? (
                                <>Tiếp tục <ChevronRight size={18}/></>
                            ) : (
                                modalMode === 'edit' ? "Cập nhật" : "Hoàn tất"
                            )
                        )}
                      </button>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminProducts;