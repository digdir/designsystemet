import type { Element, Root, Text } from 'hast';

export type TableOfContentsItem = {
  title: string;
  id: string;
  level: 2 | 3;
};

/*the VFile type has a data field*/
export type VFile = {
  data: {
    toc?: TableOfContentsItem[];
  };
};

// Custom plugin to extract headings (h2 and h3)
export const extractToc = () => (tree: Root, file: VFile) => {
  const toc: TableOfContentsItem[] = [];
  const traverse = (node: Root | Element) => {
    if ('tagName' in node && (node.tagName === 'h2' || node.tagName === 'h3')) {
      const title = node.children
        .map((child) => {
          if ('type' in child) {
            if (child.type === 'text') {
              return child.value;
            }
            //handle special case where title contains a code block
            if (
              child.type === 'element' &&
              child.tagName === 'code' &&
              'children' in child
            ) {
              return child.children
                .filter(
                  (codeChild): codeChild is Text =>
                    'type' in codeChild && codeChild.type === 'text',
                )
                .map((codeChild) => codeChild.value)
                .join('');
            }
          }
          return '';
        })
        .join('');

      toc.push({
        title,
        id: node.properties?.id as string,
        level: parseInt(node.tagName.charAt(1)) as 2 | 3,
      });
    }

    if ('children' in node) {
      node.children.forEach((child) => {
        if ('type' in child) {
          traverse(child as Element);
        }
      });
    }
  };

  traverse(tree);
  file.data.toc = toc;
};
