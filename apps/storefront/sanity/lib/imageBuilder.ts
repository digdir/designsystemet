import imageUrlBuilder from '@sanity/image-url';

import { getClient } from './client';

const builder = imageUrlBuilder(getClient('false'));

export const getUrl = (source: string) => {
  return builder.image(source);
};
