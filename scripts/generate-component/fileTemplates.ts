// Content for export file
const exportContent = (componentName: string) => {
  return `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;
};

// Content for tsx file
const mainContent = (
  componentName: string,
) => `import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './${componentName}.module.css';

export type ${componentName}Props = {
  /* Description of what myProp does in the component */
  myProp?: string;
} & HTMLAttributes<HTMLDivElement>;

export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(classes.myClass, rest.className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
`;
const cssContent = () => `.myClass {
  color: red;
}
`;

const storyContent = (componentName: string) => {
  return `import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Stack } from '../../../../../docs-components';

import { ${componentName} } from '.';

type Story = StoryObj<typeof ${componentName}>;

export default {
  title: 'Kjernekomponenter/${componentName}',
  component: ${componentName},
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;



// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the ${componentName} component!',
  },
};

// Composed story
const Composed: StoryFn<typeof ${componentName}> = () => {
  return (
    <>
      <${componentName}>I</${componentName}>
      <${componentName}>am</${componentName}>
      <${componentName}>stacked</${componentName}>
    </>
  );
};
`;
};

const mdxContent = (componentName: string) => {
  return `import { Meta, Canvas, Story, Controls, Primary } from '@storybook/blocks';
import { Information } from '../../../../../docs-components';
import * as ${componentName}Stories from './${componentName}.stories';

<Meta of={${componentName}Stories} />

# ${componentName}

<Information text="Beta" />

Description of the ${componentName} component.

<Primary />
<Controls />

## Composed

<Canvas of={${componentName}Stories.Composed} />
`;
};

export { exportContent, mainContent, cssContent, storyContent, mdxContent };
