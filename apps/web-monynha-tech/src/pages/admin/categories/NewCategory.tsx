import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@supabaseClient/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/components/ui/form';
import { Input } from '@ui/components/ui/input';
import { Textarea } from '@ui/components/ui/textarea';
import { Button } from '@ui/components/ui/button';
import { slugify } from '@ui/lib/slugify';

interface FormValues {
  slug: string;
  title_pt: string;
  title_en?: string;
  description_pt?: string;
  description_en?: string;
}

export default function NewCategory() {
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

  const titleWatch = form.watch('title_pt');
  useEffect(() => {
    form.setValue('slug', slugify(titleWatch || ''));
  }, [titleWatch, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from('categories').insert(values);
      if (error) throw error;
      toast({ title: 'Category created' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    } catch {
      toast({ title: 'Failed to create category', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">New Category</h1>
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
