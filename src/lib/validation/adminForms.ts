import { z } from 'zod';
import {
  createDefaultLinkValues,
  linksSchema,
  type LinkFormValues,
} from './links';

const optionalText = z.string().trim().optional();

export const projectFormSchema = z.object({
  slug: z.string().trim().min(1, 'Slug is required.'),
  name_pt: z.string().trim().min(1, 'Portuguese name is required.'),
  name_en: optionalText,
  description_pt: optionalText,
  description_en: optionalText,
  links: linksSchema,
  icon: optionalText,
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const createProjectDefaultValues = (): ProjectFormValues => ({
  slug: '',
  name_pt: '',
  name_en: '',
  description_pt: '',
  description_en: '',
  links: createDefaultLinkValues(),
  icon: '',
});

export const authorFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  bio: optionalText,
  links: linksSchema,
  photo_url: optionalText,
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

export const createAuthorDefaultValues = (): AuthorFormValues => ({
  name: '',
  bio: '',
  links: createDefaultLinkValues(),
  photo_url: '',
});

export type LinkableFormValues = { links: LinkFormValues };
