import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import {
  Button,
  Heading,
  Paragraph,
  Textarea,
} from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';

import './app.css';

function App() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      switch (msg.type) {
        case 'import-tokens': {
          setMessage(msg.message);
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleClick = () => {
    if (textareaRef.current) {
      const config = textareaRef.current.value;
      parent.postMessage(
        { pluginMessage: { type: 'import-tokens', config } },
        '*',
      );
    }
  };

  return (
    <main>
      <header>
        <Heading>Designsystemet</Heading>
      </header>
      <section>
        <Textarea ref={textareaRef} />
        <Button onClick={handleClick}>hot refresh me</Button>
        {message && <Paragraph>{message}</Paragraph>}
      </section>
    </main>
  );
}

export default App;
