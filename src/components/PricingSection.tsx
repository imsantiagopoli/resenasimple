import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Crown, 
  Building2,
  ArrowRight,
  Zap
} from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Básico',
      icon: Star,
      price: 25000,
      period: 'mes',
      description: 'Perfecto para negocios pequeños',
      popular: false,
      features: [
        '1 ubicación',
        'Hasta 100 reseñas',
        'Códigos QR ilimitados',
        'Personalización básica',
        'Dashboard de análisis',
        'Soporte por email',
        'Filtro de reseñas'
      ]
    },
    {
      name: 'Profesional',
      icon: Crown,
      price: 35000,
      period: 'mes',
      description: 'El más popular para negocios en crecimiento',
      popular: true,
      features: [
        '1 ubicación',
        'Reseñas ilimitadas',
        'Códigos QR ilimitados',
        'Personalización avanzada',
        'Logo y colores de marca',
        'Mensajes de ofertas',
        'Analytics avanzados',
        'Soporte prioritario',
        'Exportar reportes'
      ]
    },
    {
      name: 'Empresarial',
      icon: Building2,
      price: 70000,
      period: 'mes',
      description: 'Para negocios con múltiples ubicaciones',
      popular: false,
      features: [
        'Hasta 3 sucursales',
        'Reseñas ilimitadas',
        'Códigos QR ilimitados',
        'Panel administrativo central',
        'Gestión de múltiples locales',
        'Branding personalizado',
        'Analytics avanzados',
        'Soporte prioritario',
        'Exportar reportes',
        'Reportes personalizados'
      ]
    }
  ];

  return (
    <section 
      id="pricing"
      className="py-16 lg:py-24"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#161616' }}>
              Precios simples y
              <span className="block" style={{ color: '#075E54' }}>
                transparentes
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
                Elige el plan que mejor se adapte al tamaño de tu restaurante. 
                Todos los planes incluyen filtrado de reseñas y códigos QR ilimitados.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className={`relative group ${plan.popular ? 'lg:-mt-4' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: plan.popular ? -2 : -8, scale: 1.02 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: '#075E54',
                      color: 'white'
                    }}
                  >
                    <Zap size={14} />
                    <span>Más Popular</span>
                  </div>
                </motion.div>
              )}

              {/* Plan Card */}
              <motion.div 
                className={`h-full p-8 rounded-lg border bg-white transition-all duration-300 hover:shadow-lg relative ${
                  plan.popular ? 'lg:py-12' : ''
                } flex flex-col`}
                style={{
                  borderColor: plan.popular ? '#075E54' : 'rgb(229, 231, 235)',
                  borderWidth: plan.popular ? '2px' : '1px'
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                  }
                }}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: plan.popular ? '#075E54' : 'rgb(243, 244, 246)' }}
                  >
                    <plan.icon 
                      size={28} 
                      style={{ color: plan.popular ? 'white' : '#075E54' }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#161616' }}>
                    {plan.name}
                  </h3>
                  
                  <p 
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {plan.price ? (
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#161616' }}>
                          ${plan.price.toLocaleString('es-AR')}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: 'rgb(107, 114, 128)' }}
                        >
                          /{plan.period}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#161616' }}>
                          Hablemos
                        </span>
                        <p
                          className="text-sm mt-2"
                          style={{ color: 'rgb(107, 114, 128)' }}
                        >
                          Precio Personalizado
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check 
                        size={16} 
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: 'rgb(34, 197, 94)' }}
                      />
                      <span 
                        className="text-sm leading-relaxed"
                        style={{ color: 'rgb(107, 114, 128)' }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/auth"
                      className="group w-full flex items-center justify-center py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg focus:outline-none"
                      style={{
                        backgroundColor: plan.popular ? '#075E54' : 'white',
                        color: plan.popular ? 'white' : '#161616',
                        border: plan.popular ? '1px solid #075E54' : '1px solid rgb(209, 213, 219)'
                      }}
                      onMouseEnter={(e) => {
                        if (plan.popular) {
                          e.currentTarget.style.backgroundColor = '#064e45';
                          e.currentTarget.style.borderColor = '#064e45';
                        } else {
                          e.currentTarget.style.backgroundColor = '#075E54';
                          e.currentTarget.style.borderColor = '#075E54';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (plan.popular) {
                          e.currentTarget.style.backgroundColor = '#075E54';
                          e.currentTarget.style.borderColor = '#075E54';
                        } else {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                          e.currentTarget.style.color = '#161616';
                        }
                      }}
                    >
                      <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                        Comenzar Ahora
                      </span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div className="space-y-6">
            <p 
              className="text-lg"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              Todos los planes incluyen una prueba gratuita de 14 días. Sin tarjeta de crédito requerida.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              <span className="flex items-center space-x-2">
                <Check size={16} style={{ color: 'rgb(34, 197, 94)' }} />
                <span>Cancela cuando quieras</span>
              </span>
              <span className="flex items-center space-x-2">
                <Check size={16} style={{ color: 'rgb(34, 197, 94)' }} />
                <span>Soporte 24/7</span>
              </span>
              <span className="flex items-center space-x-2">
                <Check size={16} style={{ color: 'rgb(34, 197, 94)' }} />
                <span>Sin costos de configuración</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;