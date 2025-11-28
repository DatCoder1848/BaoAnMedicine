import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Home, Briefcase, CheckCircle, Loader2, MapPin, Edit3, Save, X } from 'lucide-react';
import { UserService } from '../../services/userService';
import { Address } from '../../types/user';

// Danh sách 63 Tỉnh/Thành phố Việt Nam
const VIETNAM_PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
  "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
  "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương",
  "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
  "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
  "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
].sort();

interface AddressesPageProps {
  user: any;
}

const AddressesPage: React.FC<AddressesPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Lưu ID đang sửa (null nếu là thêm mới)
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    recipientName: '',
    phoneNumber: '',
    specificAddress: '',
    city: 'TP. Hồ Chí Minh',
    label: 'Nhà riêng'
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Mở form để Thêm mới (Reset dữ liệu)
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      recipientName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      specificAddress: '',
      city: 'TP. Hồ Chí Minh',
      label: 'Nhà riêng'
    });
    setShowForm(true);
  };

  // Mở form để Sửa (Đổ dữ liệu cũ vào)
  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      recipientName: addr.recipientName,
      phoneNumber: addr.phoneNumber,
      specificAddress: addr.specificAddress,
      city: addr.city,
      label: addr.label || 'Nhà riêng'
    });
    setShowForm(true);
    // Cuộn lên đầu form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.specificAddress || !formData.recipientName || !formData.phoneNumber) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // --- LOGIC CẬP NHẬT ---
        // Lưu ý: Bạn cần đảm bảo UserService có hàm updateAddress (PUT).
        // Nếu chưa có, hãy thêm vào UserService.ts tương tự như addAddress
        await UserService.updateAddress(editingId, formData);
      } else {
        // --- LOGIC THÊM MỚI ---
        await UserService.addAddress(formData);
      }

      await fetchAddresses();
      setShowForm(false);
    } catch (error) {
      alert(editingId ? "Lỗi cập nhật địa chỉ." : "Lỗi thêm địa chỉ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await UserService.deleteAddress(id);
      await fetchAddresses();
    } catch (error) {
      alert("Xóa thất bại.");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await UserService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (error) {
      alert("Lỗi đặt mặc định.");
    }
  };

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-gray-900 font-bold text-2xl">Sổ địa chỉ</h1>
            </div>

            {/* Nút Thêm Mới (Gradient Xanh) */}
            {!showForm && (
                <button
                    onClick={handleOpenAdd}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                >
                  <Plus className="w-5 h-5" /> Thêm địa chỉ mới
                </button>
            )}
          </div>

          {/* FORM NHẬP LIỆU (Thêm hoặc Sửa) */}
          {showForm && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-cyan-100 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>

                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-cyan-600"/> : <Plus className="w-5 h-5 text-cyan-600"/>}
                  {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tên người nhận <span className="text-red-500">*</span></label>
                      <input
                          type="text" required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                          value={formData.recipientName}
                          onChange={e => setFormData({...formData, recipientName: e.target.value})}
                          placeholder="VD: Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                      <input
                          type="tel" required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                          value={formData.phoneNumber}
                          onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                          placeholder="VD: 0912345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                    <input
                        type="text" required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                        value={formData.specificAddress}
                        onChange={e => setFormData({...formData, specificAddress: e.target.value})}
                        placeholder="Số nhà, tên đường, phường/xã..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                      <select
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white cursor-pointer outline-none"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                      >
                        {VIETNAM_PROVINCES.map((province) => (
                            <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Loại địa chỉ</label>
                      <select
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white cursor-pointer outline-none"
                          value={formData.label}
                          onChange={e => setFormData({...formData, label: e.target.value})}
                      >
                        <option value="Nhà riêng">Nhà riêng</option>
                        <option value="Văn phòng">Văn phòng</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Gradient & Styling) */}
                  <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-cyan-600 hover:to-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 transition-all transform hover:-translate-y-0.5"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                      {editingId ? "Cập nhật" : "Lưu địa chỉ"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      <X className="w-5 h-5"/> Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
          )}

          {/* DANH SÁCH ĐỊA CHỈ */}
          {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-cyan-600"/></div>
          ) : (
              <div className="space-y-4">
                {addresses.length === 0 && !showForm && (
                    <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                      <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg mb-4">Bạn chưa lưu địa chỉ nào.</p>
                      <button
                          onClick={handleOpenAdd}
                          className="text-cyan-600 font-bold hover:text-cyan-700 hover:underline"
                      >
                        + Thêm địa chỉ ngay
                      </button>
                    </div>
                )}

                {addresses.map((addr) => (
                    <div key={addr.id} className={`group bg-white rounded-2xl shadow-sm p-6 relative border transition-all duration-200 ${addr.isDefault ? 'border-cyan-500 ring-1 ring-cyan-500 shadow-md' : 'border-gray-100 hover:border-cyan-200 hover:shadow-md'}`}>

                      {/* Badge Mặc định */}
                      {addr.isDefault && (
                          <div className="absolute top-5 right-5 text-cyan-700 text-xs font-bold bg-cyan-50 px-3 py-1 rounded-full flex items-center gap-1 border border-cyan-100">
                            <CheckCircle className="w-3.5 h-3.5"/> Mặc định
                          </div>
                      )}

                      <div className="flex gap-5">
                        {/* Icon loại địa chỉ */}
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border ${addr.isDefault ? 'bg-cyan-50 border-cyan-100' : 'bg-gray-50 border-gray-100'}`}>
                          {addr.label === 'Văn phòng'
                              ? <Briefcase className={`w-6 h-6 ${addr.isDefault ? 'text-cyan-600' : 'text-gray-500'}`}/>
                              : <Home className={`w-6 h-6 ${addr.isDefault ? 'text-cyan-600' : 'text-gray-500'}`}/>}
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1 pr-20"> {/* pr-20 để tránh đè badge */}
                            <h3 className="font-bold text-gray-900 text-lg">{addr.recipientName}</h3>
                            <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded bg-gray-50 uppercase tracking-wide">{addr.label}</span>
                          </div>

                          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                            <span>{addr.phoneNumber}</span>
                          </div>

                          <div className="text-gray-800 font-medium mt-1">
                            {addr.specificAddress}, {addr.city}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-5 text-sm pt-4 border-t border-gray-50">

                            {/* Nút đặt mặc định */}
                            {!addr.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="text-cyan-600 hover:text-cyan-800 font-semibold hover:underline flex items-center gap-1"
                                >
                                  <CheckCircle className="w-4 h-4"/> Đặt làm mặc định
                                </button>
                            )}

                            <div className="ml-auto flex gap-3">
                              {/* Nút Sửa (Yêu cầu 1) */}
                              <button
                                  onClick={() => handleOpenEdit(addr)}
                                  className="text-gray-500 hover:text-cyan-600 flex items-center gap-1 font-medium transition-colors bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-cyan-50"
                              >
                                <Edit3 className="w-4 h-4" /> Sửa
                              </button>

                              {/* Nút Xóa */}
                              <button
                                  onClick={() => handleDelete(addr.id)}
                                  className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" /> Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default AddressesPage;