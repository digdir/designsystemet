/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Heading,
  Paragraph,
  ToggleGroup,
  Textarea,
  Button,
  Link,
} from '@digdir/designsystemet-react';
import React, { useEffect, useState } from 'react';

function PageOne() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('light');
  useEffect(() => {
    window.onmessage = (event: {
      data: { pluginMessage: { type: string; message: string } };
    }) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  const onCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: 'update-variables', text, mode } },
      '*',
    );
    setText('');
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
          Oppdatere Figma variabler i Core UI Kit via designsystemet sin
          temavelger. Gå inn på{' '}
          <Link
            target='_blank'
            href='https://theme.designsystemet.no/'
          >
            theme.designsystemet.no
          </Link>{' '}
          og lag temaet ditt, så lim inn JSON i feltet under.
        </Paragraph>

        <ToggleGroup
          className='modes'
          defaultValue='light'
          name='toggle-group-nuts'
          size='sm'
          onChange={(e) => setMode(e)}
        >
          <ToggleGroup.Item value='light'>Light</ToggleGroup.Item>
          <ToggleGroup.Item value='dark'>Dark</ToggleGroup.Item>
          <ToggleGroup.Item value='contrast'>Contrast</ToggleGroup.Item>
        </ToggleGroup>
        <Textarea
          className='textarea'
          cols={40}
          rows={7}
          placeholder='Lim inn JSON her...'
          description=''
          error=''
          label='JSON'
          size='sm'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => onCreate()}
          size='sm'
        >
          Oppdater variabler
        </Button>
      </div>
    </div>
  );
}

export default PageOne;
