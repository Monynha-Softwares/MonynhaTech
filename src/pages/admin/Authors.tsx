import { useState } from 'react';
import { useAuthors } from '@/hooks/useAuthors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Plus, Edit, Trash2, ExternalLink, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Authors() {
  const { data: authors, isLoading, error, refetch } = useAuthors();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Failed to load authors" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Authors</h1>
          <p className="text-muted-foreground">Manage content creators and contributors</p>
        </div>
        <Button className="glow-hover" asChild>
          <Link to="/admin/authors/new">
            <Plus className="h-4 w-4 mr-2" />
            New Author
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors?.map((author) => {
          const links = author.links as any;
          
          return (
            <Card key={author.id} className="glass-card glow-hover">
              <CardHeader className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={author.photo_url || ''} alt={author.name} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/20 text-primary">
                    {author.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <CardTitle className="font-space-grotesk">{author.name}</CardTitle>
                
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/authors/${author.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {author.bio && (
                  <p className="text-sm text-muted-foreground text-center">
                    {author.bio}
                  </p>
                )}
                
                {links && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {links.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={links.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                    {links.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={links.twitter} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {links.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {!authors?.length && (
          <Card className="glass-card text-center py-12 md:col-span-2 lg:col-span-3">
            <CardContent>
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No authors yet</h3>
              <p className="text-muted-foreground mb-4">
                Add content creators to start managing your team
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Author
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}