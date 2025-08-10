import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';

export default function BlogIndex() {
  const { t } = useLanguage();
  const { data: posts, isLoading, error } = useBlogPosts();

  useSEO({
    title: `${t('Blog', 'Blog')} | Monynha Softwares`,
    description: t('Leia nossos artigos mais recentes sobre tecnologia futurista.', 'Read our latest articles about futuristic technology.'),
    url: `${window.location.origin}/blog`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold gradient-text mb-8">{t('Blog', 'Blog')}</h1>
        {isLoading && <LoadingSkeleton type="list" />}
        {error && <ErrorState message={t('Erro ao carregar posts.', 'Failed to load posts.')} onRetry={() => window.location.reload()} />}
        {!isLoading && posts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card key={post.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary">{post.title_pt || post.title_en}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{post.content_pt || post.content_en}</p>
                  <Button variant="outline" size="sm" asChild className="mt-4"><Link to={`/blog/${post.slug}`}>{t('Ler mais', 'Read more')}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
