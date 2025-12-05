'use client';

import React from 'react';
import HeroSection from '@/app/components/Home/HeroSection';
import SectionDivider from '@/app/components/Home/SectionDivider';
import AboutSection from '@/app/components/Home/AboutSection';
import LatestSection from '@/app/components/Home/LatestSection';
import FeaturedSection from '@/app/components/Home/FeaturedSection';
import CTASection from '@/app/components/Home/CTASection';
import NewsArticleSection from '@/app/components/Home/NewsArticleSection';

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <LatestSection />
      <FeaturedSection />
      <CTASection />
      <NewsArticleSection />
    </div>
  );
}