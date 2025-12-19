'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Spin, Empty } from 'antd';
import { getPublicProductById, getPublicLatestProducts, Product as ApiProduct, ProductImage as ApiProductImage, ProductCategory } from '@/app/lib/product-api';
import { getPublicCategories, Category as ApiCategory } from '@/app/lib/category-api';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

const getImageUrl = (url: string | undefined) => {
  if (!url) return '/images/product.jpg';
  if (url.startsWith('http')) return url;
  return `${apiBase}${url}`;
};

// Hardcoded product data - will be replaced with API
const products = [
  {
    id: 1,
    name: 'Cable Connector (Female)',
    image: '/images/product.jpg',
    shortDescription: `Ukuran Kabel Las : 10 – 25 mm
Maksimal Arus : 200 A
Material : Tembaga
Qty Inner/Master : 20 / 500`,
    categories: ['Accessories', 'Cable Connector'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Ukuran Kabel Las:</strong> 10 – 25 mm</li>
        <li><strong>Maksimal Arus:</strong> 200 A</li>
        <li><strong>Material:</strong> Tembaga</li>
        <li><strong>Qty Inner/Master:</strong> 20 / 500</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Cable Connector (Female) dari RYU dirancang khusus untuk sambungan kabel las dengan kualitas tembaga premium yang memastikan konduktivitas listrik optimal.</p>
      
      <ul>
        <li>Material tembaga berkualitas tinggi untuk konduktivitas maksimal</li>
        <li>Tahan terhadap arus hingga 200 A</li>
        <li>Desain kokoh dan tahan lama</li>
        <li>Mudah dipasang dan dilepas</li>
        <li>Cocok untuk berbagai ukuran kabel las</li>
      </ul>

      <h3>Aplikasi</h3>
      <p>Produk ini sangat cocok digunakan untuk:</p>
      <ul>
        <li>Pengelasan industri</li>
        <li>Bengkel las profesional</li>
        <li>Konstruksi dan fabrikasi</li>
        <li>Maintenance dan repair</li>
      </ul>
    `
  },
  {
    id: 2,
    name: 'Abrasive Disc 4"',
    image: '/images/product.jpg',
    shortDescription: `Size: 4 inch
Grit: 80
Speed: 13,000 RPM
Material: Aluminum Oxide`,
    categories: ['Accessories', 'Abrasive'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Size:</strong> 4 inch</li>
        <li><strong>Grit:</strong> 80</li>
        <li><strong>Speed:</strong> 13,000 RPM</li>
        <li><strong>Material:</strong> Aluminum Oxide</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Abrasive Disc profesional untuk penggerindaan dan pemotongan berbagai material dengan performa tinggi.</p>
    `
  },
  {
    id: 3,
    name: 'ROUTER RRT12-1',
    image: '/images/product.jpg',
    shortDescription: `Power: 1200W
Speed: 30,000 RPM
Collet: 6mm & 8mm
Weight: 2.5kg`,
    categories: ['Power Tools', 'Router'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Power:</strong> 1200W</li>
        <li><strong>Speed:</strong> 30,000 RPM</li>
        <li><strong>Collet:</strong> 6mm & 8mm</li>
        <li><strong>Weight:</strong> 2.5kg</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Router berkualitas tinggi untuk pekerjaan woodworking profesional dengan motor powerful dan kontrol presisi.</p>
    `
  },
  {
    id: 4,
    name: 'CORDLESS DRILL 12V-1 RCD12V-1',
    image: '/images/product.jpg',
    shortDescription: `Voltage: 12V
Battery: Lithium-ion
Chuck Size: 10mm
Torque: 30Nm`,
    categories: ['Power Tools', 'Cordless'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Voltage:</strong> 12V</li>
        <li><strong>Battery:</strong> Lithium-ion</li>
        <li><strong>Chuck Size:</strong> 10mm</li>
        <li><strong>Torque:</strong> 30Nm</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Cordless drill compact dan powerful, ideal untuk berbagai aplikasi drilling dan screwdriving.</p>
    `
  },
  {
    id: 5,
    name: 'ANGLE GRINDER 4" RAG100',
    image: '/images/product.jpg',
    shortDescription: `Power: 850W
Disc Size: 4 inch (100mm)
Speed: 11,000 RPM
Weight: 2.1kg`,
    categories: ['Power Tools', 'Angle Grinder'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Power:</strong> 850W</li>
        <li><strong>Disc Size:</strong> 4 inch (100mm)</li>
        <li><strong>Speed:</strong> 11,000 RPM</li>
        <li><strong>Weight:</strong> 2.1kg</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Angle grinder powerful untuk cutting dan grinding dengan desain ergonomis dan motor tahan lama.</p>
    `
  },
  {
    id: 6,
    name: 'WELDING INVERTER 160A',
    image: '/images/product.jpg',
    shortDescription: `Output: 160A
Input Voltage: 220V
Electrode: 1.6-4.0mm
Weight: 5.5kg`,
    categories: ['Welding', 'Inverter'],
    description: `
      <h3>Spesifikasi Produk</h3>
      <ul>
        <li><strong>Output:</strong> 160A</li>
        <li><strong>Input Voltage:</strong> 220V</li>
        <li><strong>Electrode:</strong> 1.6-4.0mm</li>
        <li><strong>Weight:</strong> 5.5kg</li>
      </ul>

      <h3>Keunggulan</h3>
      <p>Welding inverter portable dengan teknologi IGBT untuk hasil pengelasan berkualitas tinggi.</p>
    `
  }
];

const latestProducts = [
  { id: 3, name: 'ROUTER RRT12-1', image: '/images/product.jpg', category: 'Router' },
  { id: 4, name: 'CORDLESS DRILL 12V-1', image: '/images/product.jpg', category: 'Cordless' },
  { id: 5, name: 'ANGLE GRINDER 4"', image: '/images/product.jpg', category: 'Angle Grinder' },
  { id: 6, name: 'WELDING INVERTER 160A', image: '/images/product.jpg', category: 'Inverter' },
  { id: 1, name: 'Cable Connector Female', image: '/images/product.jpg', category: 'Cable Connector' },
  { id: 2, name: 'Abrasive Disc 4"', image: '/images/product.jpg', category: 'Abrasive' }
];

const featuredCategories = [
  {
    name: 'Power Tools',
    image: '/images/product.jpg',
    description: 'High-performance tools for cutting, drilling, and grinding—built to make your work faster and easier.',
    link: '/product-category/power-tools'
  },
  {
    name: 'Engine',
    image: '/images/product.jpg',
    description: 'Reliable engines designed to power machines efficiently, giving you consistent performance in every job.',
    link: '/product-category/engine'
  },
  {
    name: 'Welding',
    image: '/images/product.jpg',
    description: 'Durable welding equipment that ensures strong, clean joins—perfect for both beginners and pros.',
    link: '/product-category/welding'
  },
  {
    name: 'Accessories',
    image: '/images/product.jpg',
    description: 'Essential add-ons and spare parts to keep your tools running smoothly and ready for any task.',
    link: '/product-category/accessories'
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [latestProducts, setLatestProducts] = useState<ApiProduct[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product by ID
        const productData = await getPublicProductById(productId);
        if (productData) {
          setProduct(productData);
        }

        // Fetch latest products
        const latestData = await getPublicLatestProducts(6);
        if (latestData) {
          setLatestProducts(latestData);
        }

        // Fetch parent categories for featured section
        const categoriesData = await getPublicCategories();
        if (categoriesData) {
          const parentCategories = categoriesData.filter((cat: ApiCategory) => !cat.parentId);
          setFeaturedCategories(parentCategories.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-white py-20 flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 text-center">
          <Empty description="Product Not Found" />
          <Link href="/" className="text-[#2d5016] hover:underline mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.productImages?.[0] || { url: '/images/product.jpg' };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Info */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-6">
              {product.name}
            </h1>

            <div className="mb-6">
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {product.description}
                </pre>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 font-semibold min-w-[100px]">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {product.productCategory?.map((cat, index) => (
                    <span key={index} className="text-[#2d5016] hover:underline cursor-pointer">
                      {cat.category.name}
                      {index < (product.productCategory?.length || 0) - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <Link href="/contact">
              <button className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border border-[#2d5016] bg-[#2d5016] text-white text-sm sm:text-base font-semibold tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer mb-8">
                CONTACT US
              </button>
            </Link>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg sticky top-24">
              <img 
                src={primaryImage.url} 
                alt={product.name}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/product.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Latest Products Section */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-[#2d5016] mb-2">THE LATEST</h3>
            <p className="text-gray-600">Latest products</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {latestProducts.map((item) => {
              const itemImage = item.productImages?.[0] || { url: '/images/product.jpg' };
              
              return (
                <Link href={`/product/${item.id}`} key={item.id}>
                  <div className="flex flex-col items-center">
                    <div className="w-full bg-white p-5 hover:translate-y-[-8px] transition-all duration-300">
                      <img 
                        src={itemImage.url} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/product.jpg';
                        }}
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-[#2d5016] my-5 text-center">
                      {item.name}
                    </h4>
                    <button className="w-full bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white transition-colors cursor-pointer">
                      READ MORE
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Products Section */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2d5016]">FEATURED PRODUCTS</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((category) => (
              <Link href={`/product-category/${category.slug}`} key={category.id}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg mb-4 shadow-md">
                    <img 
                      src={category.imageUrl || '/images/product.jpg'} 
                      alt={category.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/product.jpg';
                      }}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-[#2d5016] mb-2 group-hover:text-[#72bd5a] transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description || 'Explore our range of quality products.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
