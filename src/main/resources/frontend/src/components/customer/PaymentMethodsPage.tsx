import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';

interface PaymentMethodsPageProps {
  user: any;
}

const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4532',
      expiry: '12/25',
      name: user.name,
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8765',
      expiry: '06/26',
      name: user.name,
      isDefault: false,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900">Phương thức thanh toán</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm thẻ
          </button>
        </div>

        {/* Add Card Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-gray-900 mb-6">Thêm thẻ mới</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Số thẻ</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Tên trên thẻ</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  defaultValue={user.name.toUpperCase()}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Ngày hết hạn</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-grow bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Lưu thẻ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-8 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              {method.isDefault && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
                  Mặc định
                </div>
              )}

              <div className="relative">
                <div className="text-2xl mb-4">{getCardIcon(method.type)}</div>
                
                <div className="text-lg tracking-wider mb-4">•••• •••• •••• {method.last4}</div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs opacity-75 mb-1">Chủ thẻ</div>
                    <div className="text-sm">{method.name}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Hết hạn</div>
                    <div className="text-sm">{method.expiry}</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-white/20">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-sm hover:underline"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-sm hover:underline flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa thẻ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Payment Methods */}
        <div className="mt-8">
          <h2 className="text-gray-900 mb-4">Phương thức thanh toán khác</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <div className="text-sm mb-1">MoMo</div>
                <div className="text-xs text-gray-500">Ví điện tử MoMo</div>
              </div>
              <button className="ml-auto text-sm text-cyan-600 hover:text-cyan-700">
                Liên kết
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                💵
              </div>
              <div>
                <div className="text-sm mb-1">ZaloPay</div>
                <div className="text-xs text-gray-500">Ví điện tử ZaloPay</div>
              </div>
              <button className="ml-auto text-sm text-cyan-600 hover:text-cyan-700">
                Liên kết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
