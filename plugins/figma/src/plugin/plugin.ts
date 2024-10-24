import { Messages } from '@common/types';
import type { ColorTheme, StoreThemes } from '../common/store';

import { getVariables } from './figma/getVariables';
import { getThemes } from './figma/themes';
import { updateVariables } from './figma/updateVariables';

figma.showUI(__html__, { width: 710, height: 550, themeColors: true });

figma.ui.onmessage = (msg: {
  type: Messages;
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
      case Messages.UpdateVariables: {
        if (msg.themes) await updateVariables(msg.themes);
        break;
      }

      case Messages.GetThemes: {
        const themes = await getThemes();
        figma.ui.postMessage({ type: Messages.GetThemes, themes: themes });
        break;
      }
      case Messages.GetVariables: {
        const variables = await getVariables();
        figma.ui.postMessage({
          type: Messages.GetVariables,
          variables: variables,
        });
        break;
      }

      /* case 'renameTheme': {
        if (msg.renameTheme) {
          await renameTheme(
            msg.renameTheme.newName,
            msg.renameTheme.themeModeId,
            msg.renameTheme.themeId,
          );
          figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        }
        break;
      } */

      /* case 'addTheme': {
        if (msg.addTheme) await addTheme(msg.addTheme.theme, msg.addTheme.name);
        figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        break;
      } */

      /* case 'deleteTheme': {
        if (msg.deleteTheme)
          await deleteTheme(
            msg.deleteTheme.themeModeId,
            msg.deleteTheme.themeId,
          );
        figma.ui.postMessage({ type: 'geThemesAndRedirect' });
        break;
      } */

      /* case 'updateTheme': {
        await updateTheme();
        break;
      } */

      /* case 'generateJson': {
        const json = await generateJson();
        figma.ui.postMessage({ type: 'generateJson', json: json });
        console.log('ff - ', json);
        break;
      } */

      /* case 'getFonts': {
        const fonts = await getFonts();
        figma.ui.postMessage({ type: 'getFonts', fonts: fonts });
        break;
      } */
    }
  })();
};
