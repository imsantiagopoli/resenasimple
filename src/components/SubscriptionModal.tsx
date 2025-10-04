import React, { useState } from 'react';
import { Star, Crown, Building2, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';

interface Plan {
  id: string;
  name: string;
  icon: React.ElementType;
  price: number;
  description: string;
  features: string[];
  checkoutUrl: string;
  popular?: boolean;
}

const SubscriptionModal: React.FC = () => {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const [loading, setLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'basico',
      name: 'Básico',
      icon: Star,
      price: 25000,
      description: 'Perfecto para negocios pequeños',
      checkoutUrl: 'https://resenasimple.lemonsqueezy.com/buy/bb9bfb97-f302-48c9-a28e-e9a97e76faf0',
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
      id: 'profesional',
      name: 'Profesional',
      icon: Crown,
      price: 35000,
      description: 'El más popular para negocios en crecimiento',
      checkoutUrl: 'https://resenasimple.lemonsqueezy.com/buy/6b37389d-28b2-48e9-bce4-540ced381232',
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
      id: 'empresarial',
      name: 'Empresarial',
      icon: Building2,
      price: 70000,
      description: 'Para negocios con múltiples ubicaciones',
      checkoutUrl: 'https://resenasimple.lemonsqueezy.com/buy/ff184666-a819-4f87-a03f-61b087d68217',
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

  const handleSelectPlan = (plan: Plan) => {
    if (!user || !currentBusiness) {
      console.error('User or business not found');
      return;
    }

    setLoading(true);

    const checkoutUrl = new URL(plan.checkoutUrl);
    checkoutUrl.searchParams.set('checkout[email]', user.email || '');
    checkoutUrl.searchParams.set('checkout[custom][user_id]', user.id);
    checkoutUrl.searchParams.set('checkout[custom][business_id]', currentBusiness.id);

    window.location.href = checkoutUrl.toString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#161616' }}>
              Elige tu plan
            </h2>
            <p className="text-lg" style={{ color: 'rgb(107, 114, 128)' }}>
              Selecciona el plan que mejor se adapte a tu negocio para continuar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-2' : ''
                }`}
                style={{
                  borderColor: plan.popular ? '#075E54' : 'rgb(229, 231, 235)',
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: '#075E54',
                      color: 'white',
                    }}
                  >
                    Más Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundColor: plan.popular ? '#075E54' : 'rgb(243, 244, 246)',
                    }}
                  >
                    <plan.icon
                      size={24}
                      style={{ color: plan.popular ? 'white' : '#075E54' }}
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: '#161616' }}>
                    {plan.name}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-3xl font-bold" style={{ color: '#161616' }}>
                        ${plan.price.toLocaleString('es-AR')}
                      </span>
                      <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        /mes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: 'rgb(34, 197, 94)' }}
                      />
                      <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{
                    backgroundColor: plan.popular ? '#075E54' : 'white',
                    color: plan.popular ? 'white' : '#161616',
                    border: plan.popular ? '1px solid #075E54' : '1px solid rgb(209, 213, 219)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      if (plan.popular) {
                        e.currentTarget.style.backgroundColor = '#064e45';
                      } else {
                        e.currentTarget.style.backgroundColor = '#075E54';
                        e.currentTarget.style.color = 'white';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      if (plan.popular) {
                        e.currentTarget.style.backgroundColor = '#075E54';
                      } else {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#161616';
                      }
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Seleccionar Plan</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Todos los planes incluyen una prueba gratuita de 14 días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
