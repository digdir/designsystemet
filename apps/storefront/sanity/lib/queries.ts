// ./sanity/lib/queries.ts

import { groq } from 'next-sanity';

export const BLOG_POSTS_QUERY = groq`*[_type == "blogPost" && defined(slug)]{
  _id,
  title,
  ingress,
  image,
  slug
}`;
export const BLOG_ARCHIVE_QUERY = groq`*[_type == "blogArchive" && defined(slug)]{
  _id,
  title,
  blogBanner->
}`;

export const BLOG_POSTS_SLUG_QUERY = groq`*[_type == "blogPost" && defined(slug.current)][]{
  "params": { "slug": slug.current }
}`;

export const BLOG_POST_QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0]`;

export const FOOTER_QUERY = groq`*[_type == "footer"]`;

export const MENU_QUERY = groq`*[_type == "navigation"]`;
