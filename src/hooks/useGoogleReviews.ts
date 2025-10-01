import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface GoogleReview {
  id: string;
  google_location_id: string;
  google_review_id: string;
  reviewer_name: string;
  reviewer_profile_photo_url: string | null;
  rating: number;
  comment: string | null;
  review_reply: string | null;
  review_reply_updated_at: string | null;
  review_created_at: string;
  last_synced_at: string | null;
  location_name: string;
  location_address: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleReviewsStatistics {
  totalReviews: number;
  averageRating: string;
  repliedCount: number;
  pendingReplies: number;
}

export const useGoogleReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);

  const fetchReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('google_reviews')
        .select(`
          *,
          google_locations!inner(
            google_location_id,
            location_name,
            location_address
          )
        `)
        .eq('user_id', user.id)
        .order('review_created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedReviews = (data || []).map((review: any) => ({
        id: review.id,
        google_location_id: review.google_locations.google_location_id,
        google_review_id: review.google_review_id,
        reviewer_name: review.reviewer_name,
        reviewer_profile_photo_url: review.reviewer_profile_photo_url,
        rating: review.rating,
        comment: review.comment,
        review_reply: review.review_reply,
        review_reply_updated_at: review.review_reply_updated_at,
        review_created_at: review.review_created_at,
        last_synced_at: review.last_synced_at,
        location_name: review.google_locations.location_name,
        location_address: review.google_locations.location_address,
        created_at: review.created_at,
        updated_at: review.updated_at
      }));

      setReviews(formattedReviews);
    } catch (err: any) {
      console.error('Error fetching Google reviews:', err);
      setError(err.message || 'Error al cargar las reseñas de Google');
    } finally {
      setLoading(false);
    }
  };

  const syncReviews = async () => {
    if (!user) return;

    try {
      setSyncing(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const locationsResponse = await fetch(`${supabaseUrl}/functions/v1/google-locations-sync`, {
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

      if (!locationsResponse.ok) {
        const errorData = await locationsResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al sincronizar ubicaciones');
      }

      const locationsData = await locationsResponse.json();
      if (locationsData.count === 0) {
        setError(locationsData.message || 'No se encontraron ubicaciones de Google My Business');
        return;
      }

      const reviewsResponse = await fetch(`${supabaseUrl}/functions/v1/google-reviews-sync`, {
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

      if (!reviewsResponse.ok) {
        const errorData = await reviewsResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al sincronizar reseñas');
      }

      await fetchReviews();
    } catch (err: any) {
      console.error('Error syncing reviews:', err);
      setError(err.message || 'Error al sincronizar las reseñas');
    } finally {
      setSyncing(false);
    }
  };

  const replyToReview = async (reviewId: string, replyText: string) => {
    if (!user) return;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const response = await fetch(`${supabaseUrl}/functions/v1/google-review-reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          review_id: reviewId,
          reply_text: replyText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al enviar la respuesta');
      }

      await fetchReviews();
    } catch (err: any) {
      console.error('Error replying to review:', err);
      setError(err.message || 'Error al enviar la respuesta');
      throw err;
    }
  };

  const deleteReply = async (reviewId: string) => {
    if (!user) return;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const response = await fetch(`${supabaseUrl}/functions/v1/google-review-delete-reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          review_id: reviewId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar la respuesta');
      }

      await fetchReviews();
    } catch (err: any) {
      console.error('Error deleting reply:', err);
      setError(err.message || 'Error al eliminar la respuesta');
      throw err;
    }
  };

  const getStatistics = (): GoogleReviewsStatistics => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';
    const repliedCount = reviews.filter(r => r.review_reply).length;
    const pendingReplies = totalReviews - repliedCount;

    return {
      totalReviews,
      averageRating,
      repliedCount,
      pendingReplies
    };
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  useEffect(() => {
    const autoSync = async () => {
      if (!user || hasAutoSynced || loading || syncing || reviews.length > 0) return;

      const { data: tokenData } = await supabase
        .from('google_oauth_tokens')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (tokenData) {
        setHasAutoSynced(true);
        await syncReviews();
      }
    };

    if (!loading) {
      autoSync();
    }
  }, [user, loading, reviews.length, hasAutoSynced]);

  const statistics = getStatistics();

  return {
    reviews,
    loading,
    error,
    syncing,
    syncReviews,
    replyToReview,
    deleteReply,
    statistics,
    refetch: fetchReviews
  };
};
