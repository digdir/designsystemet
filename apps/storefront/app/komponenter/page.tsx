import { ComponentCard } from '@components';
import React from 'react';

import { data } from './component-list';

const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));

const IS_NEXT_BRANCH = process.env.defaultenvironment === 'next' || 'preview';

/* If we are in the next branch, send us to the next storybook */
if (IS_NEXT_BRANCH) {
  for (const component of sortedData) {
    component.url = component.url.replace(
      'storybook.designsystemet.no',
      'next.storybook.designsystemet.no',
    );
  }
}

export default function page() {
  return (
    <>
      {sortedData.map((component) => (
        <ComponentCard key={component.title} {...component} />
      ))}
      <style>
        {`
    body {
      background-color: var(--ds-color-neutral-background-subtle);
    }
  `}
      </style>
    </>
  );
}
