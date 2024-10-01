import { useState } from 'react';

import classes from './PageOne.module.css';

import { ColorPicker } from '@ui/components/ColorPicker/ColorPicker';

import type { JsonInput } from '../../../common/types';

function PageOne() {
  const [jsonText, setJsonText] = useState('');
  const [mode, setMode] = useState('light');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [accent, setAccent] = useState('#0163BA');
  const [neutral, setNeutral] = useState('#1E2B3C');
  const [brand1, setBrand1] = useState('#F45F63');
  const [brand2, setBrand2] = useState('#E5AA20');
  const [brand3, setBrand3] = useState('#1E98F5');

  const isJsonValid = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const isJsonCorrect = (str: string) => {
    try {
      const obj = JSON.parse(str) as JsonInput;
      if (
        obj.theme.accent &&
        obj.theme.neutral &&
        obj.theme.brand1 &&
        obj.theme.brand2 &&
        obj.theme.brand3
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const onSubmit = () => {
    if (isLoading) {
      return;
    }

    if (jsonText === '') {
      setErrorText('Dette feltet er påkrevd.');
      return;
    }

    if (!isJsonValid(jsonText) || !isJsonCorrect(jsonText)) {
      setErrorText('Ugyldig JSON, prøv og kopier og lim inn på nytt.');
      setJsonText('');
      return;
    }

    setIsLoading(true);
    setErrorText('');
    setJsonText('');

    setTimeout(() => {
      parent.postMessage(
        { pluginMessage: { type: 'update-variables', text: jsonText, mode } },
        '*',
      );
    }, 400);

    setTimeout(() => {
      setIsLoading(false);
    }, 7900);
  };
  return (
    <div className={classes.content}>
      <div className={classes.pickers}></div>
    </div>
  );
}

export default PageOne;
