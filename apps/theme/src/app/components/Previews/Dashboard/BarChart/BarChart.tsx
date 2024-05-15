import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import classes from "./BarChart.module.css";

const data = [
  {
    name: "2022",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "2023",
    uv: 3000,
    pv: 6000,
  },
  {
    name: "2024",
    uv: 2000,
    pv: 9000,
  },
];

export const BarChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={classes.bar}>
      <BarChart
        data={data}
        margin={{
          left: -5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis fontSize="14px" dataKey="name" dy={5} />
        <YAxis fontSize="14px" dx={-5} />
        <Tooltip />

        <Bar
          dataKey="pv"
          fill="#57b2f8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          className={classes.test}
        />
        <Bar
          dataKey="uv"
          fill="#f78d8f"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
