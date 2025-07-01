import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

const dirname = process.cwd();

const copyDirectory = (src, dest) => {
  if (!existsSync(dest)) {
    try {
      mkdirSync(dest, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dest}:`, error);
      return;
    }
  }

  try {
    const entries = readdirSync(src);

    for (const entry of entries) {
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);

      const stats = statSync(srcPath);

      if (stats.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        try {
          copyFileSync(srcPath, destPath);
        } catch (error) {
          console.error(`Error copying file ${srcPath} -> ${destPath}:`, error);
        }
      }
    }
    console.log(`Successfully copied from ${src} to ${dest}`);
  } catch (error) {
    console.error(`Error reading directory ${src}:`, error);
  }
};
export const executeCopyFiles = async () => {
  console.log('Executing copy files script...');
  const contentPath = join(dirname, 'app/content');
  const distPath = join(dirname, 'dist/content');
  const clientPath = join(dirname, 'dist/client/app/content');

  console.log(
    `Copying content from ${contentPath} to ${distPath} and ${clientPath}`,
  );

  try {
    if (!existsSync(distPath)) {
      mkdirSync(distPath, { recursive: true });
    }

    copyDirectory(contentPath, distPath);
    copyDirectory(contentPath, './');
    console.log(
      `Successfully copied content from ${contentPath} to ${distPath}`,
    );
  } catch (error) {
    console.error(`Error copying content directory:`, error);
  }

  try {
    if (!existsSync(clientPath)) {
      mkdirSync(clientPath, { recursive: true });
    }

    copyDirectory(contentPath, clientPath);
    copyDirectory(contentPath, './');
    console.log(
      `Successfully copied content from ${contentPath} to ${clientPath}`,
    );
  } catch (error) {
    console.error(`Error copying content directory:`, error);
  }
};
