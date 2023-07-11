import React, { useEffect, useState } from 'react';

import classes from './TableOfContents.module.css';

type TestType = {
  tag: string;
  text?: string | null;
  children?: TestType[];
  id: string;
};

const TableOfContents = () => {
  const [headingTree, setHeadingTree] = useState<TestType[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('#content > div > h2, #content > div > h3'),
    );
    treeifyHeaders(elements);
  }, []);

  const treeifyHeaders = (arr: NodeListOf<Element>) => {
    const stack: TestType[] = [{ tag: 'H0', children: [], id: '' }];
    for (const header of Array.from(arr)) {
      const { tagName: tag, textContent: text, id } = header;
      const node = { tag, text, id };
      let last = stack[stack.length - 1];

      while (last && last.tag >= node.tag) {
        stack.pop();
        last = stack[stack.length - 1];
      }

      if (last !== undefined) {
        last.children = last.children || [];
        last.children.push(node);
        stack.push(node);
      }
    }
    console.log(stack[0].children);
    setHeadingTree(stack[0].children);
  };

  return (
    <div className={classes.toc}>
      <h3 className={classes.title}>Innhold på siden</h3>
      <nav>
        <ul className={classes.list}>
          {headingTree.map((heading) => (
            <>
              <li
                key={heading.text}
                className={classes.listItem}
              >
                <a
                  className={classes.link}
                  href={'#' + heading.id}
                >
                  {heading.text}
                </a>
              </li>
              {heading.children && (
                <ul className={classes.subList}>
                  {heading.children.map((subHeading) => (
                    <>
                      <li
                        key={subHeading.text}
                        className={classes.listItem}
                      >
                        <a
                          className={classes.link}
                          href={'#' + subHeading.id}
                        >
                          {subHeading.text}
                        </a>
                      </li>
                    </>
                  ))}
                </ul>
              )}
            </>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export { TableOfContents };
