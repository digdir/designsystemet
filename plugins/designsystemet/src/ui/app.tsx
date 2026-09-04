import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import {
  Alert,
  Button,
  Field,
  Heading,
  Label,
  Spinner,
  Textarea,
} from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type { FigmaMessages, Notification, UiState } from '../types';
import './app.css';
import type { CreateConfigSchema } from '@digdir/designsystemet/schemas/internal/schema.js';
import { PreviewView } from './preview-view';

const initialState: UiState = {
  config: null,
  // Pascal case to match the Figma variable modes ('Light'/'Dark').
  selectedScheme: 'Light',
  selectedTheme: null,
  isImporting: false,
  notification: null,
};

type Action =
  | {
      type: 'set-preview';
      config: CreateConfigSchema;
      scheme: string;
      notification: Notification | null;
    }
  | { type: 'clear-preview' }
  | { type: 'export-started' }
  | { type: 'export-finished'; notification: Notification }
  | { type: 'set-notification'; notification: Notification | null }
  | { type: 'select-theme'; theme: string }
  | { type: 'select-scheme'; scheme: string };

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'set-preview':
      return {
        ...state,
        config: action.config,
        selectedTheme: Object.keys(action.config.themes)[0] ?? null,
        selectedScheme: action.scheme,
        notification: action.notification,
      };
    case 'clear-preview':
      return { ...state, config: null, notification: null };
    case 'export-started':
      return { ...state, isImporting: true, notification: null };
    case 'export-finished':
      return {
        ...state,
        isImporting: false,
        notification: action.notification,
      };
    case 'set-notification':
      return { ...state, notification: action.notification };
    case 'select-theme':
      return { ...state, selectedTheme: action.theme };
    case 'select-scheme':
      return { ...state, selectedScheme: action.scheme };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const view = state.config ? 'preview' : 'paste';

  const [value, setValue] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage as FigmaMessages;
      switch (msg.type) {
        case 'preview-tokens-from-config': {
          switch (msg.status) {
            case 'success':
              if (!msg.preview) {
                return;
              }
              dispatch({
                type: 'set-preview',
                config: msg.preview.config,
                scheme: 'Light',
                notification:
                  msg.preview.warnings.length > 0
                    ? {
                        kind: 'warning',
                        text: 'The tokens were generated with warnings.',
                        details: msg.preview.warnings,
                      }
                    : null,
              });
              break;
            case 'error':
              dispatch({
                type: 'set-notification',
                notification: { kind: 'error', text: msg.message },
              });
              break;
          }
          break;
        }
        case 'export-tokens-to-figma': {
          switch (msg.status) {
            case 'exporting':
              dispatch({ type: 'export-started' });
              break;
            case 'success':
              dispatch({
                type: 'export-finished',
                notification: { kind: 'success', text: msg.message },
              });
              break;
            case 'error':
              dispatch({
                type: 'export-finished',
                notification: {
                  kind: 'error',
                  text: msg.message,
                  details: msg.logs,
                },
              });
              break;
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

  const postToPlugin = (
    type: FigmaMessages['type'],
    payload?: Record<string, unknown>,
  ) => {
    parent.postMessage({ pluginMessage: { type, ...payload } }, '*');
  };

  return (
    <div className='app'>
      <header>
        <Heading>Export theme to Figma</Heading>
      </header>

      {state.notification && (
        <Banner
          notification={state.notification}
          onDismiss={() =>
            dispatch({ type: 'set-notification', notification: null })
          }
        />
      )}

      <main>
        {view === 'paste' && (
          <div className='padding-inline'>
            <Field className='padding-block'>
              <Label>Upload config</Label>
              <Field.Description>
                Paste your designsystemet.config.json content below and click
                preview.
              </Field.Description>
              <Textarea
                id='config-textarea'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
          </div>
        )}
        {state.config && (
          <PreviewView
            config={state.config}
            selectedScheme={state.selectedScheme}
            selectedTheme={state.selectedTheme}
            onSelectScheme={(scheme) =>
              dispatch({ type: 'select-scheme', scheme })
            }
            onSelectTheme={(theme) => dispatch({ type: 'select-theme', theme })}
          />
        )}
      </main>
      <footer>
        <div className='footer-left'>
          {view === 'preview' && (
            <Button
              onClick={() => dispatch({ type: 'clear-preview' })}
              variant='tertiary'
            >
              Go back
            </Button>
          )}
        </div>
        <div className='footer-right'>
          {view === 'paste' && (
            <Button
              onClick={() =>
                postToPlugin('import-config-and-create-preview-tokens', {
                  config: value,
                })
              }
            >
              Preview
            </Button>
          )}

          {view === 'preview' && (
            <Button onClick={() => postToPlugin('export-tokens-to-figma')}>
              Export to Figma
            </Button>
          )}
        </div>
      </footer>
      {state.isImporting && (
        <div className='tx-overlay' role='status' aria-live='polite'>
          <div className='tx-overlay-card'>
            <Spinner aria-label='Exporting to Figma…' />
            <span>Exporting to Figma…</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Banner({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}): React.JSX.Element {
  // Notification.kind maps onto Designsystemet severity colors; 'error' is 'danger' there.
  const color = notification.kind === 'error' ? 'danger' : notification.kind;
  return (
    <Alert data-color={color} className='tx-banner'>
      <div className='tx-banner-body'>
        <span>{notification.text}</span>
        {notification.details && notification.details.length > 0 && (
          <ul className='tx-banner-details'>
            {notification.details.slice(0, 8).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
      </div>
      <Button
        variant='tertiary'
        data-size='sm'
        icon
        onClick={onDismiss}
        aria-label='Dismiss'
      >
        ×
      </Button>
    </Alert>
  );
}

export default App;
