import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Shield, QrCode } from 'lucide-react';

const HeroSection: React.FC = () => {
  const benefits = [
    {
      icon: Star,
      text: 'Solo reseñas positivas en Google'
    },
    {
      icon: Shield,
      text: 'Protege tu reputación online'
    },
    {
      icon: QrCode,
      text: 'Implementación fácil con QR'
    }
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content Section */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium"
                style={{
                  backgroundColor: '#075E54' + '10',
                  borderColor: '#075E54' + '30',
                  color: '#075E54'
                }}
              >
                <CheckCircle size={16} />
                <span>Usado por más de 500 restaurantes</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#161616' }}>
                Obtén solo
                <span className="block" style={{ color: '#075E54' }}>
                  reseñas positivas
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p 
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                Filtra las reseñas antes de Google. Solo los clientes satisfechos 
                dejan reseñas públicas. Protege la reputación de tu restaurante automáticamente.
              </p>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#075E54' }}
                  >
                    <benefit.icon size={12} style={{ color: 'white' }} />
                  </div>
                  <span className="text-base font-medium" style={{ color: '#161616' }}>
                    {benefit.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/auth"
                className="group inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: '#075E54',
                  color: 'white',
                  border: '1px solid #075E54'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#064e45';
                  e.currentTarget.style.borderColor = '#064e45';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#075E54';
                  e.currentTarget.style.borderColor = '#075E54';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="mr-2">Prueba Gratis 14 Días</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-base border transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: 'white',
                  color: '#161616',
                  borderColor: 'rgb(209, 213, 219)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                  e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                }}
              >
                Ver Demo
              </button>
            </motion.div>

            {/* Supporting Text */}
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p 
                className="text-sm"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                Sin tarjeta de crédito • Prueba gratuita 14 días • Configuración en minutos
              </p>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: 'rgb(249, 250, 251)' }}
            >
              <motion.img 
                src="https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=2"
                alt="Gestión de reseñas para restaurantes"
                className="aspect-[4/5] w-full object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating Stats Cards */}
              <motion.div
                className="absolute top-6 left-6 p-4 rounded-lg border bg-white shadow-lg"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#075E54' + '20' }}
                  >
                    <Star size={20} style={{ color: '#075E54' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#161616' }}>
                      Rating Promedio
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#075E54' }}>
                      4.8
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-6 right-6 p-4 rounded-lg border bg-white shadow-lg"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgb(34, 197, 94)' + '20' }}
                  >
                    <Shield size={20} style={{ color: 'rgb(34, 197, 94)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#161616' }}>
                      Reseñas Filtradas
                    </p>
                    <p className="text-lg font-bold" style={{ color: 'rgb(34, 197, 94)' }}>
                      98.2%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;