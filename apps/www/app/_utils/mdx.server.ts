import { bundleMDX } from 'mdx-bundler';

export async function processMdx(source: string) {
  if (typeof process === 'undefined' || !process.versions?.node) {
    throw new Error('MDX processing can only be done on the server side');
  }

  const { code } = await bundleMDX({
    source,
  });

  return code;
}
