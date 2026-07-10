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
import { useEffect, useReducer, useRef, useState } from 'react';
import type { FigmaMessages, Notification, UiState } from '../types';
import './app.css';
import type { PreviewData } from '../plugin/token-export/types';
import { PreviewView } from './preview-data';

type View = 'paste' | 'preview';

const initialState: UiState = {
  previewData: null,
  selectedTheme: null,
  selectedScheme: null,
  isImporting: false,
  notification: null,
};

type Action =
  | {
      type: 'set-preview';
      previewData: PreviewData;
      theme: string | null;
      scheme: string | null;
      notification: Notification | null;
    }
  | { type: 'clear-preview' }
  | { type: 'set-importing'; value: boolean }
  | { type: 'set-notification'; notification: Notification | null }
  | { type: 'select-theme'; theme: string }
  | { type: 'select-scheme'; scheme: string };

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'set-preview':
      return {
        ...state,
        previewData: action.previewData,
        selectedTheme: action.theme,
        selectedScheme: action.scheme,
        notification: action.notification,
      };
    case 'clear-preview':
      return { ...state, previewData: null, notification: null };

    case 'set-importing':
      return {
        ...state,
        isImporting: action.value,
        notification: action.value ? null : state.notification,
      };
    case 'set-notification':
      return { ...state, notification: action.notification };
    case 'select-theme':
      return { ...state, selectedTheme: action.theme };
    case 'select-scheme':
      return { ...state, selectedScheme: action.scheme };

    default:
      return state;
  }
}

function computeView(state: UiState): View {
  if (state.previewData) {
    return 'preview';
  }
  return 'paste';
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const view = computeView(state);

  const [value, setValue] = useState(``);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                previewData: msg.preview?.previewData,
                theme: msg.preview?.themeNames[0] || null,
                scheme: 'light',
                notification: null,
              });
              break;
            case 'error':
              dispatch({
                type: 'set-notification',
                notification: {
                  kind: 'error',
                  text: msg.message,
                },
              });
              break;
          }
          break;
        }
        case 'export-tokens-to-figma': {
          const { status, message: msgMessage } = msg;
          if (status === 'exporting') {
            dispatch({
              type: 'set-importing',
              value: true,
            });
          } else if (status === 'success') {
            dispatch({
              type: 'set-importing',
              value: false,
            });
            dispatch({
              type: 'set-notification',
              notification: {
                kind: 'success',
                text: msgMessage,
              },
            });
          } else if (status === 'error') {
            dispatch({
              type: 'set-notification',
              notification: {
                kind: 'error',
                text: msgMessage,
                details: msg.logs,
              },
            });
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

  const sendMessageOnClick = (
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
                Upload for preview.
              </Field.Description>
              <Textarea
                id='config-textarea'
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
          </div>
        )}
        {view === 'preview' && state.previewData && (
          <PreviewView
            preview={state.previewData}
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
              data-variant='tertiary'
            >
              Go back
            </Button>
          )}
        </div>
        <div className='footer-right'>
          {view === 'paste' && (
            <Button
              onClick={() =>
                sendMessageOnClick('import-config-and-create-preview-tokens', {
                  config: textareaRef.current?.value,
                })
              }
            >
              Upload
            </Button>
          )}

          {view === 'preview' && (
            <Button
              onClick={() => sendMessageOnClick('export-tokens-to-figma')}
            >
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
