import React, { useState, useEffect } from 'react';
import { 
  User, 
  Crown, 
  CreditCard, 
  Bell, 
  Shield, 
  Mail,
  Save,
  X,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [tempProfileData, setTempProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Mock subscription data - in a real app this would come from Stripe/payment provider
  const subscriptionData = {
    plan: 'Profesional',
    status: 'active',
    nextBilling: '2025-02-15',
    amount: 39,
    features: [
      'Hasta 2,000 votaciones por mes',
      'Códigos QR ilimitados',
      'Personalización avanzada',
      'Multiple ubicaciones',
      'Soporte prioritario'
    ]
  };

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile(data);
          const profileInfo = {
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || user.email || ''
          };
          setProfileData(profileInfo);
          setTempProfileData(profileInfo);
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url || null
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          setProfile(createdProfile);
          const profileInfo = {
            firstName: createdProfile.first_name || '',
            lastName: createdProfile.last_name || '',
            email: createdProfile.email || user.email || ''
          };
          setProfileData(profileInfo);
          setTempProfileData(profileInfo);
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setSaveMessage({ type: 'error', text: 'Error al cargar el perfil' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 5000);
  };

  const handleEditProfile = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: tempProfileData.firstName.trim() || null,
          last_name: tempProfileData.lastName.trim() || null,
          email: tempProfileData.email.trim() || null
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      setProfileData(tempProfileData);
      setIsEditingProfile(false);
      showMessage('success', 'Perfil actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      showMessage('error', err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Configuración
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Gestiona tu perfil, suscripción y preferencias de cuenta
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div 
          className={`p-3 rounded-lg border text-sm ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {saveMessage.type === 'success' ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#075E54' + '20' }}
            >
              <User size={20} style={{ color: '#075E54' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
                Información Personal
              </h2>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Actualiza tu nombre y información de contacto
              </p>
            </div>
          </div>
          
          {!isEditingProfile ? (
            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: 'white',
                color: '#161616',
                border: '1px solid rgb(209, 213, 219)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <SettingsIcon size={16} />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#075E54',
                  color: 'white',
                  border: '1px solid #075E54'
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }
                }}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
              </button>
              
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50"
                style={{
                  backgroundColor: 'white',
                  color: '#161616',
                  border: '1px solid rgb(209, 213, 219)'
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Nombre
            </label>
            <input
              type="text"
              value={isEditingProfile ? tempProfileData.firstName : profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditingProfile}
              className="w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: isEditingProfile ? 'white' : 'rgb(249, 250, 251)'
              }}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Apellido
            </label>
            <input
              type="text"
              value={isEditingProfile ? tempProfileData.lastName : profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditingProfile}
              className="w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: isEditingProfile ? 'white' : 'rgb(249, 250, 251)'
              }}
              placeholder="Tu apellido"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Email
            </label>
            <input
              type="email"
              value={isEditingProfile ? tempProfileData.email : profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={true} // Email changes require special verification
              className="w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 bg-gray-50 cursor-not-allowed"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: 'rgb(107, 114, 128)',
                backgroundColor: 'rgb(249, 250, 251)'
              }}
            />
            <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              Para cambiar tu email, contacta al soporte
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#f59e0b' + '20' }}
          >
            <Crown size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Suscripción
            </h2>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Gestiona tu plan y facturación
            </p>
          </div>
        </div>

        {/* Current Plan */}
        <div 
          className="p-4 rounded-lg border mb-6"
          style={{ 
            backgroundColor: '#075E54' + '08',
            borderColor: '#075E54' + '30'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: '#075E54' }}>
                Plan {subscriptionData.plan}
              </h3>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                ${subscriptionData.amount}/mes • Estado: {subscriptionData.status === 'active' ? 'Activo' : 'Inactivo'}
              </p>
            </div>
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: subscriptionData.status === 'active' ? '#10b981' : '#ef4444',
                color: 'white'
              }}
            >
              {subscriptionData.status === 'active' ? 'Activo' : 'Inactivo'}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium" style={{ color: '#161616' }}>
              Incluye:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {subscriptionData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'rgb(249, 250, 251)',
              borderColor: 'rgb(229, 231, 235)'
            }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Calendar size={16} style={{ color: 'rgb(107, 114, 128)' }} />
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Próxima Facturación
              </h4>
            </div>
            <p className="text-lg font-semibold" style={{ color: '#161616' }}>
              {new Date(subscriptionData.nextBilling).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Se cobrará ${subscriptionData.amount}
            </p>
          </div>

          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'rgb(249, 250, 251)',
              borderColor: 'rgb(229, 231, 235)'
            }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard size={16} style={{ color: 'rgb(107, 114, 128)' }} />
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Método de Pago
              </h4>
            </div>
            <p className="text-lg font-semibold" style={{ color: '#161616' }}>
              •••• 4242
            </p>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Visa terminada en 4242
            </p>
          </div>
        </div>

        {/* Subscription Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-200"
            style={{
              backgroundColor: 'white',
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Crown size={16} />
            <span>Cambiar Plan</span>
          </button>

          <button
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-200"
            style={{
              backgroundColor: 'white',
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <CreditCard size={16} />
            <span>Actualizar Pago</span>
          </button>

          <button
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-200"
            style={{
              backgroundColor: 'white',
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <ExternalLink size={16} />
            <span>Ver Facturas</span>
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgb(107, 114, 128)' + '20' }}
          >
            <Shield size={20} style={{ color: 'rgb(107, 114, 128)' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Cuenta y Seguridad
            </h2>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Configuraciones de seguridad y privacidad
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Cambiar Contraseña
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Actualiza tu contraseña de acceso
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cambiar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Notificaciones por Email
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Recibe actualizaciones y reportes por email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div 
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-opacity-100 transition-colors duration-200"
                style={{
                  backgroundColor: 'rgb(209, 213, 219)',
                  '--tw-peer-checked-bg-opacity': '1'
                }}
                onMouseEnter={(e) => {
                  if (!(e.target as HTMLElement).previousElementSibling?.checked) {
                    e.currentTarget.style.backgroundColor = 'rgb(156, 163, 175)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(e.target as HTMLElement).previousElementSibling?.checked) {
                    e.currentTarget.style.backgroundColor = 'rgb(209, 213, 219)';
                  }
                }}
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Exportar Datos
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Descarga todos tus datos en formato CSV
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#ef4444' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#ef4444' + '20' }}
          >
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#ef4444' }}>
              Zona de Peligro
            </h2>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Acciones irreversibles para tu cuenta
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#fed7d7' }}>
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Cancelar Suscripción
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Tu plan se cancelará al final del período actual
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                backgroundColor: 'white',
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              Cancelar Plan
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#fed7d7' }}>
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Eliminar Cuenta
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Eliminar permanentemente tu cuenta y todos los datos
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                backgroundColor: 'white',
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#3b82f6' + '20' }}
          >
            <Mail size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Soporte
            </h2>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              ¿Necesitas ayuda? Estamos aquí para ti
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="mailto:hola@resenasimple.com"
            className="flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-sm"
            style={{ borderColor: 'rgb(229, 231, 235)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
            }}
          >
            <Mail size={16} style={{ color: 'rgb(107, 114, 128)' }} />
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Contactar Soporte
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                hola@resenasimple.com
              </p>
            </div>
          </a>

          <button
            className="flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-sm"
            style={{ borderColor: 'rgb(229, 231, 235)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
            }}
          >
            <ExternalLink size={16} style={{ color: 'rgb(107, 114, 128)' }} />
            <div>
              <h4 className="font-medium text-sm" style={{ color: '#161616' }}>
                Centro de Ayuda
              </h4>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Guías y documentación
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;