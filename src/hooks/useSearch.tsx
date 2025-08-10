import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'blog_post' | 'project' | 'doc';
  slug: string;
  url: string;
  published_at?: string;
  score: number;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const escapedQuery = query.replace(/'/g, "''");

      // Search blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title_pt,
          title_en,
          content_pt,
          content_en,
          slug,
          published_at,
          author:authors(name),
          categories:blog_posts_categories(
            category:categories(slug, title_pt, title_en)
          ),
          score:ts_rank_cd(search_vector, websearch_to_tsquery('simple', '${escapedQuery}'))
        `)
        .eq('published', true)
        .textSearch('search_vector', query, { type: 'websearch', config: 'simple' })
        .order('score', { ascending: false })
        .limit(10);

      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select(`id, name_pt, name_en, description_pt, description_en, slug,
          score:ts_rank_cd(search_vector, websearch_to_tsquery('simple', '${escapedQuery}'))`)
        .textSearch('search_vector', query, { type: 'websearch', config: 'simple' })
        .order('score', { ascending: false })
        .limit(10);

      // Search docs
      const { data: docs } = await supabase
        .from('docs')
        .select(`id, title_pt, title_en, content_pt, content_en, slug,
          score:ts_rank_cd(search_vector, websearch_to_tsquery('simple', '${escapedQuery}'))`)
        .eq('published', true)
        .textSearch('search_vector', query, { type: 'websearch', config: 'simple' })
        .order('score', { ascending: false })
        .limit(10);

      const searchResults: SearchResult[] = [
        ...(blogPosts || []).map(post => ({
          id: post.id,
          title: post.title_pt || post.title_en || '',
          content: (post.content_pt || post.content_en || '').substring(0, 200),
          type: 'blog_post' as const,
          slug: post.slug,
          url: `/blog/${post.slug}`,
          published_at: post.published_at,
          score: post.score ?? 0,
        })),
        ...(projects || []).map(project => ({
          id: project.id,
          title: project.name_pt || project.name_en || '',
          content: (project.description_pt || project.description_en || '').substring(0, 200),
          type: 'project' as const,
          slug: project.slug,
          url: `/projects/${project.slug}`,
          score: project.score ?? 0,
        })),
        ...(docs || []).map(doc => ({
          id: doc.id,
          title: doc.title_pt || doc.title_en || '',
          content: (doc.content_pt || doc.content_en || '').substring(0, 200),
          type: 'doc' as const,
          slug: doc.slug,
          url: `/docs/${doc.slug}`,
          score: doc.score ?? 0,
        })),
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setResults(searchResults);
    } catch (err) {
      setError('Failed to search content');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}