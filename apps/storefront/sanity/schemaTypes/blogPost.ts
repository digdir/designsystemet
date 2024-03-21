import { defineArrayMember, defineField, defineType } from 'sanity';
import { EditIcon } from '@sanity/icons';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blogginnlegg',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tittel',
    }),
    defineField({
      name: 'ingress',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
    }),
    defineField({
      name: 'author',
      title: 'Forfatter',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Dato',
      type: 'string',
    }),
    defineField({
      name: 'figureCount',
      title: 'Figur Antall',
      type: 'number',
      validation: (rule) => rule.required().max(5),
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
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
          name: 'my_image',
          type: 'my_image',
        }),
      ],
    }),
    defineField({
      name: 'contributors',
      title: 'Bidragsytere',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'ingress',
      media: 'image',
    },
  },
});
