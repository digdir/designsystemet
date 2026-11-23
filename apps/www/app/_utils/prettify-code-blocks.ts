import { isPrettifySupported, prettifyCode } from '@internal/components';
import type { Element, Root, RootContent, Text } from 'hast';

type Parent = { children: (RootContent | Parent)[] };

const hasChildren = (node: unknown): node is Parent =>
  Array.isArray((node as Parent | undefined)?.children);

const isElement = (node: unknown, tagName: string): node is Element =>
  (node as Element | undefined)?.type === 'element' &&
  (node as Element).tagName === tagName;

const getLanguage = (code: Element) => {
  const className = code.properties?.className;
  const classes = Array.isArray(className) ? className : [className];
  const language = classes.find(
    (name) => typeof name === 'string' && name.startsWith('language-'),
  );
  return typeof language === 'string' ? language.replace('language-', '') : '';
};

/**
 * Formats fenced code blocks with Prettier while the MDX is compiled.
 *
 * Doing it here, on the server, means the browser never has to download Prettier and its parsers
 * (over 1 MB for a single tsx block) just to re-format code that is already in the HTML.
 */
export const prettifyCodeBlocks = () => async (tree: Root) => {
  const jobs: Promise<void>[] = [];

  const traverse = (node: Root | RootContent | Parent) => {
    if (isElement(node, 'pre')) {
      const code = node.children.find((child) => isElement(child, 'code'));
      const text = code?.children.length === 1 ? code.children[0] : undefined;
      const language = code ? getLanguage(code) : '';

      if (text?.type === 'text' && isPrettifySupported(language)) {
        jobs.push(
          prettifyCode(text.value, language).then((pretty) => {
            (text as Text).value = pretty;
          }),
        );
      }
      return;
    }
    if (hasChildren(node)) node.children.forEach(traverse);
  };

  traverse(tree);
  await Promise.all(jobs);
};
