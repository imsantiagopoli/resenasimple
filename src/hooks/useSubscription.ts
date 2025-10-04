import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  business_id: string;
  lemon_squeezy_subscription_id: string;
  plan_name: 'basico' | 'profesional' | 'empresarial';
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'on_trial';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface UseSubscriptionResult {
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
  hasFreeAccess: boolean;
  canAccessApp: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSubscription = (userId?: string, businessId?: string): UseSubscriptionResult => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [hasFreeAccess, setHasFreeAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!userId || !businessId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check free access
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('free_access')
        .eq('id', businessId)
        .maybeSingle();

      if (businessError) throw businessError;

      setHasFreeAccess(businessData?.free_access || false);

      // Check subscription by business_id
      let { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .eq('status', 'active')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      // Fallback: If no subscription found by business_id, check by user email
      if (!subscriptionData) {
        // Get user email from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!userError && user?.email) {
          // Find most recent active subscription by email
          const { data: emailSubscriptionData, error: emailSubscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_email', user.email)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (emailSubscriptionError && emailSubscriptionError.code !== 'PGRST116') {
            throw emailSubscriptionError;
          }

          subscriptionData = emailSubscriptionData;

          if (subscriptionData) {
            console.log('Subscription found by email fallback:', user.email);
          }
        }
      }

      setSubscription(subscriptionData as Subscription | null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [userId, businessId]);

  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'on_trial';
  const canAccessApp = hasActiveSubscription || hasFreeAccess;

  return {
    subscription,
    hasActiveSubscription,
    hasFreeAccess,
    canAccessApp,
    loading,
    error,
    refetch: fetchSubscription,
  };
};
