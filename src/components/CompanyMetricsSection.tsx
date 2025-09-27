import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Users,
  Globe,
  Award,
  Building2,
  Clock,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react';

const CompanyMetricsSection: React.FC = () => {
  const metrics = [
    {
      number: '10K+',
      label: 'Reseñas Filtradas',
      icon: TrendingUp,
      description: 'Reseñas procesadas mensualmente'
    },
    {
      number: '500+',
      label: 'Restaurantes Activos',
      icon: Building2,
      description: 'Negocios confían en nosotros diariamente'
    },
    {
      number: '4.8',
      label: 'Rating Promedio',
      icon: Star,
      description: 'Mejora garantizada en reseñas'
    },
    {
      number: '24/7',
      label: 'Soporte Disponible',
      icon: Clock,
      description: 'Asistencia en todo momento'
    }
  ];

  const achievements = [
    {
      title: 'Certificación de Seguridad',
      description: 'Los más altos estándares de seguridad',
      icon: Award,
      color: '#10b981'
    },
    {
      title: 'Protección de Datos',
      description: 'Cumplimos con regulaciones de privacidad',
      icon: Shield,
      color: '#075E54'
    },
    {
      title: '4.9/5 Valoración Clientes',
      description: 'Confianza de nuestros usuarios',
      icon: Star,
      color: '#f59e0b'
    },
    {
      title: 'Presencia Regional',
      description: 'Sirviendo toda América Latina',
      icon: Globe,
      color: '#ef4444'
    }
  ];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#161616' }}>
              La confianza de restaurantes
              <span className="block" style={{ color: '#075E54' }}>
                en todo el país
              </span>
            </h2>
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p 
                className="text-lg md:text-xl leading-relaxed"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                Miles de restaurantes ya utilizan Reseña Simple para mejorar su reputación online,
                filtrar reseñas negativas y aumentar su calificación en Google.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="group text-center"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div 
                className="p-8 rounded-lg border bg-white transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#075E54' + '20' }}
                >
                  <metric.icon size={32} style={{ color: '#075E54' }} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#075E54' }}>
                    {metric.number}
                  </h3>
                  <h4 className="text-lg font-semibold" style={{ color: '#161616' }}>
                    {metric.label}
                  </h4>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    {metric.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          className="bg-white rounded-lg border p-8"
          style={{ borderColor: 'rgb(229, 231, 235)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#161616' }}>
              Reconocimiento del Sector
            </h3>
            <p 
              className="text-lg"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              Certificados, seguros y aprobados por clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "backOut"
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-6 rounded-lg border bg-white transition-all duration-300 hover:shadow-md" style={{ borderColor: 'rgb(243, 244, 246)' }}>
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: achievement.color + '20' }}
                  >
                    <achievement.icon size={24} style={{ color: achievement.color }} />
                  </div>
                  
                  <h4 className="font-semibold mb-2" style={{ color: '#161616' }}>
                    {achievement.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <p 
              className="text-lg"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              ¿Listo para unirte a la creciente comunidad de restaurantes usando Reseña Simple?
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="/auth"
                className="group inline-flex items-center px-8 py-3 rounded-lg font-medium text-base transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: '#075E54',
                  color: 'white',
                  border: '1px solid #075E54'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#064e45';
                  e.currentTarget.style.borderColor = '#064e45';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#075E54';
                  e.currentTarget.style.borderColor = '#075E54';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                  Comenzar Prueba Gratuita
                </span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyMetricsSection;