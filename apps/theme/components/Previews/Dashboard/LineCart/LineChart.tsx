import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import classes from './LineChart.module.css';
const data = [
  {
    name: '2018',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '2019',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '2020',
    uv: 2000,
    pv: 9000,
    amt: 2290,
  },
  {
    name: '2021',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '2022',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

export const LineChartComponent = () => {
  return (
    <ResponsiveContainer width='100%' height='100%' className={classes.line}>
      <LineChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: -5,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' fontSize='14px' dy={5} />
        <YAxis fontSize='14px' dx={-5} />
        <Tooltip />

        <Line
          type='monotone'
          dataKey='pv'
          stroke='#f78d8f'
          activeDot={{ r: 8 }}
        />
        <Line type='monotone' dataKey='uv' stroke='#57b2f8' />
      </LineChart>
    </ResponsiveContainer>
  );
};
