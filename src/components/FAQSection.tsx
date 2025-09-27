import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: '¿Cómo funciona el filtro de reseñas?',
      answer: 'Es muy simple: tus clientes escanean el código QR o hacen clic en el link, votan del 1 al 5 estrellas. Si votan por encima del umbral que configures (ej: 4 o 5 estrellas), los redirigimos automáticamente a Google para que dejen su reseña positiva. Si votan por debajo del umbral, les agradecemos su feedback pero no los enviamos a Google, protegiendo así tu reputación.'
    },
    {
      question: '¿Qué incluye la prueba gratuita?',
      answer: 'Durante 14 días tienes acceso completo a todas las funciones: códigos QR ilimitados, filtro de reseñas, personalización con tu logo y colores, dashboard de análisis, y hasta 100 votaciones. No necesitas tarjeta de crédito para empezar, y puedes cancelar en cualquier momento.'
    },
    {
      question: '¿Puedo personalizar los códigos QR y mensajes?',
      answer: 'Sí, completamente. Puedes agregar tu logo, cambiar los colores para que coincidan con tu marca, personalizar los mensajes que ven los clientes, agregar ofertas especiales para incentivar las votaciones, y configurar diferentes mensajes para diferentes umbrales de estrellas.'
    },
    {
      question: '¿Cómo configuro el umbral de estrellas?',
      answer: 'En tu panel de control puedes establecer fácilmente el número mínimo de estrellas requerido para redirigir a Google. La mayoría de restaurantes usan 4 o 5 estrellas como umbral. También puedes tener diferentes umbrales para diferentes ubicaciones si tienes múltiples locales.'
    },
    {
      question: '¿Funciona con Google My Business?',
      answer: 'Sí, estamos completamente integrados con Google My Business. Cuando un cliente vota por encima de tu umbral, lo redirigimos directamente a tu perfil de Google donde puede dejar su reseña. También podemos integrarnos con otras plataformas de reseñas como Facebook, TripAdvisor, etc.'
    },
    {
      question: '¿Puedo usar esto en múltiples ubicaciones?',
      answer: 'Absolutamente. Con el plan Profesional puedes gestionar múltiples ubicaciones desde un solo panel. Cada ubicación puede tener sus propios códigos QR, mensajes personalizados, y umbrales de estrellas. El plan Cadena incluye un panel administrativo central para gestionar muchos locales.'
    },
    {
      question: '¿Qué tipo de análisis y reportes incluye?',
      answer: 'El dashboard incluye métricas detalladas como: número de votaciones por período, distribución de estrellas, tasa de conversión a Google, tendencias por ubicación/mesa, horas pico de votaciones, y reportes exportables. Esto te ayuda a identificar áreas de mejora y optimizar la experiencia del cliente.'
    },
    {
      question: '¿Necesito conocimientos técnicos para implementarlo?',
      answer: 'Para nada. La implementación es súper simple: 1) Te registras y configuras tu cuenta en minutos, 2) Personalizas tu código QR con tu logo y colores, 3) Imprimes los códigos QR y los colocas en las mesas, 4) ¡Listo! Tus clientes pueden empezar a votar inmediatamente. No se requiere instalación ni conocimientos técnicos.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
          <motion.div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#161616' }}>
              Preguntas
              <span className="block" style={{ color: '#075E54' }}>
                frecuentes
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
                Todo lo que necesitas saber sobre Reseña Simple. ¿No encuentras lo que buscas? 
                Contáctanos para ayuda personalizada.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="rounded-lg border bg-white transition-all duration-300 h-fit hover:shadow-lg"
                style={{
                  borderColor: openIndex === index ? '#075E54' : 'rgb(229, 231, 235)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between transition-colors duration-200"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    if (openIndex !== index) {
                      e.currentTarget.parentElement!.style.borderColor = 'rgb(209, 213, 219)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (openIndex !== index) {
                      e.currentTarget.parentElement!.style.borderColor = 'rgb(229, 231, 235)';
                    }
                  }}
                >
                  <h3 
                    className="text-lg font-semibold pr-4"
                    style={{ color: '#161616' }}
                  >
                    {faq.question}
                  </h3>
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: openIndex === index ? '#075E54' : 'rgb(243, 244, 246)',
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    {openIndex === index ? (
                      <Minus size={16} style={{ color: 'white' }} />
                    ) : (
                      <Plus size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                    )}
                  </div>
                </button>
                
                {/* Answer */}
                <motion.div 
                  className="overflow-hidden"
                  animate={{ 
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div 
                    className="px-6 pb-6"
                    style={{ borderTop: '1px solid rgb(229, 231, 235)' }}
                  >
                    <p 
                      className="text-base leading-relaxed pt-4"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
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
              ¿Tienes más preguntas? Estamos aquí para ayudarte.
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
                <span className="inline-block transition-transform group-hover:scale-105">
                  Comenzar Gratis
                </span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;