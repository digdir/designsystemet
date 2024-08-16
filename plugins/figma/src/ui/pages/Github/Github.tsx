import { Button, Textfield } from '@digdir/designsystemet-react';

import { useThemeStore } from '../../../common/store';

import classes from './Github.module.css';

export const Github = () => {
  const setLoading = useThemeStore((state) => state.setLoading);

  const handleClick = () => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: 'generateJson' } }, '*');
  };

  return (
    <div className={classes.content}>
      <h1 className='pageTitle'>Push til Github</h1>
      <Textfield
        label='Github repo'
        size='sm'
        className='textfield'
        prefix='github.com/'
        value='Thuneer/design-tokens'
      />

      <Textfield label='Branch' size='sm' value='main' className='textfield' />
      <Textfield
        label='PAT'
        size='sm'
        className='textfield'
        type='password'
        value='token'
      />
      <Button
        onClick={() => {
          handleClick();
        }}
        className='btn'
      >
        Push til Github
      </Button>
    </div>
  );
};
