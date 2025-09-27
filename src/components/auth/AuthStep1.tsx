import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthStep1Props {
  mode: 'login' | 'register';
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>>;
  errors: any;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onToggleMode: () => void;
}

const AuthStep1: React.FC<AuthStep1Props> = ({
  mode,
  formData,
  setFormData,
  errors,
  isLoading,
  onSubmit,
  onGoogleLogin,
  onToggleMode
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold" style={{ color: '#161616' }}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          {mode === 'login' 
            ? 'Accede a tu panel de control' 
            : 'Comienza a mejorar tus reseñas hoy'
          }
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: errors.firstName ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Juan"
                required
              />
              {errors.firstName && (
                <p className="text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: errors.lastName ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Pérez"
                required
              />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.email ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="tu@email.com"
            required
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 pr-10 rounded-lg border text-sm transition-all duration-200"
              style={{
                borderColor: errors.password ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {mode === 'register' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: errors.confirmPassword ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Confirma tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}

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
              <span>{mode === 'login' ? 'Iniciando...' : 'Creando cuenta...'}</span>
            </div>
          ) : (
            mode === 'login' ? 'Iniciar Sesión' : 'Continuar'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'rgb(229, 231, 235)' }}></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span 
            className="bg-white px-2 font-medium"
            style={{ color: 'rgb(107, 114, 128)' }}
          >
            O continúa con
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'white',
          color: '#161616',
          borderColor: 'rgb(209, 213, 219)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'white';
          }
        }}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {mode === 'login' ? 'Iniciar con Google' : 'Registrarse con Google'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm transition-colors duration-200"
          style={{ color: '#075E54' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
        >
          {mode === 'login' 
            ? '¿No tienes cuenta? Regístrate' 
            : '¿Ya tienes cuenta? Inicia sesión'
          }
        </button>
      </div>
    </>
  );
};

export default AuthStep1;