import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';
import { linkKeys } from '@/lib/validation/links';
import type { LinkKey } from '@/lib/validation/links';
import { supabase } from '@/integrations/supabase/client';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectInsertRow = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdateRow = Database['public']['Tables']['projects']['Update'];

export type ProjectLinks = Partial<Record<LinkKey, string>>;

export type Project = Omit<ProjectRow, 'links'> & {
  links: ProjectLinks | null;
  stars?: number | null;
  users?: number | null;
};

type CreateProjectPayload = Omit<ProjectInsertRow, 'links'> & {
  links?: ProjectLinks | null;
};

type UpdateProjectPayload = {
  id: string;
} & (Omit<ProjectUpdateRow, 'links' | 'id'> & {
  links?: ProjectLinks | null;
});

const normalizeProjectLinks = (links: ProjectRow['links']): ProjectLinks | null => {
  if (!links || typeof links !== 'object' || Array.isArray(links)) {
    return null;
  }

  const normalized: ProjectLinks = {};
  for (const [key, value] of Object.entries(links)) {
    if (typeof value === 'string' && linkKeys.includes(key as LinkKey)) {
      normalized[key as LinkKey] = value;
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
};

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map((project) => ({
        ...project,
        links: normalizeProjectLinks(project.links),
      }));
    },
  });

  const createProject = useMutation<void, Error, CreateProjectPayload>({
    mutationFn: async (values) => {
      const { error } = await supabase.from('projects').insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const updateProject = useMutation<void, Error, UpdateProjectPayload>({
    mutationFn: async ({ id, ...values }) => {
      const { error } = await supabase
        .from('projects')
        .update(values)
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const deleteProject = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return {
    ...projectsQuery,
    createProject: createProject.mutateAsync,
    updateProject: updateProject.mutateAsync,
    deleteProject: deleteProject.mutateAsync,
  };
}