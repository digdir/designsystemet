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
      title: title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'og:image',
      content: image,
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
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
