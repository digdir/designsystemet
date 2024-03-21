import { defineField, defineType } from 'sanity';

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
    }),
    defineField({
      name: 'ingress',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Farge',
      type: 'string',
      options: {
        list: [
          { title: 'Blå', value: 'blue' },
          { title: 'Gul', value: 'yellow' },
          { title: 'Rød', value: 'red' },
        ],
        layout: 'radio',
      },
    }),
  ],
});
