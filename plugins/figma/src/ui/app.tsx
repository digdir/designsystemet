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
import AddTheme from './pages/AddTheme/AddTheme';
import Colors from './pages/Colors/Colors';
import Font from './pages/Font/Font';
import Fonts from './pages/Fonts/Fonts';
import { Github } from './pages/Github/Github';
import PageTwo from './pages/PageTwo/PageTwo';
import Theme from './pages/Theme/Theme';
import Themes from './pages/Themes/Themes';
import PageThree from './pages/pageThree/PageThree';
import { commitToGithub } from './utils/github';

function App() {
  const setThemes = useThemeStore((state) => state.setThemes);
  const navigate = useNavigate();
  const setLoading = useThemeStore((state) => state.setLoading);
  const setFonts = useThemeStore((state) => state.setFonts);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getThemes' } }, '*');
    parent.postMessage({ pluginMessage: { type: 'getFonts' } }, '*');
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
      if (event.data.pluginMessage.type === 'getThemes') {
        setThemes(event.data.pluginMessage.themes);
      } else if (event.data.pluginMessage.type === 'geThemesAndRedirect') {
        navigate('/');
        parent.postMessage({ pluginMessage: { type: 'getThemes' } }, '*');
      } else if (event.data.pluginMessage.type === 'getFonts') {
        setFonts(event.data.pluginMessage.fonts);
      } else if (event.data.pluginMessage.type === 'generateJson') {
        commitToGithub(event.data.pluginMessage.json)
          .then(() => {
            console.log('finish');
          })
          .catch((e) => {
            console.log(e);
          });
      }
      console.log('finish');
      setLoading(false);
    };
  }, []);

  return (
    <div data-ds-color-mode='dark'>
      <div className='links'>
        <NavLink
          className={({ isActive }) => (isActive ? 'link active' : 'link')}
          to='/themes'
        >
          Mine temaer
        </NavLink>
        {/* <NavLink className='link' to='/settings'>
          Innstillinger
        </NavLink> */}
      </div>

      <div className='content'>
        <Routes>
          <Route path='/' element={<Navigate to='/themes' replace />} />

          <Route path='/fonts' element={<PageTwo />} />
          <Route path='/settings' element={<PageThree />} />
          <Route path='/themes' element={<Themes />} />

          <Route path='/themes/:themeId/colors' element={<Colors />} />
          <Route path='/themes/:themeId/fonts' element={<Fonts />} />
          <Route path='/themes/:themeId/fonts/fontId' element={<Font />} />
          <Route path='/themes/:themeId' element={<Theme />} />
          <Route path='/theme/add' element={<AddTheme />} />
          <Route path='/github' element={<Github />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
