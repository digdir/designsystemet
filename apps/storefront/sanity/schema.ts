import { type SchemaTypeDefinition } from 'sanity';

import { blogPost } from './schemaTypes/blogPost';
import { footer } from './schemaTypes/footer';
import { settings } from './schemaTypes/settings';
import { navigation } from './schemaTypes/navigation';
import { page } from './schemaTypes/page';
import { heading } from './schemaTypes/heading';
import { person } from './schemaTypes/person';
import { paragraph } from './schemaTypes/paragraph';
import { image } from './schemaTypes/image';
import { link } from './schemaTypes/link';
import { blogArchive } from './schemaTypes/blogArchive';
import { banner } from './schemaTypes/banner';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    blogPost,
    navigation,
    footer,
    settings,
    heading,
    person,
    paragraph,
    image,
    link,
    blogArchive,
    banner,
  ],
};
