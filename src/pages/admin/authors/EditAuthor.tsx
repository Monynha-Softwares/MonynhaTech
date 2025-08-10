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
  name: string;
  bio?: string;
  links: string;
  photo_url?: string;
}

export default function EditAuthor() {
  const { id } = useParams<{ id: string }>();
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      bio: '',
      links: '',
      photo_url: '',
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        toast({ title: 'Failed to load author', variant: 'destructive' });
        return;
      }
      form.reset({
        name: data.name,
        bio: data.bio || '',
        links: data.links ? JSON.stringify(data.links) : '',
        photo_url: data.photo_url || '',
      });
      setLoading(false);
    };
    fetchAuthor();
  }, [id, form]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const filePath = `authors/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(filePath, file);
      if (error) throw error;
      form.setValue('photo_url', filePath);
      toast({ title: 'Photo uploaded', description: filePath });
    } catch {
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const links = values.links ? JSON.parse(values.links) : null;
      const { error } = await supabase
        .from('authors')
        .update({
          name: values.name,
          bio: values.bio,
          links,
          photo_url: values.photo_url,
        })
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Author updated' });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      navigate('/admin/authors');
    } catch {
      toast({ title: 'Failed to update author', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await supabase.from('authors').delete().eq('id', id);
      toast({ title: 'Author deleted' });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      navigate('/admin/authors');
    } catch {
      toast({ title: 'Failed to delete author', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">Edit Author</h1>
        <Button variant="destructive" onClick={handleDelete} disabled={uploading}>
          Delete
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
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
            <FormLabel>Photo</FormLabel>
            <Input type="file" onChange={handlePhotoUpload} disabled={uploading} />
          </div>

          <Button type="submit" className="glow-hover" disabled={uploading}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
