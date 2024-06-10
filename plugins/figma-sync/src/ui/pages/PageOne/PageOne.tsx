/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Heading,
  Paragraph,
  ToggleGroup,
  Textarea,
  Button,
  Link,
} from '@digdir/designsystemet-react';
import React, { useState } from 'react';

import { Toast } from '@ui/components/Toast/Toast';

import type { JsonInput } from '../../../common/types';

function PageOne() {
  const [jsonText, setJsonText] = useState('');
  const [mode, setMode] = useState('light');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className='content'>
      <div className='content'>
        <Heading
          className='heading'
          size='2xs'
        >
          Oppdater fargetema
        </Heading>

        <Paragraph
          size='sm'
          className='paragraph'
        >
          Oppdater{' '}
          <Link
            target='_blank'
            href='https://www.figma.com/community/file/1322138390374166141/designsystemet-core-ui-kit'
          >
            Designsystemet - Core UI Kit
          </Link>{' '}
          community filen med ditt eget fargetema. Gå til{' '}
          <Link
            target='_blank'
            href='https://theme.designsystemet.no/'
          >
            theme.designsystemet.no
          </Link>{' '}
          og lag temaet ditt, velg light- eller dark mode og lim inn JSON koden
          i feltet under.
        </Paragraph>

        <ToggleGroup
          className='modes'
          defaultValue='light'
          name='toggle-group-nuts'
          size='sm'
          onChange={(e) => setMode(e)}
        >
          <ToggleGroup.Item value='light'>Light Mode</ToggleGroup.Item>
          <ToggleGroup.Item value='dark'>Dark Mode</ToggleGroup.Item>
          {/* <ToggleGroup.Item value='contrast'>Contrast</ToggleGroup.Item> */}
        </ToggleGroup>
        <Textarea
          className='textarea'
          cols={40}
          rows={7}
          placeholder='Lim inn JSON her'
          description=''
          error={errorText}
          label='JSON'
          size='sm'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        <Button
          onClick={() => onSubmit()}
          size='sm'
          className='button'
        >
          Oppdater variabler
        </Button>
        {isLoading && <Toast />}
      </div>
    </div>
  );
}

export default PageOne;
