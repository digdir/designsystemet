import {
  type ThemeInfo,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import {
  MagnifyingGlassIcon,
  MenuHamburgerIcon,
  MicrophoneIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { ColorScaleNames } from '../utils';
import { CategoryIcon } from './CategoryIcon';
import { FooterIcon } from './FooterIcon';
import classes from './Mobile.module.css';
import { MobileHeader } from './MobileHeader/MobileHeader';

type MobileProps = {
  colorScales: ThemeInfo[][];
};

export const Mobile = ({ colorScales }: MobileProps) => {
  const scheme = generateColorSchemes('#0062BA');
  const scheme2 = generateColorSchemes('#ff0000');
  const scheme3 = generateColorSchemes('#049c04');
  const greyScheme = generateColorSchemes('#000000');

  type ItemProps = {
    colorScheme: ThemeInfo;
    type: 'A' | 'B' | 'C' | 'D';
  };

  type CategoryItemProps = {
    name: string;
    children: React.ReactNode;
    activeColor?: string;
    showShadow?: boolean;
  };

  type PostItemProps = {
    title: string;
    desc: string;
    img: string;
    type: string;
    colorScheme: ThemeInfo;
    showShadow?: boolean;
  };

  const getCategoryBg = (type: string, colorScheme: ThemeInfo) => {
    if (type === 'A' || type === 'B') {
      return colorScheme.light[2].hex;
    }
    return colorScheme.light[3].hex;
  };

  const CategoryItem = ({
    name,
    activeColor,
    showShadow,
    children,
  }: CategoryItemProps) => {
    return (
      <div className={classes.categoryItem}>
        <div
          className={classes.categoryIconContainer}
          style={{
            backgroundColor: activeColor && activeColor,
            boxShadow: showShadow
              ? '0px 2px 8px rgba(0, 0, 0, 0.03)'
              : undefined,
          }}
        >
          {children}
        </div>
        <div className={classes.categoryName}>{name}</div>
      </div>
    );
  };

  const PostItem = ({
    title,
    desc,
    img,
    type,
    showShadow,
    colorScheme,
  }: PostItemProps) => {
    return (
      <div
        className={classes.postsItem}
        style={{
          backgroundColor:
            type === 'A' || type === 'B'
              ? colorScheme.light[2].hex
              : colorScheme.light[3].hex,
          boxShadow: showShadow ? '0px 2px 8px rgba(0, 0, 0, 0.03)' : undefined,
        }}
      >
        <img className={classes.postsImg} src={img} alt='' />
        <div className={classes.postsText}>
          <div className={classes.postsTitle}>{title}</div>
          <div className={classes.postsDesc}>{desc}</div>
        </div>
      </div>
    );
  };

  const Item = ({ colorScheme, type }: ItemProps) => {
    return (
      <div
        className={classes.item}
        style={{
          backgroundColor:
            type === 'A'
              ? greyScheme.light[1].hex
              : type === 'B' || type === 'C'
                ? colorScheme.light[1].hex
                : greyScheme.light[0].hex,
        }}
      >
        <MobileHeader />
        <div className={classes.header}>
          <div className={classes.menu}>
            <MenuHamburgerIcon title='a11y-title' fontSize='1.5rem' />
          </div>
          <div
            className={classes.logo}
            style={{ color: colorScheme.light[9].hex }}
          >
            Gamezone
          </div>
          <img className={classes.avatar} src='img/avatars/male2.png' alt='' />
        </div>
        <div className={classes.search}>
          <div className={classes.heading}>Søk etter spill</div>
          <div className={classes.searchContainer}>
            <input
              className={classes.searchInput}
              type='text'
              placeholder='Søk her...'
            />
            <MagnifyingGlassIcon
              className={classes.searchIcon}
              title='a11y-title'
              fontSize='1.5rem'
            />
            <MicrophoneIcon
              className={classes.searchMic}
              title='a11y-title'
              fontSize='1.5rem'
            />
          </div>
        </div>

        <div className={classes.categories}>
          <div className={classes.headerContainer}>
            <div className={classes.heading}>Kategorier</div>
            <a href='#' className={classes.link}>
              Se alle
            </a>
          </div>

          <div className={classes.categoriesItems}>
            <CategoryItem
              name='Action'
              activeColor={colorScheme.light[3].hex}
              showShadow={type === 'A'}
            >
              <CategoryIcon type='sword' color='#000000' />
            </CategoryItem>
            <CategoryItem
              name='Fantasy'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
            >
              <CategoryIcon type='flask' color='#000000' />
            </CategoryItem>
            <CategoryItem
              name='RPG'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
            >
              <CategoryIcon type='shield' color='#000000' />
            </CategoryItem>
            <CategoryItem
              name='Strategi'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
            >
              <CategoryIcon type='hex' color='#000000' />
            </CategoryItem>
          </div>
        </div>

        <div className={classes.posts}>
          <div className={classes.headerContainer}>
            <div className={classes.heading}>Mest populære spill</div>
            <a href='#' className={classes.link}>
              Se alle
            </a>
          </div>
          <div className={classes.postsItems}>
            <PostItem
              title='Star Wars: Old Empire'
              desc='Become the hero of the galaxy'
              img='img/debug/space-man.png'
              type={type}
              colorScheme={colorScheme}
              showShadow={type === 'A'}
            />
            <PostItem
              title='Dune The Adventure'
              desc='Roam through'
              img='img/debug/space-ship.png'
              type={type}
              colorScheme={colorScheme}
              showShadow={type === 'A'}
            />
          </div>
        </div>

        <div className={classes.footer}>
          <div className={classes.footerItems}>
            <div className={cl(classes.footerItem)}>
              <FooterIcon color={colorScheme.light[11].hex} type='house' />
              <div
                className={classes.footerCircle}
                style={{ backgroundColor: colorScheme.light[11].hex }}
              ></div>
            </div>
            <div className={classes.footerItem}>
              <FooterIcon color={greyScheme.light[9].hex} type='letter' />
            </div>
            <div className={classes.footerItem}>
              <FooterIcon color={greyScheme.light[9].hex} type='heart' />
            </div>
            <div className={classes.footerItem}>
              <FooterIcon color={greyScheme.light[9].hex} type='profile' />
            </div>
          </div>
          <div
            className={classes.footerBar}
            style={{ backgroundColor: greyScheme.light[9].hex }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      {colorScales.map((innerScales, index) => (
        <div key={index}>
          <div className={classes.pageHeading}>{ColorScaleNames[index]}</div>
          <div className={classes.colorRow}>
            {innerScales.map((colorScheme, index2) => (
              <div key={index2}>
                <div className={classes.colorMeta}>
                  <div
                    className={classes.colorMetaColor}
                    style={{ backgroundColor: colorScheme.light[11].hex }}
                  ></div>
                </div>
                <div className={classes.row}>
                  <Item colorScheme={colorScheme} type='A' />
                  <Item colorScheme={colorScheme} type='B' />
                  <Item colorScheme={colorScheme} type='C' />
                  <Item colorScheme={colorScheme} type='D' />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
