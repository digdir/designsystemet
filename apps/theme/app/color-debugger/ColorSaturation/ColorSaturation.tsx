import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import classes from './ColorSaturation.module.css';

export const ColorSaturation = () => {
  const test = () => {
    const data = [];
    for (let i = 0; i < 360; i++) {
      const obj = {
        name: 'ff',
        pv: 1,
      };
      if (i % 10 === 0) {
        obj.pv = 4;
      }
      data.push(obj);
    }

    return data;
  };

  const data = test();

  return (
    <div>
      <div className={classes.container}>
        <ResponsiveContainer width={'100%'} height={300}>
          <LineChart data={data} margin={{ left: -25 }}>
            <CartesianGrid strokeDasharray='3 3' />

            <YAxis fontSize={14} />

            <Line
              type='monotone'
              dataKey='pv'
              stroke='#646464'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className={classes.gradient}></div>
      </div>
    </div>
  );
};
