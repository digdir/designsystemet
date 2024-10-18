/* eslint-disable react-hooks/exhaustive-deps */
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

import './App.css';
import { useEffect } from 'react';
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import type { StoreThemes } from '../common/store';
import { useThemeStore } from '../common/store';

import { Footer } from './components/Footer/Footer';
import Theme from './pages/Theme/Theme';
import Themes from './pages/Themes/Themes';
import { useDsMode } from './utils/useDsMode';

function App() {
  const dsMode = useDsMode();
  const setThemes = useThemeStore((state) => state.setThemes);
  const navigate = useNavigate();
  const setLoading = useThemeStore((state) => state.setLoading);
  const setError = useThemeStore((state) => state.setCodeSnippetError);
  const setNoThemesFound = useThemeStore((state) => state.setNoThemesFound);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getThemes' } }, '*');
    // biome-ignore lint/suspicious/noGlobalAssign: <explanation>
    onmessage = (event: {
      data: {
        pluginMessage: {
          type: string;
          themes: StoreThemes;
          json: [];
          fonts: [];
        };
      };
    }) => {
      switch (event.data.pluginMessage.type) {
        case 'getThemes':
          if (event.data.pluginMessage.themes.length > 0) {
            setThemes(event.data.pluginMessage.themes);
          } else {
            setNoThemesFound(true);
          }
          break;
        case 'geThemesAndRedirect':
          navigate('/');
          parent.postMessage({ pluginMessage: { type: 'getThemes' } }, '*');
          break;
        case 'setValueForModeError':
          setError(
            'En feil har oppstått. Du må ha minimum pro-versjonen av Figma for å kunne generere tema.',
          );
          break;
        case 'updateVariables':
          setError('');
          break;
      }
      setLoading(false);
    };
  }, []);

  return (
    <div className='page' data-ds-color-mode={dsMode}>
      <div className='links'>
        <NavLink
          className={({ isActive }) => (isActive ? 'link active' : 'link')}
          to='/themes'
        >
          Mine temaer
        </NavLink>
      </div>

      <div className='content'>
        <Routes>
          <Route path='/' element={<Navigate to='/themes' replace />} />
          <Route path='/themes' element={<Themes />} />
          <Route path='/themes/:themeId' element={<Theme />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
