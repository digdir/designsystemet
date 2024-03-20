import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Innstillinger',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'tittel',
      type: 'string',
      hidden: true,
      initialValue: 'Innstillinger',
    }),
    defineField({
      name: 'logo',
      type: 'image',
    }),
    defineField({
      name: 'favicon',
      type: 'image',
    }),
  ],
})
