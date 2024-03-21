import { defineField, defineType } from 'sanity';

export const blogArchive = defineType({
  name: 'blogArchive',
  title: 'Bloggarkiv',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tittel',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'blogBanner',
      type: 'reference',
      to: [{ type: 'banner' }],
    }),
  ],
});
