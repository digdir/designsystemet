import crypto from 'node:crypto';

import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';

import type { ColorScheme } from '../../colors/types.js';
import type { Colors } from '../types.js';

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

const createHash = (text: string) => crypto.hash('sha1', text);

type ColorSchemes = Array<ColorScheme>;

type ThemeObject_ = ThemeObject & {
  $figmaCollectionId?: string;
  $figmaModeId?: string;
  $figmaVariableReferences?: Record<string, string>;
};

export function generateThemesJson(colorSchemes: ColorSchemes, themes: string[], colors: Colors): ThemeObject_[] {
  return [
    ...generateSizeGroup(),
    ...generateThemesGroup(themes),
    ...generateTypographyGroup(themes),
    ...generateColorSchemesGroup(colorSchemes, themes),
    generateSemanticGroup(),
    ...generateColorGroup('main', colors),
    ...generateColorGroup('support', colors),
  ];
}

function generateSizeGroup(): ThemeObject_[] {
  return [
    {
      id: 'fb11567729c298ca37c9da4e3a27716a23480824',
      name: 'small',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/small': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/small': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:42212:29109',
      $figmaModeId: '42212:0',
      $figmaVariableReferences: {
        'font-size.1': '0918a6e18af0d0626e986d0d974c3710c9543307',
        'font-size.2': 'd83453adb39699bc5dac07323a8521c42298658c',
        'font-size.3': '99a88b4e9d69ba35a19ae733ed990af16f029905',
        'font-size.4': 'f6b8732ee2a4ca17753f85d8da8c23a26d0bb8fa',
        'font-size.5': '1fd182f82f9efc97b48f22b71ec8870fc1566a18',
        'font-size.6': 'd28187087fe109a7f5d495114aebe1751cfd0845',
        'font-size.7': 'b190a03d589d92020807dbf745d13571ad71a4bb',
        'font-size.8': 'babc299be5efc9c8e66afbd72142be00e6afbceb',
        'font-size.9': 'd9aae308744b6d063bcaa7c954f850ff8eba01be',
        'font-size.10': '02307bf39cbc6a4c4c4f39a98c534e9cc3bd471b',
        'font-size.11': '31c417a84ce9f7e16f76a9f1f9e0c5d445793ae6',
        'size.0': '049b87c9edfef73597e88c8433dfb70e9dc4f8cb',
        'size.1': '6e4139d5cb0282165c92e441bb565562dc9afa1d',
        'size.2': 'd786893051954a518025ea8817dde0c0713ebd8d',
        'size.3': 'cba1a001249a81cbd052ea5732bb84c4fa2f9dd9',
        'size.4': 'bcb8061aa8c70013a486c5c1bceeac04ce2678c1',
        'size.5': '405596765ee5bbb371a9479e527b49ba43580d19',
        'size.6': 'e588d32982145a109bbd86da57ebae6a149f91eb',
        'size.7': '1ea2aa22663dc27dfe70c10744480c9eec930269',
        'size.8': 'c1cca6be5007a623b4fe731524847b4f040eee9e',
        'size.9': '7a01b7eba8fe698062080a2aa7c6f203e05a5e7c',
        'size.10': '3e2e0e198db8e89a7d716bbee4dc887934dff5ed',
        'size.11': '050087517351340be3a7f65b249a9ae8d01d6286',
        'size.12': '47204f9bb7937097f4b6388c4a5addbe913318a4',
        'size.13': 'e2ffb69847997d9b93bea8b47d22e6337adf65ce',
        'size.14': 'f910478b6a4e6d247cb265b1e9468031d5fe183b',
        'size.15': '8ddb06202f770e4a2c1cf9d74789c21447b92240',
        'size.18': '1244373e39adca00c6e5d2dafe4e54ffcdf78e35',
        'size.22': '4e33c13746c0edf17066d8b3c34551730019e36b',
        'size.26': 'a5a5b3ef4f857e46d19e581eaf14fcb0f105a70a',
        'size.30': '88af5667364d808a1d4ae656ea6f82ef64073a75',
        'size._mode-font-size': '40350aed54e6bc94c3460bf6f94141b6f4b9adc1',
        'size._base': 'b20d311a4235705c45973df78540c01cb0f4b490',
        'size._step': 'f8db745fb109a80fb926cf08c9e3a019ab026823',
      },
      group: 'Size',
    },
    {
      id: '8b2c8cc86611a34b135cb22948666779361fd729',
      name: 'medium',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/medium': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/medium': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:42212:29109',
      $figmaModeId: '42212:1',
      $figmaVariableReferences: {
        'font-size.1': '0918a6e18af0d0626e986d0d974c3710c9543307',
        'font-size.2': 'd83453adb39699bc5dac07323a8521c42298658c',
        'font-size.3': '99a88b4e9d69ba35a19ae733ed990af16f029905',
        'font-size.4': 'f6b8732ee2a4ca17753f85d8da8c23a26d0bb8fa',
        'font-size.5': '1fd182f82f9efc97b48f22b71ec8870fc1566a18',
        'font-size.6': 'd28187087fe109a7f5d495114aebe1751cfd0845',
        'font-size.7': 'b190a03d589d92020807dbf745d13571ad71a4bb',
        'font-size.8': 'babc299be5efc9c8e66afbd72142be00e6afbceb',
        'font-size.9': 'd9aae308744b6d063bcaa7c954f850ff8eba01be',
        'font-size.10': '02307bf39cbc6a4c4c4f39a98c534e9cc3bd471b',
        'font-size.11': '31c417a84ce9f7e16f76a9f1f9e0c5d445793ae6',
        'size.0': '049b87c9edfef73597e88c8433dfb70e9dc4f8cb',
        'size.1': '6e4139d5cb0282165c92e441bb565562dc9afa1d',
        'size.2': 'd786893051954a518025ea8817dde0c0713ebd8d',
        'size.3': 'cba1a001249a81cbd052ea5732bb84c4fa2f9dd9',
        'size.4': 'bcb8061aa8c70013a486c5c1bceeac04ce2678c1',
        'size.5': '405596765ee5bbb371a9479e527b49ba43580d19',
        'size.6': 'e588d32982145a109bbd86da57ebae6a149f91eb',
        'size.7': '1ea2aa22663dc27dfe70c10744480c9eec930269',
        'size.8': 'c1cca6be5007a623b4fe731524847b4f040eee9e',
        'size.9': '7a01b7eba8fe698062080a2aa7c6f203e05a5e7c',
        'size.10': '3e2e0e198db8e89a7d716bbee4dc887934dff5ed',
        'size.11': '050087517351340be3a7f65b249a9ae8d01d6286',
        'size.12': '47204f9bb7937097f4b6388c4a5addbe913318a4',
        'size.13': 'e2ffb69847997d9b93bea8b47d22e6337adf65ce',
        'size.14': 'f910478b6a4e6d247cb265b1e9468031d5fe183b',
        'size.15': '8ddb06202f770e4a2c1cf9d74789c21447b92240',
        'size.18': '1244373e39adca00c6e5d2dafe4e54ffcdf78e35',
        'size.22': '4e33c13746c0edf17066d8b3c34551730019e36b',
        'size.26': 'a5a5b3ef4f857e46d19e581eaf14fcb0f105a70a',
        'size.30': '88af5667364d808a1d4ae656ea6f82ef64073a75',
        'size._mode-font-size': '40350aed54e6bc94c3460bf6f94141b6f4b9adc1',
        'size._base': 'b20d311a4235705c45973df78540c01cb0f4b490',
        'size._step': 'f8db745fb109a80fb926cf08c9e3a019ab026823',
      },
      group: 'Size',
    },
    {
      id: 'd49b9eebeb48a4f165a74b7261733d0a73370f0e',
      name: 'large',
      $figmaStyleReferences: {},
      selectedTokenSets: {
        'primitives/modes/size/large': TokenSetStatus.SOURCE,
        'primitives/modes/size/global': TokenSetStatus.ENABLED,
        'primitives/modes/typography/size/large': TokenSetStatus.ENABLED,
      },
      $figmaCollectionId: 'VariableCollectionId:42212:29109',
      $figmaModeId: '42212:2',
      $figmaVariableReferences: {
        'font-size.1': '0918a6e18af0d0626e986d0d974c3710c9543307',
        'font-size.2': 'd83453adb39699bc5dac07323a8521c42298658c',
        'font-size.3': '99a88b4e9d69ba35a19ae733ed990af16f029905',
        'font-size.4': 'f6b8732ee2a4ca17753f85d8da8c23a26d0bb8fa',
        'font-size.5': '1fd182f82f9efc97b48f22b71ec8870fc1566a18',
        'font-size.6': 'd28187087fe109a7f5d495114aebe1751cfd0845',
        'font-size.7': 'b190a03d589d92020807dbf745d13571ad71a4bb',
        'font-size.8': 'babc299be5efc9c8e66afbd72142be00e6afbceb',
        'font-size.9': 'd9aae308744b6d063bcaa7c954f850ff8eba01be',
        'font-size.10': '02307bf39cbc6a4c4c4f39a98c534e9cc3bd471b',
        'font-size.11': '31c417a84ce9f7e16f76a9f1f9e0c5d445793ae6',
        'size.0': '049b87c9edfef73597e88c8433dfb70e9dc4f8cb',
        'size.1': '6e4139d5cb0282165c92e441bb565562dc9afa1d',
        'size.2': 'd786893051954a518025ea8817dde0c0713ebd8d',
        'size.3': 'cba1a001249a81cbd052ea5732bb84c4fa2f9dd9',
        'size.4': 'bcb8061aa8c70013a486c5c1bceeac04ce2678c1',
        'size.5': '405596765ee5bbb371a9479e527b49ba43580d19',
        'size.6': 'e588d32982145a109bbd86da57ebae6a149f91eb',
        'size.7': '1ea2aa22663dc27dfe70c10744480c9eec930269',
        'size.8': 'c1cca6be5007a623b4fe731524847b4f040eee9e',
        'size.9': '7a01b7eba8fe698062080a2aa7c6f203e05a5e7c',
        'size.10': '3e2e0e198db8e89a7d716bbee4dc887934dff5ed',
        'size.11': '050087517351340be3a7f65b249a9ae8d01d6286',
        'size.12': '47204f9bb7937097f4b6388c4a5addbe913318a4',
        'size.13': 'e2ffb69847997d9b93bea8b47d22e6337adf65ce',
        'size.14': 'f910478b6a4e6d247cb265b1e9468031d5fe183b',
        'size.15': '8ddb06202f770e4a2c1cf9d74789c21447b92240',
        'size.18': '1244373e39adca00c6e5d2dafe4e54ffcdf78e35',
        'size.22': '4e33c13746c0edf17066d8b3c34551730019e36b',
        'size.26': 'a5a5b3ef4f857e46d19e581eaf14fcb0f105a70a',
        'size.30': '88af5667364d808a1d4ae656ea6f82ef64073a75',
        'size._mode-font-size': '40350aed54e6bc94c3460bf6f94141b6f4b9adc1',
        'size._base': 'b20d311a4235705c45973df78540c01cb0f4b490',
        'size._step': 'f8db745fb109a80fb926cf08c9e3a019ab026823',
      },
      group: 'Size',
    },
  ];
}

const colorSchemeDefaults: Record<ColorScheme, ThemeObject_> = {
  light: {
    name: 'Light',
    selectedTokenSets: {},
    id: '0daa3ca0b427b9349da7e7dc00101b5668972926',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:0',
  },
  dark: {
    name: 'Dark',
    selectedTokenSets: {},
    id: '9ebd8aed52afbffc17e2666e8b4653a53498b257',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:1',
  },
  contrast: {
    name: 'Contrast',
    selectedTokenSets: {},
    id: '9ebd8aed52afbffc17e2666e8b4653a53498b123',
    $figmaCollectionId: 'VariableCollectionId:34811:5472',
    $figmaModeId: '34811:2',
  },
};

function generateColorSchemesGroup(colorSchemes: ColorSchemes, themes: string[]): ThemeObject_[] {
  return colorSchemes.map(
    (scheme): ThemeObject_ => ({
      ...colorSchemeDefaults[scheme],
      selectedTokenSets: Object.fromEntries([
        [`primitives/modes/color-scheme/${scheme}/global`, TokenSetStatus.ENABLED],
        ...themes.map((theme) => [`primitives/modes/color-scheme/${scheme}/${theme}`, TokenSetStatus.ENABLED]),
      ]),
      group: 'Color scheme',
    }),
  );
}

function generateThemesGroup(themes: string[]): ThemeObject_[] {
  return themes.map(
    (theme, index): ThemeObject_ => ({
      id: createHash(theme),
      $figmaCollectionId: 'VariableCollectionId:36329:62335',
      $figmaModeId: `36329:${index + 4}`, // Start on 4 in Token Studio and Community file for some reason
      name: theme,
      selectedTokenSets: {
        [`themes/${theme}`]: TokenSetStatus.ENABLED,
      },
      group: 'Theme',
    }),
  );
}

function generateSemanticGroup(): ThemeObject_ {
  return {
    id: '541629445ef90ad5363f9e88f52a1ccb617e6f84',
    name: 'Semantic',
    selectedTokenSets: {
      'semantic/style': TokenSetStatus.ENABLED,
      'semantic/color': TokenSetStatus.ENABLED,
      'primitives/globals': TokenSetStatus.SOURCE,
    },
    group: 'Semantic',
  };
}

function generateColorGroup(group: 'main' | 'support', colors: Colors): ThemeObject_[] {
  return Object.entries(colors[group]).map(
    ([color]): ThemeObject_ => ({
      id: createHash(`${group}-${color}`),
      name: color,
      selectedTokenSets: {
        [`semantic/modes/${group}-color/${color}`]: TokenSetStatus.ENABLED,
      },
      group: `${capitalize(group)} color`,
    }),
  );
}

function generateTypographyGroup(themes: string[]): ThemeObject_[] {
  return [
    {
      id: '368d753fcac4455f289500eaa42e70dc0a03522f',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:2',
      name: 'Primary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/primary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
    {
      id: '264b8bd1d40b364e1ea3acf09e49795ddd4c513c',
      $figmaCollectionId: 'VariableCollectionId:36248:20769',
      $figmaModeId: '36248:3',
      name: 'Secondary',
      selectedTokenSets: Object.fromEntries(
        themes.map((theme) => [`primitives/modes/typography/secondary/${theme}`, TokenSetStatus.ENABLED]),
      ),
      group: 'Typography',
    },
  ];
}
