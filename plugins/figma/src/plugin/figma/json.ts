/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { rgbToHex } from '@common/utils';

export const generateJson = async () => {
  const variables = await figma.variables.getLocalVariablesAsync();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeCollection = collections.find(
    (collection) => collection.name === 'Mode',
  );

  const obj2: Record<string, any> = {};

  for (const collection of collections) {
    if (!obj2[collection.name]) {
      obj2[collection.name] = {};
    }
    for (const collectionMode of collection.modes) {
      if (!obj2[collection.name][collectionMode.name]) {
        obj2[collection.name][collectionMode.name] = {};
      }

      for (const variable of variables) {
        if (modeCollection && collection.id === variable.variableCollectionId) {
          const name = variable.name;
          const nameArr = name.split('/');
          let obj: Record<string, any> =
            obj2[collection.name][collectionMode.name]; // Modified line

          for (let i = 0; i < nameArr.length; i++) {
            const key = nameArr[i];
            if (obj[key] === undefined) {
              obj[key] = {};
            }
            if (key === nameArr[nameArr.length - 1]) {
              let value;
              if (
                variable.valuesByMode[collectionMode.modeId].hasOwnProperty(
                  'type',
                ) &&
                variable.valuesByMode[collectionMode.modeId].type ===
                  'VARIABLE_ALIAS'
              ) {
                value =
                  '{' +
                  variables.find(
                    (v) =>
                      v.id === variable.valuesByMode[collectionMode.modeId].id,
                  ).name +
                  '}';
              } else if (variable.resolvedType === 'COLOR') {
                value = rgbToHex({
                  r: variable.valuesByMode[collectionMode.modeId].r,
                  g: variable.valuesByMode[collectionMode.modeId].g,
                  b: variable.valuesByMode[collectionMode.modeId].b,
                });
              } else {
                value = variable.valuesByMode[collectionMode.modeId];
              }
              obj[key] = {
                value: value,
                type: variable.resolvedType.toLocaleLowerCase(),
              };
            }
            obj = obj[key];
          }
        }
      }
    }
  }

  const filesArr = [];
  // loop through first keys of obj2 with Object.entries
  for (const [firstKey, firstValue] of Object.entries(obj2)) {
    const path = firstKey;
    for (const [secondKey, secondValue] of Object.entries(firstValue)) {
      filesArr.push({
        path: 'design-tokens/' + path + `/${secondKey}.json`,
        content: JSON.stringify(secondValue, null, 2),
      });
    }
  }

  return filesArr;
};
