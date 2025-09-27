import React from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface AuthStep1Props {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

const AuthStep1: React.FC<AuthStep1Props> = ({
  isLogin,
  setIsLogin,
  formData,
  setFormData,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  onSubmit,
  onGoogleSignIn
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#161616' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          {isLogin ? 'Accede a tu cuenta de Reseña Simple' : 'Únete a Reseña Simple y mejora las reseñas de tu restaurante'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Nombre
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                    errors.firstName ? 'border-red-300 bg-red-50' : ''
                  }`}
                  style={{
                    borderColor: errors.firstName ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: errors.firstName ? 'rgb(254, 242, 242)' : 'white'
                  }}
                  placeholder="Tu nombre"
                  required={!isLogin}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Apellido
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                    errors.lastName ? 'border-red-300 bg-red-50' : ''
                  }`}
                  style={{
                    borderColor: errors.lastName ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: errors.lastName ? 'rgb(254, 242, 242)' : 'white'
                  }}
                  placeholder="Tu apellido"
                  required={!isLogin}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#161616' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
                errors.email ? 'border-red-300 bg-red-50' : ''
              }`}
              style={{
                borderColor: errors.email ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: errors.email ? 'rgb(254, 242, 242)' : 'white'
              }}
              placeholder="tu@email.com"
              required
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#161616' }}>
            Contraseña
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border text-sm transition-all duration-200 ${
                errors.password ? 'border-red-300 bg-red-50' : ''
              }`}
              style={{
                borderColor: errors.password ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: errors.password ? 'rgb(254, 242, 242)' : 'white'
              }}
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: '#161616' }}>
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border text-sm transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : ''
                }`}
                style={{
                  borderColor: errors.confirmPassword ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: errors.confirmPassword ? 'rgb(254, 242, 242)' : 'white'
                }}
                placeholder="Confirma tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

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
          <span>{isLogin ? 'Iniciar Sesión' : 'Continuar'}</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'rgb(229, 231, 235)' }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">o continúa con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg font-medium text-base border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          style={{
            backgroundColor: 'white',
            color: '#161616',
            borderColor: 'rgb(209, 213, 219)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
              e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{isLogin ? 'Iniciar con Google' : 'Registrarse con Google'}</span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: '#075E54' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate aquí'
              : '¿Ya tienes cuenta? Inicia sesión aquí'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthStep1;