"use client";

import React from "react";
import {  Row, Col } from "antd";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-stretch">
      <Row gutter={[0, 0]} align="stretch" className="w-full">
        <Col xs={24} lg={12} className="flex items-center">
          <div className="w-full px-8 sm:px-12 lg:px-16 py-24 max-w-screen-xl mx-auto">
            <div className="pr-0 lg:pr-10 items-center lg:items-start text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2d6a2e] leading-tight mb-6">
                {t.home.heroTitle}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-10 whitespace-pre-wrap">
                {t.home.heroSubtitle}
              </p>
              <button
                type="button"
                className="px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-primary bg-primary text-white text-sm sm:text-base tracking-wide transition-colors hover:bg-transparent hover:text-[#2d5016] cursor-pointer"
                onClick={() => (window.location.href = `/${language}/contact`)}
              >
                {t.home.heroCTA}
              </button>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={12} className="h-full">
          <div className="w-full h-full">
            <img
              src="/images/ryu-tools-stack.webp"
              alt="Ryu Power Tools Collection"
              className="w-full h-full object-cover block"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
