import { Heading } from '@digdir/designsystemet-react';
import { GradientSpace } from '../../GradientSpace/GradientSpace';
import { useDebugStore } from '../../debugStore';
import classes from './GradientPage.module.css';

export const GradientPage = () => {
  const colorScales = useDebugStore((state) => state.colorScales);

  return (
    <div className={classes.page}>
      <div className={classes.gradients}>
        <Heading>Blue</Heading>
        <div className={classes.group}>
          <GradientSpace themeInfo={colorScales[0][1]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[0][3]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[0][9]} colorScheme='light' />
        </div>
        <Heading>Blue</Heading>
        <div className={classes.group}>
          <GradientSpace themeInfo={colorScales[5][1]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[5][3]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[5][9]} colorScheme='light' />
        </div>

        <Heading>Blue</Heading>
        <div className={classes.group}>
          <GradientSpace themeInfo={colorScales[7][0]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[7][3]} colorScheme='light' />
          <GradientSpace themeInfo={colorScales[7][9]} colorScheme='light' />
        </div>
      </div>
    </div>
  );
};
