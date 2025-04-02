import { LayersIcon } from '@navikt/aksel-icons';
import { Outlet } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';

export default function MonstreLayout() {
  return (
    <div className='text-center p-4'>
      <Banner color='red'>
        <BannerIcon>
          <LayersIcon />
        </BannerIcon>
        <BannerHeading level={1}>Mønstre</BannerHeading>
        <BannerIngress>
          Mønstre er retningslinjer og anbefalinger for hvordan interaksjon og
          gjentagende brukeroppgaver skal løses. Når de samme mønstrene brukes
          på tvers, skaper vi gjenkjennelighet i tjenestene.
        </BannerIngress>
      </Banner>

      <Outlet />
    </div>
  );
}
