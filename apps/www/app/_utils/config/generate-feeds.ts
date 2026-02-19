import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { buildMetadata, logoPath } from '../metadata';
import { getBlogPosts } from './get-blog-posts';
import { buildRFC822Date } from './rfc-822';
import { rfc3339 } from './rfc-3339';

const baseUrl = 'https://designsystemet.no';
const ttl = 60 * 24 * 7; // 1 week

// Source - https://stackoverflow.com/a/27979933
// Posted by hgoebl, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-11, License - CC BY-SA 4.0
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
    return c;
  });
}

export async function generateFeeds(lang: string): Promise<void> {
  const dirname = cwd();
  const now = new Date();

  try {
    const rssPath = `/${lang}/blog/feed.rss`;
    const rssSource = `${baseUrl}${rssPath}`;
    const atomPath = `/${lang}/blog/feed.atom`;
    const atomSource = `${baseUrl}${atomPath}`;

    const blogPosts = await getBlogPosts(lang);
    const { title, description, siteUrl, image } = buildMetadata(
      blogPosts.metadata,
    );

    const rssOutput = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${escapeXml(title)} - Designsystemet</title>
  <description>${escapeXml(description)}</description>
  <link>${escapeXml(siteUrl)}</link>
  <language>${lang}</language>
  <image>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <url>${escapeXml(`${baseUrl}/${image}`)}</url>
  </image>
  <ttl>${ttl}</ttl>
  <pubDate>${buildRFC822Date(now)}</pubDate>
  <lastBuildDate>${buildRFC822Date(now)}</lastBuildDate>
  <atom:link href="${escapeXml(rssSource)}" rel="self" type="application/rss+xml" />
${blogPosts.posts
  .map(
    ({ url, description, title, date, searchTerms, image }) => `  <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(`${baseUrl}/${lang}/blog/${url}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${baseUrl}/${lang}/blog/${url}`)}</guid>
      <pubDate>${buildRFC822Date(date)}</pubDate>
      <description>${escapeXml(description)}</description>
      <source url="${escapeXml(rssSource)}">${escapeXml(title)}</source>
      <media:content url="${escapeXml(`${baseUrl}${image.src}`)}" lang="${lang}" />
${searchTerms.map((term) => `      <category>${escapeXml(term.trim())}</category>`).join('\n')}
  </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;

    const atomOutput = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)} - Designsystemet</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${escapeXml(siteUrl)}" />
  <link rel="self" href="${escapeXml(atomPath)}" />
  <icon>${escapeXml(logoPath)}</icon>
  <logo>${escapeXml(image)}</logo>
  <id>${escapeXml(atomSource)}</id>
  <updated>${escapeXml(rfc3339(now))}</updated>

${blogPosts.posts
  .map(
    ({ url, description, title, date, author, searchTerms }) => `  <entry>
      <title>${escapeXml(title)}</title>
      <link rel="alternate" href="${escapeXml(`${baseUrl}/${lang}/blog/${url}`)}" />
      <link rel="self" href="${escapeXml(atomSource)}" />
      <id>${escapeXml(`${baseUrl}/${lang}/blog/${url}`)}</id>
      <updated>${escapeXml(rfc3339(new Date(date)))}</updated>
      <summary>${escapeXml(description)}</summary>
      <author>
        <name>${escapeXml(author)}</name>
      </author>
${searchTerms.map((term) => `      <category term="${escapeXml(term.trim())}" />`).join('\n')}
  </entry>`,
  )
  .join('\n')}
</feed>`;

    const rssClientPath = join(
      dirname,
      'dist',
      'client',
      lang,
      'blog',
      'feed.rss',
    );
    console.log(
      `Writing feed.rss to ${rssClientPath} with ${blogPosts.posts.length} URLs`,
    );
    writeFileSync(rssClientPath, rssOutput);

    const atomClientPath = join(
      dirname,
      'dist',
      'client',
      lang,
      'blog',
      'feed.atom',
    );
    console.log(
      `Writing feed.atom to ${atomClientPath} with ${blogPosts.posts.length} URLs`,
    );
    writeFileSync(atomClientPath, atomOutput);
  } catch (error) {
    console.error(`Error generating feeds: ${error}`);
  }
}
