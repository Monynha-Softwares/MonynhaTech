import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO, generateSEOForBlogPost } from '@/hooks/useSEO';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:authors(*)')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error || !data) {
        setError(error?.message || 'Not found');
      } else {
        setPost(data);
        setAuthor(data.author);
      }
      setLoading(false);
    }
    if (slug) fetchPost();
  }, [slug]);

  useSEO(post ? generateSEOForBlogPost(post, author) : {
    title: `${t('Carregando...', 'Loading...')} | Monynha Softwares`,
    description: t('Carregando post do blog', 'Loading blog post'),
    url: `${window.location.origin}/blog/${slug}`,
    type: 'article'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={t('Post não encontrado.', 'Post not found.')} />}
        {!loading && post && (
          <article>
            <h1 className="text-4xl font-bold gradient-text mb-4">{language === 'pt' ? post.title_pt : (post.title_en || post.title_pt)}</h1>
            {author?.name && (
              <p className="text-muted-foreground mb-6">{t('Por', 'By')} {author.name}</p>
            )}
            <Card className="glass-card">
              <CardContent className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: (language === 'pt' ? post.content_pt : (post.content_en || post.content_pt)) || '' }} />
              </CardContent>
            </Card>
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/blog">{t('Voltar ao blog', 'Back to blog')}</Link>
              </Button>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
