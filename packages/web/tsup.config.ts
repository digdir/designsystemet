// stolen from https://github.com/u-elements/u-elements/blob/main/tsup.config.ts
import fs from 'node:fs';
import path from 'node:path';
// Use tsup (not Vite) for building, as it has better dts support out of the box
// @ts-ignore
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
    fs.writeFileSync(manifestFile, JSON.stringify(manifestData, null, ' '));

    // Generate Blazor integration files
    const blazorDir = path.resolve(pkgPath, 'dist/blazor');
    if (!fs.existsSync(blazorDir)) {
      fs.mkdirSync(blazorDir, { recursive: true });
    }
    const blazorFiles = getBlazorTypes(modules);
    for (const { src, filePath } of blazorFiles) {
      fs.writeFileSync(path.resolve(pkgPath, filePath), src);
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

// See: https://learn.microsoft.com/en-us/aspnet/core/blazor/components/event-handling?view=aspnetcore-8.0
function getBlazorTypes(modules: string[][]) {
  // Collect all events from all modules
  const eventObject: Record<
    string,
    { name: string; tagName: string; description?: string }[]
  > = {};

  for (const [, code] of modules) {
    const tagRexes = /['"]?(ds-[\w-]+)['"]?:\s*(\w+Element)/gi;
    const tagDefinitions = Array.from(code.matchAll(tagRexes));

    if (tagDefinitions.length === 0) continue;

    const eventMap = `${code.match(/GlobalEventHandlersEventMap[^}]+/s) || ''}`;
    const eventRexes = /['"]?(\S*?)['"]?: (CustomEvent(<[^>]+>)?)/gi;
    const events = Array.from(eventMap.matchAll(eventRexes));

    for (const [, tag] of tagDefinitions) {
      for (const [, eventName] of events) {
        if (!eventObject[eventName]) {
          eventObject[eventName] = [];
        }
        eventObject[eventName].push({ name: eventName, tagName: tag });
      }
    }
  }

  // Skip generating files if there are no custom events
  if (Object.keys(eventObject).length === 0) {
    return [];
  }

  const generatedMessage =
    'Auto-generated by @digdir/designsystemet-web - Do not edit directly';

  const srcCS = `/*
 * @experimental
 *
 * EventHandlers.cs
 * ${generatedMessage}
 */

using Microsoft.AspNetCore.Components;
using System.Text.Json;

namespace Designsystemet;
${Object.keys(eventObject)
  .map((name) => ({ name, descriptions: eventObject[name] }))
  .map(
    (e) =>
      `
[EventHandler("on${e.name}", typeof(CustomEventArgs))] // ${e.descriptions.map((d) => `${d.tagName}`).join(', ')}`,
  )
  .join('')}
public static class EventHandlers
{
}

public class CustomEventArgs : EventArgs
{
  public dynamic? Detail { get; set; }

  /* Returns the detail value of CustomEvent with given type */
  public T GetDetail<T>() {
    return JsonSerializer.Deserialize<T>(Detail); // used to cast dynamic type, unknown until event occurs at runtime
  }
}`.trim();

  const srcJS = `/**
 * @experimental
 *
 * wwwroot/{ASSEMBLY NAME}.lib.module.js
 * ${generatedMessage}
 *
 * For Blazor Web App, use afterWebStarted. For Blazor Server/WebAssembly, use afterStarted.
 */

const customEvents = {${Object.keys(eventObject)
    .map((name) => ({ name, descriptions: eventObject[name] }))
    .map(
      (e) => `
  '${e.name}': true, // ${e.descriptions.map((d) => `${d.tagName}`).join(', ')}`,
    )
    .join(',')}
};

/**
 * Workaround: Blazor ignores the event target and only listens to global events.
 * This is a problem for most custom elements which dispatch CustomEvent types
 * that default to not bubbling.
 */
CustomEvent = class Bubbled extends CustomEvent {
  constructor(event, config) {
    const bubbles = customEvents[event] !== undefined ? customEvents[event] : config.bubbles;
    super(event, { ...config, bubbles });
  }
}

/** Blazor Web App */
export function afterWebStarted(blazor) {
  registerCustomEvents(blazor);
}

/** Blazor Server / Blazor WebAssembly */
export function afterStarted(blazor) {
  registerCustomEvents(blazor);
}

function registerCustomEvents(blazor) {
  Object.keys(customEvents).forEach(event => {
    blazor.registerCustomEventType(event, {
      browserEventName: event,
      createEventArgs: e => {
        return { detail: e.detail };
      }
    });
  });
}
`;

  return [
    { src: srcCS, filePath: 'dist/blazor/EventHandlers.cs' },
    { src: srcJS, filePath: 'dist/blazor/custom-events.js' },
  ];
}
