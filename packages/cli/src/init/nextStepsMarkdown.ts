import { normalizeTokenSetName, toGeneratedCssFileName } from './utils.js';
import type { Mode } from './createTokensPackage.js';

export function nextStepsMarkdown(themes: string[], modes: Mode[], tokensTargetDir: string, packageName: string) {
  const themeModeCombinations = themes.flatMap((theme) =>
    modes.map((mode): [theme: string, mode: string] => [theme, mode]),
  );
  const themeOrThemes = `theme${themes.length > 1 ? 's' : ''}`;
  const isOrAre = themes.length > 1 ? 'are' : 'is';

  return `
## Next steps

### Using the ${themeOrThemes} in Figma

1. Initialise a git repository in the current directory
2. Push the tokens to GitHub, GitLab or Azure DevOps
3. [Open the Figma component library](https://www.figma.com/community/file/1322138390374166141/designsystemet-core-ui-kit) and save it to your project
4. Install the [Tokens Studio plugin](https://www.figma.com/community/plugin/843461159747178978/Tokens-Studio-for-Figma-(Figma-Tokens)) in Figma
5. [Set up sync](https://docs.tokens.studio/sync/sync) in Tokens Studio for Figma
6. Use the ["Create variables" action](https://docs.tokens.studio/variables/creating-variables) in Tokens Studio
7. Push the resulting variables from Tokens Studio to Git

### Customizing the ${themeOrThemes}

1. Go to https://theme.designsystemet.no and set up a color theme
2. Press "Kopier tema"
3. Under "Json til Figma", copy the contents under ${modes.join(' / ')} to
   the corresponding file under \`${tokensTargetDir}\`:  
${themeModeCombinations.map(([theme, mode]) => `     **${theme}, ${mode}**: \`primitives/colors/${normalizeTokenSetName(mode)}/${normalizeTokenSetName(theme)}.json\`  `).join('\n')}
   This can also be done in Tokens Studio for Figma.
4. **IMPORTANT!** In the JSON data you copied, replace \`theme\` on line 2
   with the correct theme identifier, depending on the theme you're customizing.
   This is the same as the json filename without extension (e.g. ${themes.map((x) => `\`${normalizeTokenSetName(x)}\``).join(', ')}).
${themes.length > 1 ? '5. Repeat steps 1—4 for the remaining themes' : ''}

### Using the correct ${themeOrThemes} in Figma components

The "Designsystemet - Core UI Kit" component library is set up with the themes
"Theme1" and "Theme2" by default. To ensure our custom ${themeOrThemes} ${isOrAre} used, follow these steps:

1. Open your copy of "Designsystemet - Core UI Kit" in Figma
2. Pull any changes from Git using Tokens Studio
3. Update the Figma variables using the "Styles & Variables" > "Sync variables" action in Tokens Studio
4. Access the [Variables modal](https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables)
5. Select the "Theme" collection in the upper left dropdown
6. Select "All variables"
7. Right click the modes "Theme1" and click "Delete mode"
8. Repeat for "Theme2"
9. Publish the library

### Updating the Figma components after theme changes

1. Open your copy of "Designsystemet - Core UI Kit" in Figma
2. Pull any changes from Git using Tokens Studio
3. Update the Figma variables using the "Styles & Variables" > "Sync variables" action in Tokens Studio
4. Publish the library

### Using the ${themeOrThemes} in code

The current directory is set up to easily publish the ${themeOrThemes} as an npm package.

1. Check that the package.json file is set up to your liking
2. \`npm install\`
3. \`npm run build\` - builds the css files for each theme and outputs them to \`./dist\`
4. \`npm publish\`   - publishes the package to npm as \`${packageName}\`, unless you manually changed \`package.json\`

In a different npm package (e.g. a frontend web app), follow the "Get started"
instructions at https://github.com/digdir/designsystemet but replace
\`@digdir/designsystemet-theme\` with \`${packageName}\`. In short:

#### Install packages

\`\`\`
npm i ${packageName} @digdir/designsystemet-css @digdir/designsystemet-react
\`\`\`

#### Import the default theme and use components

\`\`\`js
import '${packageName}';
import '@digdir/designsystemet-css';
import { Button } from '@digdir/designsystemet-react';
\`\`\`

${
  themes.length > 1
    ? `
#### Or import a specific theme
\`\`\`js
import '${packageName}/${toGeneratedCssFileName(themes[1])}';
\`\`\`
`.trim()
    : ''
}`;
}
