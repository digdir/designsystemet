# @digdir/design-system-tokens

Transformed design tokens from the Digdir Common Designsystem to work in code.

## Installation

```sh
npm install @digdir/design-system-tokens
```

If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:

```sh
npm install typescript --save-dev
```

## Usage

You can use CSS variables:

```js
import '@altinn/figma-design-tokens/dist/tokens.css';
```

```css
div {
  padding: var(--space-standard);
}
```

Or use the tokens as a module:

```jsx
import tokens from '@altinn/figma-design-tokens';

const Foo = () => <div style={{ padding: tokens.SpaceStandard }}>Hi</div>;
```

Or as JSON:

```jsx
import tokens from '@altinn/figma-design-tokens/dist/tokens.json';

const Foo = () => (
  <div style={{ padding: tokens.space.standard.value }}>Hi</div>
);
```

(Note that in TypeScript you'll want to set `resolveJsonModule: true` for the above to work.)
