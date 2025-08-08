import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
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

      return data;
    },
  });
}