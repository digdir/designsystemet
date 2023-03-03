import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';
import { IconVariant } from './utils';

describe('Icon', () => {
  it.each([IconVariant.Error, IconVariant.Search])(
    'Returns expected icon when variant is %s',
    (variant) => {
      render({ variant });
      expect(screen.getByTestId(`input-icon-${variant}`)).toBeInTheDocument();
    },
  );

  it.each([undefined, IconVariant.None])(
    `Returns null when variant is %s`,
    (variant) => {
      const { container } = render({ variant });
      expect(container.firstChild).toBeNull();
    },
  );
});

const render = (props: Partial<IconProps> = {}) =>
  renderRtl(<Icon {...props} />);
