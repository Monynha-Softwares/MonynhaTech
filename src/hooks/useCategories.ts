import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from('categories').insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...values }: any) => {
      const { error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  return {
    ...categoriesQuery,
    createCategory: createCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
}