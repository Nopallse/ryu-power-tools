"use client";

import React, { use } from "react";
import { Card, Row, Col, Button } from "antd";
import Link from "next/link";
import Image from "next/image";

// Mock data untuk contoh - nanti bisa diganti dengan data dari API/database
const mockProducts = {
  "cable-connector": [
    {
      id: 1,
      name: "Cable Connector Pro",
      image: "/images/product.jpg",
      description: "High quality cable connector for industrial use",
      specs: ["Material: Copper", "Rating: 15A", "Voltage: 220V"],
    },
    {
      id: 2,
      name: "Cable Connector Standard",
      image: "/images/product.jpg",
      description: "Standard cable connector for general purposes",
      specs: ["Material: Brass", "Rating: 10A", "Voltage: 220V"],
    },
    {
      id: 3,
      name: "Cable Connector Standard",
      image: "/images/product.jpg",
      description: "Standard cable connector for general purposes",
      specs: ["Material: Brass", "Rating: 10A", "Voltage: 220V"],
    },
    {
      id: 4,
      name: "Cable Connector Standard",
      image: "/images/product.jpg",
      description: "Standard cable connector for general purposes",
      specs: ["Material: Brass", "Rating: 10A", "Voltage: 220V"],
    },
    {
      id: 5,
      name: "Cable Connector Standard",
      image: "/images/product.jpg",
      description: "Standard cable connector for general purposes",
      specs: ["Material: Brass", "Rating: 10A", "Voltage: 220V"],
    },
  ],
  abrasive: [
    {
      id: 3,
      name: 'Abrasive Disc 4"',
      image: "/images/product.jpg",
      description: "Professional abrasive disc for grinding",
      specs: ["Size: 4 inch", "Grit: 80", "Speed: 13,000 RPM"],
    },
  ],
  // Tambahkan data untuk kategori lainnya
};

const categoryNames: Record<string, string> = {
  accessories: "Accessories",
  engine: "Engine",
  "power-tools": "Power Tools",
  welding: "Welding",
};

const subcategoryNames: Record<string, string> = {
  "cable-connector": "Cable Connector",
  abrasive: "Abrasive",
  "circular-saw-blade": "Circular Saw Blade",
  "diamond-wheel": "Diamond Wheel",
  "drill-bits": "Drill Bits",
  "planner-blade": "Planner Blade",
  "chain-saw": "Chain Saw",
  compressor: "Compressor",
  "gasoline-engine": "Gasoline Engine",
  generator: "Generator",
  waterpump: "Waterpump",
  "angle-grinder": "Angle Grinder",
  "bench-drill": "Bench Drill",
  inverter: "Inverter",
};

interface ProductCategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  params,
}) => {
  const { category, subcategory } = use(params);

  const products = mockProducts[subcategory as keyof typeof mockProducts] || [];
  const categoryName = categoryNames[category] || category;
  const subcategoryName = subcategoryNames[subcategory] || subcategory;

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#2d5016] mb-3">
          {subcategoryName}
        </h1>
        <p className="text-lg text-gray-600">
          Browse our collection of {subcategoryName.toLowerCase()} products
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="flex flex-col items-center">
                <Card
                  hoverable
                  className="w-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-300"
                  cover={
                    <div className="w-full h-full border-none shadow-none flex items-center justify-center bg-white p-5">
                      <Image
                        alt={product.name}
                        src={product.image}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-product.jpg";
                        }}
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <h3 className="text-xl font-semibold text-[#2d5016] my-5 text-center">
                        {product.name}
                      </h3>
                    }
                    description={
                      <div className="flex flex-col items-center">
                        <Button
                          type="primary"
                          block
                          className="bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white"
                        >
                          READ MORE
                        </Button>
                      </div>
                    }
                  />
                </Card>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-3xl text-gray-900 mb-3">No Products Available</h3>
          <p className="text-base text-gray-600 mb-8">
            Products for this category are coming soon.
          </p>
          <Link href="/">
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductCategoryPage;
