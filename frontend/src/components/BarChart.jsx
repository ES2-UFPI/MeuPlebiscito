import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

const BarChartComponent = ({ data, dataKeyX, dataKeyY, title }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKeyX} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKeyY} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
