"use client";

import { useState } from "react";
import HomeBoxItem from "./HomeBoxItem";
import { obterLeisRecentes, obterLeisPorStatus } from "../mocks/LeiMock";
import { Scale, Vote, Clock } from "lucide-react";

const HomeBox = () => {
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const obterLeisFiltradas = () => {
    switch (filtroAtivo) {
      case "sancionadas":
        return obterLeisPorStatus("sancionada");
      case "votacao":
        return obterLeisPorStatus("em_votacao");
      default:
        return obterLeisRecentes(6);
    }
  };

  const leis = obterLeisFiltradas();

  return (
    <section className="home-box">
      <div className="home-box__cabecalho">
        <h2 className="home-box__titulo">
          <Scale size={24} />
          Movimentos Recentes no Congresso
        </h2>
        <p className="home-box__subtitulo">
          Acompanhe as leis recentemente sancionadas e projetos em votação
        </p>
      </div>

      <div className="home-box__filtros">
        <button
          className={`filtro-botao ${filtroAtivo === "todos" ? "ativo" : ""}`}
          onClick={() => setFiltroAtivo("todos")}
        >
          <Clock size={16} />
          Todos os Recentes
        </button>
        <button
          className={`filtro-botao ${
            filtroAtivo === "sancionadas" ? "ativo" : ""
          }`}
          onClick={() => setFiltroAtivo("sancionadas")}
        >
          <Scale size={16} />
          Leis Sancionadas
        </button>
        <button
          className={`filtro-botao ${filtroAtivo === "votacao" ? "ativo" : ""}`}
          onClick={() => setFiltroAtivo("votacao")}
        >
          <Vote size={16} />
          Em Votação
        </button>
      </div>

      <div className="home-box__grid">
        {leis.length === 0 ? (
          <div className="home-box__vazio">
            <p>Nenhuma lei encontrada para este filtro.</p>
          </div>
        ) : (
          leis.map((lei) => <HomeBoxItem key={lei.id} lei={lei} />)
        )}
      </div>

      <div className="home-box__rodape">
        <p className="home-box__info">
          Dados atualizados a partir de fonte oficial:
          https://dadosabertos.camara.leg.br/swagger/api.html
        </p>
      </div>
    </section>
  );
};

export default HomeBox;
