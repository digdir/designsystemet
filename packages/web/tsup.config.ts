// stolen from https://github.com/u-elements/u-elements/blob/main/tsup.config.ts
import fs from 'node:fs';
import path from 'node:path';
// Use tsup (not Vite) for building, as it has better dts support out of the box
import * as manifest from '@custom-elements-manifest/analyzer/src/browser-entrypoint.js';
import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';
import { defineConfig } from 'tsup';

// Config runs from all workspaces, so process.cwd is current package path
const pkgPath = process.cwd();
const pkgName = path.basename(pkgPath);
const srcPath = path.resolve(pkgPath, 'src');

// Get all .ts files recursively from src (excluding tests)
const getAllTsFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllTsFiles(fullPath);
    if (entry.name.match(/\.ts$/) && !entry.name.match(/\.(spec|test)\.ts$/))
      return [fullPath];
    return [];
  });
};

const modules = getAllTsFiles(srcPath).map((file) => [
  path.basename(file),
  fs.readFileSync(file).toString(),
]);

const tsToSource = ([file, code]: string[]) =>
  manifest.ts.createSourceFile(
    file,
    code,
    manifest.ts.ScriptTarget.Latest,
    true,
  );

const manifestVSCode = customElementVsCodePlugin({
  cssFileName: null,
  htmlFileName: `${pkgName}.vscode.json`,
  outdir: path.resolve(pkgPath, 'dist'),
});

export default defineConfig({
  clean: true,
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: {
    footer: modules.map(getFrameworkTypes).join(''),
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },
  async onSuccess() {
    const manifestFile = path.resolve(pkgPath, `dist/${pkgName}.manifest.json`);
    const manifestData = manifest.create({
      modules: modules.map(tsToSource),
      plugins: [manifestVSCode],
    });
    console.log(manifestData);
    fs.writeFileSync(manifestFile, JSON.stringify(manifestData, null, ' '));
  },
});

function getFrameworkTypes([_file, code]: string[], index: number) {
  // Match ds-* tags from HTMLElementTagNameMap declarations: 'ds-field': DSFieldElement
  const tagRexes = /['"]?(ds-[\w-]+)['"]?:\s*(\w+Element)/gi;
  const tagDefinitions = Array.from(code.matchAll(tagRexes));

  // Skip files without web component definitions
  if (tagDefinitions.length === 0) return '';

  const eventMap = `${code.match(/GlobalEventHandlersEventMap[^}]+/s) || ''}`;
  const eventRexes = /['"]?(\S*?)['"]?: (CustomEvent(<[^>]+>)?)/gi;
  const events = Array.from(eventMap.matchAll(eventRexes));

  return `${
    index
      ? '' // Only add once for each package, not for every file
      : `import type * as PreactTypes from 'preact'
import type * as ReactTypes from 'react'
import type * as SvelteTypes from 'svelte/elements'
import type * as VueJSX from '@vue/runtime-dom'
import type { JSX as QwikJSX } from '@builder.io/qwik/jsx-runtime'
import type { JSX as SolidJSX } from 'solid-js'`
  }

${tagDefinitions
  .map(([, tag, domInterface]) => {
    // ds-* elements use custom element classes, not native HTML elements
    const type = tag.replace(/\W/g, '').replace(/./, (m) => m.toUpperCase());

    return `
export type Preact${type} = PreactTypes.JSX.HTMLAttributes<${domInterface}> & { ${events
      .map(([, type, event]) => `"on${type}"?: (event: ${event}) => void`)
      .join('; ')} }
export type React${type} = ReactTypes.DetailedHTMLProps<ReactTypes.HTMLAttributes<${domInterface}>, ${domInterface}> & { class?: string }
export type Qwik${type} = QwikJSX.IntrinsicElements['div'] & { class?: string }
export type Vue${type} = VueJSX.HTMLAttributes
export type Svelte${type} = SvelteTypes.HTMLAttributes<${domInterface}> & { ${events
      .map(
        ([, type, event]) =>
          `"on:${type}"?: (event: ${event}) => void, "on${type}"?: (event: ${event}) => void`,
      )
      .join('; ')} }
export type Solid${type} = SolidJSX.HTMLAttributes<${domInterface}>

// Augmenting @vue/runtime-dom instead of vue directly to avoid interfering with React JSX
declare global { namespace React.JSX { interface IntrinsicElements { '${tag}': React${type} } } }
declare global { namespace preact.JSX { interface IntrinsicElements { '${tag}': Preact${type} } } }
declare module '@builder.io/qwik/jsx-runtime' { export namespace JSX { export interface IntrinsicElements { '${tag}': Qwik${type} } } }
declare module '@vue/runtime-dom' { export interface GlobalComponents { '${tag}': Vue${type} } }
declare module 'svelte/elements' { interface SvelteHTMLElements { '${tag}': Svelte${type} } }
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements { '${tag}': Solid${type} }
    interface CustomEvents { ${events.map(([, type, event]) => `"${type}": (event: ${event}) => void`).join('; ')} }
  }
}`;
  })
  .join('')}`;
}
