import type { FieldPath, UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { linkDefinitions } from '@/lib/validation/links';
import type { LinkableFormValues } from '@/lib/validation/adminForms';

interface LinkFieldsProps<TFieldValues extends LinkableFormValues> {
  form: UseFormReturn<TFieldValues>;
}

export const LinkFields = <TFieldValues extends LinkableFormValues>({ form }: LinkFieldsProps<TFieldValues>) => {
  const links = form.watch('links');

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Links</h2>
        <p className="text-sm text-muted-foreground">
          Toggle each channel and provide the URL you want to publish.
        </p>
      </div>
      {linkDefinitions.map(({ key, label, description, placeholder }) => {
        const enabled = links?.[key]?.enabled ?? false;
        const enabledField = `links.${key}.enabled` as FieldPath<TFieldValues>;
        const urlField = `links.${key}.url` as FieldPath<TFieldValues>;

        return (
          <div key={key} className="rounded-lg border p-4 space-y-4">
            <FormField
              control={form.control}
              name={enabledField}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <FormLabel className="text-base">{label}</FormLabel>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                  </div>
                  <FormControl>
                    <Switch
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) {
                          const currentValue = form.getValues(urlField) as unknown as string;
                          if (currentValue?.length) {
                            form.setValue(urlField, '' as any, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          } else {
                            void form.trigger(urlField);
                          }
                        }
                      }}
                      aria-label={`${label} link toggle`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={urlField}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{label} URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder}
                      disabled={!enabled}
                      inputMode="url"
                      autoComplete="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

LinkFields.displayName = 'LinkFields';
