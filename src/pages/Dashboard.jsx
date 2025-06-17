import React from "react";
import BarChartComponent from "../components/BarChart";
import { dataDeputados } from "../mocks/DashboardMock";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard — Gráficos Estáticos</h2>
      <BarChartComponent
        data={dataDeputados}
        dataKeyX="partido"
        dataKeyY="quantidade"
        title="Deputados por Partido"
      />
    </div>
  );
};

export default Dashboard;
