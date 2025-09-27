import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Building2,
  Shield,
  Zap,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  Quote,
  ArrowLeft,
  Globe,
  Music
} from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn, signInWithGoogle, resetPassword, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Paso 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Paso 2
    restaurantName: '',
    businessType: '',
    // Paso 3 - Redes Sociales (opcional)
    facebook: '',
    instagram: '',
    website: '',
    tiktok: ''
  });

  // Testimonials carousel data
  const testimonials = [
    {
      image: 'https://images.pexels.com/photos/28945103/pexels-photo-28945103.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=2',
      rating: 5,
      review: 'La pizza estaba deliciosa, ambiente perfecto para cenar en familia. ¡Definitivamente volveremos pronto!',
      customer: 'María González',
      restaurant: 'Pizzería Napolitana',
      type: 'positive',
      status: 'Reseña enviada a Google ⭐'
    },
    {
      image: 'https://images.pexels.com/photos/29039084/pexels-photo-29039084.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=2',
      rating: 5,
      review: 'Pasta increíble, el sabor casero que buscaba. El servicio fue excelente y rápido.',
      customer: 'Carlos Martínez',
      restaurant: 'Trattoria Roma',
      type: 'positive',
      status: 'Reseña enviada a Google ⭐'
    },
    {
      image: 'https://images.pexels.com/photos/29007122/pexels-photo-29007122.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=2',
      rating: 2,
      review: 'Los tacos estaban fríos y el servicio fue muy lento. Esperaba mucho más.',
      customer: 'Ana López',
      restaurant: 'Tacos El Primo',
      type: 'negative',
      status: 'Reseña negativa evitada en Google ✅'
    },
    {
      image: 'https://wallpapers.com/images/hd/churrasco-on-chopping-board-g3ikpaz5sy5cl9g6.jpg',
      rating: 5,
      review: 'El mejor asado que he probado en años. La carne estaba perfecta y el ambiente espectacular.',
      customer: 'Roberto Silva',
      restaurant: 'Parrilla Don Juan',
      type: 'positive',
      status: 'Reseña enviada a Google ⭐'
    }
  ];

  const businessTypes = [
    'Restaurante',
    'Pizzería',
    'Bar',
    'Café',
    'Parrilla',
    'Food Truck',
    'Panadería',
    'Heladería',
    'Otro'
  ];

  // Check URL params for mode (reset password, etc.)
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setSuccessMessage('Revisa tu email para continuar con el restablecimiento de contraseña');
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    clearMessages();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    if (isLogin) {
      return handleLoginSubmit(e);
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    // Ir al paso 3 (redes sociales)
    setCurrentStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFinalRegistration();
  };

  const handleSkipSocialMedia = async () => {
    // Saltear redes sociales y proceder con el registro
    await handleFinalRegistration();
  };

  const handleFinalRegistration = async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.restaurantName,
        formData.businessType,
        {
          facebook: formData.facebook,
          instagram: formData.instagram,
          website: formData.website,
          tiktok: formData.tiktok
        }
      );

      if (error) {
        throw error;
      }

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          // Email confirmation required
          setSuccessMessage(
            `¡Cuenta creada para ${formData.restaurantName}! Revisa tu email para confirmar tu cuenta y acceder al dashboard.`
          );
          setCurrentStep(1);
          setIsLogin(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            restaurantName: '',
            businessType: '',
            facebook: '',
            instagram: '',
            website: '',
            tiktok: ''
          });
        } else {
          // Auto login if email confirmation is disabled
          setSuccessMessage(`¡Bienvenido a ${formData.restaurantName}! Tu cuenta ha sido creada exitosamente.`);
          // Navigation will happen automatically via useEffect when user state changes
        }
      } else {
        setError('Error inesperado durante el registro. Por favor intenta de nuevo.');
      }
    } catch (err: any) {
      if (err.message?.includes('email')) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión en su lugar?');
      } else if (err.message?.includes('password')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(err.message || 'Error al crear la cuenta y configurar el restaurante. Por favor intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        throw error;
      }

      // Navigation will happen automatically via useEffect when user state changes
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        throw error;
      }
      // Google auth will redirect automatically
    } catch (err: any) {
      setError(err.message || 'Error al autenticar con Google');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Ingresa tu email para restablecer la contraseña');
      return;
    }

    clearMessages();
    setIsSubmitting(true);

    try {
      const { error } = await resetPassword(formData.email);
      if (error) {
        throw error;
      }
      setSuccessMessage('Te hemos enviado un email para restablecer tu contraseña');
    } catch (err: any) {
      setError(err.message || 'Error al enviar email de restablecimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b bg-white" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="px-6 py-4">
            <Link 
              to="/"
              className="flex items-center justify-between cursor-pointer group transition-opacity duration-200 hover:opacity-80 bg-white"
            >
              <h1 className="text-xl font-bold" style={{ color: '#075E54' }}>
                Reseña Simple
              </h1>
              <div className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Gestión de Reseñas
              </div>
            </Link>
          </div>
        </header>

        {/* Form Content - Posicionado más abajo */}
        <div className="flex-1 px-6 pt-16 pb-12 min-h-0 overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              {/* Error Message */}
              {error && (
                <div 
                  className="mb-4 p-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fecaca',
                    color: '#dc2626'
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div 
                  className="mb-4 p-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: '#dcfce7',
                    borderColor: '#bbf7d0',
                    color: '#16a34a'
                  }}
                >
                  {successMessage}
                </div>
              )}

              <h2 className="text-3xl font-bold mb-2" style={{ color: '#161616' }}>
                {isLogin 
                  ? 'Bienvenido de vuelta' 
                  : currentStep === 1 ? 'Crea tu cuenta'
                  : currentStep === 2 ? 'Detalles del restaurante'  
                  : 'Conecta tus redes'
                }
              </h2>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                {isLogin 
                  ? 'Accede a tu panel de gestión de reseñas' 
                  : currentStep === 1
                    ? 'Comienza a filtrar reseñas hoy mismo'
                    : currentStep === 2
                      ? 'Ya casi terminamos, cuéntanos sobre tu negocio'
                      : 'Opcional: Muestra tus redes en la página de votación'
                }
              </p>
            </div>

            {/* Form Toggle - Solo mostrar en paso 1 o login */}
            {(isLogin || currentStep === 1) && (
              <div className="flex p-1 rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)', backgroundColor: 'rgb(249, 250, 251)' }}>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setCurrentStep(1);
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    isLogin ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: isLogin ? 'white' : 'transparent',
                    color: isLogin ? '#161616' : 'rgb(107, 114, 128)',
                    borderColor: isLogin ? 'rgb(229, 231, 235)' : 'transparent'
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setCurrentStep(1);
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                    !isLogin ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: !isLogin ? 'white' : 'transparent',
                    color: !isLogin ? '#161616' : 'rgb(107, 114, 128)',
                    borderColor: !isLogin ? 'rgb(229, 231, 235)' : 'transparent'
                  }}
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Paso 2 - Botón Volver */}
            {!isLogin && (currentStep === 2 || currentStep === 3) && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2 text-sm transition-colors duration-200"
                style={{ color: '#075E54' }}
              >
                <ArrowLeft size={16} />
                <span>Volver</span>
              </button>
            )}

            {/* LOGIN FORM */}
            {isLogin && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="password"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200"
                      style={{ color: 'rgb(107, 114, 128)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 focus:ring-2"
                      style={{ 
                        accentColor: '#075E54'
                      }}
                    />
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      Recordarme
                    </span>
                  </label>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleForgotPassword();
                    }}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#075E54' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white',
                    border: '1px solid #075E54'
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
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                        Iniciar Sesión
                      </span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgb(229, 231, 235)' }} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-2 bg-white"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    >
                      o
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'white',
                    color: '#161616',
                    borderColor: 'rgb(209, 213, 219)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                    e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuar con Google
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTRO PASO 1 */}
            {!isLogin && currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* Nombre y Apellido en la misma fila */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label 
                      htmlFor="firstName"
                      className="block text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      Nombre
                    </label>
                    <div className="relative">
                      <User 
                        size={18} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: 'rgb(107, 114, 128)' }}
                      />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                          backgroundColor: 'white',
                          borderColor: 'rgb(209, 213, 219)',
                          color: '#161616',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#075E54';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        placeholder="Juan"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="lastName"
                      className="block text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Pérez"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="password"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200"
                      style={{ color: 'rgb(107, 114, 128)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label 
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Repite tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200"
                      style={{ color: 'rgb(107, 114, 128)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ 
                      accentColor: '#075E54'
                    }}
                    required
                  />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Acepto los términos y condiciones
                  </span>
                </div>

                {/* Continue Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white',
                    border: '1px solid #075E54'
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
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                        Continuar
                      </span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgb(229, 231, 235)' }} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-2 bg-white"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    >
                      o
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'white',
                    color: '#161616',
                    borderColor: 'rgb(209, 213, 219)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                    e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuar con Google
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTRO PASO 2 */}
            {!isLogin && currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* Restaurant Name */}
                <div className="space-y-2">
                  <label 
                    htmlFor="restaurantName"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    Nombre del restaurante
                  </label>
                  <div className="relative">
                    <Building2 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: 'rgb(107, 114, 128)' }}
                    />
                    <input
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Nombre de tu negocio"
                      required
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                  <label 
                    htmlFor="businessType"
                    className="block text-sm font-medium"
                    style={{ color: '#161616' }}
                  >
                    ¿Qué tipo de negocio es?
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#075E54';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="">Selecciona un tipo...</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Create Account Button */}
                <button 
                  type="submit"
                  disabled={!formData.restaurantName || !formData.businessType}
                  className="group w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white',
                    border: '1px solid #075E54'
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
                  <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                    Continuar
                  </span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}

            {/* REGISTRO PASO 3 - REDES SOCIALES (OPCIONAL) */}
            {!isLogin && currentStep === 3 && (
              <div className="space-y-6">
                {/* Header del paso opcional */}
                <div className="text-center">
                  
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Opcional: Agrega tus redes para mostrarlas en la página de votación
                  </p>
                </div>

                <form onSubmit={handleStep3Submit} className="space-y-6">
                  {/* Facebook */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="facebook"
                      className="flex items-center space-x-2 text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#1877f2' }}>
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span>Facebook</span>
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="https://facebook.com/tu-restaurante"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="instagram"
                      className="flex items-center space-x-2 text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span>Instagram</span>
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="https://instagram.com/tu-restaurante"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="website"
                      className="flex items-center space-x-2 text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgb(107, 114, 128)' }}>
                        <Globe size={12} className="text-white" />
                      </div>
                      <span>Sitio Web</span>
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="https://tu-restaurante.com"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="tiktok"
                      className="flex items-center space-x-2 text-sm font-medium"
                      style={{ color: '#161616' }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-black">
                        <Music size={12} className="text-white" />
                      </div>
                      <span>TikTok</span>
                    </label>
                    <input
                      type="url"
                      id="tiktok"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#075E54';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="https://tiktok.com/@tu-restaurante"
                    />
                  </div>

                  {/* Botones */}
                  <div className="space-y-3 pt-4">
                    {/* Botón completar */}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: '#075E54',
                        color: 'white',
                        border: '1px solid #075E54'
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
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                            Crear Cuenta
                          </span>
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {/* Botón saltear */}
                    <button 
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSkipSocialMedia}
                      className="w-full py-3 px-6 rounded-lg font-medium text-sm border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'white',
                        color: 'rgb(107, 114, 128)',
                        borderColor: 'rgb(209, 213, 219)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                        e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                      }}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        'Completar más tarde'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Right Side - Testimonials Carousel */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="w-full h-full relative">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentSlide ? 1 : 0
              }}
            >
              {/* Background Image */}
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${testimonial.image})`,
                }}
              >
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: 'linear-gradient(45deg, rgba(7, 94, 84, 0.8), rgba(7, 94, 84, 0.6))'
                  }}
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="max-w-md text-center">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote size={40} className="mx-auto text-white opacity-80" />
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={`${
                            star <= testimonial.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className="text-lg leading-relaxed text-white mb-6 font-medium">
                      "{testimonial.review}"
                    </blockquote>

                    {/* Customer Info */}
                    <div className="text-white/90 mb-6">
                      <p className="font-semibold">{testimonial.customer}</p>
                      <p className="text-sm opacity-80">{testimonial.restaurant}</p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        testimonial.type === 'positive'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}
                    >
                      {testimonial.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;