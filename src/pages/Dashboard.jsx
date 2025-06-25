import React from "react";
import BarChartComponent from "../components/BarChart";
import { dataDeputados } from "../mocks/DashboardMock";
import DeputadoCard from "../components/DeputadoCard";
import { deputados } from "../mock/deputadosMock";

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
      <h2>Deputados</h2>
{deputados.map((dep, index) => (
  <DeputadoCard
    key={index}
    nome={dep.nome}
    partido={dep.siglaPartido}
    uf={dep.siglaUf}
    email={dep.email}
  />
    </div>
  );
};

export default Dashboard;
