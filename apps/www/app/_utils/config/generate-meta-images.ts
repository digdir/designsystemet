import { mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import satori from 'satori';
import sharp from 'sharp';
import { DsFullLogo } from '../../_components/logos/designsystemet';
import { defaultCoverImagePath, getMetaImagePath } from '../metadata';

/* @TODO: Dont use hardcoded colors, @mimarz has an idea here later on */
const colors = {
  brand1: { background: '#fef0f1', foreground: '#4b1d1e', icon: '#f45f63' },
  brand2: { background: '#fbf3df', foreground: '#382908', icon: '#e5aa20' },
  brand3: { background: '#eaf5fe', foreground: '#092d49', icon: '#1e98f5' },
};

export async function generateMetaImages(paths: string[], clientDir: string) {
  const fonts = await Promise.all(
    ([400, 700] as const).map(async (weight) => ({
      name: 'Inter',
      data: await readFile(
        fileURLToPath(new URL(`./fonts/inter-${weight}.woff`, import.meta.url)),
      ),
      weight,
      style: 'normal' as const,
    })),
  );
  const logoSvg = parse(renderToStaticMarkup(createElement(DsFullLogo)));
  const sections = new Map<
    string,
    {
      title: string;
      background: string;
      foreground: string;
      artwork: string;
      logo: { src: string; width: number; height: number };
    }
  >();

  await rm(join(clientDir, 'img/meta'), { recursive: true, force: true });
  let count = 0;
  for (const pathname of new Set(paths)) {
    const imagePath = getMetaImagePath(pathname);
    if (imagePath === defaultCoverImagePath) continue;
    const page = parse(
      await readFile(join(clientDir, pathname, 'index.html'), 'utf8'),
    );
    if (page.querySelector('meta[http-equiv="refresh"]')) continue;
    const sectionPath = pathname.split('/').slice(0, 3).join('/');
    let section = sections.get(sectionPath);
    if (!section) {
      const index = parse(
        await readFile(join(clientDir, sectionPath, 'index.html'), 'utf8'),
      );
      const banner = index.querySelector('h1')?.closest('[data-color]');
      const color = banner?.getAttribute('data-color');
      const palette = colors[color as keyof typeof colors] ?? colors.brand1;
      logoSvg
        .querySelector('[data-text]')
        ?.setAttribute('fill', palette.foreground);
      const logo = await sharp(Buffer.from(logoSvg.toString()))
        .resize({ height: 48 })
        .png()
        .toBuffer({ resolveWithObject: true });
      const icon = banner?.querySelector('svg');
      if (icon) {
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.setAttribute('color', palette.icon);
        for (const path of icon.querySelectorAll('path')) {
          path.setAttribute('fill', palette.icon);
        }
      }
      const artwork = await sharp(
        icon
          ? Buffer.from(icon.toString())
          : await readFile(join(clientDir, 'img/figures/third.svg')),
      )
        .resize(560, 560, { fit: 'inside' })
        .png()
        .toBuffer();
      section = {
        title:
          index
            .querySelector('meta[property="og:title"]')
            ?.getAttribute('content') ?? 'Designsystemet',
        ...palette,
        artwork: `data:image/png;base64,${artwork.toString('base64')}`,
        logo: {
          src: `data:image/png;base64,${logo.data.toString('base64')}`,
          width: logo.info.width,
          height: logo.info.height,
        },
      };
      sections.set(sectionPath, section);
    }
    const title = page
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content');
    if (!title) throw new Error(`Missing social title for ${pathname}`);
    const svg = await satori(
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: section.background,
            color: section.foreground,
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          },
        },
        createElement('img', {
          src: section.logo.src,
          width: section.logo.width,
          height: section.logo.height,
          style: {
            position: 'absolute',
            left: 60,
            top: 60,
          },
        }),
        createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              left: 60,
              top: 156,
              width: 650,
              height: 318,
            },
          },
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: 650,
                gap: 24,
              },
            },
            title !== section.title
              ? createElement('div', { style: { fontSize: 39 } }, section.title)
              : null,
            createElement(
              'div',
              {
                style: {
                  fontSize:
                    title.length > 110 ? 38 : title.length > 60 ? 46 : 56,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  overflowWrap: 'anywhere',
                },
              },
              title,
            ),
          ),
        ),
        createElement('img', {
          src: section.artwork,
          width: 560,
          height: 560,
          style: {
            position: 'absolute',
            right: -150,
            top: 70,
            objectFit: 'contain',
          },
        }),
        createElement(
          'div',
          {
            style: {
              fontSize: 36,
              position: 'absolute',
              left: 60,
              bottom: 60,
            },
          },
          'designsystemet.no',
        ),
      ),
      { width: 1200, height: 630, fonts },
    );
    const destination = join(clientDir, imagePath);
    await mkdir(dirname(destination), { recursive: true });
    await sharp(Buffer.from(svg)).png().toFile(destination);
    count++;
  }
  console.log(
    `Generated ${count} meta images in ${join(clientDir, 'img/meta')}.`,
  );
}
