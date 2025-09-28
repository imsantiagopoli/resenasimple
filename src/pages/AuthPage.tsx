import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthStep1 from '../components/auth/AuthStep1';
import AuthStep2 from '../components/auth/AuthStep2';
import AuthStep3 from '../components/auth/AuthStep3';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Form data states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [businessData, setBusinessData] = useState({
    restaurantName: '',
    businessType: ''
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    website: '',
    tiktok: ''
  });

  // Validation functions
  const validateStep1 = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (mode === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    if (!businessData.restaurantName.trim()) {
      newErrors.restaurantName = 'El nombre del restaurante es requerido';
    }

    if (!businessData.businessType) {
      newErrors.businessType = 'El tipo de negocio es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle functions
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) return;

    if (mode === 'login') {
      setIsLoading(true);
      try {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setErrors({ 
            email: error.message.includes('Invalid') ? 'Credenciales inválidas' : error.message 
          });
          return;
        }

        navigate('/dashboard');
      } catch (err: any) {
        setErrors({ email: 'Error al iniciar sesión' });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register mode - go to step 2
      setStep(2);
      setErrors({});
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    // Go to step 3 (social media)
    setStep(3);
    setErrors({});
  };

  const handleStep3SubmitWithSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    await completeRegistration(true);
  };

  const handleStep3SubmitSkipSocials = async () => {
    await completeRegistration(false);
  };

  const completeRegistration = async (includeSocials: boolean) => {
    setIsLoading(true);
    try {
      const socialMediaData = includeSocials ? {
        facebook: socialMedia.facebook.trim() || undefined,
        instagram: socialMedia.instagram.trim() || undefined,
        website: socialMedia.website.trim() || undefined,
        tiktok: socialMedia.tiktok.trim() || undefined
      } : undefined;

      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        businessData.restaurantName,
        businessData.businessType,
        socialMediaData
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'Este email ya está registrado' });
          setStep(1);
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({ general: 'Error al crear la cuenta' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors({ google: error.message });
      }
    } catch (err: any) {
      setErrors({ google: 'Error al iniciar sesión con Google' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
    setErrors({});
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setStep(1);
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm space-y-8">
          {step === 1 && (
            <AuthStep1
              mode={mode}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              isLoading={isLoading}
              onSubmit={handleStep1Submit}
              onGoogleLogin={handleGoogleLogin}
              onToggleMode={toggleMode}
            />
          )}

          {step === 2 && (
            <AuthStep2
              businessData={businessData}
              setBusinessData={setBusinessData}
              errors={errors}
              isLoading={isLoading}
              onSubmit={handleStep2Submit}
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <AuthStep3
              socialMedia={socialMedia}
              setSocialMedia={setSocialMedia}
              errors={errors}
              isLoading={isLoading}
              onSubmitWithSocials={handleStep3SubmitWithSocials}
              onSubmitSkipSocials={handleStep3SubmitSkipSocials}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div 
          className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)`
          }}
        >
          <div className="absolute inset-0 bg-black opacity-20" />
          
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-4">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Mejora tus reseñas'}
              </h2>
              <p className="text-lg opacity-90 mb-8">
                {mode === 'login' 
                  ? 'Accede a tu panel de control y gestiona las reseñas de tu restaurante'
                  : 'Filtra las reseñas antes de Google. Solo los clientes satisfechos dejan reseñas públicas.'
                }
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                  <span className="text-sm">Filtro inteligente de reseñas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                  <span className="text-sm">Códigos QR personalizables</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                  <span className="text-sm">Dashboard de análisis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                  <span className="text-sm">Protege tu reputación online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;