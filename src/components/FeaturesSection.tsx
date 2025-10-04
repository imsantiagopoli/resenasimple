import React from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Shield,
  BarChart3,
  Settings,
  Star,
  CheckCircle
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  // Define primary color for easy reuse and maintenance
  const primaryColor = '#075E54';

  const features = [
    {
      icon: QrCode,
      title: 'Código QR Personalizable',
      description: 'Genera códigos QR únicos para cada mesa o ubicación. Los clientes escanean y votan al instante.',
      stats: 'Configuración en 2 min'
    },
    {
      icon: Shield,
      title: 'Filtro de Reseñas Inteligente',
      description: 'Solo los clientes que votan por encima de tu umbral son redirigidos a Google. Protege tu reputación.',
      stats: '98% efectividad'
    },
    {
      icon: BarChart3,
      title: 'Dashboard de Métricas',
      description: 'Monitorea las votaciones internas, identifica áreas de mejora y optimiza la experiencia del cliente.',
      stats: 'Informes en tiempo real'
    },
    {
      icon: Settings,
      title: 'Personalización Total',
      description: 'Agrega tu logo, colores de marca, mensajes personalizados y ofertas especiales para incentivar votaciones.',
      stats: 'Completamente tuyo'
    },
    {
      icon: Star,
      title: 'Umbral Configurable',
      description: 'Define cuántas estrellas mínimas necesitas para redirigir a Google. Típicamente 4 o 5 estrellas.',
      stats: 'Tu decides el límite'
    },
    {
      icon: CheckCircle,
      title: 'Implementación Fácil',
      description: 'No necesitas conocimientos técnicos. Simplemente imprime el QR y colócalo en las mesas de tu restaurante.',
      stats: 'Listo en minutos'
    }
  ];

  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section id="features" className="py-16 bg-gray-100 lg:py-24">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-neutral-900">
              Todo lo que necesitas para
              <span className="block" style={{ color: primaryColor }}>
                mejorar tus reseñas
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-500 md:text-xl">
              Desde códigos QR personalizables hasta análisis detallados, nuestra plataforma 
              te ayuda a obtener solo las mejores reseñas en Google y proteger tu reputación.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group h-full"
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className="flex flex-col h-full p-6 transition-all duration-300 bg-white border border-gray-200 rounded-lg group-hover:border-gray-300 group-hover:shadow-lg"
              >
                {/* Feature Icon */}
                <div className="mb-6">
                  <div
                    className="flex items-center justify-center w-12 h-12 transition-transform duration-300 rounded-lg group-hover:scale-110 group-hover:rotate-[-10deg]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <feature.icon size={24} color="white" />
                  </div>
                </div>

                {/* Feature Content */}
                <div className="flex flex-col flex-grow space-y-4">
                  <div className="flex-grow">
                    <h3 className="mb-3 text-lg font-semibold text-neutral-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Stats */}
                  <div
                    className="inline-block px-3 py-1.5 rounded-lg border w-fit"
                    style={{
                      backgroundColor: `${primaryColor}1A`, // Adding 1A for ~10% opacity
                      borderColor: `${primaryColor}4D`,   // Adding 4D for ~30% opacity
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: primaryColor }}
                    >
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <p className="text-lg text-gray-500">
              ¿Listo para mejorar las reseñas de tu restaurante?
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/auth"
                className="group inline-flex items-center px-8 py-3 text-base font-medium text-neutral-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg focus:outline-none hover:text-white hover:bg-neutral-800 hover:border-neutral-800"
              >
                <span className="mr-2">Comenzar Gratis</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;