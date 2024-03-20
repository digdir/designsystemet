import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const image = defineType({
  name: 'my_image',
  title: 'Image',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'tittel',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
    }),
    defineField({
      name: 'alt_text',
      title: 'Alt tekst',
      type: 'string',
    }),
  ],
})
