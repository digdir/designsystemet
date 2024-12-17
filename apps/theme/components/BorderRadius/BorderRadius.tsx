import {
  Button,
  Heading,
  Link,
  Paragraph,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';
import { ClipboardButton } from '@repo/components';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './BorderRadius.module.css';
import { SettingsCard } from './SettingsCard/SettingsCard';

// TODO get this token data from @digdir/designsystemet (use json from --preview or something)
const borderRadiuses = {
  sm: {
    name: 'sm',
    value:
      'min(var(--ds-border-radius-base)*0.5,var(--ds-border-radius-scale))',
    variable: '--ds-border-radius-sm',
  },
  md: {
    name: 'md',
    value: 'min(var(--ds-border-radius-base),var(--ds-border-radius-scale)*2)',
    variable: '--ds-border-radius-md',
  },
  lg: {
    name: 'lg',
    value:
      'min(var(--ds-border-radius-base)*2,var(--ds-border-radius-scale)*5)',
    variable: '--ds-border-radius-lg',
  },
  xl: {
    name: 'xl',
    value:
      'min(var(--ds-border-radius-base)*3,var(--ds-border-radius-scale)*7)',
    variable: '--ds-border-radius-xl',
  },
  default: {
    name: 'default',
    value: 'var(--ds-border-radius-base)',
    variable: '--ds-border-radius-default',
  },
  full: {
    name: 'full',
    value: '624.9375rem',
    variable: '--ds-border-radius-full',
  },
};

const setProperty = (token: string, value: string) => {
  const previewElement = document.getElementById('test');
  if (previewElement) {
    previewElement.style.setProperty(token, value);
  }
};

const VariablePreview = (props: {
  variable: string;
  name: string;
}) => {
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);

  const ref = useRef<HTMLDivElement | null>(null);
  const [radius, setRadius] = useState('');

  useEffect(() => {
    // We need to wait for the new base border radius to be set via `setProperty` before we can read it
    setTimeout(() => {
      if (ref.current) {
        setRadius(window.getComputedStyle(ref?.current).borderRadius);
      }
    }, 10);
  }, [baseBorderRadius]);

  return (
    <div className={classes.item}>
      <ClipboardButton
        ariaLabel={`Kopier CSS variabel for ${props.name} border-radius`}
        text={props.name}
        value={props.variable}
      />
      <Tag
        ref={ref}
        data-color='accent'
        className={classes.itemValue}
        style={{ borderRadius: `var(${props.variable})` }}
      >
        {radius}
      </Tag>
    </div>
  );
};

export const BorderRadius = () => {
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);

  useEffect(() => {
    // we need to set these properties on the preview element because they are immutable on :root
    for (const key in borderRadiuses) {
      const borderRadius = borderRadiuses[key as keyof typeof borderRadiuses];
      setProperty(borderRadius.variable, borderRadius.value);
    }
  }, []);

  useEffect(() => {
    setProperty('--ds-border-radius-base', `${baseBorderRadius / 16}rem`);
  }, [baseBorderRadius]);

  return (
    <div className='panelContainer' id='test'>
      <div className='panelLeft'>
        <Paragraph data-size='sm'>
          Border radius er delt inn i 6 forskjellige tokens som endrer på seg
          når border radius gruppene blir justert i sidebaren.
        </Paragraph>

        <Paragraph data-size='sm'>
          Small, Medium, Large og xLarge er ment å brukes som tokens på ulike
          overflatestørrelser for å beholde proporsjonene når ting blir større
          eller mindre.
        </Paragraph>

        <Paragraph data-size='sm'>
          Full tokenet vil alltid gi runde kanter.
        </Paragraph>
        <div className={classes.itemsContainer}>
          <Heading data-size='2xs'>Tokens</Heading>
          <div className={classes.items}>
            <VariablePreview {...borderRadiuses.default} />
            <VariablePreview {...borderRadiuses.sm} />
            <VariablePreview {...borderRadiuses.md} />
            <VariablePreview {...borderRadiuses.lg} />
            <VariablePreview {...borderRadiuses.xl} />
            <VariablePreview {...borderRadiuses.full} />
          </div>
        </div>
      </div>
      <div className={'panelRight'}>
        <div className={classes.inner}>
          <div className={classes.card}>
            <Heading data-size='2xs'>Logg inn i portalen</Heading>
            <Textfield
              placeholder='Ola Normann'
              label='Navn'
              data-size='sm'
              className={classes.test}
            />
            <Textfield placeholder='********' label='Passord' data-size='sm' />
            <Link href='#' data-size='sm'>
              Glemt passord?
            </Link>

            <Button data-size='sm' className={classes.btn}>
              Logg inn
            </Button>
          </div>
          <div className={classes.card}>
            <img className={classes.img} src='img/city.png' alt='' />
            <div className={classes.imgText}>
              <div className={classes.tags} data-size='sm'>
                <Tag color='brand1'>Sport</Tag>
                <Tag color='brand2'>Nyheter</Tag>
                <Tag color='brand3'>Innenriks</Tag>
              </div>
              <Heading data-size='2xs' className={classes.imgTitle}>
                Reiste alene til storbyen
              </Heading>
              <Paragraph data-size='sm' className={classes.imgDesc}>
                Mona kvist ville finne drømmen i New York City
              </Paragraph>
            </div>
          </div>
          <div className={classes.card} data-size='sm'>
            <SettingsCard />
          </div>
          <div className={classes.card}>
            <Heading data-size='2xs'>Folk du kanskje kjenner</Heading>
            <div className={classes.users}>
              <div className={classes.user}>
                <img
                  src='img/avatars/male2.png'
                  alt=''
                  className={classes.userImg}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Designer</div>
                  <div className={classes.userName}>Ola Normann</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                >
                  Følg
                </Button>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/female2.png'
                  alt=''
                  className={classes.userImg}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Frontend</div>
                  <div className={classes.userName}>Kari Slotsveen</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                >
                  Følg
                </Button>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/male3.png'
                  alt=''
                  className={classes.userImg}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Backend</div>
                  <div className={classes.userName}>Marcus Viken</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                >
                  Følg
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
