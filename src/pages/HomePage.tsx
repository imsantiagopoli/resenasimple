import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnnouncementBanner from '../components/AnnouncementBanner';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CompanyMetricsSection from '../components/CompanyMetricsSection';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle anchor scrolling when navigating to homepage with hash
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <SEOHead
        title="Reseña Simple - Gestiona las Reseñas de tu Restaurante"
        description="Gestiona y mejora las reseñas de tu restaurante con Reseña Simple. Aumenta tu reputación online y atrae más clientes."
        url="https://resenasimple.com"
      />
      <AnnouncementBanner />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CompanyMetricsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;