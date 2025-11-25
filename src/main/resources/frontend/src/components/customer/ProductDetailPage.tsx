import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ProductDetailPageProps {
  cart: any[];
  updateCart: (cart: any[]) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  cart,
  updateCart,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Comprehensive product catalog with details
  const productCatalog = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Thuốc không kê đơn",
      price: 15000,
      originalPrice: 20000,
      description: "Thuốc giảm đau, hạ sốt hiệu quả",
      image:
        "https://www.mediplantex.com/upload/product/thumbs/8594648bd43d66f8f602e77c7cccf242.jpg",
      images: [
        "https://www.mediplantex.com/upload/product/thumbs/8594648bd43d66f8f602e77c7cccf242.jpg",
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
      ],
      brand: "DHG Pharma",
      stock: 150,
      unit: "Hộp 100 viên",
      details: {
        ingredients: "Paracetamol 500mg",
        uses: "Giảm đau, hạ sốt trong các trường hợp đau đầu, đau răng, đau cơ, sốt do cảm cúm",
        dosage: "Người lớn: 1-2 viên/lần, 3-4 lần/ngày. Không quá 8 viên/ngày",
        sideEffects: "Hiếm gặp: buồn nôn, nôn, phát ban da",
        storage: "Bảo quản nơi khô ráo, thoáng mát, nhiệt độ dưới 30°C",
        expiry: "36 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      category: "Thực phẩm chức năng",
      price: 120000,
      originalPrice: 150000,
      description: "Tăng cường sức đề kháng",
      image:
        "https://cdn.famitaa.net/storage/uploads/noidung/vitamin-c-plus-1000-mg-dr-life-24-vien-sui-bo-sung-vitamin-c_00471.webp",
      images: [
        "https://cdn.famitaa.net/storage/uploads/noidung/vitamin-c-plus-1000-mg-dr-life-24-vien-sui-bo-sung-vitamin-c_00471.webp",
        "https://parapharmacy.vn/wp-content/uploads/2023/08/vitamin-c-1000mg-drlife-24-vien-1-300x300.webp",
        "https://salt.tikicdn.com/cache/750x750/ts/product/ff/44/42/dc92fc098d4caa9825d96e989583cb71.jpg.webp",
      ],
      brand: "Dr. Life",
      stock: 200,
      unit: "Hộp 30 viên",
      details: {
        ingredients: "Vitamin C 1000mg từ tinh chất lựu và ổi",
        uses: "Bổ sung vitamin C, tăng cường miễn dịch, chống oxy hóa, hỗ trợ sức khỏe xương khớp",
        dosage: "1 viên/ngày, uống sau bữa ăn sáng với nước",
        sideEffects: "Hiếm gặp khi dùng đúng liều",
        storage: "Bảo quản ở nơi thoáng mát, tránh ánh sáng trực tiếp",
        expiry: "24 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      category: "Thuốc kê đơn",
      price: 45000,
      originalPrice: 55000,
      description: "Kháng sinh cho nhiễm khuẩn",
      image:
        "https://domesco.com/pictures/catalog/san-pham-2025/AMOXICILLIN-500-mg-Do-Vang-893110107324-Hop-10-vi-x-10-VNC-.png",
      images: [
        "https://domesco.com/pictures/catalog/san-pham-2025/AMOXICILLIN-500-mg-Do-Vang-893110107324-Hop-10-vi-x-10-VNC-.png",
        "https://cdn.upharma.vn/unsafe/828x0/filters:quality(90)/san-pham/10022.png",
      ],
      brand: "DOMESCO",
      stock: 100,
      unit: "Hộp 100 viên",
      details: {
        ingredients: "Amoxicillin Trihydrate 500mg",
        uses: "Kháng sinh tổng hợp, điều trị nhiễm khuẩn đường hô hấp, tiêu hóa, niệu sinh dục",
        dosage: "Người lớn: 1-2 viên x 3 lần/ngày (theo đơn bác sĩ)",
        sideEffects: "Hiếm: phát ban, buồn nôn, tiêu chảy",
        storage: "Bảo quản dưới 25°C, nơi khô ráo",
        expiry: "36 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 4,
      name: "Omega-3 Fish Oil",
      category: "Thực phẩm chức năng",
      price: 250000,
      originalPrice: 320000,
      description: "Hỗ trợ tim mạch và não bộ",
      image:
        "https://chuoinhathuocminhchau.com/wp-content/uploads/2024/03/OMEGA-3-FISH-OIL-NATURE-GIFT-CHAI-100-VIEN-chinh-hang-768x767.jpg",
      images: [
        "https://chuoinhathuocminhchau.com/wp-content/uploads/2024/03/OMEGA-3-FISH-OIL-NATURE-GIFT-CHAI-100-VIEN-chinh-hang-768x767.jpg",
        "https://production-cdn.pharmacity.io/digital/640x640/plain/e-com/images/ecommerce/P16615_4.png",
        "https://production-cdn.pharmacity.io/digital/640x640/plain/e-com/images/ecommerce/P16615_5.png",
      ],
      brand: "Nature Gift",
      stock: 80,
      unit: "Chai 100 viên",
      details: {
        ingredients: "Dầu cá sâu (Fish Oil) có chứa EPA 180mg, DHA 120mg/viên",
        uses: "Bảo vệ tim mạch, hỗ trợ sức khỏe não, giảm cholesterol, chống viêm",
        dosage: "1-2 viên/ngày, uống cùng bữa ăn",
        sideEffects: "Hiếm: nước trôi nước thở, buồn nôn nhẹ",
        storage: "Bảo quản ở nơi thoáng mát, tránh ánh sáng",
        expiry: "24 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 5,
      name: "Ibuprofen 400mg",
      category: "Thuốc không kê đơn",
      price: 25000,
      originalPrice: 35000,
      description: "Giảm đau, chống viêm hiệu quả",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2023/9/344827499/TG/YT/FY/192270567/ibuprofen-tablet-400mg.png",
      images: [
        "https://5.imimg.com/data5/SELLER/Default/2023/9/344827499/TG/YT/FY/192270567/ibuprofen-tablet-400mg.png",
        "https://usercontent.one/wp/www.yenisom.com/wp-content/uploads/2025/02/IMG_2245-600x450.jpg",
      ],
      brand: "Imexpharm",
      stock: 120,
      unit: "Hộp 20 viên",
      details: {
        ingredients: "Ibuprofen 400mg",
        uses: "Giảm đau, hạ sốt, chống viêm. Dùng cho đau đầu, đau cơ, đau bụng, sốt",
        dosage: "Người lớn: 1 viên x 3-4 lần/ngày. Khoảng cách tối thiểu 4 giờ",
        sideEffects: "Hiếm: khó tiêu, đau bao tử, dị ứng",
        storage: "Bảo quản ở nơi khô ráo, dưới 30°C",
        expiry: "36 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 6,
      name: "Multivitamin Premium",
      category: "Thực phẩm chức năng",
      price: 350000,
      originalPrice: 450000,
      description: "Vitamin tổng hợp cho cơ thể khỏe mạnh",
      image:
        "https://product.hstatic.net/200000425265/product/3_9cfe1ee7ab7346f4977846b927706bf0.png",
      images: [
        "https://product.hstatic.net/200000425265/product/3_9cfe1ee7ab7346f4977846b927706bf0.png",
        "https://haligroup.vn/wp-content/uploads/2023/11/km-vien-tong-hop-vitamin-khoang-chat-nutri-d-day.jpg",
      ],
      brand: "Premium Health",
      stock: 60,
      unit: "Hộp 60 viên",
      details: {
        ingredients:
          "Vitamin A, B1, B2, B3, B5, B6, B12, C, D3, E, và các chất khoáng",
        uses: "Bổ sung vitamin và khoáng chất, tăng sức khỏe tổng thể, bổ năng lượng, chống mệt mỏi",
        dosage: "1 viên/ngày, uống cùng bữa ăn sáng",
        sideEffects: "Hiếm gặp, có thể gây nhuộm nước tiểu",
        storage: "Bảo quản ở nơi thoáng mát, tránh ẩm ướt",
        expiry: "24 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 7,
      name: "Cetirizine 10mg",
      category: "Thuốc không kê đơn",
      price: 30000,
      originalPrice: 40000,
      description: "Kháng histamine cho dị ứng hiệu quả",
      image:
        "https://www.imexpharm.com/Data/Sites/1/Product/8859/Cetirizine-10mg.png",
      images: [
        "https://www.imexpharm.com/Data/Sites/1/Product/8859/Cetirizine-10mg.png",
        "https://img.thuocbietduoc.com.vn/images/drugs/domesco/centirizil.jpg",
      ],
      brand: "Imexpharm",
      stock: 110,
      unit: "Hộp 10 viên",
      details: {
        ingredients: "Cetirizine Dihydrochloride 10mg",
        uses: "Điều trị dị ứng mũi, dị ứng da, nổi mề đay, ngứa da do côn trùng đốt",
        dosage:
          "Người lớn: 1 viên/ngày, uống buổi tối. Nếu cần thiết uống buổi sáng thêm",
        sideEffects: "Hiếm: buồn ngủ nhẹ, khô miệng",
        storage: "Bảo quản ở nơi khô ráo, dưới 25°C",
        expiry: "36 tháng kể từ ngày sản xuất",
      },
    },
    {
      id: 8,
      name: "Collagen Beauty Plus",
      category: "Thực phẩm chức năng",
      price: 450000,
      originalPrice: 580000,
      description: "Hỗ trợ làm đẹp da và sức khỏe tóc",
      image:
        "https://vn-test-11.slatic.net/p/1065fa3327040bbc0783306a6df751e6.jpg",
      images: [
        "https://vn-test-11.slatic.net/p/1065fa3327040bbc0783306a6df751e6.jpg",
        "https://filebroker-cdn.lazada.vn/kf/S820ebc21d2f94e008d77e7d1922cb8e38.jpg",
      ],
      brand: "Beauty Plus",
      stock: 40,
      unit: "Hộp 30 gói",
      details: {
        ingredients:
          "Collagen Fish 2000mg, Vitamin C, Biotin, Zinc, Hyaluronic acid",
        uses: "Cải thiện độ đàn hồi da, giảm nếp nhăn, tăng độ ẩm cho da, làm chắc khỏe tóc và móng",
        dosage: "1 gói/ngày, hoà vào nước ấm, uống buổi sáng hoặc tối",
        sideEffects: "Hiếm gặp, an toàn với cơ thể",
        storage: "Bảo quản ở nơi thoáng mát, tránh ánh sáng trực tiếp",
        expiry: "24 tháng kể từ ngày sản xuất",
      },
    },
  ];

  // Get product by ID
  const product =
    productCatalog.find((p) => p.id === Number(id)) || productCatalog[0];

  // Selected image for gallery
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image
  );

  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    updateCart(newCart);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-cyan-600 hover:text-cyan-700">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-cyan-600 hover:text-cyan-700">
            Sản phẩm
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            Đã thêm vào giỏ hàng!
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(product.images || [product.image]).map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(imgSrc)}
                  className={`bg-white rounded-lg overflow-hidden border-2 cursor-pointer ${
                    selectedImage === imgSrc
                      ? "border-cyan-500"
                      : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={imgSrc}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-sm text-gray-500 mb-2">
                {product.category}
              </div>
              <h1 className="text-gray-900 mb-4">{product.name}</h1>
              <div className="text-sm text-gray-600 mb-6">
                Thương hiệu:{" "}
                <span className="text-cyan-600">{product.brand}</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-3xl text-cyan-600">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-gray-400 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -25%
                  </span>
                </div>
                <div className="text-sm text-gray-600">{product.unit}</div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-xs text-gray-600">Chính hãng 100%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs text-gray-600">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-xs text-gray-600">Hỗ trợ 24/7</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3">
                  Số lượng:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Buy Now */}
              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all text-center"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Thông tin chi tiết</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm mb-2">Thành phần:</h3>
              <p className="text-gray-600">{product.details.ingredients}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Công dụng:</h3>
              <p className="text-gray-600">{product.details.uses}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Liều dùng:</h3>
              <p className="text-gray-600">{product.details.dosage}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Tác dụng phụ:</h3>
              <p className="text-gray-600">{product.details.sideEffects}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Bảo quản:</h3>
              <p className="text-gray-600">{product.details.storage}</p>
            </div>
            <div>
              <h3 className="text-sm mb-2">Hạn sử dụng:</h3>
              <p className="text-gray-600">{product.details.expiry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
