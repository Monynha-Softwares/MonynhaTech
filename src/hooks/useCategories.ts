import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type CategoryInsertRow = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdateRow = Database['public']['Tables']['categories']['Update'];

export type Category = CategoryRow;

type CreateCategoryPayload = CategoryInsertRow;
type UpdateCategoryPayload = { id: string } & Omit<CategoryUpdateRow, 'id'>;

export function useCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    },
  });

  const createCategory = useMutation<void, Error, CreateCategoryPayload>({
    mutationFn: async (values) => {
      const { error } = await supabase.from('categories').insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const updateCategory = useMutation<void, Error, UpdateCategoryPayload>({
    mutationFn: async ({ id, ...values }) => {
      const { error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteCategory = useMutation<void, Error, string>({
    mutationFn: async (id) => {
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