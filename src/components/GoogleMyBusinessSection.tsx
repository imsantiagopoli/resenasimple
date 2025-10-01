import React, { useState, useEffect } from 'react';
import { Link2, AlertCircle, CheckCircle, RefreshCw, ExternalLink, MapPin, Unlink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface GoogleLocation {
  id: string;
  google_location_id: string;
  location_name: string;
  location_address: string;
  is_active: boolean;
  branch_id: string | null;
}

interface GoogleMyBusinessSectionProps {
  showMessage: (type: 'success' | 'error', text: string) => void;
}

const GoogleMyBusinessSection: React.FC<GoogleMyBusinessSectionProps> = ({ showMessage }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [locations, setLocations] = useState<GoogleLocation[]>([]);
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        checkConnection();
        showMessage('success', 'Cuenta de Google My Business conectada exitosamente');
        syncLocations();
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        showMessage('error', event.data.error || 'Error al conectar con Google My Business');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkConnection = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if user signed up with Google OAuth
      const isGoogleAuth = user.app_metadata?.provider === 'google';
      setIsGoogleUser(isGoogleAuth);

      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessData) {
        setLoading(false);
        return;
      }

      const { data: tokenData, error: tokenError } = await supabase
        .from('google_oauth_tokens')
        .select('*')
        .eq('business_id', businessData.id)
        .maybeSingle();

      if (tokenData) {
        setIsConnected(true);
        setTokenExpiry(tokenData.token_expiry);

        const { data: locationsData } = await supabase
          .from('google_locations')
          .select('*')
          .eq('business_id', businessData.id)
          .order('location_name');

        setLocations(locationsData || []);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user) return;

    try {
      setConnecting(true);

      const redirectUri = `${window.location.origin}/google/callback`;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const response = await fetch(`${supabaseUrl}/functions/v1/google-oauth-init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          user_id: user.id,
          redirect_uri: redirectUri
        })
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la conexión con Google');
      }

      const { auth_url } = await response.json();
      window.open(auth_url, 'google-oauth', 'width=600,height=700');

    } catch (error: any) {
      console.error('Error connecting to Google:', error);
      showMessage('error', error.message || 'Error al conectar con Google My Business');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !confirm('¿Estás seguro de que deseas desconectar tu cuenta de Google My Business?')) {
      return;
    }

    try {
      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessData) return;

      const { error } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('business_id', businessData.id);

      if (error) throw error;

      setIsConnected(false);
      setLocations([]);
      showMessage('success', 'Cuenta de Google My Business desconectada');
    } catch (error: any) {
      console.error('Error disconnecting:', error);
      showMessage('error', 'Error al desconectar la cuenta');
    }
  };

  const syncLocations = async () => {
    if (!user) return;

    try {
      setSyncing(true);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const response = await fetch(`${supabaseUrl}/functions/v1/google-locations-sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          user_id: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Error al sincronizar ubicaciones');
      }

      await checkConnection();
      showMessage('success', 'Ubicaciones sincronizadas exitosamente');
    } catch (error: any) {
      console.error('Error syncing locations:', error);
      showMessage('error', error.message || 'Error al sincronizar ubicaciones');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Google My Business
            </h2>
            {isConnected && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#10b981' + '20',
                  color: '#10b981'
                }}
              >
                Conectado
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Conecta tu cuenta para gestionar reseñas de Google directamente desde aquí
          </p>
        </div>

        {isConnected ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={syncLocations}
              disabled={syncing}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: '#075E54',
                color: 'white'
              }}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: 'rgb(254, 242, 242)',
                color: 'rgb(185, 28, 28)'
              }}
            >
              <Unlink size={16} />
              <span>Desconectar</span>
            </button>
          </div>
        ) : !isGoogleUser ? (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: '#075E54',
              color: 'white'
            }}
          >
            <Link2 size={16} />
            <span>{connecting ? 'Conectando...' : 'Conectar Cuenta'}</span>
          </button>
        ) : null}
      </div>

      {isConnected && (
        <div className="space-y-4">
          {tokenExpiry && (
            <div className="flex items-center space-x-2 text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              <AlertCircle size={14} />
              <span>
                Token válido hasta: {new Date(tokenExpiry).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {locations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium" style={{ color: '#161616' }}>
                Ubicaciones Conectadas ({locations.length})
              </h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border"
                    style={{ borderColor: 'rgb(229, 231, 235)', backgroundColor: 'rgb(249, 250, 251)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#075E54' + '20' }}
                    >
                      <MapPin size={18} style={{ color: '#075E54' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: '#161616' }}>
                        {location.location_name}
                      </p>
                      {location.location_address && (
                        <p className="text-xs mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
                          {location.location_address}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            location.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {location.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://business.google.com/locations/${location.google_location_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: 'white',
                        color: 'rgb(107, 114, 128)',
                        border: '1px solid rgb(229, 231, 235)'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Ver en Google</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {locations.length === 0 && (
            <div className="text-center py-8">
              <MapPin size={48} className="mx-auto mb-3" style={{ color: 'rgb(156, 163, 175)' }} />
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                No se encontraron ubicaciones. Haz clic en "Sincronizar" para cargar tus ubicaciones de Google.
              </p>
            </div>
          )}
        </div>
      )}

      {!isConnected && (
        <div
          className="p-4 rounded-lg border"
          style={{
            borderColor: 'rgb(229, 231, 235)',
            backgroundColor: 'rgb(249, 250, 251)'
          }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} style={{ color: '#075E54' }} />
            <div className="space-y-2">
              {isGoogleUser ? (
                <>
                  <p className="text-sm font-medium" style={{ color: '#161616' }}>
                    Ya autorizaste los permisos de Google My Business
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Los tokens de acceso se guardaron automáticamente cuando te registraste con Google. Haz clic en "Sincronizar" arriba para cargar tus ubicaciones y reseñas.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium" style={{ color: '#161616' }}>
                    Conecta tu cuenta de Google My Business para:
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: 'rgb(107, 114, 128)' }}>
                    <li className="flex items-center space-x-2">
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span>Ver todas tus reseñas de Google en un solo lugar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span>Responder a reseñas directamente desde la plataforma</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span>Gestionar múltiples ubicaciones fácilmente</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span>Sincronización automática de nuevas reseñas</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMyBusinessSection;
