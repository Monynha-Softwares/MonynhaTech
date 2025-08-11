import { Header } from '@ui/components/Header';
import { Footer } from '@ui/components/Footer';
import { useDocs } from '@/hooks/useDocs';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card';
import { LoadingSkeleton } from '@ui/components/ui/loading-skeleton';
import { ErrorState } from '@ui/components/ui/error-state';
import { Link } from 'react-router-dom';

export default function DocsIndex() {
  const { t } = useLanguage();
  const { data: docs, isLoading, error } = useDocs();

  useSEO({
    title: `${t('Documentação', 'Documentation')} | Monynha Softwares`,
    description: t('Explore a documentação dos nossos projetos.', 'Explore our projects documentation.'),
    url: `${window.location.origin}/docs`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold gradient-text mb-8">{t('Documentação', 'Documentation')}</h1>
        {isLoading && <LoadingSkeleton />}
        {error && <ErrorState message={t('Erro ao carregar docs.', 'Failed to load docs.')} />}
        {!isLoading && docs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc: any) => (
              <Card key={doc.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link to={`/docs/${doc.slug}`} className="hover:text-primary">{doc.title_pt || doc.title_en}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{doc.content_pt || doc.content_en}</p>
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
