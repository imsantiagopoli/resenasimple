import React from 'react';
import { Building2, ChevronLeft } from 'lucide-react';

interface AuthStep2Props {
  formData: {
    restaurantName: string;
    businessType: string;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const AuthStep2: React.FC<AuthStep2Props> = ({
  formData,
  setFormData,
  errors,
  loading,
  onSubmit,
  onBack
}) => {
  const businessTypes = [
    { value: '', label: 'Selecciona el tipo de negocio...' },
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'pizzeria', label: 'Pizzería' },
    { value: 'cafe', label: 'Café' },
    { value: 'bar', label: 'Bar' },
    { value: 'parrilla', label: 'Parrilla' },
    { value: 'comida-rapida', label: 'Comida Rápida' },
    { value: 'heladeria', label: 'Heladería' },
    { value: 'pasteleria', label: 'Pastelería' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200 mb-6"
        style={{ color: '#075E54' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
      >
        <ChevronLeft size={16} />
        <span>Volver</span>
      </button>

      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#075E54' + '20' }}
        >
          <Building2 size={28} style={{ color: '#075E54' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#161616' }}>
          Información del Negocio
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Configura los datos básicos de tu restaurante
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="restaurantName" className="block text-sm font-medium" style={{ color: '#161616' }}>
            Nombre del Restaurante
          </label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
            <input
              type="text"
              id="restaurantName"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                errors.restaurantName ? 'border-red-300 bg-red-50' : ''
              }`}
              style={{
                borderColor: errors.restaurantName ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: errors.restaurantName ? 'rgb(254, 242, 242)' : 'white'
              }}
              placeholder="Ej: La Casa de las Empanadas"
              required
            />
          </div>
          {errors.restaurantName && (
            <p className="text-xs text-red-600 mt-1">{errors.restaurantName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="businessType" className="block text-sm font-medium" style={{ color: '#161616' }}>
            Tipo de Negocio
          </label>
          <select
            id="businessType"
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className={`w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
              errors.businessType ? 'border-red-300 bg-red-50' : ''
            }`}
            style={{
              borderColor: errors.businessType ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: errors.businessType ? 'rgb(254, 242, 242)' : 'white'
            }}
            required
          >
            {businessTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="text-xs text-red-600 mt-1">{errors.businessType}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          style={{
            backgroundColor: '#075E54',
            color: 'white',
            border: '1px solid #075E54'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#064e45';
              e.currentTarget.style.borderColor = '#064e45';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#075E54';
              e.currentTarget.style.borderColor = '#075E54';
            }
          }}
        >
          {loading && (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          <span>Continuar</span>
        </button>
      </form>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#075E54' }}
        />
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#075E54' }}
        />
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'rgb(209, 213, 219)' }}
        />
      </div>
    </div>
  );
};

export default AuthStep2;