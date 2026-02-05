import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Paths
const contentDir = path.join(rootDir, 'apps/www/app/content');
const sitemapPath = path.join(rootDir, 'apps/www/dist/client/sitemap.xml');

/**
 * Recursively find all MDX files in directory
 */
function findMDXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMDXFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(path.relative(contentDir, filePath));
    }
  });

  return fileList;
}

/**
 * Extract all URLs from sitemap.xml
 */
function extractUrlsFromSitemap(sitemapContent) {
  const urls = new Set();
  const urlRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;

  match = urlRegex.exec(sitemapContent);
  while (match !== null) {
    const url = match[1];
    // Extract path from URL (remove https://designsystemet.no)
    const pathMatch = url.match(/designsystemet\.no(.*?)$/);
    if (pathMatch) {
      // Normalize by removing trailing slash
      const normalizedPath = pathMatch[1].replace(/\/$/, '');
      urls.add(normalizedPath);
    }
    match = urlRegex.exec(sitemapContent);
  }

  return urls;
}

/**
 * Extract internal links from MDX content
 */
function extractInternalLinks(content) {
  const links = new Set();

  // Match various link patterns in MDX:
  // [text](/path) - markdown links
  // href="/path" - JSX attributes
  // to="/path" - React Router links
  const patterns = [
    /\[([^\]]+)\]\(([^)]+)\)/g, // Markdown links [text](url)
    /href=["']([^"']+)["']/g, // href attributes
    /to=["']([^"']+)["']/g, // to attributes
  ];

  patterns.forEach((pattern) => {
    let match;
    match = pattern.exec(content);
    while (match !== null) {
      // For markdown links, the link is in group 2, for others it's group 1
      const link = match[2] || match[1];

      // Only capture internal links (starting with /en/ or /no/)
      if (link && (link.startsWith('/en/') || link.startsWith('/no/'))) {
        // Remove hash and query parameters for comparison
        let cleanLink = link.split('#')[0].split('?')[0];
        // Normalize by removing trailing slash
        cleanLink = cleanLink.replace(/\/$/, '');
        if (cleanLink) {
          links.add(cleanLink);
        }
      }
      match = pattern.exec(content);
    }
  });

  return links;
}

/**
 * Get all MDX files from content directory
 */
function getMDXFiles() {
  try {
    if (!fs.existsSync(contentDir)) {
      console.error(`❌ Content directory not found at ${contentDir}`);
      return [];
    }
    return findMDXFiles(contentDir);
  } catch (error) {
    console.error('Error reading MDX files:', error.message);
    return [];
  }
}

/**
 * Main function
 */
function searchBrokenLinks() {
  console.log('🔍 Searching for broken internal links...\n');

  // Check if sitemap exists
  if (!fs.existsSync(sitemapPath)) {
    console.error(
      `❌ Sitemap not found at ${sitemapPath}\nPlease build the www app first.`,
    );
    process.exit(1);
  }

  // Read and parse sitemap
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const sitemapUrls = extractUrlsFromSitemap(sitemapContent);

  console.log(`✓ Found ${sitemapUrls.size} URLs in sitemap`);

  // Get all MDX files
  const mdxFiles = getMDXFiles();
  console.log(`✓ Found ${mdxFiles.length} MDX files\n`);

  const brokenLinks = new Map(); // Map of broken link -> [files where it appears]
  const foundLinks = new Set();

  // Process each MDX file
  for (const file of mdxFiles) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractInternalLinks(content);

    for (const link of links) {
      foundLinks.add(link);

      // Check if link exists in sitemap
      if (!sitemapUrls.has(link)) {
        if (!brokenLinks.has(link)) {
          brokenLinks.set(link, []);
        }
        brokenLinks.get(link).push(file);
      }
    }
  }

  // Report results
  console.log(`✓ Found ${foundLinks.size} unique internal links`);
  /*   console.log(
    `Sample found links: ${Array.from(foundLinks).slice(0, 5).join(', ')}\n`,
  ); */

  if (brokenLinks.size === 0) {
    console.log('✅ All internal links are valid!\n');
    return;
  }

  console.log(`❌ Found ${brokenLinks.size} broken links:\n`);

  // Sort broken links for consistent output
  const sortedBrokenLinks = Array.from(brokenLinks.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  sortedBrokenLinks.forEach(([link, files]) => {
    console.log(`  ${link}`);
    files.forEach((file) => {
      console.log(`    - ${file}`);
    });
  });

  console.log();
  process.exit(1);
}

// Run the script
try {
  searchBrokenLinks();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
