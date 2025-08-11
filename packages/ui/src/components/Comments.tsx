import { useState, FormEvent } from 'react';
import { useComments } from '@/hooks/useComments';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@ui/components/ui/input';
import { Textarea } from '@ui/components/ui/textarea';
import { Button } from '@ui/components/ui/button';
import { toast } from '@ui/components/ui/use-toast';

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const { t } = useLanguage();
  const { comments, isLoading, error, mutate: addComment } = useComments(postId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast({
        title: t('Nome e comentário são obrigatórios.', 'Name and comment are required.'),
      });
      return;
    }

    addComment(
      { postId, name, email, content },
      {
        onSuccess: () => {
          toast({
            title: t('Comentário enviado para aprovação!', 'Comment submitted for approval!'),
          });
          setName('');
          setEmail('');
          setContent('');
        },
        onError: () => {
          toast({
            title: t('Erro ao enviar comentário.', 'Error submitting comment.'),
          });
        },
      }
    );
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">
        {t('Comentários', 'Comments')}
      </h2>
      {isLoading && (
        <p>{t('Carregando comentários...', 'Loading comments...')}</p>
      )}
      {error && (
        <p className="text-destructive">
          {t('Erro ao carregar comentários.', 'Error loading comments.')}
        </p>
      )}
      {!isLoading && !error && comments.length === 0 && (
        <p>{t('Nenhum comentário ainda.', 'No comments yet.')}</p>
      )}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b border-muted pb-2">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm">{c.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          placeholder={t('Seu nome', 'Your name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder={t('Seu email (opcional)', 'Your email (optional)')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Textarea
          placeholder={t('Seu comentário', 'Your comment')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit">{t('Enviar', 'Submit')}</Button>
      </form>
    </section>
  );
}

export default Comments;
