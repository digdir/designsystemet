import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const paragraph = defineType({
  name: 'paragraph',
  title: 'Paragraph',
  type: 'document',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'Text',
      title: 'Tekst',
      type: 'text',
    }),
  ],
})
