import { Link as DSLink } from '@digdir/designsystemet-react';
import { Link, type LinkProps } from 'react-router';

export type RRLinkProps = LinkProps;

export const RRLink = ({ ...props }: LinkProps) => {
  return (
    <DSLink asChild>
      <Link {...props} />
    </DSLink>
  );
};
