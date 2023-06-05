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
  /** Description of what myProp does in the component */
  myProp?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ myProp = false, children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(myProp && classes.myClass, rest.className)}
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
    myProp: false, // we set this so "boolean" is set in props table
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof ${componentName}> = () => (
  <>
    <${componentName} myProp>I</${componentName}>
    <${componentName}>am</${componentName}>
    <${componentName} myProp>stacked</${componentName}>
  </>
);
`;
};

const mdxContent = (componentName: string) => {
  return `import { Meta, Canvas, Story, Controls, Primary } from '@storybook/blocks';
import { Information } from '../../../../../docs-components';
import * as ${componentName}Stories from './${componentName}.stories';

<Meta of={${componentName}Stories} />

# ${componentName}

<Information text='development' />

Description of the ${componentName} component.

<Primary />
<Controls />

## Bruk

<Information text='token' />

\`\`\`tsx
import '@digdir/design-system-tokens/brand/altinn/tokens.css'; // Importeres kun en gang i appen din.
import { ${componentName} } from '@digdir/design-system-react';

<${componentName}>You are using the ${componentName} component!</${componentName}>;
\`\`\`

## Composed

<Canvas of={${componentName}Stories.Composed} />
`;
};

const testContent = (componentName: string) => `import React from 'react';
import { render, screen } from '@testing-library/react';

import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  test('myProp should add myClass', (): void => {
    render(<${componentName} myProp>test text</${componentName}>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});



`;

export {
  exportContent,
  mainContent,
  cssContent,
  storyContent,
  mdxContent,
  testContent,
};
