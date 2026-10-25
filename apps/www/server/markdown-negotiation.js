import { NodeHtmlMarkdown } from 'node-html-markdown';
import { parse } from 'node-html-parser';

const nhm = new NodeHtmlMarkdown();

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Extract the page title from a parsed HTML document, stripping the site name suffix.
 */
function extractTitle(root) {
  const titleEl = root.querySelector('title');
  if (!titleEl) return '';
  return titleEl.textContent
    .trim()
    .replace(/\s*[-–|]\s*Designsystemet.*$/i, '')
    .trim();
}

/**
 * Extract the og:description meta content as a plain-text description.
 */
function extractDescription(root) {
  const el = root.querySelector('meta[property="og:description"]');
  return el?.getAttribute('content')?.trim() || '';
}

/**
 * Parse the full HTML page and return only the main content area
 * with navigation chrome, interactive UI controls, and visual-only
 * elements removed.  Code examples inside hidden editor sections are
 * promoted to proper <pre><code> blocks so they render as fenced code
 * in the final Markdown.
 */
function extractMainContent(html) {
  const root = parse(html);

  const title = extractTitle(root);
  const description = extractDescription(root);
  const lang = root.querySelector('html')?.getAttribute('lang') || '';

  // #main is the content div inside <main>; it excludes the sidebar.
  const content = root.querySelector('#main') || root.querySelector('main');
  if (!content) {
    return { cleanedHtml: html, title, description, lang };
  }

  // Static source remains available even when the highlighted UI suspends.
  for (const block of content.querySelectorAll(
    '[data-documentation-code-block]',
  )) {
    const pre = block.querySelector('pre');
    const code = pre && parse(pre.innerHTML).querySelector('code');
    if (code) {
      block.replaceWith(`<pre>${code.outerHTML}</pre>`);
    }
  }

  // ── Promote code examples before stripping ────────────────────────
  // Each live-component pair is: a [data-live="true"] preview container
  // followed by a <section hidden> containing editors.
  // Keep both React source and the server-rendered HTML.
  for (const section of content.querySelectorAll('section[aria-label]')) {
    const reactEditor = section.querySelector('.live-editor pre');
    const htmlEditor = section.querySelector('pre.prism-code.language-html');
    if (!reactEditor && !htmlEditor) continue;

    const blocks = [];

    if (reactEditor) {
      // node-html-parser treats <pre> contents as raw text;
      // re-parse the innerHTML to strip the prism <span> wrappers.
      const code = parse(reactEditor.innerHTML).textContent.trim();
      if (
        code &&
        code !== 'Unable to parse html' &&
        code !== 'Unable to render HTML'
      ) {
        blocks.push(
          `<pre><code class="language-tsx">${escapeHtml(code)}</code></pre>`,
        );
      }
    }

    if (htmlEditor) {
      const code = parse(htmlEditor.innerHTML).textContent.trim();
      if (
        code &&
        code !== 'Unable to parse html' &&
        code !== 'Unable to render HTML'
      ) {
        blocks.push(
          `<pre><code class="language-html">${escapeHtml(code)}</code></pre>`,
        );
      }
    }

    // Remove the associated visual preview that precedes this section.
    const prev = section.previousElementSibling;
    if (prev?.getAttribute('data-live') === 'true') {
      prev.remove();
    }

    if (blocks.length > 0) {
      section.replaceWith(blocks.join('\n'));
    } else {
      section.remove();
    }
  }

  // Also remove any remaining live-preview containers that have no code.
  for (const el of content.querySelectorAll('[data-live="true"]')) {
    el.remove();
  }

  // ── Remove UI chrome ──────────────────────────────────────────────
  const removeSelectors = [
    'nav',
    'button',
    'dialog',
    '[popover]',
    'script',
    'style',
    'svg',
    '.l-sidebar-left',
    '[data-toggle-group]',
    '[role="tablist"]',
    'ds-tablist',
    '[aria-live="polite"]',
    'aside', // table-of-contents sidebar
    '.toc-feedback', // "Har du innspill" feedback section
    'img[src$=".svg"]', // component preview icons
    '.ds-skeleton', // loading skeletons
    'template', // React streaming templates
  ];

  for (const sel of removeSelectors) {
    for (const el of content.querySelectorAll(sel)) {
      el.remove();
    }
  }

  // Remove "Komponenter" / "Components" pre-heading label.
  for (const el of content.querySelectorAll('p.ds-heading')) {
    const text = el.textContent.trim();
    if (text === 'Komponenter' || text === 'Components') {
      el.remove();
    }
  }

  // Remove overview/code/accessibility tab navigation links.
  for (const el of content.querySelectorAll('a.ds-button')) {
    el.remove();
  }

  // Remove the header wrapper divs that are now empty after stripping.
  for (const el of content.querySelectorAll('[class*="headerBottom"]')) {
    el.remove();
  }

  return { cleanedHtml: content.innerHTML, title, description, lang };
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function markdownLocation(location, req) {
  const origin = `${req.protocol}://${req.get('host')}`;
  const target = new URL(location, origin);
  if (
    target.origin !== origin ||
    target.pathname.split('/').pop()?.includes('.')
  ) {
    return location;
  }

  target.pathname = `${target.pathname.replace(/\/+$/, '') || '/'}.md`;
  return location.startsWith('/')
    ? `${target.pathname}${target.search}${target.hash}`
    : target.href;
}

/**
 * Express middleware that converts HTML responses to Markdown
 * when requested through a .md URL or Accept: text/markdown.
 *
 * The output strips site chrome (header, footer, sidebar navigation)
 * and interactive controls, keeping only the documentation content
 * with YAML front-matter metadata.
 */
export function markdownNegotiation(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  const url = new URL(req.url, 'http://localhost');
  const markdownUrl = /\.md\/?$/.test(url.pathname);
  if (markdownUrl) {
    url.pathname = url.pathname.replace(/\.md\/?$/, '') || '/';
    req.url = `${url.pathname}${url.search}`;
    // React Router's Express adapter builds its request from originalUrl.
    req.originalUrl = req.url;
  }
  const canonicalUrl = req.url;

  // HTML responses must vary too, otherwise caches can mix the representations.
  res.vary('Accept');
  if (
    !markdownUrl &&
    req.accepts(['html', 'text/markdown']) !== 'text/markdown'
  ) {
    return next();
  }

  req.headers.accept = 'text/markdown';
  // Static-file validators describe HTML bytes, not the Markdown representation.
  delete req.headers['if-none-match'];
  delete req.headers['if-modified-since'];
  delete req.headers.range;
  delete req.headers['if-range'];

  const chunks = [];
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = (chunk, ...args) => {
    if (!res.getHeader('content-type')?.toString().includes('text/html')) {
      return originalWrite.call(res, chunk, ...args);
    }
    const encoding = args.find((a) => typeof a === 'string') || 'utf-8';
    const callback = args.find((a) => typeof a === 'function');

    if (chunk != null) {
      chunks.push(
        typeof chunk === 'string'
          ? Buffer.from(chunk, encoding)
          : Buffer.from(chunk),
      );
    }

    if (callback) process.nextTick(callback);
    return true;
  };

  res.end = (chunk, ...args) => {
    const location = res.getHeader('location');
    if (markdownUrl && location) {
      res.setHeader('Location', markdownLocation(location.toString(), req));
    }

    const contentType = (res.getHeader('content-type') || '').toString();
    if (!contentType.includes('text/html')) {
      return originalEnd.call(res, chunk, ...args);
    }

    const encoding = args.find((a) => typeof a === 'string') || 'utf-8';
    const callback = args.find((a) => typeof a === 'function');

    if (chunk != null && typeof chunk !== 'function') {
      chunks.push(
        typeof chunk === 'string'
          ? Buffer.from(chunk, encoding)
          : Buffer.from(chunk),
      );
    }

    if (chunks.length > 0 || req.method === 'HEAD') {
      const html = Buffer.concat(chunks).toString('utf-8');
      const { cleanedHtml, title, description, lang } =
        extractMainContent(html);

      const markdown = nhm.translate(cleanedHtml).trim();

      // Prepend YAML front-matter so consumers get structured metadata.
      const frontmatter = [
        '---',
        `title: ${JSON.stringify(title)}`,
        description ? `description: ${JSON.stringify(description)}` : null,
        `url: ${JSON.stringify(canonicalUrl)}`,
        lang ? `language: ${JSON.stringify(lang)}` : null,
        '---',
      ]
        .filter(Boolean)
        .join('\n');

      const fullMarkdown = `${frontmatter}\n\n${markdown}`;
      const tokens = estimateTokens(fullMarkdown);

      res.removeHeader('content-length');
      res.removeHeader('etag');
      res.removeHeader('last-modified');
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      if (req.method !== 'HEAD') {
        res.setHeader('x-markdown-tokens', String(tokens));
      }
      res.setHeader(
        'Content-Signal',
        `ai-train=${process.env.APP_ENV === 'production' ? 'yes' : 'no'}, search=yes, ai-input=yes`,
      );

      const existingVary = res.getHeader('vary');
      if (existingVary) {
        const varies = existingVary
          .toString()
          .split(',')
          .map((v) => v.trim().toLowerCase());
        if (!varies.includes('accept')) {
          res.setHeader('Vary', `${existingVary}, Accept`);
        }
      } else {
        res.setHeader('Vary', 'Accept');
      }

      return originalEnd.call(
        res,
        req.method === 'HEAD' ? undefined : fullMarkdown,
        'utf-8',
        callback,
      );
    }

    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
    if (body) {
      return originalEnd.call(res, body, callback);
    }
    return originalEnd.call(res, callback);
  };

  next();
}
