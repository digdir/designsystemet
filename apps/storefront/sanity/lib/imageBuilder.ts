import imageUrlBuilder from '@sanity/image-url';

import { client } from './client';

const builder = imageUrlBuilder(client);

export const getUrl = (source: string) => {
  return builder.image(source);
};
