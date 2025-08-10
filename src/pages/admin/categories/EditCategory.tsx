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
  title_pt: string;
  title_en?: string;
  description_pt?: string;
  description_en?: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

export default function EditCategory() {
  const { id } = useParams<{ id: string }>();
  const form = useForm<FormValues>({
    defaultValues: {
      slug: '',
      title_pt: '',
      title_en: '',
      description_pt: '',
      description_en: '',
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        toast({ title: 'Failed to load category', variant: 'destructive' });
        return;
      }
      form.reset({
        slug: data.slug,
        title_pt: data.title_pt,
        title_en: data.title_en || '',
        description_pt: data.description_pt || '',
        description_en: data.description_en || '',
      });
      setLoading(false);
    };
    fetchCategory();
  }, [id, form]);

  const titleWatch = form.watch('title_pt');
  useEffect(() => {
    form.setValue('slug', slugify(titleWatch || ''));
  }, [titleWatch, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Category updated' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    } catch {
      toast({ title: 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await supabase.from('categories').delete().eq('id', id);
      toast({ title: 'Category deleted' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    } catch {
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">Edit Category</h1>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title_pt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (PT)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (EN)</FormLabel>
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

          <Button type="submit" className="glow-hover">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
