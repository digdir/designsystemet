export type SeverityColors = 'info' | 'success' | 'warning' | 'danger';

export type CustomColors = 'neutral' | (string & {});

export type Color = CustomColors | SeverityColors;
