import { type StoreThemes, useThemeStore } from '@common/store';
import { Messages } from '@common/types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useStartup = () => {
  const setThemes = useThemeStore((state) => state.setThemes);
  const navigate = useNavigate();
  const setLoading = useThemeStore((state) => state.setLoading);
  const setError = useThemeStore((state) => state.setCodeSnippetError);
  const setNoThemesFound = useThemeStore((state) => state.setNoThemesFound);

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: Messages.GetThemes } }, '*');
    const onmessage = (event: {
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
        case Messages.GetThemes:
          if (event.data.pluginMessage.themes.length > 0) {
            setThemes(event.data.pluginMessage.themes);
          } else {
            setNoThemesFound(true);
          }
          break;
        case Messages.GetThemesAndRedirect:
          navigate('/');
          parent.postMessage(
            { pluginMessage: { type: Messages.GetThemes } },
            '*',
          );
          break;
        case Messages.SetValueForModeError:
          setError(
            'En feil har oppstått. Du må ha minimum pro-versjonen av Figma for å kunne generere tema.',
          );
          break;
        case Messages.UpdateVariables:
          setError('');
          break;
      }
      setLoading(false);
    };

    window.addEventListener('message', onmessage);

    return () => {
      window.removeEventListener('message', onmessage);
    };
  }, []);
};
