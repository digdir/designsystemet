import { render as renderRtl, screen } from '@testing-library/react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';
import type { IconVariant_ } from './utils';

describe('Icon', () => {
  it.each<IconVariant_>(['error', 'search'])(
    'Returns expected icon when variant is %s',
    (variant) => {
      render({ variant });
      expect(screen.getByTestId(`input-icon-${variant}`)).toBeInTheDocument();
    },
  );

  it.each<IconVariant_ | undefined>([undefined, 'none'])(
    `Returns null when variant is %s`,
    (variant) => {
      const { container } = render({ variant });
      expect(container.firstChild).toBeNull();
    },
  );
});

const render = (props: IconProps = {}) => renderRtl(<Icon {...props} />);
