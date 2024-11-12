export type SeverityColors = 'info' | 'success' | 'warning' | 'danger';

export type CustomColors = 'neutral' | 'accent' | (string & {});

export type Color = CustomColors | SeverityColors;
