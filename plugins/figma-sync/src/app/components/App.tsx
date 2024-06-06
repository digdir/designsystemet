/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';
import '../styles/ui.css';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Textarea,
  ToggleGroup,
  Heading,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';

function App() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('light');
  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
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
      <Heading
        className='heading'
        size='xsmall'
      >
        Oppdater fargetema
      </Heading>

      <Paragraph
        size='small'
        className='paragraph'
      >
        Denne pluginen lar deg oppdatere lokale Figma farge-variabler i Core UI
        Kit via designsystemet sin temavelger. Gå inn på{' '}
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
        size='small'
      >
        Oppdater variabler
      </Button>
    </div>
  );
}

export default App;
