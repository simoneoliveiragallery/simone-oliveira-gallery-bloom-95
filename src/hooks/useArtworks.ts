
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  year: string;
  medium: string;
  description?: string;
  dimensions?: string;
  exhibition_id?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArtworkMetadata {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description?: string;
  dimensions?: string;
  exhibition_id?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Hook para buscar metadados das obras (sem imagens)
export const useArtworksMetadata = (exhibitionId?: string) => {
  return useQuery({
    queryKey: ['artworks-metadata', exhibitionId],
    queryFn: async () => {
      let query = supabase
        .from('artworks')
        .select('id, title, artist, year, medium, description, dimensions, exhibition_id, featured, created_at, updated_at')
        .order('created_at', { ascending: false });
      
      if (exhibitionId) {
        query = query.eq('exhibition_id', exhibitionId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching artworks metadata:', error);
        throw error;
      }
      
      return data as ArtworkMetadata[];
    },
  });
};

// Hook para buscar uma obra específica com imagem
export const useArtworkImage = (artworkId: string) => {
  return useQuery({
    queryKey: ['artwork-image', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('image')
        .eq('id', artworkId)
        .single();
      
      if (error) {
        console.error('Error fetching artwork image:', error);
        throw error;
      }
      
      return data.image;
    },
    enabled: !!artworkId,
  });
};

// Hook para buscar uma obra completa
export const useArtwork = (artworkId: string) => {
  return useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', artworkId)
        .single();
      
      if (error) {
        console.error('Error fetching artwork:', error);
        throw error;
      }
      
      return data as Artwork;
    },
    enabled: !!artworkId,
  });
};

export const useArtworks = (exhibitionId?: string) => {
  return useQuery({
    queryKey: ['artworks', exhibitionId],
    queryFn: async () => {
      let query = supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (exhibitionId) {
        query = query.eq('exhibition_id', exhibitionId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching artworks:', error);
        throw error;
      }
      
      return data as Artwork[];
    },
  });
};

export const useFeaturedArtworksMetadata = () => {
  return useQuery({
    queryKey: ['artworks-metadata', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, artist, year, medium, description, dimensions, exhibition_id, featured, created_at, updated_at')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured artworks metadata:', error);
        throw error;
      }
      
      return data as ArtworkMetadata[];
    },
  });
};

export const useFeaturedArtworks = () => {
  return useQuery({
    queryKey: ['artworks', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured artworks:', error);
        throw error;
      }
      
      return data as Artwork[];
    },
  });
};
