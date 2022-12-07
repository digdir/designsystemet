import Axios from 'axios';
const { create, get } = Axios;

const FILE_KEY = 'K2KZbw0PISz6tM5TkpAIlF';

const FigmaAxion = (token?: string) =>
  create({
    headers: {
      'X-FIGMA-TOKEN': token,
    },
  });

/**
 * Published Figma-components
 */
export const getPublishedIcons = async () => {
  const { data } = await FigmaAxion(process.env.FIGMA_TOKEN)
    .get(`https://api.figma.com/v1/files/${FILE_KEY}/components`)
    .catch((e) => {
      console.log('Failed getPublishedIcons ');
      throw e;
    });

  console.log(data);

  return data?.meta?.components?.filter((component: any) => {
    const page = component?.containing_frame?.pageName;
    return page !== '🔆Pictogram' && page !== '🧩Placeholder';
  });
};

/**
 * Downloadable link to each icon in SVG-format
 */
export const getIconsDownloadableUrl = async (nodeIds: string) => {
  const {
    data: { images },
  } = await FigmaAxion(process.env.FIGMA_TOKEN)
    .get(
      `https://api.figma.com/v1/images/${FILE_KEY}/?ids=${nodeIds}&format=svg`,
    )
    .catch((e) => {
      console.log('Failed getIconsDownloadableUrl ');
      throw e;
    });

  return Object.values(images) as string[];
};

/**
 * Download icon @url
 */
export const getIconContent = async (url: string) => get(url);
