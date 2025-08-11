import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthors } from '@/hooks/useAuthors';
import { useCategories } from '@/hooks/useCategories';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { slugify } from '@/lib/slugify';

type FormValues = {
  slug: string;
  title_pt: string;
  title_en?: string;
  content_pt?: string;
  content_en?: string;
  author_id?: string;
  categories: string[];
  published: boolean;
  published_at?: string | null;
};

export default function NewPost() {
  const form = useForm<FormValues>({
    defaultValues: {
      slug: '',
      title_pt: '',
      title_en: '',
      content_pt: '',
      content_en: '',
      author_id: undefined,
      categories: [],
      published: false,
      published_at: null,
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authors } = useAuthors();
  const { data: categories } = useCategories();
  const [uploading, setUploading] = useState(false);

  const titleWatch = form.watch('title_pt');

  useEffect(() => {
    form.setValue('slug', slugify(titleWatch || ''));
  }, [titleWatch, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const filePath = `posts/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(filePath, file);
      if (error) throw error;
      toast({ title: 'Image uploaded', description: filePath });
    } catch {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          slug: values.slug,
          title_pt: values.title_pt,
          title_en: values.title_en,
          content_pt: values.content_pt,
          content_en: values.content_en,
          author_id: values.author_id,
          published: values.published,
          published_at: values.published ? values.published_at : null,
        })
        .select()
        .single();

      if (error) throw error;

      if (values.categories.length > 0) {
        const inserts = values.categories.map((category_id) => ({
          post_id: data.id,
          category_id,
        }));
        await supabase.from('blog_posts_categories').insert(inserts);
      }

      toast({ title: 'Post created' });
      queryClient.invalidateQueries({ queryKey: ['all-blog-posts'] });
      navigate('/admin/posts');
    } catch {
      toast({ title: 'Failed to create post', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">New Post</h1>
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
            name="content_pt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (PT)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (EN)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Categories</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories?.map((cat) => (
                <FormField
                  key={cat.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    const isChecked = field.value?.includes(cat.id);
                    return (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, cat.id]);
                              } else {
                                field.onChange(field.value.filter((v: string) => v !== cat.id));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel>{cat.title_pt}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Published</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('published') && (
            <FormField
              control={form.control}
              name="published_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published At</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div>
            <FormLabel>Image</FormLabel>
            <Input type="file" onChange={handleImageUpload} disabled={uploading} />
          </div>

          <Button type="submit" className="glow-hover" disabled={uploading}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
