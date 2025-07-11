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

console.log('Executing copy files script...');
const contentPath = join(dirname, 'app/content');
const serverDistPath = join(dirname, 'dist/server');

try {
  if (!existsSync(serverDistPath)) {
    mkdirSync(serverDistPath, { recursive: true });
  }

  const folders = readdirSync(serverDistPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folder of folders) {
    const folderPath = join(serverDistPath, folder, 'content');
    copyDirectory(contentPath, folderPath);
    console.log(
      `Successfully copied content from ${contentPath} to ${folderPath}`,
    );
  }
} catch (error) {
  console.error(`Error copying content directory:`, error);
}

/* take generated sitemap.xml from /public and move it to /dist/client */
const sitemapPath = join(dirname, 'public', 'sitemap.xml');
const sitemapClientPath = join(dirname, 'dist', 'client', 'sitemap.xml');

if (existsSync(sitemapPath)) {
  try {
    copyFileSync(sitemapPath, sitemapClientPath);
    console.log(`Successfully copied sitemap.xml to ${sitemapClientPath}`);
  } catch (error) {
    console.error(`Error copying sitemap.xml:`, error);
  }
}

/* take generated robots.txt from /public and move it to /dist/client */
const robotsPath = join(dirname, 'public', 'robots.txt');
const robotsClientPath = join(dirname, 'dist', 'client', 'robots.txt');

if (existsSync(robotsPath)) {
  try {
    copyFileSync(robotsPath, robotsClientPath);
    console.log(`Successfully copied robots.txt to ${robotsClientPath}`);
  } catch (error) {
    console.error(`Error copying robots.txt:`, error);
  }
}
