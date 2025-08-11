import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDocs(projectId?: string) {
  return useQuery({
    queryKey: ['docs', projectId],
    queryFn: async () => {
      let query = supabase
        .from('docs')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('published', true);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('position', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}