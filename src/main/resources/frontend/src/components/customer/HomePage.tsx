import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { MarketingService } from "../../services/marketingService";
import { Advertisement, AdSlot } from "../../types/marketing";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import dhc from "../../assets/dhc.jpg";
import fishoil from "../../assets/fishoil.jpg";
import urgo from "../../assets/urgo.jpg";
import maiger from "../../assets/maiger.jpg";
import paracetamol from "../../assets/paracetamol.jpg";
import zinc from "../../assets/zinc.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const HomePage: React.FC = () => {

  const [banners, setBanners] = useState<Advertisement[]>([]);

  // Gọi API lấy Banner
  useEffect(() => {
    const fetchBanners = async () => {
      const ads = await MarketingService.getAds(AdSlot.HOMEPAGE_BANNER);
      setBanners(ads);
    };
    fetchBanners();
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Thuốc chính hãng",
      description: "100% sản phẩm được nhập khẩu từ nhà thuốc uy tín",
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh",
      description: "Giao hàng tận nơi trong vòng 2-4 giờ",
    },
    {
      icon: HeadphonesIcon,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ dược sĩ tư vấn miễn phí",
    },
    {
      icon: Pill,
      title: "Đa dạng sản phẩm",
      description: "Hơn 10,000+ sản phẩm thuốc và TPCN",
    },
  ];

  const categories = [
    {
      name: "Thuốc kê đơn",
      link: "/products?category=prescription",
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Thuốc không kê đơn",
      link: "/products?category=otc",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Thực phẩm chức năng",
      link: "/products?category=supplement",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Chăm sóc sức khỏe",
      link: "/products?category=healthcare",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl mb-6 font-bold">Nhà Thuốc Bảo An</h1> {/* Thêm font-bold cho đẹp */}
              <p className="text-xl mb-8 opacity-90">
                Chăm sóc sức khỏe của bạn và gia đình với sản phẩm chính hãng,
                giá tốt nhất thị trường
              </p>
              <div className="flex gap-4">
                <Link
                    to="/products"
                    className="bg-white text-cyan-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-semibold"
                >
                  Xem sản phẩm
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                    to="/prescriptions"
                    className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-cyan-600 transition-colors font-semibold"
                >
                  Tải đơn thuốc
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                  src="https://www.tainstruments.com/wp-content/uploads/AdobeStock_123504209-1-scaled.jpeg"
                  alt="Pharmacy"
                  className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- BANNER ĐỘNG TỪ API --- */}
      {banners.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 relative">
              <Carousel
                  className="rounded-xl shadow-lg mx-auto w-full"
                  opts={{ loop: true, slidesToScroll: 1, align: "start" }}
              >
                <CarouselPrevious className="z-10 left-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md border-none">
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </CarouselPrevious>

                <CarouselContent className="-ml-4">
                  {banners.map((ad) => (
                          <CarouselItem key={ad.id} className="pl-4 basis-full">
                            {/* Link bao quanh ảnh để click chuyển trang */}
                            <Link to={ad.targetUrl} className="block w-full h-[400px] overflow-hidden rounded-xl group">
                              <ImageWithFallback
                                  src={ad.contentUrl}
                                  alt={ad.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </Link>
                          </CarouselItem>
                      )
                  )}
                </CarouselContent>

                <CarouselNext className="z-10 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md border-none">
                  <ArrowRight className="w-6 h-6 text-gray-700" />
                </CarouselNext>
              </Carousel>
            </div>
          </section>
      )}

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
            <Link
              to="/products"
              className="text-cyan-600 hover:text-cyan-700 flex items-center gap-2"
            >
              Xem tất cả
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: "Paracetamol 500mg",
                price: 15000,
                image:
                  "https://www.mediplantex.com/upload/product/thumbs/8594648bd43d66f8f602e77c7cccf242.jpg",
              },
              {
                id: 2,
                name: "Vitamin C 1000mg",
                price: 120000,
                image:
                  "https://cdn.famitaa.net/storage/uploads/noidung/vitamin-c-plus-1000-mg-dr-life-24-vien-sui-bo-sung-vitamin-c_00471.webp",
              },
              {
                id: 3,
                name: "Amoxicillin 500mg",
                price: 45000,
                image:
                  "https://domesco.com/pictures/catalog/san-pham-2025/AMOXICILLIN-500-mg-Do-Vang-893110107324-Hop-10-vi-x-10-VNC-.png",
              },
              {
                id: 4,
                name: "Omega-3 Fish Oil",
                price: 250000,
                image:
                  "https://chuoinhathuocminhchau.com/wp-content/uploads/2024/03/OMEGA-3-FISH-OIL-NATURE-GIFT-CHAI-100-VIEN-chinh-hang-768x767.jpg",
              },
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
                  <p className="text-cyan-600">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
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
