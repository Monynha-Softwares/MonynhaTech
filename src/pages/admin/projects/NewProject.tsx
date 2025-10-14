import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/slugify';
import { LinkFields } from '@/components/admin/LinkFields';
import {
  createProjectDefaultValues,
  projectFormSchema,
  type ProjectFormValues,
} from '@/lib/validation/adminForms';
import { buildProjectPayload } from '@/lib/supabase/payloadBuilders';
import { getErrorMessage } from '@/lib/errors';

export default function NewProject() {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: createProjectDefaultValues(),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

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
    } catch (error) {
      toast({
        title: 'Failed to upload icon',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload = buildProjectPayload(values);
      const { error } = await supabase.from('projects').insert(payload);
      if (error) throw error;
      toast({ title: 'Project created' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    } catch (error) {
      toast({
        title: 'Failed to create project',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">New Project</h1>
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

          <LinkFields form={form} />

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
