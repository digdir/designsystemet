import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useThemeStore } from '../../../store';
import classes from './IntroPage.module.css';

type IntroPageProps = {
  onNextClick: () => void;
};

export const IntroPage = ({ onNextClick }: IntroPageProps) => {
  const themeName = useThemeStore((state) => state.themeName);
  const setThemeName = useThemeStore((state) => state.setThemeName);
  return (
    <div>
      <Heading data-size='xs'>Konfigurer temaet ditt</Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>

      <Paragraph data-size='sm' className={classes.desc}>
        Logbook a sitting success parents' girl in it however, greater, full
        with he that pleasures up attention to hardly to power definitely hardly
      </Paragraph>

      <Paragraph data-size='sm' className={classes.desc}>
        Start først med å gi temaet ditt et navn.
      </Paragraph>

      <Textfield
        label='Navn'
        value={themeName}
        data-size='sm'
        onChange={(e) => {
          const value = e.currentTarget.value
            .replace(/\s+/g, '-')
            .replace(/[^A-Z0-9-]+/gi, '')
            .toLowerCase();

          setThemeName(value);
        }}
      />
      <div className={classes.bottom}>
        <Button
          data-size='sm'
          className={classes.btn}
          onClick={() => onNextClick()}
        >
          Gå videre til farger
          <ChevronRightIcon title='a11y-title' fontSize='1.5rem' />
        </Button>
      </div>
    </div>
  );
};
