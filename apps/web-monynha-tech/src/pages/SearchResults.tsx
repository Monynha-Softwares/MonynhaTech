import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { Search } from '@ui/components/Search';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card';
import { Badge } from '@ui/components/ui/badge';
import { Button } from '@ui/components/ui/button';
import { LoadingSkeleton } from '@ui/components/ui/loading-skeleton';
import { SearchIcon, FileText, FolderOpen, BookOpen, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { results, isLoading, search } = useSearch();
  const { t } = useLanguage();

  useSEO({
    title: query ? `${t('Resultados para', 'Results for')} "${query}" | Monynha Softwares` : `${t('Busca', 'Search')} | Monynha Softwares`,
    description: query ? `${t('Resultados da busca por', 'Search results for')} "${query}"` : t('Busque por projetos, posts do blog e documentação', 'Search for projects, blog posts and documentation'),
    url: `${window.location.origin}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
  });

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog_post':
        return <FileText className="h-5 w-5 text-primary" aria-hidden="true" />;
      case 'project':
        return <FolderOpen className="h-5 w-5 text-secondary" aria-hidden="true" />;
      case 'doc':
        return <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />;
      default:
        return <SearchIcon className="h-5 w-5" aria-hidden="true" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'blog_post':
        return t('Blog', 'Blog');
      case 'project':
        return t('Projeto', 'Project');
      case 'doc':
        return t('Docs', 'Docs');
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog_post':
        return 'border-primary/30 bg-primary/10';
      case 'project':
        return 'border-secondary/30 bg-secondary/10';
      case 'doc':
        return 'border-accent/30 bg-accent/10';
      default:
        return 'border-border/30 bg-muted/10';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t('Voltar', 'Back')}
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {t('Buscar Conteúdo', 'Search Content')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('Encontre projetos, posts do blog e documentação', 'Find projects, blog posts and documentation')}
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <Search 
              placeholder={t('Digite sua busca...', 'Type your search...')}
              showResults={false}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {t('Resultados para', 'Results for')} "<span className="text-primary">{query}</span>"
              </h2>
              {!isLoading && (
                <p className="text-muted-foreground">
                  {results.length} {t('resultado(s) encontrado(s)', 'result(s) found')}
                </p>
              )}
            </div>

            {isLoading ? (
              <LoadingSkeleton />
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <Card key={result.id} className={`glass-card glow-hover ${getTypeColor(result.type)}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-space-grotesk">
                              <Link 
                                to={result.url}
                                className="hover:text-primary transition-colors"
                              >
                                {result.title}
                              </Link>
                            </CardTitle>
                            <Badge variant="outline">
                              {getTypeBadge(result.type)}
                            </Badge>
                          </div>
                          {result.published_at && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {format(new Date(result.published_at), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {result.content}...
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={result.url}>
                          {t('Ver mais', 'Read more')}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card text-center py-12">
                <CardContent>
                  <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t('Nenhum resultado encontrado', 'No results found')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('Tente ajustar sua busca ou usar termos diferentes', 'Try adjusting your search or using different terms')}
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/">
                      {t('Voltar ao início', 'Back to home')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty state when no query */}
        {!query && (
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card text-center py-12">
              <CardContent>
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">
                  {t('Digite algo para buscar', 'Type something to search')}
                </h3>
                <p className="text-muted-foreground">
                  {t('Use a caixa de busca acima para encontrar conteúdo', 'Use the search box above to find content')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}