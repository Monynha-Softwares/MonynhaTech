import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@supabaseClient/supabase/client';

export type Comment = {
  id: string;
  post_id: string;
  name: string;
  email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
};

interface NewComment {
  postId: string;
  name: string;
  email?: string;
  content: string;
}

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .match({ post_id: postId, approved: true })
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as Comment[];
    },
  });

  const {
    mutate,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async ({ postId, name, email, content }: NewComment) => {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        name,
        email,
        content,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return {
    comments: data ?? [],
    isLoading: queryLoading || isPending,
    error: queryError ?? mutationError,
    mutate,
  };
}

