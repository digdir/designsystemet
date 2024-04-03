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
      type: 'number',
      options: {
        list: [
          { title: 'H2', value: 2 },
          { title: 'H3', value: 3 },
          { title: 'H4', value: 3 },
        ],
        layout: 'radio',
      },
    }),
  ],
});
