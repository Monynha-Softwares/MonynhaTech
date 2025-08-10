import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FormValues {
  slug: string;
  name_pt: string;
  name_en?: string;
  description_pt?: string;
  description_en?: string;
  links: string;
  icon?: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const form = useForm<FormValues>({
    defaultValues: {
      slug: '',
      name_pt: '',
      name_en: '',
      description_pt: '',
      description_en: '',
      links: '',
      icon: '',
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        toast({ title: 'Failed to load project', variant: 'destructive' });
        return;
      }
      form.reset({
        slug: data.slug,
        name_pt: data.name_pt,
        name_en: data.name_en || '',
        description_pt: data.description_pt || '',
        description_en: data.description_en || '',
        links: data.links ? JSON.stringify(data.links) : '',
        icon: data.icon || '',
      });
      setLoading(false);
    };
    fetchProject();
  }, [id, form]);

  const nameWatch = form.watch('name_pt');
  useEffect(() => {
    form.setValue('slug', slugify(nameWatch || ''));
  }, [nameWatch, form]);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const filePath = `projects/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(filePath, file);
      if (error) throw error;
      form.setValue('icon', filePath);
      toast({ title: 'Icon uploaded', description: filePath });
    } catch {
      toast({ title: 'Failed to upload icon', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const links = values.links ? JSON.parse(values.links) : null;
      const { error } = await supabase
        .from('projects')
        .update({
          slug: values.slug,
          name_pt: values.name_pt,
          name_en: values.name_en,
          description_pt: values.description_pt,
          description_en: values.description_en,
          links,
          icon: values.icon,
        })
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Project updated' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    } catch {
      toast({ title: 'Failed to update project', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await supabase.from('projects').delete().eq('id', id);
      toast({ title: 'Project deleted' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    } catch {
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">Edit Project</h1>
        <Button variant="destructive" onClick={handleDelete} disabled={uploading}>
          Delete
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name_pt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (PT)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (EN)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_pt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (PT)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (EN)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="links"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Links (JSON)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Icon</FormLabel>
            <Input type="file" onChange={handleIconUpload} disabled={uploading} />
          </div>

          <Button type="submit" className="glow-hover" disabled={uploading}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
