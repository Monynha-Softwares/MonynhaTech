import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { linkKeys } from '@/lib/validation/links';
import type { LinkKey } from '@/lib/validation/links';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type AuthorRow = Database['public']['Tables']['authors']['Row'];
type AuthorInsertRow = Database['public']['Tables']['authors']['Insert'];
type AuthorUpdateRow = Database['public']['Tables']['authors']['Update'];

export type AuthorLinks = Partial<Record<LinkKey, string>>;

export type Author = Omit<AuthorRow, 'links'> & {
  links: AuthorLinks | null;
};

type CreateAuthorPayload = Omit<AuthorInsertRow, 'links'> & {
  links?: AuthorLinks | null;
};

type UpdateAuthorPayload = {
  id: string;
} & (Omit<AuthorUpdateRow, 'links' | 'id'> & {
  links?: AuthorLinks | null;
});

const normalizeAuthorLinks = (links: AuthorRow['links']): AuthorLinks | null => {
  if (!links || typeof links !== 'object' || Array.isArray(links)) {
    return null;
  }

  const normalized: AuthorLinks = {};
  for (const [key, value] of Object.entries(links)) {
    if (typeof value === 'string' && linkKeys.includes(key as LinkKey)) {
      normalized[key as LinkKey] = value;
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
};

export function useAuthors() {
  const queryClient = useQueryClient();

  const authorsQuery = useQuery<Author[], Error>({
    queryKey: ['authors'],
    queryFn: async (): Promise<Author[]> => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map((author) => ({
        ...author,
        links: normalizeAuthorLinks(author.links),
      }));
    },
  });

  const createAuthor = useMutation<void, Error, CreateAuthorPayload>({
    mutationFn: async (values) => {
      const { error } = await supabase.from('authors').insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  const updateAuthor = useMutation<void, Error, UpdateAuthorPayload>({
    mutationFn: async ({ id, ...values }) => {
      const { error } = await supabase
        .from('authors')
        .update(values)
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  const deleteAuthor = useMutation<void, Error, string>({
    mutationFn: async (id) => {
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