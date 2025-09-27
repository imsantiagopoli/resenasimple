import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthStep1 from '../components/auth/AuthStep1';
import AuthStep2 from '../components/auth/AuthStep2';
import AuthStep3 from '../components/auth/AuthStep3';
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
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2
    restaurantName: '',
    businessType: '',
    
    // Step 3
    socialMedia: {
      facebook: '',
      instagram: '',
      website: '',
      tiktok: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {};
    
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        stepErrors.firstName = 'El nombre es requerido';
      }
      if (!formData.lastName.trim()) {
        stepErrors.lastName = 'El apellido es requerido';
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    if (!formData.email.trim()) {
      stepErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      stepErrors.email = 'Email inválido';
    }
    
    if (!formData.password.trim()) {
      stepErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      stepErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors: Record<string, string> = {};
    
    if (!formData.restaurantName.trim()) {
      stepErrors.restaurantName = 'El nombre del restaurante es requerido';
    }
    
    if (!formData.businessType) {
      stepErrors.businessType = 'Selecciona el tipo de negocio';
    }
    
    return stepErrors;
  };

  // Step 1 submit (Personal info)
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await handleLogin();
    } else {
      const stepErrors = validateStep1();
      if (Object.keys(stepErrors).length === 0) {
        setStep(2);
      } else {
        setErrors(stepErrors);
      }
    }
  };

  // Step 2 submit (Business info)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepErrors = validateStep2();
    if (Object.keys(stepErrors).length === 0) {
      setStep(3);
    } else {
      setErrors(stepErrors);
    }
  };

  // Step 3 submit (Social media + final registration)
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCompleteRegistration();
  };

  const handleSkipSocial = async () => {
    await handleCompleteRegistration();
  };

  const handleCompleteRegistration = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.restaurantName,
        formData.businessType,
        formData.socialMedia
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'Este email ya está registrado. Intenta iniciar sesión.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      setSuccessMessage(`¡Bienvenido a Reseña Simple, ${formData.firstName}! Tu cuenta ha sido creada exitosamente.`);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      setErrors({ general: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Email o contraseña incorrectos' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setErrors({ general: 'Error inesperado. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors({ general: 'Error al iniciar sesión con Google' });
      }
    } catch (err: any) {
      setErrors({ general: 'Error inesperado con Google' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Messages */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {step === 1 && (
          <AuthStep1
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            loading={isSubmitting}
            onSubmit={handleStep1Submit}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        {step === 2 && (
          <AuthStep2
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={isSubmitting}
            onSubmit={handleStep2Submit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <AuthStep3
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={isSubmitting}
            onSubmit={handleStep3Submit}
            onSkip={handleSkipSocial}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;