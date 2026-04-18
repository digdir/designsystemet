import { NodeHtmlMarkdown } from 'node-html-markdown';

const nhm = new NodeHtmlMarkdown();

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Express middleware that converts HTML responses to Markdown
 * when the request includes `Accept: text/markdown`.
 */
export function markdownNegotiation(req, res, next) {
  const accept = req.headers.accept || '';
  if (!accept.includes('text/markdown')) {
    return next();
  }

  const chunks = [];
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, ...args) {
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

  res.end = function (chunk, ...args) {
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
      const markdown = nhm.translate(html);
      const tokens = estimateTokens(markdown);

      res.removeHeader('content-length');
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('x-markdown-tokens', String(tokens));
      res.setHeader(
        'Content-Signal',
        'ai-train=no, search=yes, ai-input=no',
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

      return originalEnd.call(res, markdown, 'utf-8', callback);
    }

    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
    if (body) {
      return originalEnd.call(res, body, callback);
    }
    return originalEnd.call(res, callback);
  };

  next();
}
