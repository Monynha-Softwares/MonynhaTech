import type { AuthorFormValues, ProjectFormValues } from '@/lib/validation/adminForms';
import { serializeLinks } from '@/lib/validation/links';

const nullIfEmpty = (value: string | undefined | null) => {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const buildProjectPayload = (values: ProjectFormValues) => ({
  slug: values.slug.trim(),
  name_pt: values.name_pt.trim(),
  name_en: nullIfEmpty(values.name_en),
  description_pt: nullIfEmpty(values.description_pt),
  description_en: nullIfEmpty(values.description_en),
  links: serializeLinks(values.links),
  icon: nullIfEmpty(values.icon),
});

export const buildAuthorPayload = (values: AuthorFormValues) => ({
  name: values.name.trim(),
  bio: nullIfEmpty(values.bio),
  links: serializeLinks(values.links),
  photo_url: nullIfEmpty(values.photo_url),
});
