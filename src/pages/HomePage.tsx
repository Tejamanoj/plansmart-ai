import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PopularDestinations } from '@/components/home/PopularDestinations';
import { CtaBanner } from '@/components/home/CtaBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <FeaturesSection />
      <PopularDestinations />
      <CtaBanner />
    </div>
  );
};
