import { prettify } from 'htmlfy';

/** Reduces every `<svg>` to an empty element, keeping the attributes that matter to the reader. */
const truncateSvgs = (html: string) =>
  html.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
    const ariaAttrs = match.match(/aria-[\w-]+="[^"]*"/gi) || [];
    const dataAttrs = match.match(/data-[\w-]+="[^"]*"/gi) || [];
    const classAttr = match.match(/class="[^"]*"/i) || [];
    const roleAttr = match.match(/role="[^"]*"/i) || [];
    const attrs = [...classAttr, ...ariaAttrs, ...roleAttr, ...dataAttrs];
    return `<svg${attrs.length ? ` ${attrs.join(' ')}` : ''}></svg>`;
  });

/** Formats the HTML a story renders to, the way it is shown in the HTML tab. */
export const formatHtml = (html: string, truncateSvg: boolean) => {
  const source = html || 'Unable to parse html';
  return prettify(truncateSvg ? truncateSvgs(source) : source, {
    tag_wrap: 63,
    content_wrap: 70,
  });
};
