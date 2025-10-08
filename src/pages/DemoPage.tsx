import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const DemoPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).Cal) {
        const Cal = (window as any).Cal;
        Cal('init', '15min', { origin: 'https://app.cal.com' });
        Cal.ns['15min']('inline', {
          elementOrSelector: '#my-cal-inline-15min',
          config: { layout: 'month_view' },
          calLink: 'resenasimple/15min',
        });
        Cal.ns['15min']('ui', {
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const faqs = [
    {
      question: '¿Cuánto dura la demostración?',
      answer: 'La demostración dura aproximadamente 15 minutos. Durante este tiempo, revisaremos las funcionalidades principales de Reseña Simple y responderemos tus preguntas específicas sobre cómo puede ayudar a tu negocio.',
    },
    {
      question: '¿Qué veremos en la demo?',
      answer: 'Te mostraremos cómo configurar tu página de reseñas personalizada, generar códigos QR, gestionar las respuestas de tus clientes, y cómo conectar tu cuenta de Google My Business para sincronizar automáticamente tus reseñas.',
    },
    {
      question: '¿Necesito preparar algo para la demostración?',
      answer: 'No es necesario preparar nada. Sin embargo, si tienes preguntas específicas sobre tu negocio o casos de uso particulares, te recomendamos anotarlas para que podamos abordarlas durante la llamada.',
    },
    {
      question: '¿La demo tiene algún costo?',
      answer: 'No, la demostración es completamente gratuita y sin compromiso. Queremos que conozcas todas las funcionalidades de Reseña Simple antes de tomar una decisión.',
    },
    {
      question: '¿Puedo cancelar o reprogramar la demo?',
      answer: 'Sí, puedes cancelar o reprogramar tu demostración en cualquier momento usando el enlace que recibirás en el correo de confirmación.',
    },
    {
      question: '¿Qué tipo de negocios se benefician más de Reseña Simple?',
      answer: 'Reseña Simple es ideal para restaurantes, cafeterías, hoteles, spas, centros de belleza, y cualquier negocio que desee mejorar su reputación online y recibir más reseñas de sus clientes satisfechos.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Agenda una Demo - Reseña Simple"
        description="Agenda una demostración personalizada de 15 minutos y descubre cómo Reseña Simple puede ayudar a tu negocio a gestionar reseñas y mejorar tu reputación online."
        url="https://resenasimple.com/demo"
      />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#075E54' }}>
                Agenda una Demostración
              </h1>
              <p className="text-lg md:text-xl" style={{ color: 'rgb(107, 114, 128)' }}>
                Descubre cómo Reseña Simple puede transformar la gestión de reseñas de tu negocio
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#075E54' }}>
                  ¿Qué incluye la demostración?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#075E54' }}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#075E54' }}>
                        Configuración personalizada
                      </h3>
                      <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        Te mostramos cómo personalizar tu página de reseñas con los colores y el estilo de tu marca.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#075E54' }}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#075E54' }}>
                        Generación de códigos QR
                      </h3>
                      <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        Aprende a crear códigos QR personalizados para facilitar que tus clientes dejen reseñas.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#075E54' }}>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#075E54' }}>
                        Gestión de respuestas
                      </h3>
                      <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        Descubre cómo gestionar eficientemente las respuestas privadas de tus clientes.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#075E54' }}>
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#075E54' }}>
                        Integración con Google
                      </h3>
                      <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        Te enseñamos a conectar tu cuenta de Google My Business para sincronizar reseñas automáticamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{ width: '100%', height: '700px', overflow: 'auto' }}
                id="my-cal-inline-15min"
              />
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#075E54' }}>
                Preguntas Frecuentes
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#075E54' }}>
                      {faq.question}
                    </h3>
                    <p style={{ color: 'rgb(107, 114, 128)' }}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#075E54' }}>
                  ¿Prefieres empezar directamente?
                </h2>
                <p className="text-lg mb-6" style={{ color: 'rgb(107, 114, 128)' }}>
                  Puedes comenzar a usar Reseña Simple de inmediato sin necesidad de una demostración
                </p>
                <a
                  href="/auth"
                  className="inline-block px-8 py-3 rounded-lg text-base font-medium border transition-all duration-200"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white',
                    borderColor: '#075E54',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#064e45';
                    e.currentTarget.style.borderColor = '#064e45';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#075E54';
                    e.currentTarget.style.borderColor = '#075E54';
                  }}
                >
                  Comenzar Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoPage;
