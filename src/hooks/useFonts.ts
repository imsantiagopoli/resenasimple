import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Font {
  id: string;
  name: string;
  value: string;
  category: string;
  google_font: boolean;
  import_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export const useFonts = () => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('fonts')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      setFonts(data || []);
    } catch (err) {
      console.error('Error loading fonts:', err);
      setError(err instanceof Error ? err.message : 'Error loading fonts');
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleFont = (font: Font) => {
    if (!font.google_font || !font.import_url) return;

    const existingLink = document.querySelector(`link[href="${font.import_url}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.import_url;
    document.head.appendChild(link);
  };

  const loadMultipleFonts = (fontValues: string[]) => {
    const fontsToLoad = fonts.filter(f => fontValues.includes(f.value) && f.google_font);
    fontsToLoad.forEach(loadGoogleFont);
  };

  return {
    fonts,
    loading,
    error,
    loadGoogleFont,
    loadMultipleFonts,
    reload: loadFonts
  };
};
