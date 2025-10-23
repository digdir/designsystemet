import { Card, Dialog, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useRef } from 'react';
import type { ColorTheme } from '~/routes/themebuilder/_utils/use-themebuilder';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import ColorDetails from './_components/color-details';
import classes from './color-overrides.module.css';

type ColorOverridesProps = {
  triggerButton: React.ReactNode;
};

export const ColorOverrides = ({ triggerButton }: ColorOverridesProps) => {
  const { colors, severityColors, severityEnabled } = useThemebuilder();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const allColors: Array<{ color: ColorTheme; type: string }> = [
    ...colors.main.map((c) => ({ color: c, type: 'main' })),
    ...colors.neutral.map((c) => ({ color: c, type: 'neutral' })),
    ...colors.support.map((c) => ({ color: c, type: 'support' })),
    ...(severityEnabled
      ? severityColors.map((c) => ({
          color: c as ColorTheme,
          type: 'severity',
        }))
      : []),
  ];

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild onClick={() => dialogRef.current?.showModal()}>
        {triggerButton}
      </Dialog.Trigger>
      <Dialog ref={dialogRef} closedby='any' className={classes.dialog}>
        <Dialog.Block>
          <Heading data-size='xs'>Color Overrides</Heading>
          <Paragraph data-size='sm' className={classes.description}>
            Override specific token colors for light and dark modes
          </Paragraph>
        </Dialog.Block>

        <Dialog.Block>
          <Card data-color='neutral' variant='tinted'>
            {allColors.map(({ color }) => {
              return <ColorDetails key={color.name} color={color} />;
            })}
          </Card>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
