import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'] & {
  author: Database['public']['Tables']['authors']['Row'] | null;
  categories: {
    category: Database['public']['Tables']['categories']['Row'];
  }[];
};

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          title_pt,
          title_en,
          content_pt,
          content_en,
          published_at,
          author:authors(*),
          categories:blog_posts_categories(
            category:categories(*)
          )
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as BlogPost[];
    },
  });
}
