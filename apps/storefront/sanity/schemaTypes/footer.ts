import { defineArrayMember, defineField, defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  description: 'Tittelen til footeren',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'tittel',
      type: 'string',
      hidden: true,
      initialValue: 'Footer',
    }),
    defineField({
      name: 'column1',
      title: 'Kolonne 1',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'heading',
          type: 'heading',
        }),
        defineArrayMember({
          name: 'paragraph',
          type: 'paragraph',
        }),
        defineArrayMember({
          name: 'link',
          type: 'link',
        }),
        defineArrayMember({
          name: 'my_image',
          type: 'my_image',
        }),
      ],
    }),
    defineField({
      name: 'column2',
      title: 'Kolonne 2',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'heading',
          type: 'heading',
        }),
        defineArrayMember({
          name: 'paragraph',
          type: 'paragraph',
        }),
        defineArrayMember({
          name: 'link',
          type: 'link',
        }),
        defineArrayMember({
          name: 'my_image',
          type: 'my_image',
        }),
      ],
    }),
    defineField({
      name: 'column3',
      title: 'Kolonne 3',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'heading',
          type: 'heading',
        }),
        defineArrayMember({
          name: 'paragraph',
          type: 'paragraph',
        }),
        defineArrayMember({
          name: 'link',
          type: 'link',
        }),
        defineArrayMember({
          name: 'my_image',
          type: 'my_image',
        }),
      ],
    }),
  ],
});
