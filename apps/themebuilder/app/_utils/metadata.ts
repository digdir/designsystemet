export const generateMetadata = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const image = '/img/designsystemet-meta.png';
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
      content: 'https://theme.designsystemet.no',
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
