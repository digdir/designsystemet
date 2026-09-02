import { z } from 'zod';

const shadowDeclaration = z.array(
  z.object({
    color: z.string(),
    x: z.string(),
    y: z.string(),
    blur: z.string(),
    spread: z.string(),
  }),
);

export const shadowSchema = z
  .object({
    xs: shadowDeclaration,
    sm: shadowDeclaration,
    md: shadowDeclaration,
    lg: shadowDeclaration,
    xl: shadowDeclaration,
  })
  .default({
    xs: [
      {
        color: 'rgba(0,0,0,0.16)',
        x: '0',
        y: '0',
        blur: '1',
        spread: '0',
      },
      {
        x: '0',
        y: '1',
        blur: '2',
        spread: '0',
        color: 'rgba(0,0,0,0.12)',
      },
    ],
    sm: [
      {
        color: 'rgba(0,0,0,0.15)',
        x: '0',
        y: '0',
        blur: '1',
        spread: '0',
      },
      {
        color: 'rgba(0,0,0,0.12)',
        x: '0',
        y: '1',
        blur: '2',
        spread: '0',
      },
      {
        x: '0',
        y: '2',
        blur: '4',
        spread: '0',
        color: 'rgba(0,0,0,0.1)',
      },
    ],
    md: [
      {
        color: 'rgba(0,0,0,0.14)',
        x: '0',
        y: '0',
        blur: '1',
        spread: '0',
      },
      {
        color: 'rgba(0,0,0,0.12)',
        x: '0',
        y: '2',
        blur: '4',
        spread: '0',
      },
      {
        x: '0',
        y: '4',
        blur: '8',
        spread: '0',
        color: 'rgba(0,0,0,0.12)',
      },
    ],
    lg: [
      {
        color: 'rgba(0,0,0,0.13)',
        x: '0',
        y: '0',
        blur: '1',
        spread: '0',
      },
      {
        color: 'rgba(0,0,0,0.13)',
        x: '0',
        y: '3',
        blur: '5',
        spread: '0',
      },
      {
        x: '0',
        y: '6',
        blur: '12',
        spread: '0',
        color: 'rgba(0,0,0,0.14)',
      },
    ],
    xl: [
      {
        color: 'rgba(0,0,0,0.12)',
        x: '0',
        y: '0',
        blur: '1',
        spread: '0',
      },
      {
        color: 'rgba(0,0,0,0.16)',
        x: '0',
        y: '4',
        blur: '8',
        spread: '0',
      },
      {
        x: '0',
        y: '12',
        blur: '24',
        spread: '0',
        color: 'rgba(0,0,0,0.16)',
      },
    ],
  });
