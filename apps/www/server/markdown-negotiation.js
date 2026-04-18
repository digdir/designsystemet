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

  // ── Promote code examples before stripping ────────────────────────
  // Each live-component pair is: a [data-live="true"] preview container
  // followed by a <section hidden> containing editors.
  // We replace the pair with a clean <pre><code> of the React source.
  for (const section of content.querySelectorAll('section[aria-label]')) {
    // Prefer the tsx (React) live-editor source code.
    const reactEditor = section.querySelector('.live-editor pre');
    const htmlEditor = section.querySelector('pre.prism-code.language-html');

    const blocks = [];

    if (reactEditor) {
      // node-html-parser treats <pre> contents as raw text;
      // re-parse the innerHTML to strip the prism <span> wrappers.
      const code = parse(reactEditor.innerHTML).textContent.trim();
      if (code && code !== 'Unable to parse html') {
        blocks.push(
          `<pre><code class="language-tsx">${escapeHtml(code)}</code></pre>`,
        );
      }
    }

    if (htmlEditor) {
      const code = parse(htmlEditor.innerHTML).textContent.trim();
      if (code && code !== 'Unable to parse html') {
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

/**
 * Remove residual UI text that survives DOM-level stripping.
 */
function cleanMarkdown(md) {
  return md
    .replace(/^.*Unable to parse html.*$/gm, '')
    .replace(/^.*Unable to render HTML.*$/gm, '')
    .replace(/^React$/gm, '') // stray language label
    .replace(/^HTML$/gm, '') // stray language label
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Express middleware that converts HTML responses to Markdown
 * when the request includes `Accept: text/markdown`.
 *
 * The output strips site chrome (header, footer, sidebar navigation)
 * and interactive controls, keeping only the documentation content
 * with YAML front-matter metadata.
 */
export function markdownNegotiation(req, res, next) {
  const accept = req.headers.accept || '';
  if (!accept.includes('text/markdown')) {
    return next();
  }

  const chunks = [];
  const originalEnd = res.end;

  res.write = (chunk, ...args) => {
    const encoding = args.find((a) => typeof a === 'string') || 'utf-8';
    const callback = args.find((a) => typeof a === 'function');

    if (chunk != null) {
      chunks.push(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding),
      );
    }

    if (callback) process.nextTick(callback);
    return true;
  };

  res.end = (chunk, ...args) => {
    const encoding = args.find((a) => typeof a === 'string') || 'utf-8';
    const callback = args.find((a) => typeof a === 'function');

    if (chunk != null && typeof chunk !== 'function') {
      chunks.push(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding),
      );
    }

    const contentType = (res.getHeader('content-type') || '').toString();

    if (contentType.includes('text/html') && chunks.length > 0) {
      const html = Buffer.concat(chunks).toString('utf-8');
      const url = req.originalUrl || req.url;
      const { cleanedHtml, title, description, lang } =
        extractMainContent(html);

      let markdown = nhm.translate(cleanedHtml);
      markdown = cleanMarkdown(markdown);

      // Prepend YAML front-matter so consumers get structured metadata.
      const frontmatter = [
        '---',
        `title: "${title}"`,
        description ? `description: "${description}"` : null,
        `url: ${url}`,
        lang ? `language: ${lang}` : null,
        '---',
      ]
        .filter(Boolean)
        .join('\n');

      const fullMarkdown = `${frontmatter}\n\n${markdown}`;
      const tokens = estimateTokens(fullMarkdown);

      res.removeHeader('content-length');
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('x-markdown-tokens', String(tokens));
      res.setHeader('Content-Signal', 'ai-train=no, search=yes, ai-input=no');

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

      return originalEnd.call(res, fullMarkdown, 'utf-8', callback);
    }

    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
    if (body) {
      return originalEnd.call(res, body, callback);
    }
    return originalEnd.call(res, callback);
  };

  next();
}
