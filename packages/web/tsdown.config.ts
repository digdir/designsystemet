import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsdown';

const pkgPath = process.cwd();
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

export default defineConfig({
  async onSuccess() {
    const dtsPath = path.resolve(pkgPath, 'dist/index.d.ts');
    if (!fs.existsSync(dtsPath)) return;

    const modules = getAllTsFiles(srcPath).map((file) => [
      path.basename(file),
      fs.readFileSync(file).toString(),
    ]);

    const footer = modules.map(getFrameworkTypes).join('');
    if (footer) {
      fs.appendFileSync(dtsPath, footer);
    }
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
      : `\nimport type * as PreactTypes from 'preact'
import type * as ReactTypes from 'react'
import type * as SvelteTypes from 'svelte/elements'
import type * as VueJSX from '@vue/runtime-dom'
import type { JSX as QwikJSX } from '@builder.io/qwik/jsx-runtime'
import type { JSX as SolidJSX } from 'solid-js'`
  }

${tagDefinitions
  .map(([, tag, domInterface]) => {
    const componentType = tag
      ?.replace(/\W/g, '')
      .replace(/./, (m) => m.toUpperCase());

    return `
export type Preact${componentType} = PreactTypes.JSX.HTMLAttributes<${domInterface}> & { ${events
      .map(
        ([, eventName, event]) =>
          `"on${eventName}"?: (event: ${event}) => void`,
      )
      .join('; ')} }
export type React${componentType} = ReactTypes.DetailedHTMLProps<ReactTypes.HTMLAttributes<${domInterface}>, ${domInterface}> & { class?: string }
export type Qwik${componentType} = QwikJSX.IntrinsicElements['div'] & { class?: string }
export type Vue${componentType} = VueJSX.HTMLAttributes
export type Svelte${componentType} = SvelteTypes.HTMLAttributes<${domInterface}> & { ${events
      .map(
        ([, eventName, event]) =>
          `"on:${eventName}"?: (event: ${event}) => void, "on${eventName}"?: (event: ${event}) => void`,
      )
      .join('; ')} }
export type Solid${componentType} = SolidJSX.HTMLAttributes<${domInterface}>

declare global { namespace React.JSX { interface IntrinsicElements { '${tag}': React${componentType} } } }
declare global { namespace preact.JSX { interface IntrinsicElements { '${tag}': Preact${componentType} } } }
declare module '@builder.io/qwik/jsx-runtime' { export namespace JSX { export interface IntrinsicElements { '${tag}': Qwik${componentType} } } }
// Augmenting @vue/runtime-dom instead of vue directly to avoid interfering with React JSX
declare module '@vue/runtime-dom' { export interface GlobalComponents { '${tag}': Vue${componentType} } }
declare module 'svelte/elements' { interface SvelteHTMLElements { '${tag}': Svelte${componentType} } }
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements { '${tag}': Solid${componentType} }
    interface CustomEvents { ${events.map(([, eventName, event]) => `"${eventName}": (event: ${event}) => void`).join('; ')} }
  }
}`;
  })
  .join('')}`;
}
