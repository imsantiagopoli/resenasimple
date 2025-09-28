import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export interface BusinessProfile {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessBranch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  google_maps_link: string | null;
  slug: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessSocialMedia {
  id: string;
  business_id: string;
  platform: string;
  url: string;
  created_at: string;
}

interface BusinessContextType {
  profile: BusinessProfile | null;
  branches: BusinessBranch[];
  socialMedia: BusinessSocialMedia[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  updateBusinessProfile: (updates: Partial<Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<{ data: BusinessProfile | null; error: string | null }>;
  upsertBranch: (branch: Partial<BusinessBranch>) => Promise<{ data: BusinessBranch | null; error: string | null }>;
  deleteBranch: (branchId: string) => Promise<{ error: string | null }>;
  updateSocialMedia: (socialData: Record<string, string>) => Promise<{ error: string | null }>;
  generateSlug: (name: string) => string;
  refetch: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [businessData, setBusinessData] = useState({
    profile: null as BusinessProfile | null,
    branches: [] as BusinessBranch[],
    socialMedia: [] as BusinessSocialMedia[],
    loading: true,
    error: null as string | null,
    loaded: false
  });

  // Fetch business data
  const fetchBusinessData = async () => {
    if (!user) {
      setBusinessData(prev => ({ ...prev, loading: false, loaded: true }));
      return;
    }

    try {
      setBusinessData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch business profile
      const { data: profile, error: profileError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profile) {
        // Fetch branches
        const { data: branches, error: branchesError } = await supabase
          .from('business_branches')
          .select('*')
          .eq('business_id', profile.id)
          .order('is_main', { ascending: false });

        if (branchesError) {
          throw branchesError;
        }

        // Fetch social media
        const { data: socialMedia, error: socialError } = await supabase
          .from('business_social_media')
          .select('*')
          .eq('business_id', profile.id);

        if (socialError) {
          throw socialError;
        }

        setBusinessData({
          profile,
          branches: branches || [],
          socialMedia: socialMedia || [],
          loading: false,
          error: null,
          loaded: true
        });
      } else {
        setBusinessData({
          profile: null,
          branches: [],
          socialMedia: [],
          loading: false,
          error: null,
          loaded: true
        });
      }
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setBusinessData(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Error al cargar los datos del negocio',
        loaded: true
      }));
    }
  };

  // Update business profile
  const updateBusinessProfile = async (updates: Partial<Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !businessData.profile) {
      throw new Error('No hay perfil de negocio para actualizar');
    }

    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .update(updates)
        .eq('id', businessData.profile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBusinessData(prev => ({
        ...prev,
        profile: data
      }));

      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating business profile:', err);
      return { data: null, error: err.message || 'Error al actualizar el perfil' };
    }
  };

  // Add or update branch
  const upsertBranch = async (branch: Partial<BusinessBranch>) => {
    if (!user || !businessData.profile) {
      throw new Error('No hay perfil de negocio');
    }

    try {
      const branchData = {
        ...branch,
        business_id: businessData.profile.id
      };

      let result;
      if (branch.id) {
        // Update existing branch
        result = await supabase
          .from('business_branches')
          .update(branchData)
          .eq('id', branch.id)
          .select()
          .single();
      } else {
        // Create new branch
        result = await supabase
          .from('business_branches')
          .insert([branchData])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Refresh branches
      await fetchBusinessData();

      return { data: result.data, error: null };
    } catch (err: any) {
      console.error('Error upserting branch:', err);
      return { data: null, error: err.message || 'Error al guardar la sucursal' };
    }
  };

  // Delete branch
  const deleteBranch = async (branchId: string) => {
    try {
      const { error } = await supabase
        .from('business_branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        throw error;
      }

      // Refresh branches
      await fetchBusinessData();

      return { error: null };
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      return { error: err.message || 'Error al eliminar la sucursal' };
    }
  };

  // Update social media
  const updateSocialMedia = async (socialData: Record<string, string>) => {
    if (!user || !businessData.profile) {
      throw new Error('No hay perfil de negocio');
    }

    try {
      // Delete existing social media entries
      await supabase
        .from('business_social_media')
        .delete()
        .eq('business_id', businessData.profile.id);

      // Insert new entries for non-empty URLs
      const socialEntries = Object.entries(socialData)
        .filter(([_, url]) => url.trim() !== '')
        .map(([platform, url]) => ({
          business_id: businessData.profile!.id,
          platform,
          url: url.trim()
        }));

      if (socialEntries.length > 0) {
        const { error } = await supabase
          .from('business_social_media')
          .insert(socialEntries);

        if (error) {
          throw error;
        }
      }

      // Refresh data
      await fetchBusinessData();

      return { error: null };
    } catch (err: any) {
      console.error('Error updating social media:', err);
      return { error: err.message || 'Error al actualizar redes sociales' };
    }
  };

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (user && !businessData.loaded && !businessData.loading) {
      fetchBusinessData();
    }
  }, [user?.id, businessData.loaded, businessData.loading]);

  const contextValue: BusinessContextType = {
    ...businessData,
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    updateSocialMedia,
    generateSlug,
    refetch: fetchBusinessData
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
    </BusinessContext.Provider>
  );
};