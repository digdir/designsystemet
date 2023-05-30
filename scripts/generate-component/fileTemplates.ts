// Content for export file
const exportContent = (componentName: string) => {
  return `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;
};

// Content for tsx file
const mainContent = (componentName: string) => {
  return `import React from 'react';

import classes from './${componentName}.module.css';

type ${componentName}Props = {
  children: React.ReactNode;
};

const ${componentName} = ({ children }: ${componentName}Props) => {
  return <div className={classes.myClass}>{children}</div>;
};

export { ${componentName} };
export type { ${componentName}Props };
`;
};

const cssContent = () => {
  return `.myClass {
  color: red;
}
`;
};

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

const render: StoryFn<typeof ${componentName}> = () => {
  return (
    <>
      <${componentName}>I</${componentName}>
      <${componentName}>am</${componentName}>
      <${componentName}>stacked</${componentName}>
    </>
  );
};

// Simple story
export const Normal: Story = {
  args: {
    children: 'You created the ${componentName} component!',
  },
};

// Composed story
export const Composed: Story = {
  render,
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
};
`;
};

const mdxContent = (componentName: string) => {
  return `import { Meta, Canvas, Story, Controls, Primary } from '@storybook/blocks';
import { BetaBlock } from '../../../../../docs-components';
import * as ${componentName}Stories from './${componentName}.stories';

<Meta of={${componentName}Stories} />

# ${componentName}

<BetaBlock />

Description of the ${componentName} component.
`;
};

export { exportContent, mainContent, cssContent, storyContent, mdxContent };
