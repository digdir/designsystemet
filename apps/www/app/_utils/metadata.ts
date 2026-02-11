export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

export interface BuiltMetadata {
  pageTitle: string;
  title: string;
  description: string;
  image: string;
  siteUrl: string;
}

export const defaultCoverImagePath = '/img/designsystemet-meta.png';
export const logoPath = '/img/Logotest.svg';

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

export const buildMetadata = ({
  title,
  description,
  image = defaultCoverImagePath,
}: PageMetadata): BuiltMetadata => ({
  pageTitle: `${title} - Designsystemet`,
  title,
  description,
  image,
  siteUrl: 'https://designsystemet.no',
});
