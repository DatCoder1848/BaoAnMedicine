import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, MapPin, CreditCard, FileText, Loader2, AlertCircle, Edit, PlusCircle } from 'lucide-react';
import { OrderService } from '../../services/orderService';
import { UserService } from '../../services/userService';
import { Address } from '../../types/user';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MarketingService } from '../../services/marketingService'; // Import Service

interface CheckoutPageProps {
  cart: any[];
  updateCart: () => void;
  user: any;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, updateCart, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STATE QUẢN LÝ ĐỊA CHỈ ---
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(true);

  // --- STATE QUẢN LÝ FORM & THANH TOÁN ---
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'COD', // Mặc định là COD
    notes: '',
  });

  // --- STATE COUPON (MỚI) ---
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // 1. Load danh sách địa chỉ khi vào trang
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddr(true);
      try {
        const addresses = await UserService.getAddresses();
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          // Có địa chỉ -> Chọn cái mặc định
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          handleSelectAddress(defaultAddr);
        } else {
          // Không có -> Bắt buộc nhập mới
          setIsNewAddress(true);
          setFormData(prev => ({ ...prev, phone: user?.phoneNumber || '' }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddr(false);
      }
    };
    fetchAddresses();
  }, [user]);

  // Logic chọn địa chỉ từ combobox
  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setIsNewAddress(false);
    setFormData(prev => ({
      ...prev,
      address: addr.specificAddress,
      city: addr.city,
      phone: addr.phoneNumber
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'new') {
      setIsNewAddress(true);
      setSelectedAddressId(0);
      setFormData(prev => ({ ...prev, address: '', city: '', phone: '' }));
    } else {
      const addr = savedAddresses.find(a => a.id === Number(val));
      if (addr) handleSelectAddress(addr);
    }
  };


  // Tính tiền
  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 200000 ? 0 : 30000;

  // --- LOGIC TÍNH TỔNG TIỀN MỚI (Đã trừ giảm giá) ---
  const total = Math.max(0, subtotal + shipping - discountAmount);

  // --- HÀM XỬ LÝ CHECK COUPON ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCheckingCoupon(true);
    setCouponMessage({ type: '', text: '' });

    try {
      const discount = await MarketingService.validateCoupon(couponCode, subtotal);
      if (discount > 0) {
        setDiscountAmount(discount);
        setCouponMessage({ type: 'success', text: `Áp dụng thành công! Giảm ${discount.toLocaleString('vi-VN')}đ` });
      } else {
        setDiscountAmount(0);
        setCouponMessage({ type: 'error', text: 'Mã giảm giá không hợp lệ hoặc không đủ điều kiện.' });
      }
    } catch (err) {
      setDiscountAmount(0);
      setCouponMessage({ type: 'error', text: 'Mã không tồn tại hoặc đã hết hạn.' });
    } finally {
      setCheckingCoupon(false);
    }
  };
  // Logic tính tiền
  /*const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 200000 ? 0 : 30000;
  const total = subtotal + shipping;*/


  // Xử lý sự kiện "ĐẶT HÀNG NGAY"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation cơ bản
    if (!formData.address || !formData.phone) {
      setError("Vui lòng nhập đầy đủ địa chỉ và số điện thoại.");
      return;
    }
    if (isNewAddress && !formData.city) {
      setError("Vui lòng chọn Tỉnh/Thành phố.");
      return;
    }

    setLoading(true);

    try {
      // Ghép địa chỉ nếu cần
      const finalAddress = isNewAddress
          ? `${formData.address}, ${formData.city}`
          : `${formData.address}, ${formData.city}`;

      // 1. Gọi API tạo đơn hàng
      const order = await OrderService.checkout({
        shippingAddress: finalAddress,
        shippingPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        couponCode: discountAmount > 0 ? couponCode : undefined // Gửi mã nếu áp dụng thành công
      });

      // 2. Refresh giỏ hàng
      updateCart();

      // 3. Xử lý thanh toán
      // Nếu Backend trả về URL thanh toán (VNPay) -> Redirect
      if (order.paymentUrl) {
        window.location.href = order.paymentUrl;
      } else {
        // Nếu COD -> Chuyển sang trang chi tiết
        navigate(`/orders/${order.orderId}`);
      }

    } catch (err: any) {
      console.error("Checkout failed:", err);
      setError("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Nếu giỏ hàng trống -> Chặn
  if (cart.length === 0 && !loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-xl font-bold">Giỏ hàng trống</div>;

  return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-gray-900 mb-8 font-bold text-2xl">Thanh toán</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI: FORM NHẬP LIỆU */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Thông báo lỗi nếu có */}
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}

                {/* 1. KHU VỰC ĐỊA CHỈ */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3"><MapPin className="text-cyan-600"/><h2 className="text-gray-900 font-bold">Địa chỉ giao hàng</h2></div>
                    <button type="button" onClick={() => navigate('/profile/addresses')} className="text-cyan-600 text-sm flex items-center gap-1 font-medium"><Edit className="w-4 h-4"/> Quản lý sổ địa chỉ</button>
                  </div>
                  {loadingAddr ? <Loader2 className="animate-spin mx-auto text-cyan-600"/> : (
                      <div className="space-y-4">
                        {savedAddresses.length > 0 && (
                            <select value={isNewAddress ? 'new' : selectedAddressId} onChange={handleSelectChange} className="w-full px-4 py-3 rounded border font-medium">
                              {savedAddresses.map(addr => <option key={addr.id} value={addr.id}>{addr.label} - {addr.recipientName}</option>)}
                              <option value="new">+ Nhập địa chỉ mới...</option>
                            </select>
                        )}
                        <div className={`p-4 rounded border ${isNewAddress ? 'bg-white border-cyan-500' : 'bg-gray-50'}`}>
                          {isNewAddress ? (
                              <div className="space-y-3">
                                <h3 className="font-bold text-cyan-700 text-sm">Nhập thông tin mới:</h3>
                                <input type="tel" placeholder="SĐT người nhận" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded" required />
                                <input type="text" placeholder="Địa chỉ chi tiết" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded" required />
                                <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border rounded">
                                  <option value="">Chọn TP</option><option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option><option value="Hà Nội">Hà Nội</option><option value="Đà Nẵng">Đà Nẵng</option><option value="Cần Thơ">Cần Thơ</option>
                                </select>
                              </div>
                          ) : (
                              <div className="text-sm">
                                <div className="font-bold">{savedAddresses.find(a => a.id === selectedAddressId)?.recipientName} <span className="font-normal">({savedAddresses.find(a => a.id === selectedAddressId)?.phoneNumber})</span></div>
                                <div className="text-gray-600 mt-1">{savedAddresses.find(a => a.id === selectedAddressId)?.specificAddress}, {savedAddresses.find(a => a.id === selectedAddressId)?.city}</div>
                              </div>
                          )}
                        </div>
                      </div>
                  )}
                </div>

                {/* 2. KHU VỰC THANH TOÁN (ĐÃ KHÔI PHỤC) */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-cyan-600" />
                    <h2 className="text-gray-900 font-bold">Phương thức thanh toán</h2>
                  </div>
                  <div className="space-y-3">
                    {/* Option COD */}
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                          type="radio"
                          name="payment"
                          value="COD"
                          checked={formData.paymentMethod === 'COD'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-cyan-600 accent-cyan-600"
                      />
                      <div className="ml-3">
                        <span className="font-bold block text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                        <span className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi shipper giao hàng</span>
                      </div>
                    </label>

                    {/* Option VNPay */}
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'VNPAY' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                          type="radio"
                          name="payment"
                          value="VNPAY"
                          checked={formData.paymentMethod === 'VNPAY'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-cyan-600 accent-cyan-600"
                      />
                      <div className="ml-3">
                        <span className="font-bold block text-gray-800">Thanh toán qua VNPAY</span>
                        <span className="text-xs text-gray-500">Quét mã QR hoặc dùng thẻ ATM/Visa nội địa</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 3. KHU VỰC GHI CHÚ */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-3 mb-6"><FileText className="text-cyan-600"/><h2 className="text-gray-900 font-bold">Ghi chú đơn hàng</h2></div>
                  <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                      rows={3}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  />
                </div>
              </form>
            </div>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-24">
                <h2 className="text-gray-900 mb-6 font-bold text-lg">Đơn hàng của bạn</h2>

                {/* Danh sách sản phẩm rút gọn */}
                <div className="space-y-4 mb-6 pb-6 border-b max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                      <div key={item.cartItemId || item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <ImageWithFallback src={item.product?.imageUrl || item.image} alt={item.product?.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-grow text-sm">
                          <div className="font-medium text-gray-800 line-clamp-2">{item.product?.name || item.name}</div>
                          <div className="text-gray-500 mt-1">Số lượng: {item.quantity}</div>
                        </div>
                        <div className="font-bold text-sm text-gray-900">{((item.product?.price || item.price) * item.quantity).toLocaleString('vi-VN')}đ</div>
                      </div>
                  ))}
                </div>

                {/* --- PHẦN NHẬP COUPON (MỚI) --- */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Nhập mã coupon"
                          className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none uppercase"
                          disabled={discountAmount > 0} // Disable nếu đã áp dụng (muốn đổi phải xóa)
                      />
                      {discountAmount > 0 && (
                          <button
                              onClick={() => { setDiscountAmount(0); setCouponCode(''); setCouponMessage({type:'', text:''}); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 hover:underline"
                          >
                            Xóa
                          </button>
                      )}
                    </div>
                    <button
                        onClick={handleApplyCoupon}
                        disabled={checkingCoupon || !couponCode || discountAmount > 0}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {checkingCoupon ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Áp dụng'}
                    </button>
                  </div>
                  {/* Thông báo coupon */}
                  {couponMessage.text && (
                      <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {couponMessage.text}
                      </p>
                  )}
                </div>

                {/* Tính tiền */}
                {/* Tính tiền (Cập nhật hiển thị Discount) */}
                <div className="space-y-3 border-b pb-6 mb-6">
                  <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{subtotal.toLocaleString('vi-VN')}đ</span></div>
                  <div className="flex justify-between text-gray-600"><span>Phí vận chuyển:</span><span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}</span></div>

                  {/* Hiển thị dòng giảm giá nếu có */}
                  {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Giảm giá ({couponCode}):</span>
                        <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                      </div>
                  )}
                </div>
                <div className="flex justify-between mb-8 font-bold text-xl text-cyan-600">
                  <span>Tổng cộng:</span>
                  <span>{total.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* NÚT SUBMIT */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 flex justify-center gap-2 disabled:opacity-70 shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  {loading ? <Loader2 className="animate-spin"/> : 'ĐẶT HÀNG NGAY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;