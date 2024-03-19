import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'Url',
      type: 'url',
    }),
  ],
})
