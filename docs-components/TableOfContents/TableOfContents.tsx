import type { Dispatch } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import classes from './TableOfContents.module.css';

/**
 * Dynamically generates the table of contents list, using any H2s and H3s it can find in the main text
 */
const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<NestedHeading[]>([]);

  useEffect(() => {
    const headingElements: HTMLHeadingElement[] = Array.from(
      document.querySelectorAll('.sbdocs > div > h2'),
    );

    // Created a list of headings, with H3s nested
    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

type NestedHeading = {
  id: string;
  title: string;
  items: { id: string; title: string }[];
};

const getNestedHeadings = (headingElements: HTMLHeadingElement[]) => {
  const nestedHeadings: NestedHeading[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === 'H2') {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === 'H3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};

const useIntersectionObserver = (setActiveId: Dispatch<string>) => {
  const headingElementsRef = useRef<
    Record<string, IntersectionObserverEntryInit>
  >({});
  useEffect(() => {
    const callback = (headings: IntersectionObserverEntryInit[]) => {
      headingElementsRef.current = headings.reduce((acc, headingElement) => {
        acc[headingElement.target.id] = headingElement;
        return acc;
      }, headingElementsRef.current);

      // Get all headings that are currently visible on the page
      const visibleHeadings: IntersectionObserverEntryInit[] = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id);

      // If there is only one visible heading, this is our "active" heading
      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
        // If there is more than one visible heading,
        // choose the one that is closest to the top of the page
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id),
        );

        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: document.querySelector('iframe'),
      rootMargin: '500px',
    });

    const headingElements = Array.from(
      document.querySelectorAll('.sbdocs > div > h2, .sbdocs > div > h3'),
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

type HeadingsProps = {
  headings: NestedHeading[];
  activeId: string;
};
/**
 * This renders an item in the table of contents list.
 * scrollIntoView is used to ensure that when a user clicks on an item, it will smoothly scroll.
 */
const Headings = ({ headings, activeId }: HeadingsProps) => (
  <ul className={classes['toc__list']}>
    {headings.map((headingReference) => (
      <li
        key={headingReference.id}
        className={cn(classes['toc__item'], {
          [classes['toc__item--active']]: headingReference.id === activeId,
        })}
      >
        <a
          href={`#${headingReference.id}`}
          onClick={(e) => {
            e.preventDefault();
            const heading = document.querySelector(`#${headingReference.id}`);

            if (heading) {
              heading.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }}
        >
          {headingReference.title}
        </a>
      </li>
    ))}
  </ul>
);

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('');
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <>
      {nestedHeadings.length > 1 && (
        <div className={classes.toc}>
          <div className={classes['toc__heading']}>Innhold på siden</div>
          <nav aria-label='Table of contents'>
            <Headings
              headings={nestedHeadings}
              activeId={activeId}
            />
          </nav>
        </div>
      )}
    </>
  );
}

TableOfContents.displayName = 'TableOfContents';
