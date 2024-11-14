import { generateThemeForColor } from '@/packages/cli/dist/src';

type ContrastChartProps = {
  type: 'light' | 'dark';
};

export const ContrastChart = ({ type }: ContrastChartProps) => {
  const theme = generateThemeForColor('#0062BA');
  return <div>dd</div>;
};
