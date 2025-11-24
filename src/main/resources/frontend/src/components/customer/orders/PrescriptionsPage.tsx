import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Download, Eye, Trash2 } from 'lucide-react';

interface PrescriptionsPageProps {
  user: any;
}

const PrescriptionsPage: React.FC<PrescriptionsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      name: 'Đơn thuốc kháng sinh',
      doctor: 'BS. Nguyễn Văn A',
      hospital: 'Bệnh viện Chợ Rẫy',
      date: '15/11/2025',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1630094539596-da3ab25241d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJlc2NyaXB0aW9ufGVufDF8fHx8MTc2MzY5NTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      name: 'Đơn thuốc cao huyết áp',
      doctor: 'BS. Trần Thị B',
      hospital: 'Bệnh viện Thống Nhất',
      date: '10/11/2025',
      status: 'used',
      image: 'https://images.unsplash.com/photo-1630094539596-da3ab25241d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJlc2NyaXB0aW9ufGVufDF8fHx8MTc2MzY5NTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa đơn thuốc này?')) {
      setPrescriptions(prescriptions.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900">Đơn thuốc của tôi</h1>
          </div>
          <label className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Tải đơn thuốc
            <input type="file" className="hidden" accept="image/*,.pdf" />
          </label>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-blue-900 mb-2">Hướng dẫn tải đơn thuốc</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Chụp ảnh đơn thuốc rõ nét, đầy đủ thông tin</li>
            <li>Đơn thuốc phải có chữ ký và con dấu của bác sĩ</li>
            <li>Định dạng hỗ trợ: JPG, PNG, PDF</li>
            <li>Dược sĩ sẽ xác nhận trong vòng 1-2 giờ</li>
          </ul>
        </div>

        {/* Prescriptions Grid */}
        {prescriptions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Prescription Image */}
                <div className="h-48 bg-gray-100 overflow-hidden relative group">
                  <img
                    src={prescription.image}
                    alt={prescription.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                      <Download className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  {prescription.status === 'active' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Còn hiệu lực
                    </div>
                  )}
                  {prescription.status === 'used' && (
                    <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-3 py-1 rounded-full">
                      Đã sử dụng
                    </div>
                  )}
                </div>

                {/* Prescription Info */}
                <div className="p-6">
                  <h3 className="text-sm mb-3">{prescription.name}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Bác sĩ: {prescription.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{prescription.hospital}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ngày kê đơn: {prescription.date}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-grow bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                      Mua thuốc theo đơn
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">Chưa có đơn thuốc</h3>
            <p className="text-gray-600 mb-6">
              Tải lên đơn thuốc của bạn để mua thuốc nhanh chóng và chính xác
            </p>
            <label className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer">
              Tải đơn thuốc
              <input type="file" className="hidden" accept="image/*,.pdf" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionsPage;
