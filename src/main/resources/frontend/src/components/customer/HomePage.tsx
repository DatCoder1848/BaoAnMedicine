import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Truck, HeadphonesIcon, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Thuốc chính hãng',
      description: '100% sản phẩm được nhập khẩu từ nhà thuốc uy tín',
    },
    {
      icon: Truck,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng tận nơi trong vòng 2-4 giờ',
    },
    {
      icon: HeadphonesIcon,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ dược sĩ tư vấn miễn phí',
    },
    {
      icon: Pill,
      title: 'Đa dạng sản phẩm',
      description: 'Hơn 10,000+ sản phẩm thuốc và TPCN',
    },
  ];

  const categories = [
    { name: 'Thuốc kê đơn', link: '/products?category=prescription', color: 'from-red-500 to-pink-500' },
    { name: 'Thuốc không kê đơn', link: '/products?category=otc', color: 'from-blue-500 to-cyan-500' },
    { name: 'Thực phẩm chức năng', link: '/products?category=supplement', color: 'from-green-500 to-emerald-500' },
    { name: 'Chăm sóc sức khỏe', link: '/products?category=healthcare', color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl mb-6">
                Nhà Thuốc Bảo An
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Chăm sóc sức khỏe của bạn và gia đình với sản phẩm chính hãng, giá tốt nhất thị trường
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-white text-cyan-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  Xem sản phẩm
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/prescriptions"
                  className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-cyan-600 transition-colors"
                >
                  Tải đơn thuốc
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lfGVufDF8fHx8MTc2MzczNTMxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Pharmacy"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 relative">
          <Carousel className="rounded-xl shadow-lg max-h-72 mx-auto" opts={{ loop: true }}>
            <CarouselPrevious className="z-10" />
            <CarouselContent>
              {[
                '/src/assets/dhc.jpg',
                '/src/assets/fishoil.jpg',
                '/src/assets/urgo.jpg',
              ].map((src, index) => (
                <CarouselItem key={index}>
                  <ImageWithFallback
                    src={src}
                    alt={`Banner ${index + 1}`}
                    className="w-full rounded-xl object-cover max-h-72"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="z-10" />
          </Carousel>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Danh mục sản phẩm</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className={`bg-gradient-to-br ${category.color} text-white p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1`}
              >
                <h3 className="text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2>Sản phẩm phổ biến</h2>
            <Link to="/products" className="text-cyan-600 hover:text-cyan-700 flex items-center gap-2">
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { id: 1, name: 'Paracetamol 500mg', price: 15000, image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
              { id: 2, name: 'Vitamin C 1000mg', price: 120000, image: 'https://images.unsplash.com/photo-1601302030807-8cfadb191a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxscyUyMHZpdGFtaW5zfGVufDF8fHx8MTc2MzczNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
              { id: 3, name: 'Amoxicillin 500mg', price: 45000, image: 'https://images.unsplash.com/photo-1630094539596-da3ab25241d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJlc2NyaXB0aW9ufGVufDF8fHx8MTc2MzY5NTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
              { id: 4, name: 'Omega-3 Fish Oil', price: 250000, image: 'https://images.unsplash.com/photo-1706777227772-629b1cdb8a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYzNzM1MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
            ].map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm mb-2">{product.name}</h3>
                  <p className="text-cyan-600">{product.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6">Tải ứng dụng Bảo An Medicine</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Trải nghiệm mua sắm thuốc dễ dàng hơn trên ứng dụng di động
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              App Store
            </button>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
