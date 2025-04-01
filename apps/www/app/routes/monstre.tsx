import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Route } from './+types/monstre';

export function loader({ params }: Route.LoaderArgs) {
  /* using the url path, read file in /content/monstre/{file}.md */
  const file = params.file || 'index';
  const filePath = join(
    process.cwd(),
    'app',
    'content',
    'monstre',
    `${file}.md`,
  );
  console.log({ filePath });

  if (!existsSync(filePath)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Read the file content
  const content = readFileSync(filePath, 'utf-8');

  return {
    name: params.file,
    content: content,
  };
}

export default function Monstre({ loaderData }: Route.ComponentProps) {
  return (
    <div className='text-center p-4'>
      <h1 className='text-2xl'>Monstre {loaderData.name}</h1>
      <div>{loaderData.content}</div>
    </div>
  );
}
