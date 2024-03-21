import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
  ],
});
