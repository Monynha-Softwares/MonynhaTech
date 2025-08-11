import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@supabaseClient/supabase/client';

export function useAuthors() {
  const queryClient = useQueryClient();

  const authorsQuery = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  const createAuthor = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from('authors').insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  const updateAuthor = useMutation({
    mutationFn: async ({ id, ...values }: any) => {
      const { error } = await supabase
        .from('authors')
        .update(values)
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  const deleteAuthor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('authors').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  return {
    ...authorsQuery,
    createAuthor: createAuthor.mutateAsync,
    updateAuthor: updateAuthor.mutateAsync,
    deleteAuthor: deleteAuthor.mutateAsync,
  };
}