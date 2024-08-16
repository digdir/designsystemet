/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { ColorTheme, StoreThemes } from '../common/store';

import {
  addTheme,
  getThemes,
  deleteTheme,
  renameTheme,
  updateTheme,
} from './figma/themes';
import { getVariables } from './figma/getVariables';
import { updateVariables } from './figma/updateVariables';
import { generateJson } from './figma/json';
import { getFonts } from './figma/fonts';

figma.showUI(__html__, { width: 710, height: 550, themeColors: true });

figma.ui.onmessage = (msg: {
  type: string;
  themes?: StoreThemes;
  themeId?: string;
  renameTheme?: {
    newName: string;
    themeModeId: string;
    themeId: string;
  };
  addTheme?: {
    theme: ColorTheme;
    name: string;
  };
  deleteTheme?: {
    themeModeId: string;
    themeId: string;
  };
}) => {
  void (async () => {
    switch (msg.type) {
      case 'updateVariables': {
        if (msg.themes) await updateVariables(msg.themes);
        figma.ui.postMessage({ type: 'tomato' });
        break;
      }

      case 'getThemes': {
        const themes = await getThemes();
        console.log('themes - ', themes);
        figma.ui.postMessage({ type: 'getThemes', themes: themes });
        break;
      }
      case 'getVariables': {
        const variables = await getVariables();
        figma.ui.postMessage({ type: 'getVariables', variables: variables });
        break;
      }

      case 'renameTheme': {
        if (msg.renameTheme) {
          await renameTheme(
            msg.renameTheme.newName,
            msg.renameTheme.themeModeId,
            msg.renameTheme.themeId,
          );
          figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        }
        break;
      }

      case 'addTheme': {
        if (msg.addTheme) await addTheme(msg.addTheme.theme, msg.addTheme.name);
        figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        break;
      }

      case 'deleteTheme': {
        if (msg.deleteTheme)
          await deleteTheme(
            msg.deleteTheme.themeModeId,
            msg.deleteTheme.themeId,
          );
        figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        break;
      }

      case 'updateTheme': {
        await updateTheme();
        break;
      }

      case 'generateJson': {
        const json = await generateJson();
        figma.ui.postMessage({ type: 'generateJson', json: json });
        console.log('ff - ', json);
        break;
      }
      case 'getFonts': {
        const fonts = await getFonts();
        figma.ui.postMessage({ type: 'getFonts', fonts: fonts });
        break;
      }
    }
  })();
};
