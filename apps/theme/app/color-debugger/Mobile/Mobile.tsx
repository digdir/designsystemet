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
import { useState } from 'react';
import { ColorFilter } from '../ColorFilter/ColorFilter';
import { useDebugStore } from '../debugStore';
import { ColorIndexes, ColorScaleNames } from '../utils';
import { CategoryIcon } from './CategoryIcon';
import { FooterIcon } from './FooterIcon';
import classes from './Mobile.module.css';
import { MobileHeader } from './MobileHeader/MobileHeader';

type MobileProps = {
  colorScales: ThemeInfo[][];
};

export const Mobile = ({ colorScales }: MobileProps) => {
  const greyScheme = generateColorSchemes('#000000');
  const [activeColor, setActiveColor] = useState('Red');
  const themeSettings = useDebugStore((state) => state.themeSettings);

  type ItemProps = {
    colorScheme: ThemeInfo;
    type: 'A' | 'B' | 'C' | 'D';
  };

  type CategoryItemProps = {
    name: string;
    children: React.ReactNode;
    activeColor?: string;
    showShadow?: boolean;
    scale: ThemeInfo;
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
      if (type === 'A') {
        return greyScheme[themeSettings.general.colorScheme][2].hex;
      }
      return colorScheme[themeSettings.general.colorScheme][2].hex;
    }
    return colorScheme[themeSettings.general.colorScheme][3].hex;
  };

  const CategoryItem = ({
    name,
    activeColor,
    showShadow,
    children,
    scale,
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
        <div
          className={classes.categoryName}
          style={{
            color:
              scale[themeSettings.general.colorScheme][ColorIndexes.textDefault]
                .hex,
          }}
        >
          {name}
        </div>
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
              ? type === 'A'
                ? greyScheme[themeSettings.general.colorScheme][2].hex
                : colorScheme[themeSettings.general.colorScheme][2].hex
              : colorScheme[themeSettings.general.colorScheme][3].hex,
          boxShadow: showShadow ? '0px 2px 8px rgba(0, 0, 0, 0.03)' : undefined,
        }}
      >
        <img className={classes.postsImg} src={img} alt='' />
        <div className={classes.postsText}>
          <div
            className={classes.postsTitle}
            style={{
              color:
                type === 'A'
                  ? greyScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex
                  : colorScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex,
            }}
          >
            {title}
          </div>
          <div
            className={classes.postsDesc}
            style={{
              color:
                type === 'A'
                  ? greyScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textSubtle
                    ].hex
                  : colorScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textSubtle
                    ].hex,
            }}
          >
            {desc}
          </div>
        </div>
      </div>
    );
  };

  type HeadingProps = {
    name: string;
    scale: ThemeInfo;
  };

  const Heading = ({ scale, name }: HeadingProps) => {
    return (
      <div
        className={classes.heading}
        style={{
          color:
            scale[themeSettings.general.colorScheme][ColorIndexes.textDefault]
              .hex,
        }}
      >
        {name}
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
              ? greyScheme[themeSettings.general.colorScheme][1].hex
              : type === 'B' || type === 'C'
                ? colorScheme[themeSettings.general.colorScheme][1].hex
                : greyScheme[themeSettings.general.colorScheme][0].hex,
        }}
      >
        <MobileHeader scale={type === 'A' ? greyScheme : colorScheme} />
        <div className={classes.header}>
          <div className={classes.menu}>
            <MenuHamburgerIcon
              title='a11y-title'
              fontSize='1.5rem'
              color={
                type === 'A'
                  ? greyScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex
                  : colorScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex
              }
            />
          </div>
          <div
            className={classes.logo}
            style={{
              color:
                colorScheme[themeSettings.general.colorScheme][
                  ColorIndexes.textSubtle
                ].hex,
            }}
          >
            Gamezone
          </div>
          <img className={classes.avatar} src='img/avatars/male2.png' alt='' />
        </div>
        <div className={classes.search}>
          <Heading
            name='Søk etter spill'
            scale={type === 'A' ? greyScheme : colorScheme}
          />
          <div className={classes.searchContainer}>
            <input
              className={classes.searchInput}
              type='text'
              placeholder='Søk her...'
              value='Søk her...'
              style={{
                backgroundColor:
                  type === 'A'
                    ? greyScheme[themeSettings.general.colorScheme][2].hex
                    : colorScheme[themeSettings.general.colorScheme][2].hex,
                color:
                  type === 'A'
                    ? greyScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textSubtle
                      ].hex
                    : colorScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textSubtle
                      ].hex,
                border:
                  type === 'A'
                    ? '1px solid' +
                      greyScheme[themeSettings.general.colorScheme][
                        ColorIndexes.borderDefault
                      ].hex
                    : '1px solid' +
                      colorScheme[themeSettings.general.colorScheme][
                        ColorIndexes.borderStrong
                      ].hex,
              }}
            />
            <MagnifyingGlassIcon
              className={classes.searchIcon}
              title='a11y-title'
              fontSize='1.5rem'
              color={
                type === 'A'
                  ? greyScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex
                  : colorScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textDefault
                    ].hex
              }
            />
            <MicrophoneIcon
              className={classes.searchMic}
              title='a11y-title'
              fontSize='1.5rem'
              color={
                type === 'A'
                  ? greyScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textSubtle
                    ].hex
                  : colorScheme[themeSettings.general.colorScheme][
                      ColorIndexes.textSubtle
                    ].hex
              }
            />
          </div>
        </div>

        <div className={classes.categories}>
          <div className={classes.headerContainer}>
            <Heading
              name='Kategorier'
              scale={type === 'A' ? greyScheme : colorScheme}
            />
            <a href='#' className={classes.link}>
              Se alle
            </a>
          </div>

          <div className={classes.categoriesItems}>
            <CategoryItem
              name='Action'
              activeColor={
                colorScheme[themeSettings.general.colorScheme][4].hex
              }
              showShadow={type === 'A'}
              scale={type === 'A' ? greyScheme : colorScheme}
            >
              <CategoryIcon
                type='sword'
                color={
                  colorScheme[themeSettings.general.colorScheme][
                    ColorIndexes.textDefault
                  ].hex
                }
              />
            </CategoryItem>
            <CategoryItem
              name='Fantasy'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
              scale={type === 'A' ? greyScheme : colorScheme}
            >
              <CategoryIcon
                type='flask'
                color={
                  type === 'A'
                    ? greyScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                    : colorScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                }
              />
            </CategoryItem>
            <CategoryItem
              name='RPG'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
              scale={type === 'A' ? greyScheme : colorScheme}
            >
              <CategoryIcon
                type='shield'
                color={
                  type === 'A'
                    ? greyScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                    : colorScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                }
              />
            </CategoryItem>
            <CategoryItem
              name='Strategi'
              showShadow={type === 'A'}
              activeColor={getCategoryBg(type, colorScheme)}
              scale={type === 'A' ? greyScheme : colorScheme}
            >
              <CategoryIcon
                type='hex'
                color={
                  type === 'A'
                    ? greyScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                    : colorScheme[themeSettings.general.colorScheme][
                        ColorIndexes.textDefault
                      ].hex
                }
              />
            </CategoryItem>
          </div>
        </div>

        <div className={classes.posts}>
          <div className={classes.headerContainer}>
            <Heading
              name='Mest populære spill'
              scale={type === 'A' ? greyScheme : colorScheme}
            />
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

        <div
          className={classes.footer}
          style={{
            backgroundColor:
              type === 'B' || type === 'C'
                ? colorScheme[themeSettings.general.colorScheme][2].hex
                : greyScheme[themeSettings.general.colorScheme][2].hex,
          }}
        >
          <div className={classes.footerItems}>
            <div className={cl(classes.footerItem)}>
              <FooterIcon
                color={colorScheme[themeSettings.general.colorScheme][11].hex}
                type='house'
              />
              <div
                className={classes.footerCircle}
                style={{
                  backgroundColor:
                    colorScheme[themeSettings.general.colorScheme][11].hex,
                }}
              ></div>
            </div>
            <div className={classes.footerItem}>
              <FooterIcon
                color={greyScheme[themeSettings.general.colorScheme][9].hex}
                type='letter'
              />
            </div>
            <div className={classes.footerItem}>
              <FooterIcon
                color={greyScheme[themeSettings.general.colorScheme][9].hex}
                type='heart'
              />
            </div>
            <div className={classes.footerItem}>
              <FooterIcon
                color={greyScheme[themeSettings.general.colorScheme][9].hex}
                type='profile'
              />
            </div>
          </div>
          <div
            className={classes.footerBar}
            style={{
              backgroundColor:
                greyScheme[themeSettings.general.colorScheme][9].hex,
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.pageHeading}>App design</div>
      <ColorFilter onFilterChange={(e) => setActiveColor(e)} />
      {colorScales.map((innerScales, index) => (
        <div key={index}>
          {(ColorScaleNames[index] === activeColor ||
            activeColor === 'Alle') && (
            <>
              <div className={classes.title}>{ColorScaleNames[index]}</div>
              <div className={classes.colorRow}>
                {innerScales.map((colorScheme, index2) => (
                  <div key={index2}>
                    <div className={classes.colorMeta}>
                      <div
                        className={classes.colorMetaColor}
                        style={{
                          backgroundColor: colorScheme.light[11].hex,
                        }}
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};
