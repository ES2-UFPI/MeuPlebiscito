import React from "react";
import BarChartComponent from "../components/BarChart";
import DeputadoCard from "../components/DeputadoCard";
import { dataDeputados } from "../mock/mockData";
import { deputadoMockData } from "../mock/DeputadoMock";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard — Meu Plebiscito</h2>

      {/* Gráfico de Barras */}
      <BarChartComponent
        data={dataDeputados}
        dataKeyX="partido"
        dataKeyY="quantidade"
        title="Deputados por Partido"
      />

      {/* Lista de Deputados */}
      <h2 style={{ marginTop: "40px" }}>Deputados</h2>
      {Object.values(deputadoMockData).map((dep) => (
        <DeputadoCard key={dep.id} deputado={dep} />
      ))}
    </div>
  );
};

export default Dashboard;
