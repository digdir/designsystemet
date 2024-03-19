import {defineArrayMember, defineField, defineType} from 'sanity'
import {EditIcon} from '@sanity/icons'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blogginnlegg',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({
      name: 'tittel',
      type: 'string',
    }),
    defineField({
      name: 'ingress',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'tittel'},
    }),
    defineField({
      name: 'bilde',
      type: 'image',
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
          to: [{type: 'person'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'tittel',
      subtitle: 'ingress',
      media: 'bilde',
    },
  },
})
