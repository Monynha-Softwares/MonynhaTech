import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Plus, Edit, Trash2, Eye, ExternalLink, Github, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function Projects() {
  const { data: projects, isLoading, error, refetch, deleteProject } = useProjects();

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    try {
      await deleteProject(id);
      toast({ title: 'Project deleted' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Failed to load projects" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button className="glow-hover" asChild>
          <Link to="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects?.map((project) => {
          const links = project.links;

          return (
            <Card key={project.id} className="glass-card glow-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {project.icon && (
                        <div className="w-8 h-8 text-2xl">
                          {project.icon}
                        </div>
                      )}
                      <CardTitle className="font-space-grotesk">
                        {project.name_pt}
                      </CardTitle>
                    </div>
                    {project.name_en && (
                      <CardDescription className="text-sm italic">
                        EN: {project.name_en}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" aria-label={`View ${project.name_pt}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete ${project.name_pt}`}
                      onClick={() => handleDelete(project.id, project.name_pt)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {project.description_pt && (
                  <p className="text-sm text-muted-foreground">
                    {project.description_pt}
                  </p>
                )}
                
                {project.description_en && (
                  <p className="text-xs text-muted-foreground italic">
                    EN: {project.description_en}
                  </p>
                )}

                {links && (
                  <div className="flex flex-wrap gap-2">
                    {links.demo && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={links.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {links.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {!projects?.length && (
          <Card className="glass-card text-center py-12 lg:col-span-2">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Start showcasing your work by adding projects
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}