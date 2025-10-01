import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const GoogleCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Conectando con Google...');
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Error de Google: ${error}`);
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/app/mi-negocio');
          }
        }, 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Faltan parámetros de autorización');
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/app/mi-negocio');
          }
        }, 3000);
        return;
      }

      setMessage('Intercambiando código de autorización...');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/google-oauth-callback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({ code, state })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con Google');
      }

      setStatus('success');
      setMessage('¡Cuenta conectada exitosamente!');

      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
          window.close();
        } else {
          navigate('/app/mi-negocio');
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error in callback:', error);
      setStatus('error');
      setMessage(error.message || 'Error al procesar la autorización');

      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: error.message }, window.location.origin);
          window.close();
        } else {
          navigate('/app/mi-negocio');
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <Loader2 size={48} className="animate-spin" style={{ color: '#075E54' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold" style={{ color: '#161616' }}>
                  Conectando con Google
                </h2>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {message}
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#10b981' + '20' }}
                >
                  <CheckCircle size={32} style={{ color: '#10b981' }} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold" style={{ color: '#161616' }}>
                  ¡Conexión Exitosa!
                </h2>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {message}
                </p>
                <p className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                  Esta ventana se cerrará automáticamente...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgb(254, 242, 242)' }}
                >
                  <AlertCircle size={32} style={{ color: 'rgb(185, 28, 28)' }} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold" style={{ color: '#161616' }}>
                  Error de Conexión
                </h2>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {message}
                </p>
                <p className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                  Esta ventana se cerrará automáticamente...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
