import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import classes from './AreaChart.module.css';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mars',
    uv: 2000,
    pv: 9000,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Mai',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Juni',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
];

export const AreaChartComponent = () => {
  return (
    <ResponsiveContainer width='100%' height='100%' className={classes.area}>
      <AreaChart
        data={data}
        margin={{
          left: -5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' fontSize='14px' dy={5} />
        <YAxis fontSize='14px' dx={-5} />
        <Tooltip />
        <Area
          type='monotone'
          dataKey='uv'
          stackId='1'
          stroke='#f78d8f'
          fill='#f78d8f'
        />
        <Area
          type='monotone'
          dataKey='pv'
          stackId='1'
          stroke='#57b2f8'
          fill='#57b2f8'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
