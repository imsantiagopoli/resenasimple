import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUserBusiness = async () => {
      if (loading) return;

      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data: businessProfile, error } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking business profile:', error);
          navigate('/auth');
          return;
        }

        if (businessProfile) {
          // User has a business, go to dashboard
          navigate('/app/inicio');
        } else {
          // User doesn't have a business, go to onboarding
          navigate('/onboarding');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        navigate('/auth');
      }
    };

    checkUserBusiness();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#075E54' }} />
        <p className="text-lg font-medium" style={{ color: '#161616' }}>
          Configurando tu cuenta...
        </p>
        <p className="text-sm mt-2" style={{ color: 'rgb(107, 114, 128)' }}>
          Un momento por favor
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
