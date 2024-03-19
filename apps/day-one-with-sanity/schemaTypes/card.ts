import {defineField, defineType} from 'sanity'

export const card = defineType({
  name: 'card',
  title: 'Kort',
  type: 'document',
  fields: [
    defineField({
      name: 'tittel',
      type: 'string',
    }),
    defineField({
      name: 'ingress',
      type: 'string',
    }),
    defineField({
      name: 'bilde',
      type: 'image',
    }),
  ],
})
