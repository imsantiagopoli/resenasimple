import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthStep2Props {
  businessData: {
    restaurantName: string;
    businessType: string;
  };
  setBusinessData: React.Dispatch<React.SetStateAction<{
    restaurantName: string;
    businessType: string;
  }>>;
  errors: any;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const AuthStep2: React.FC<AuthStep2Props> = ({
  businessData,
  setBusinessData,
  errors,
  isLoading,
  onSubmit,
  onBack
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'rgb(107, 114, 128)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgb(209, 213, 219)' }}
          />
          <div 
            className="w-6 h-2 rounded-full"
            style={{ backgroundColor: '#075E54' }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgb(209, 213, 219)' }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Información del negocio
        </h2>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Cuéntanos sobre tu restaurante
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Nombre del restaurante
          </label>
          <input
            type="text"
            value={businessData.restaurantName}
            onChange={(e) => setBusinessData({ ...businessData, restaurantName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.restaurantName ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="Pizzería Napolitana"
            required
          />
          {errors.restaurantName && (
            <p className="text-xs text-red-600">{errors.restaurantName}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Tipo de negocio
          </label>
          <select
            value={businessData.businessType}
            onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.businessType ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            required
          >
            <option value="">Selecciona el tipo de negocio</option>
            <option value="restaurante">Restaurante</option>
            <option value="pizzeria">Pizzería</option>
            <option value="cafe">Café</option>
            <option value="bar">Bar</option>
            <option value="parrilla">Parrilla</option>
            <option value="comida-rapida">Comida Rápida</option>
            <option value="panaderia">Panadería</option>
            <option value="heladeria">Heladería</option>
            <option value="otro">Otro</option>
          </select>
          {errors.businessType && (
            <p className="text-xs text-red-600">{errors.businessType}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#075E54',
            color: 'white',
            border: '1px solid #075E54'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#064e45';
              e.currentTarget.style.borderColor = '#064e45';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#075E54';
              e.currentTarget.style.borderColor = '#075E54';
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Procesando...</span>
            </div>
          ) : (
            'Continuar'
          )}
        </button>
      </form>
    </>
  );
};

export default AuthStep2;