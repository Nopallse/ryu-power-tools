"use client";

import React from "react";
import { Button, Row, Col, Card } from "antd";

const categories = [
  {
    src: "/images/welding.webp",
    label: "WELDING",
    alt: "Welding Tools",
    width: "w-full",
    height: { mobile: "h-32", desktop: "md:h-[200px]" },
  },
  {
    src: "/images/powertools.webp",
    label: "POWER TOOLS",
    alt: "Power Tools",
    width: "w-full",
    height: { mobile: "h-64", desktop: "md:h-[400px]" },
  },
  {
    src: "/images/engine.webp",
    label: "ENGINE",
    alt: "Engine",
    width: "w-full",
    height: { mobile: "h-64", desktop: "md:h-[400px]" },
  },
  {
    src: "/images/accessories.webp",
    label: "ACCESSORIES",
    alt: "Accessories",
    width: "w-full",
    height: { mobile: "h-32", desktop: "md:h-[200px]" },
  },
];

export default function AboutSection() {
  return (
    <div className="py-20" style={{ background: 'linear-gradient(to top, #a3a3a3 0%, #ffffff 25%)' }}>
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <Row gutter={[80, 80]} align="middle">
          <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
            <Row gutter={[20, 20]}>
              <Col xs={12}>
              <div className="md:space-y-4">
                {/* WELDING */}
                <div
                className={`flex justify-end relative overflow-hidden ${categories[0].height.mobile} ${categories[0].height.desktop}`}
                >
                <img
                  src={categories[0].src}
                  alt={categories[0].alt}
                  className="h-full object-contain"
                />
                </div>

                {/* ENGINE */}
                <div
                className={`flex justify-end relative overflow-hidden ${categories[2].height.mobile} ${categories[2].height.desktop}`}
                >
                <img
                  src={categories[2].src}
                  alt={categories[2].alt}
                  className="h-full object-contain"
                />
                </div>
              </div>
              </Col>

              <Col xs={12}>
              <div className="md:space-y-4">
                {/* POWER TOOLS */}
                <div
                className={`flex justify-start relative overflow-hidden ${categories[1].height.mobile} ${categories[1].height.desktop}`}
                >
                <img
                  src={categories[1].src}
                  alt={categories[1].alt}
                  className="h-full object-contain"
                />
                </div>

                {/* ACCESSORIES */}
                <div
                className={`flex justify-start relative overflow-hidden ${categories[3].height.mobile} ${categories[3].height.desktop}`}
                >
                <img
                  src={categories[3].src}
                  alt={categories[3].alt}
                  className="h-full object-contain"
                />
                </div>
              </div>
              </Col>
            </Row>
            </Col>

          <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
            <div className="pl-0 lg:pl-5 text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-bold text-[#2d6a2e] mb-8 leading-tight">
                About Us
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-10">
                RYU Power Tools offers a wide range of modern power tools and
                woodworking equipment—such as drills, grinders, wood planers,
                compressors, and more—designed to deliver quality performance at
                competitive prices. Backed by proven experience, our tools are
                trusted to meet the specific needs of customers across
                residential, commercial, industrial, institutional, and civil
                engineering sectors.
              </p>
              <Button
                type="primary"
                size="large"
                className="!bg-[#2d6a2e] hover:!bg-[#3d8a3e] !border-none !rounded-full !px-12 !h-auto !py-3 !text-base font-semibold tracking-wider"
              >
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
