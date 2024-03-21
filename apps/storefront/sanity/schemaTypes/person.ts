import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
    }),
    defineField({
      name: 'profession',
      title: 'Yrke',
      type: 'string',
    }),
    defineField({
      name: 'organisation',
      title: 'Organisasjon',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
    }),
  ],
})
