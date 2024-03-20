import { defineArrayMember, defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';

export const navigation = defineType({
  name: 'navigation',
  title: 'Hovednavigasjon',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'tittel',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'menu',
      title: 'Meny',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'link',
          type: 'link',
        }),
      ],
    }),
  ],
});
