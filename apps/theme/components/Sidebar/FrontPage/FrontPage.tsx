import { Heading, Paragraph } from '@digdir/designsystemet-react';
import {
  PackageIcon,
  PaletteIcon,
  PencilLineIcon,
  PlateIcon,
  RulerIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useThemeStore } from '../../../store';
import { TokenModal } from '../../TokenModal/TokenModal';
import classes from './FrontPage.module.css';

export const FrontPage = () => {
  const activePanel = useThemeStore((state) => state.activePage);
  const setActivePage = useThemeStore((state) => state.setActivePage);

  type CardProps = {
    title: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    blurry?: boolean;
  };

  const Card = ({ title, icon, onClick, blurry }: CardProps) => {
    return (
      <div
        className={cl(classes.card, blurry ? classes.blurry : '')}
        onClick={onClick}
      >
        <div className={classes.icon}>{icon}</div>
        <div>{title}</div>
      </div>
    );
  };

  return (
    <div>
      <Heading data-size='xs' className={classes.title}>
        Konfigurer temaet ditt
      </Heading>

      <Paragraph data-size='sm' className={classes.description}>
        Her feel he rattling display either a pointing he much field up built
        knowing the remain felt.
      </Paragraph>

      <div className={classes.cards}>
        <Card
          onClick={() => setActivePage('colors')}
          title='Farger'
          icon={<PaletteIcon title='a11y-title' fontSize='1.5rem' />}
        />
        <Card
          title='Border-radius'
          icon={<PlateIcon title='a11y-title' fontSize='1.5rem' />}
          blurry
        />
        <Card
          title='Typografi'
          icon={<PencilLineIcon title='a11y-title' fontSize='1.5rem' />}
          blurry
        />
        <Card
          title='Komponentstørrelser'
          icon={<PackageIcon title='a11y-title' fontSize='1.5rem' />}
          blurry
        />
        <Card
          title='Spacing'
          icon={<RulerIcon title='a11y-title' fontSize='1.5rem' />}
          blurry
        />
      </div>
      <div className={classes.tokenContainer}>
        <TokenModal />
      </div>
    </div>
  );
};
