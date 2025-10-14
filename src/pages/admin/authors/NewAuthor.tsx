import { useState } from 'react';
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
import { LinkFields } from '@/components/admin/LinkFields';
import {
  authorFormSchema,
  createAuthorDefaultValues,
  type AuthorFormValues,
} from '@/lib/validation/adminForms';
import { buildAuthorPayload } from '@/lib/supabase/payloadBuilders';
import { getErrorMessage } from '@/lib/errors';

export default function NewAuthor() {
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: createAuthorDefaultValues(),
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
    } catch (error) {
      toast({
        title: 'Failed to upload photo',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: AuthorFormValues) => {
    try {
      const payload = buildAuthorPayload(values);
      const { error } = await supabase.from('authors').insert(payload);
      if (error) throw error;
      toast({ title: 'Author created' });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      navigate('/admin/authors');
    } catch (error) {
      toast({
        title: 'Failed to create author',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
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

          <LinkFields form={form} />

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
