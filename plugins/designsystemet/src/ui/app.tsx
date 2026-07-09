import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import {
  Button,
  Details,
  Heading,
  Paragraph,
  Spinner,
  Textarea,
} from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';
import type { FigmaMessages } from '../types';
import './app.css';

function App() {
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(`{
  "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
  "outDir": "./design-tokens",
  "themes": {
    "theme": {
      "colors": {
        "accent": "#ba4000",
        "brand1": "#180d7a",
        "brand2": "#56a03f",
        "neutral": "#24272B"
      },
      "borderRadius": 4,
      "typography": {
        "fontFamily": "IBM Plex Sans"
      }
    },
    "theme2": {
      "colors": {
        "accent": "#0062BA",
        "brand1": "#0D7A5F",
        "brand2": "#5B3FA0",
        "neutral": "#24272B"
      },
      "borderRadius": 4,
      "typography": {
        "fontFamily": "Arial"
      }
    }
  }
}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const trustedOrigins = new Set([window.location.origin, 'null']);
      if (!trustedOrigins.has(event.origin)) {
        return;
      }

      const msg = event.data.pluginMessage as FigmaMessages;
      switch (msg.type) {
        case 'import-config-result': {
          setMessage(msg.message);
          break;
        }
        case 'export-tokens-to-figma-result': {
          const { status, message: msgMessage } = msg;
          if (status === 'exporting') {
            setLoading(true);
            setMessage(msgMessage);
          } else if (status === 'finished') {
            setLoading(false);
            setLogs(msg.logs || []);
            setMessage('Export completed successfully.');
          } else if (status === 'error') {
            setLoading(false);
            setMessage(`Error exporting tokens: ${msgMessage}`);
          }
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleClick = (type: FigmaMessages['type']) => {
    if (textareaRef.current) {
      const config = textareaRef.current.value;
      parent.postMessage({ pluginMessage: { type, config } }, '*');
    }
  };

  return (
    <main>
      <header>
        <Heading>Designsystemet</Heading>
      </header>
      <section>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className='actions'>
          <Button
            disabled={loading}
            onClick={() => handleClick('import-config')}
          >
            import-config
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleClick('export-tokens-to-figma')}
          >
            export-tokens-to-figma
          </Button>
          {message && <Paragraph>{message}</Paragraph>}
          {loading && <Spinner aria-label='Exporting tokens to Figma' />}
        </div>
        <div className='logs'>
          {logs.length > 0 && (
            <Details>
              <Details.Summary>{logs.length} logs</Details.Summary>
              <Details.Content>
                <ul>
                  {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              </Details.Content>
            </Details>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
