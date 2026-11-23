export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  pathname?: string;
}

export interface BuiltMetadata {
  pageTitle: string;
  title: string;
  description: string;
  image: string;
  siteUrl: string;
}

export const defaultCoverImagePath = '/img/designsystemet-meta.png';
export const logoPath = '/img/logo.svg';

export const getMetaImagePath = (pathname: string) => {
  const path = pathname.replace(/\/+$/, '');
  if (
    /^\/(no|en)\/blog\//.test(path) ||
    !/^\/(no|en)\/(intro|fundamentals|components|patterns|best-practices|blog)(\/|$)/.test(
      path,
    )
  )
    return defaultCoverImagePath;
  return `/img/meta${path}.png`;
};

export const generateMetadata = (metadata: PageMetadata) => {
  const { title, description, siteUrl, pageTitle, image } =
    buildMetadata(metadata);
  return [
    {
      title: pageTitle,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:url',
      content: siteUrl,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:image',
      content: image,
    },
  ];
};

export const withMetaImage = (
  metadata: ReturnType<typeof generateMetadata>,
  pathname: string,
) =>
  metadata.map((entry) =>
    entry.property === 'og:image' || entry.property === 'twitter:image'
      ? {
          ...entry,
          content: `https://designsystemet.no${getMetaImagePath(pathname)}`,
        }
      : entry,
  );

export const buildMetadata = ({
  title,
  description,
  pathname,
  image = pathname
    ? `https://designsystemet.no${getMetaImagePath(pathname)}`
    : defaultCoverImagePath,
}: PageMetadata): BuiltMetadata => ({
  pageTitle: `${title} - Designsystemet`,
  title,
  description,
  image,
  siteUrl: 'https://designsystemet.no',
});
