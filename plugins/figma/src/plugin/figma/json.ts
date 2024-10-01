import { rgbToHex } from '@common/utils';

export const generateJson = async () => {
  const variables = await figma.variables.getLocalVariablesAsync();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeCollection = collections.find(
    (collection) => collection.name === 'Mode',
  );

  type VariableValue = string | { r: number; g: number; b: number };
  type VariableObject = {
    [key: string]:
      | VariableObject
      | { value?: VariableValue; type?: string }
      | undefined;
  };
  const obj2: Record<string, VariableObject> = {};

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
          let obj: VariableObject =
            obj2[collection.name][collectionMode.name] || {}; // Modified line

          for (let i = 0; i < nameArr.length; i++) {
            const key = nameArr[i];
            if (obj[key] === undefined) {
              obj[key] = {};
            }
            if (key === nameArr[nameArr.length - 1]) {
              let value:
                | string
                | { r: number; g: number; b: number }
                | undefined;
              const modeValue = variable.valuesByMode[
                collectionMode.modeId
              ] as { type?: string; id?: string };
              if (modeValue.type === 'VARIABLE_ALIAS') {
                const foundVariable = variables.find(
                  (v) =>
                    v.id ===
                    (
                      variable.valuesByMode[collectionMode.modeId] as {
                        id: string;
                      }
                    ).id,
                );
                value =
                  '{' +
                  (foundVariable ? foundVariable.name : 'undefined') +
                  '}';
              } else if (variable.resolvedType === 'COLOR') {
                const colorValue = variable.valuesByMode[
                  collectionMode.modeId
                ] as { r: number; g: number; b: number };
                value = rgbToHex({
                  r: colorValue.r,
                  g: colorValue.g,
                  b: colorValue.b,
                });
              } else {
                value = String(variable.valuesByMode[collectionMode.modeId]);
              }
              obj[key] = {
                value: value,
                type: variable.resolvedType.toLocaleLowerCase(),
              };
            }
            obj = obj[key] as VariableObject;
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
