import { promises as fs } from 'fs';

import type { NextApiRequest, NextApiResponse } from 'next';

type outputObjType = {
  [key: string]: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //Read the json data file data.json
  const fileContents = await fs.readFile('tokens.css', 'utf8');
  const fileContentsArr = fileContents.split('--');
  const outputObj: outputObjType = {};

  for (let i = 0; i < fileContentsArr.length; i++) {
    if (i === 0) {
      continue;
    }
    const itemArr = fileContentsArr[i].split(':');
    outputObj[itemArr[0]] = itemArr[1];
  }

  res.status(200).json(outputObj);
}
