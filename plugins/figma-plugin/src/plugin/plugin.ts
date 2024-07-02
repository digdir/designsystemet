/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

figma.showUI(__html__, { width: 590, height: 575 });

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

function UpdateColor(
  type: string,
  obj: object,
  modeId: string,
  variable: Variable,
) {
  const suffix = variable.name.split('/')[2];
  if (variable.name.startsWith(`theme/${type}`)) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === suffix) {
        const rgb = hexToRgb(value['value'] as string);
        if (rgb) {
          variable.setValueForMode(modeId, rgb);
        }
      }
    }
  }
}

function getModeIndex(mode: string) {
  if (mode === 'light') {
    return 0;
  } else {
    return 1;
  }
}

figma.ui.onmessage = (msg: { type: string; text: string; mode: string }) => {
  if (msg.type === 'update-variables') {
    const obj = JSON.parse(msg.text);
    const accent = obj['theme']['accent'] as object;
    const neutral = obj['theme']['neutral'] as object;
    const brand1 = obj['theme']['brand1'] as object;
    const brand2 = obj['theme']['brand2'] as object;
    const brand3 = obj['theme']['brand3'] as object;

    figma.variables.getLocalVariableCollectionsAsync().then((collections) => {
      for (const collection of collections) {
        if (collection.name === 'Mode') {
          figma.variables.getLocalVariablesAsync('COLOR').then((variables) => {
            const modeId: string =
              collection.modes[getModeIndex(msg.mode)].modeId;

            for (const variable of variables) {
              UpdateColor('accent', accent, modeId, variable);
              UpdateColor('neutral', neutral, modeId, variable);
              UpdateColor('brand1', brand1, modeId, variable);
              UpdateColor('brand2', brand2, modeId, variable);
              UpdateColor('brand3', brand3, modeId, variable);
            }
          });
        }
      }
    });
  }
};
