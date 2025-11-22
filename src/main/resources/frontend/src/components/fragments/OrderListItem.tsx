import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface OrderListItemProps {
  order: any;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipping':
        return 'text-purple-600 bg-purple-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Link to={`/orders/${order.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(order.status)}
          <div>
            <div className="text-sm text-gray-500">Đơn hàng #{order.id}</div>
            <div className="text-xs text-gray-400 mt-1">{order.date}</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="space-y-2 mb-4">
        {order.items.slice(0, 2).map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="text-sm truncate">{item.name}</div>
              <div className="text-xs text-gray-500">x{item.quantity}</div>
            </div>
            <div className="text-sm">{item.price.toLocaleString('vi-VN')}đ</div>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-sm text-gray-500 text-center">
            và {order.items.length - 2} sản phẩm khác
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t pt-4 flex items-center justify-between">
        <span className="text-gray-600">Tổng cộng:</span>
        <span className="text-cyan-600">{order.total.toLocaleString('vi-VN')}đ</span>
      </div>
    </Link>
  );
};

export default OrderListItem;
