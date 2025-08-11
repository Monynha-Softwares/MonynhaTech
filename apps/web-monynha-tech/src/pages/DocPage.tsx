import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@ui/components/Header';
import { Footer } from '@ui/components/Footer';
import { supabase } from '@supabaseClient/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { LoadingSkeleton } from '@ui/components/ui/loading-skeleton';
import { ErrorState } from '@ui/components/ui/error-state';
import { Card, CardContent } from '@ui/components/ui/card';
import { Button } from '@ui/components/ui/button';

export default function DocPage() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoc() {
      setLoading(true);
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error || !data) {
        setError(error?.message || 'Not found');
      } else {
        setDoc(data);
      }
      setLoading(false);
    }
    if (slug) fetchDoc();
  }, [slug]);

  useSEO({
    title: doc ? `${language === 'pt' ? doc.title_pt : (doc.title_en || doc.title_pt)} | Docs` : `${t('Carregando...', 'Loading...')} | Docs`,
    description: doc ? (doc.content_pt || doc.content_en || '') : t('Carregando documento', 'Loading document'),
    url: `${window.location.origin}/docs/${slug}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={t('Documento não encontrado.', 'Document not found.')} />}
        {!loading && doc && (
          <article>
            <h1 className="text-4xl font-bold gradient-text mb-4">{language === 'pt' ? doc.title_pt : (doc.title_en || doc.title_pt)}</h1>
            <Card className="glass-card">
              <CardContent className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: (language === 'pt' ? doc.content_pt : (doc.content_en || doc.content_pt)) || '' }} />
              </CardContent>
            </Card>
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/docs">{t('Voltar à documentação', 'Back to docs')}</Link>
              </Button>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
