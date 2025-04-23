export const generateMetadata = ({
  title,
  description,
  image = '/img/designsystemet-meta.png',
}: {
  title: string;
  description: string;
  image?: string;
}) => {
  return [
    {
      title: `${title} - Designsystemet`,
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
      content: 'https://designsystemet.no',
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
