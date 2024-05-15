import classes from "./Landing.module.css";
import cn from "classnames";
import { Button, Heading, Ingress } from "@digdir/designsystemet-react";
import { MagnifyingGlassIcon, MenuHamburgerIcon } from "@navikt/aksel-icons";

export const Landing = () => {
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={cn(classes.container)}>
          <div className={classes.headerLeft}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 38 28"
              fill="none"
            >
              <path
                d="M16.5073 24.9867L4.10673 12.4764C1.83572 10.1853 1.84386 6.48947 4.12494 4.20839C6.43846 1.89487 10.1984 1.92425 12.4755 4.27363L18.8333 10.8333L25.4131 4.45922C27.6935 2.25 31.3137 2.24253 33.6032 4.44232C36.0075 6.75232 36.0205 10.5945 33.632 12.9207L21.2004 25.0281C19.8897 26.3045 17.7952 26.286 16.5073 24.9867Z"
                fill="#0C4DC4"
              />
              <path
                d="M25.3494 4.31707L18.8333 10.8332L22.8136 14.8134C25.2231 17.223 29.1252 17.2381 31.5533 14.8473L33.7005 12.7332C36.0627 10.4073 36.0586 6.5965 33.6914 4.27577C31.3699 1.99973 27.6483 2.01816 25.3494 4.31707Z"
                fill="#528FFF"
              />
            </svg>
            Virksomhet
          </div>
          <div className={classes.headerMiddle}>
            <div className={classes.menu}>
              <div className={classes.menuItem}>Temaer</div>
              <div className={classes.menuItem}>Rapporter</div>
              <div className={classes.menuItem}>Nyheter</div>
              <div className={classes.menuItem}>Artikler</div>
              <div className={classes.menuItem}>Kontakt</div>
            </div>
          </div>
          <div className={classes.headerRight}>
            <Button variant="tertiary">
              <MagnifyingGlassIcon title="a11y-title" fontSize="1.6rem" />
              Søk
            </Button>
            <Button variant="tertiary">
              <MenuHamburgerIcon title="a11y-title" fontSize="1.6rem" />
              Meny
            </Button>
          </div>
        </div>
      </div>

      <div className={classes.banner}>
        <div className={classes.container}>
          <div className={classes.bannerLeft}>
            <div className={classes.bannerSub}>Here is a sub heading</div>
            <Heading size="medium" className={classes.bannerTitle}>
              A need explain have out been making it
            </Heading>
            <Ingress size="small" className={classes.bannerIngress}>
              Multitude a hung structure return her belt of fixed had because a
              been ahead well logbook the accept as effort consideration with
              derived indulged of the all and more soon will you there.
            </Ingress>
            <Button>Les mer</Button>
          </div>
          <div className={classes.bannerRight}>
            <div className={classes.bannerBox}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
