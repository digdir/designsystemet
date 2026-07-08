import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import {
  Button,
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
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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
            setProgress(parseFloat(msgMessage));
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
          value={`{
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
      "borderRadius": 4
    }
  }
}

`}
        />
        <Button onClick={() => handleClick('import-config')}>
          import-config
        </Button>
        <Button onClick={() => handleClick('export-tokens-to-figma')}>
          export-tokens-to-figma
        </Button>
        {message && <Paragraph>{message}</Paragraph>}
        {loading && (
          <>
            <Spinner aria-label='Exporting tokens to Figma' />
            <Paragraph>{`Progress: ${progress.toFixed(2)}%`}</Paragraph>
          </>
        )}
        {logs.length > 0 && (
          <section>
            <Heading>Logs</Heading>
            {logs.map((log, index) => (
              <Paragraph key={index}>{log}</Paragraph>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
