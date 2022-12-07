import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

import pLimit from 'p-limit';
import rimraf from 'rimraf';
import startCase from 'lodash.startcase';
import dotenv from 'dotenv';

import { writeMeta } from './write-meta';
import {
  getPublishedIcons,
  getIconsDownloadableUrl,
  getIconContent,
} from './api';
dotenv.config();

export type ComponentT = {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  user: any;
  containing_frame: any;
};

const main = async () => {
  if (!process.env.FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN not set in .env');
  }
  const iconFolder = './svg';

  // Limiting to ~20 concurrent downloads seems to lead to less errors
  const limit = pLimit(20);

  const publishedIconNodes: ComponentT[] = await getPublishedIcons();

  writeMeta(publishedIconNodes);
  /* Get all urls in one fetch rather than 300+ */
  const iconUrls: string[] = await getIconsDownloadableUrl(
    publishedIconNodes.map((node) => node.node_id).join(','),
  );

  if (existsSync(iconFolder)) {
    rimraf.sync(iconFolder);
  }
  mkdirSync(iconFolder);

  console.log('Total icons: ' + publishedIconNodes.length);

  await Promise.all(
    iconUrls.map((url, x) =>
      limit(() =>
        getIconContent(url)
          .then(({ data }) => {
            writeFileSync(
              resolve(
                iconFolder,
                `${startCase(publishedIconNodes[x].name).replace(
                  /\s/g,
                  '',
                )}.svg`,
              ),
              data,
              {
                encoding: 'utf8',
              },
            );
          })
          .catch((e) => {
            throw e;
          }),
      ),
    ),
  );

  console.log('\nDownloaded all icons from Figma!\n');
};

main();
