import { defineField, defineType } from 'sanity';
import { TextIcon } from '@sanity/icons';

export const heading = defineType({
  name: 'heading',
  title: 'Heading',
  type: 'document',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'Tekst',
    }),
    defineField({
      name: 'level',
      type: 'string',
      options: {
        list: ['H2', 'H3', 'H4', 'H5', 'H6'],
        layout: 'radio',
      },
    }),
  ],
});
