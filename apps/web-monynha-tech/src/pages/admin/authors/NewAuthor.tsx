import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@supabaseClient/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/components/ui/form';
import { Input } from '@ui/components/ui/input';
import { Textarea } from '@ui/components/ui/textarea';
import { Button } from '@ui/components/ui/button';

interface FormValues {
  name: string;
  bio?: string;
  links: string;
  photo_url?: string;
}

export default function NewAuthor() {
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
  const [uploading, setUploading] = useState(false);

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
      const { error } = await supabase.from('authors').insert({
        name: values.name,
        bio: values.bio,
        links,
        photo_url: values.photo_url,
      });
      if (error) throw error;
      toast({ title: 'Author created' });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      navigate('/admin/authors');
    } catch {
      toast({ title: 'Failed to create author', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text">New Author</h1>
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
