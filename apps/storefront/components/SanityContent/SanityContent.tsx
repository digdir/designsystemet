/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { SanityDocument } from 'next-sanity';
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
  PortableTextSpan,
} from '@portabletext/types';
import { Heading } from '@digdir/design-system-react';

import classes from './SanityContent.module.css';

type SanityContentProps = {
  content: PortableTextBlock[] | SanityDocument[];
};

export const SanityContent = ({ content }: SanityContentProps) => {
  return (
    <div>
      {content.map((block, index) => (
        <div
          key={index}
          className={classes.blocks}
        >
          {block._type === 'heading' && 'text' in block && (
            <Heading level={block.level}>{block.text}</Heading>
          )}
          {block._type === 'paragraph' && 'text' in block && (
            <p>{block.text}</p>
          )}
          {block._type === 'body' && block.style === 'h1' && (
            <>
              {(
                block.children as (PortableTextSpan | ArbitraryTypedObject)[]
              ).map(
                (
                  child: PortableTextSpan | ArbitraryTypedObject,
                  index: number,
                ) => (
                  <div key={index}>{child.text}</div>
                ),
              )}
            </>
          )}
          {block._type === 'body' && block.style === 'h2' && (
            <h2>{block.children[0].text}</h2>
          )}
          {block._type === 'body' && block.style === 'normal' && (
            <p>{block.children[0].text}</p>
          )}
          {/* {block._type === 'my_image' && (
            <img
              src={getUrl(block.image)}
              alt='ff'
            />
          )} */}
        </div>
      ))}
    </div>
  );
};
