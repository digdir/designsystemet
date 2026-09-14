import { z } from 'zod';
import { semanticColorNames } from '../colors/specs.ts';
import { severityColorNames } from './defaults.ts';
import { colorSchema } from './schema-color.ts';

const colorModeOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .describe('Override values for semantic color tokens like "background-subtle", "border-default", etc.');

const colorWeightOverrideSchema = z
  .partialRecord(z.enum([...semanticColorNames]), colorModeOverrideSchema)
  .describe('The name of the color to add overrides for, e.g. "accent"');

const semanticColorOverrideSchema = z
  .record(z.string(), colorWeightOverrideSchema)
  .describe('An object with color names as keys');

const severityColorOverrideSchema = z
  .partialRecord(
    z.enum(severityColorNames),
    colorSchema.describe('A hex color, which is used for creating a color scale'),
  )
  .optional()
  .describe('An object with severity color names as keys');

const linkVisitedOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .describe('Overrides for the "link-visited" color');

const focusOverrideSchema = z
  .object({
    inner: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-inner" color'),
    outer: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-outer" color'),
  })
  .describe('Overrides for the focus colors');

export const overridesSchema = z
  .object({
    colors: semanticColorOverrideSchema.optional(),
    severity: severityColorOverrideSchema.optional(),
    linkVisited: linkVisitedOverrideSchema.optional(),
    focus: focusOverrideSchema.optional(),
  })
  .describe('Overrides for generated design tokens. Currently only supports colors defined in your theme')
  .optional();

export type ColorOverrideSchema = z.infer<typeof overridesSchema>;
