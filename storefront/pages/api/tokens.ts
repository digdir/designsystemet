import { promises as fs } from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

type outputObjType = {
  [key: string]: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //Read the json data file data.json
  const tokensDirectory = path.join(process.cwd(), 'tokens');
  const fileContents = await fs.readFile(
    tokensDirectory + '/tokens.css',
    'utf8',
  );
  const fileContentsArr = fileContents.split(';');
  const outputObj: outputObjType = {};

  for (let i = 0; i < fileContentsArr.length; i++) {
    if (i === 0) {
      continue;
    }
    const itemArr = fileContentsArr[i].split(':');
    outputObj[itemArr[0].replace('\n  --', '')] = itemArr[1];
  }
  res.status(200).json(outputObj);
}
