import {
  Button,
  Heading,
  Link,
  Paragraph,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';

import cl from 'clsx/lite';
import { useEffect } from 'react';
import { useThemeStore } from '../../store';
import classes from './BorderRadius.module.css';
import { SettingsCard } from './SettingsCard/SettingsCard';

export const BorderRadius = () => {
  const borderRadius = useThemeStore((state) => state.borderRadius);

  const setToken = (token: string, color: string) => {
    const previewElement = document.getElementById('test');
    if (previewElement) {
      previewElement.style.setProperty(token, color);
    }
  };

  useEffect(() => {
    setToken('--ds-border-radius-md', borderRadiusMap[borderRadius][1]);
  }, [borderRadius]);

  const borderRadiusMap = {
    none: ['0px', '0px', '0px', '0px', '0px', '999px'],
    small: ['2px', '4px', '8px', '12px', '4px', '999px'],
    medium: ['2px', '8px', '12px', '16px', '8px', '999px'],
    large: ['2px', '8px', '16px', '20px', '12px', '999px'],
    full: ['2px', '8px', '16px', '24px', '999px', '999px'],
  };

  const items = [
    {
      name: 'sm',
      value: '2px',
    },
    {
      name: 'md',
      value: '4px',
    },
    {
      name: 'lg',
      value: '8px',
    },
    {
      name: 'xl',
      value: '16px',
    },
    {
      name: 'default',
      value: '4px',
    },
    {
      name: 'full',
      value: '999px',
    },
  ];

  return (
    <div className='panelContainer'>
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
            {items.map((item, index) => (
              <div key={index} className={classes.item}>
                <div className={classes.itemName}>{item.name}:</div>
                <div className={classes.itemValue}>
                  {borderRadiusMap[borderRadius][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cl('panelRight', classes.outer)} id='test'>
        <div
          className={classes.inner}
          style={{ borderRadius: borderRadiusMap[borderRadius][2] }}
        >
          <div
            className={classes.card}
            style={{ borderRadius: borderRadiusMap[borderRadius][2] }}
          >
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

            <Button
              style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
              data-size='sm'
              className={classes.btn}
            >
              Logg inn
            </Button>
          </div>
          <div
            className={classes.card}
            style={{ borderRadius: borderRadiusMap[borderRadius][2] }}
          >
            <img
              className={classes.img}
              src='img/city.png'
              alt=''
              style={{ borderRadius: borderRadiusMap[borderRadius][1] }}
            />
            <div className={classes.imgText}>
              <div className={classes.tags} data-size='sm'>
                <Tag
                  style={{ borderRadius: borderRadiusMap[borderRadius][0] }}
                  color='brand1'
                >
                  Sport
                </Tag>
                <Tag
                  style={{ borderRadius: borderRadiusMap[borderRadius][0] }}
                  color='brand2'
                >
                  Nyheter
                </Tag>
                <Tag
                  style={{ borderRadius: borderRadiusMap[borderRadius][0] }}
                  color='brand3'
                >
                  Innenriks
                </Tag>
              </div>
              <Heading data-size='2xs' className={classes.imgTitle}>
                Reiste alene til storbyen
              </Heading>
              <Paragraph data-size='sm' className={classes.imgDesc}>
                Mona kvist ville finne drømmen i New York City
              </Paragraph>
            </div>
          </div>
          <div
            className={classes.card}
            data-size='sm'
            style={{ borderRadius: borderRadiusMap[borderRadius][2] }}
          >
            <SettingsCard />
          </div>
          <div
            className={classes.card}
            style={{ borderRadius: borderRadiusMap[borderRadius][2] }}
          >
            <Heading data-size='2xs'>Folk du kanskje kjenner</Heading>
            <div className={classes.users}>
              <div className={classes.user}>
                <img
                  src='img/avatars/male2.png'
                  alt=''
                  className={classes.userImg}
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Designer</div>
                  <div className={classes.userName}>Ola Normann</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
                >
                  Følg
                </Button>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/female2.png'
                  alt=''
                  className={classes.userImg}
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Frontend</div>
                  <div className={classes.userName}>Kari Slotsveen</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
                >
                  Følg
                </Button>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/male3.png'
                  alt=''
                  className={classes.userImg}
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
                />
                <div className={classes.userText}>
                  <div className={classes.userRole}>Backend</div>
                  <div className={classes.userName}>Marcus Viken</div>
                </div>
                <Button
                  className={classes.userBtn}
                  data-size='sm'
                  variant='secondary'
                  style={{ borderRadius: borderRadiusMap[borderRadius][4] }}
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
