import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Sider',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
    }),
    defineField({
      name: 'ingress',
      title: 'Ingress',
      type: 'text',
    }),
  ],
})
