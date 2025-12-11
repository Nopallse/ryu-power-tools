'use client';

import React from 'react';
import { Button, Row, Col } from 'antd';

export default function HeroSection() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center py-24">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <Row gutter={[60, 60]} align="middle">
          <Col xs={24} lg={12}>
            <div className="pr-0 lg:pr-10">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#2d6a2e] leading-tight mb-6">
                Engineered for Impact,
                Made for Everyone.
                </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-10">
                High-performance tools engineered<br />
                for precision, built with power & ready<br />
                for everyday challenges.
              </p>
              <Button 
                type="primary" 
                size="large"
                className="!bg-[#2d6a2e] hover:!bg-[#3d8a3e] !border-none !rounded-full !px-12 !h-auto !py-3 !text-base font-semibold tracking-wider"
              >
                POWER UP
              </Button>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/ryu-tools-stack.webp" 
                alt="Ryu Power Tools Collection"
                className="max-w-xs lg:max-w-sm h-auto block"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
