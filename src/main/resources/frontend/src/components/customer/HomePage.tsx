import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  Pill,
  Upload,
  Menu,
  ChevronRight,
  ShoppingCart,
  Star,
  Thermometer,
  Baby,
  Heart
} from "lucide-react";
import { MarketingService } from "../../services/marketingService";
import { ProductService } from "../../services/productService";
import { Advertisement, AdSlot } from "../../types/marketing";
import { Product } from "../../types/product";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Advertisement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Config Autoplay
  const bannerPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const productPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsData, productsData] = await Promise.all([
          MarketingService.getAds(AdSlot.HOMEPAGE_BANNER),
          ProductService.getAllProducts(0, 10)
        ]);
        setBanners(adsData);
        setProducts(productsData);
      } catch (e) {
        console.error("Lỗi tải dữ liệu trang chủ", e);
      }
    };
    fetchData();
  }, []);

  // --- CẤU HÌNH DANH MỤC SẢN PHẨM CỦA BẠN ---
  const mainCategories = [
    {
      id: "prescription",
      name: "Thuốc kê đơn",
      desc: "Theo chỉ định bác sĩ",
      icon: Pill,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      img: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
    },
    {
      id: "otc",
      name: "Thuốc không kê đơn",
      desc: "Cảm cúm, giảm đau...",
      icon: Pill,
      color: "bg-green-50 text-green-600 border-green-100",
      img: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
    },
    {
      id: "supplement",
      name: "Thực phẩm chức năng",
      desc: "Vitamin, Bổ gan...",
      icon: ShieldCheck,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      img: "https://cdn-icons-png.flaticon.com/512/3063/3063229.png"
    },
    {
      id: "cosmetics",
      name: "Dược mỹ phẩm",
      desc: "Chăm sóc da, tóc",
      icon: Star,
      color: "bg-pink-50 text-pink-600 border-pink-100",
      img: "https://cdn-icons-png.flaticon.com/512/3050/3050361.png"
    },
    {
      id: "device",
      name: "Thiết bị y tế",
      desc: "Máy đo huyết áp, nhiệt kế",
      icon: Thermometer,
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
      img: "https://cdn-icons-png.flaticon.com/512/2390/2390237.png"
    },
    {
      id: "personal",
      name: "Chăm sóc cá nhân",
      desc: "Vệ sinh, Mẹ & Bé",
      icon: Baby,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      img: "https://cdn-icons-png.flaticon.com/512/2854/2854224.png"
    },
  ];

  return (
      <div className="bg-gray-50 min-h-screen font-sans">

        {/* SECTION 1: HERO */}
        <section className="bg-white pt-6 pb-10 shadow-sm border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

              {/* CỘT TRÁI: MENU DANH MỤC NHANH */}
              <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 h-full">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-grow">
                  <div className="bg-cyan-600 text-white px-5 py-3 font-bold flex items-center gap-2">
                    <Menu className="w-5 h-5" /> DANH MỤC CHÍNH
                  </div>
                  <div className="py-2">
                    {mainCategories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.id}`}
                            className="flex items-center justify-between px-5 py-3 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <cat.icon className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" />
                            <span className="font-medium text-sm">{cat.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-600" />
                        </Link>
                    ))}
                  </div>
                </div>

                {/* Banner nhỏ Tải đơn thuốc */}
                <Link to="/prescriptions" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between group h-32 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">Tải đơn thuốc</h3>
                    <p className="text-cyan-100 text-xs">Được dược sĩ tư vấn ngay</p>
                  </div>
                  <div className="relative z-10 flex justify-end">
                    <span className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors"><Upload className="w-5 h-5" /></span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                </Link>
              </div>

              {/* CỘT PHẢI: BANNER SLIDER */}
              <div className="lg:col-span-9 h-full">
                {banners.length > 0 ? (
                    <Carousel
                        plugins={[bannerPlugin.current]}
                        opts={{ loop: true, align: "start" }}
                        className="w-full h-full rounded-2xl overflow-hidden shadow-md relative group"
                        onMouseEnter={bannerPlugin.current.stop}
                        onMouseLeave={bannerPlugin.current.reset}
                    >
                      <CarouselContent className="ml-0 h-full">
                        {banners.map((ad) => (
                            <CarouselItem key={ad.id} className="pl-0 min-w-0 basis-full h-full">
                              <Link to={ad.targetUrl} className="block w-full h-full relative">
                                <div className="w-full h-[200px] sm:h-[300px] lg:h-[450px] relative bg-gray-200">
                                  <img
                                      src={ad.contentUrl}
                                      alt={ad.name}
                                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/1200x450?text=Banner"; }}
                                  />
                                </div>
                              </Link>
                            </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-none h-10 w-10 text-gray-800 shadow-sm" />
                        <CarouselNext className="right-4 bg-white/80 hover:bg-white border-none h-10 w-10 text-gray-800 shadow-sm" />
                      </div>
                    </Carousel>
                ) : (
                    <div className="w-full h-[200px] lg:h-[450px] bg-gray-200 rounded-2xl animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST BADGES */}
        <section className="bg-white border-b border-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: "Thuốc Chính Hãng", desc: "100% hóa đơn đỏ" },
                { icon: Truck, title: "Giao Nhanh 2H", desc: "Miễn phí đơn từ 300k" },
                { icon: HeadphonesIcon, title: "Dược Sĩ Tư Vấn", desc: "Chuyên môn cao 24/7" },
                { icon: Heart, title: "Giá Tốt Nhất", desc: "Tiết kiệm cho mọi nhà" },
              ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SẢN PHẨM BÁN CHẠY (Carousel 3s) */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-red-500 w-2 h-8 rounded-full inline-block"></span>
                  Sản phẩm bán chạy
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-4">Lựa chọn hàng đầu của khách hàng</p>
              </div>
              <Link to="/products" className="text-cyan-600 font-semibold hover:text-cyan-700 flex items-center gap-1 text-sm">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {products.length > 0 ? (
                <Carousel
                    plugins={[productPlugin.current]}
                    opts={{ loop: true, align: "start" }}
                    className="w-full"
                    onMouseEnter={productPlugin.current.stop}
                    onMouseLeave={productPlugin.current.reset}
                >
                  <CarouselContent className="-ml-6 pb-4">
                    {products.map((product) => (
                        <CarouselItem key={product.productId} className="pl-6 basis-1/2 md:basis-1/3 lg:basis-1/5 min-w-0">
                          <Link
                              to={`/products/${product.productId}`}
                              className="block bg-white rounded-xl border border-gray-100 hover:border-cyan-500 hover:shadow-xl transition-all duration-300 p-4 h-full flex flex-col group relative"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3 relative">
                              <ImageWithFallback
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                           <span className="bg-cyan-600 text-white p-2 rounded-full shadow-md flex items-center justify-center hover:bg-cyan-700">
                             <ShoppingCart className="w-4 h-4" />
                           </span>
                              </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors min-h-[40px]" title={product.name}>
                                {product.name}
                              </h3>
                              <div className="mt-auto">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base font-bold text-cyan-700">{product.price.toLocaleString("vi-VN")}đ</span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString("vi-VN")}đ</span>
                                  )}
                                </div>
                                <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Còn hàng
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden md:block">
                    <CarouselPrevious className="-left-4 bg-white shadow-md text-gray-600 border-gray-100 h-10 w-10 hover:text-cyan-600"/>
                    <CarouselNext className="-right-4 bg-white shadow-md text-gray-600 border-gray-100 h-10 w-10 hover:text-cyan-600"/>
                  </div>
                </Carousel>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 h-[300px] animate-pulse"></div>
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* SECTION 4: DANH MỤC NỔI BẬT (ĐÃ SỬA THEO YÊU CẦU CỦA BẠN) */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mainCategories.map((cat) => (
                  <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      className={`bg-white p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:${cat.color}`}
                  >
                    {/* Dùng ảnh PNG minh họa cho sinh động */}
                    <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="text-center">
                      <span className="font-bold text-gray-700 block group-hover:text-cyan-600">{cat.name}</span>
                      <span className="text-xs text-gray-400 mt-1 block group-hover:text-cyan-500">{cat.desc}</span>
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: THƯƠNG HIỆU (Giữ nguyên) */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Thương hiệu đối tác</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" className="h-8 object-contain" alt="Brand 1"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" className="h-8 object-contain" alt="Brand 2"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" className="h-8 object-contain" alt="Brand 3"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png" className="h-8 object-contain" alt="Brand 4"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" className="h-8 object-contain" alt="Brand 5"/>
            </div>
          </div>
        </section>

        {/* SECTION 6: GÓC SỨC KHỎE (Giữ nguyên) */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Góc sức khỏe</h2>
              <Link to="#" className="text-cyan-600 text-sm font-semibold hover:underline">Xem thêm bài viết</Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News"/>
                </div>
                <div className="p-5">
                  <span className="text-cyan-600 text-xs font-bold uppercase tracking-wider">Sống khỏe</span>
                  <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-cyan-600 transition-colors">5 cách tăng cường hệ miễn dịch mùa cúm</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Để bảo vệ sức khỏe trong mùa cúm, việc tăng cường hệ miễn dịch là vô cùng quan trọng...</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News"/>
                </div>
                <div className="p-5">
                  <span className="text-cyan-600 text-xs font-bold uppercase tracking-wider">Dinh dưỡng</span>
                  <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-cyan-600 transition-colors">Thực đơn eat clean cho người mới bắt đầu</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Eat clean không phải là ăn kiêng kham khổ, mà là lựa chọn thực phẩm sạch và chế biến đơn giản...</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News"/>
                </div>
                <div className="p-5">
                  <span className="text-cyan-600 text-xs font-bold uppercase tracking-wider">Y học thường thức</span>
                  <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-cyan-600 transition-colors">Phân biệt các loại Vitamin và công dụng</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Vitamin đóng vai trò thiết yếu trong việc duy trì hoạt động sống của cơ thể. Cùng tìm hiểu...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CTA APP */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-900 to-cyan-800 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Chăm sóc sức khỏe trong tầm tay</h2>
                <p className="text-cyan-100 mb-8 text-lg font-light">
                  Tải ứng dụng Bảo An Medicine ngay hôm nay để nhận ưu đãi độc quyền.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1">
                    App Store
                  </button>
                  <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1">
                    Google Play
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
  );
};

export default HomePage;