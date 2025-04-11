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
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:image',
      content: image,
    },
  ];
};
