import {
  HouseIcon,
  CogIcon,
  PersonGroupIcon,
  PadlockLockedIcon,
  FileTextIcon,
  NewspaperIcon,
  TokenIcon,
  ArchiveIcon,
  TeddyBearIcon,
} from '@navikt/aksel-icons';
import cn from 'classnames';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';

import classes from './Dashboard.module.css';
import { ColorCard } from './ColorCard/ColorCard';
import { BarChartComponent } from './BarChart/BarChart';
import { AreaChartComponent } from './AreaChart/AreaChart';
import { LineChartComponent } from './LineCart/LineChart';

export const Dashboard = () => {
  return (
    <div className={classes.dashboard}>
      <div className={classes.topBar}></div>
      <div className={classes.sidebar}>
        <div className={classes.logo}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 38 28'
            fill='none'
          >
            <path
              d='M16.5073 24.9867L4.10673 12.4764C1.83572 10.1853 1.84386 6.48947 4.12494 4.20839C6.43846 1.89487 10.1984 1.92425 12.4755 4.27363L18.8333 10.8333L25.4131 4.45922C27.6935 2.25 31.3137 2.24253 33.6032 4.44232C36.0075 6.75232 36.0205 10.5945 33.632 12.9207L21.2004 25.0281C19.8897 26.3045 17.7952 26.286 16.5073 24.9867Z'
              fill='#0C4DC4'
            />
            <path
              d='M25.3494 4.31707L18.8333 10.8332L22.8136 14.8134C25.2231 17.223 29.1252 17.2381 31.5533 14.8473L33.7005 12.7332C36.0627 10.4073 36.0586 6.5965 33.6914 4.27577C31.3699 1.99973 27.6483 2.01816 25.3494 4.31707Z'
              fill='#528FFF'
            />
          </svg>
          Virksomhet
        </div>
        <div className={classes.menu}>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={cn(classes.btn, classes.btnActive)}
          >
            <HouseIcon
              title='a11y-title'
              fontSize='1.5rem'
            />
            Dashboard
          </Button>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={classes.btn}
          >
            <NewspaperIcon
              title='a11y-title'
              fontSize='1.5rem'
            />
            Sider
          </Button>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={classes.btn}
          >
            <FileTextIcon
              title='a11y-title'
              fontSize='1.5rem'
            />
            Artikler
          </Button>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={classes.btn}
          >
            <PersonGroupIcon
              title='a11y-title'
              fontSize='1.7rem'
            />
            Brukere
          </Button>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={classes.btn}
          >
            <PadlockLockedIcon
              title='a11y-title'
              fontSize='1.7rem'
            />
            Tilganger
          </Button>
          <Button
            color='second'
            size='small'
            variant='tertiary'
            className={classes.btn}
          >
            <CogIcon
              title='a11y-title'
              fontSize='1.7rem'
            />
            Innstillinger
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <Heading
          size='xsmall'
          className={classes.title}
        >
          Dashboard
        </Heading>
        <div className={classes.grid}>
          <div className={cn(classes.colorCardsContainer, classes.card)}>
            <Heading
              size='xxsmall'
              className={classes.cardTitle}
            >
              Grafikk one
            </Heading>
            <Paragraph
              size='small'
              className={classes.cardDesc}
            >
              Her er ein stor beskrivelse
            </Paragraph>
            <div className={classes.colorCards}>
              <ColorCard
                brand='one'
                icon={
                  <TeddyBearIcon
                    title='a11y-title'
                    fontSize='1.6rem'
                  />
                }
              />
              <ColorCard
                brand='two'
                icon={
                  <ArchiveIcon
                    title='a11y-title'
                    fontSize='1.6rem'
                  />
                }
              />
              <ColorCard
                brand='three'
                icon={
                  <TokenIcon
                    title='a11y-title'
                    fontSize='1.6rem'
                  />
                }
              />
            </div>
          </div>
          <div className={cn(classes.users, classes.card)}>
            <Heading
              size='xxsmall'
              className={classes.cardTitle}
            >
              Siste brukere
            </Heading>
            <div className={classes.usersContainer}>
              <div className={classes.user}>
                <img
                  src='img/avatars/female1.png'
                  alt=''
                />
                <div className={classes.userTextContainer}>
                  <span className={classes.userRole}>Administrator</span>
                  <span className={classes.userName}>Kari Olsen</span>
                </div>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/male1.png'
                  alt=''
                />
                <div className={classes.userTextContainer}>
                  <span className={cn(classes.userRole, classes.userRoleTwo)}>
                    Subscriber
                  </span>
                  <span className={classes.userName}>Ola Normann</span>
                </div>
              </div>
              <div className={classes.user}>
                <img
                  src='img/avatars/male2.png'
                  alt=''
                />
                <div className={classes.userTextContainer}>
                  <span className={cn(classes.userRole, classes.userRoleThree)}>
                    Editor
                  </span>
                  <span className={classes.userName}>Jens Birkemoen</span>
                </div>
              </div>
            </div>
          </div>
          <div className={cn(classes.graph, classes.card)}>
            <Heading
              size='xxsmall'
              className={classes.cardTitle}
            >
              Vekst de siste 3 årene
            </Heading>
            <BarChartComponent />
          </div>
          <div className={cn(classes.graph2, classes.card)}>
            <Heading
              size='xxsmall'
              className={classes.cardTitle}
            >
              Sideklikk siste 6 mnd
            </Heading>
            <AreaChartComponent />
          </div>
          <div className={cn(classes.graph3, classes.card)}>
            <Heading
              size='xxsmall'
              className={classes.cardTitle}
            >
              Antall innlogginger
            </Heading>
            <LineChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
};
