/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
figma.showUI(__html__, { width: 610, height: 515 });

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
  const number = variable.name.split('/')[2];
  if (variable.name.startsWith(`theme/${type}`)) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === number) {
        const rgb = hexToRgb(value['value'] as string);
        variable.setValueForMode(modeId, rgb || { r: 0.2, g: 0.4, b: 0.6 });
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
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'update-variables') {
    const nodes: SceneNode[] = [];
    const obj: object = JSON.parse(msg.text);
    const accent: object = obj['theme']['accent'];
    const neutral: object = obj['theme']['neutral'];
    const brand1: object = obj['theme']['brand1'];
    const brand2: object = obj['theme']['brand2'];
    const brand3: object = obj['theme']['brand3'];

    figma.variables
      .getVariableCollectionByIdAsync('VariableCollectionId:34811:5472')
      .then((collection) => {
        if (collection) {
          figma.variables.getLocalVariablesAsync('COLOR').then((variables) => {
            const modeId: string =
              collection.modes[getModeIndex(msg.mode)].modeId;

            for (let i = 0; i < variables.length; i++) {
              UpdateColor('accent', accent, modeId, variables[i]);
              UpdateColor('neutral', neutral, modeId, variables[i]);
              UpdateColor('brand1', brand1, modeId, variables[i]);
              UpdateColor('brand2', brand2, modeId, variables[i]);
              UpdateColor('brand3', brand3, modeId, variables[i]);
            }
          });
        } else {
          console.error('Variable collection is null.');
        }
      });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
};
