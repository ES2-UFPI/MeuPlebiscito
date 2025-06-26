"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, TrendingUp } from "lucide-react";
import HomeBoxItem from "../components/HomeBoxItem";

const ProjetosLei = () => {
  const [filtroTematica, setFiltroTematica] = useState("todas");
  const [projetos, setProjetos] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(true);

  const tematicas = [
    { id: "todas", nome: "Todas as Temáticas", icone: FileText },
    { id: "educacao", nome: "Educação", icone: FileText },
    { id: "saude", nome: "Saúde", icone: FileText },
    { id: "meio-ambiente", nome: "Meio Ambiente", icone: FileText },
    { id: "trabalhista", nome: "Trabalhista", icone: FileText },
    { id: "economia", nome: "Economia", icone: FileText },
    { id: "seguranca", nome: "Segurança", icone: FileText },
    { id: "tecnologia", nome: "Tecnologia", icone: FileText },
    { id: "cultura", nome: "Cultura", icone: FileText },
  ];

  useEffect(() => {
    setLoading(true);
    // Simular carregamento de dados
    setTimeout(() => {
      const todosProjetos = [
        {
          id: 1,
          numero: "PL 1234/2024",
          titulo: "Dispõe sobre a educação digital nas escolas públicas",
          autor: "João Silva Santos",
          partido: "PT",
          estado: "PI",
          data: "15/03/2024",
          status: "Em tramitação",
          categoria: "educacao",
          descricao:
            "Estabelece diretrizes para implementação da educação digital...",
        },
        {
          id: 2,
          numero: "PL 5678/2024",
          titulo: "Programa Nacional de Telemedicina",
          autor: "Maria Santos",
          partido: "PSDB",
          estado: "SP",
          data: "20/03/2024",
          status: "Aprovado",
          categoria: "saude",
          descricao: "Regulamenta o uso da telemedicina no SUS...",
        },
        {
          id: 3,
          numero: "PL 9012/2024",
          titulo: "Lei de Proteção aos Recursos Hídricos",
          autor: "Carlos Lima",
          partido: "MDB",
          estado: "MG",
          data: "25/03/2024",
          status: "Sancionada",
          categoria: "meio-ambiente",
          descricao: "Estabelece medidas de proteção e conservação...",
        },
        {
          id: 4,
          numero: "PL 3456/2024",
          titulo: "Regulamentação do Trabalho Remoto",
          autor: "Ana Costa",
          partido: "PDT",
          estado: "RJ",
          data: "28/03/2024",
          status: "Em tramitação",
          categoria: "trabalhista",
          descricao: "Define direitos e deveres no trabalho remoto...",
        },
      ];

      const projetosFiltrados =
        filtroTematica === "todas"
          ? todosProjetos
          : todosProjetos.filter((p) => p.categoria === filtroTematica);

      setProjetos(projetosFiltrados);

      // Calcular estatísticas por temática
      const stats = {};
      tematicas.forEach((tematica) => {
        if (tematica.id !== "todas") {
          const count = todosProjetos.filter(
            (p) => p.categoria === tematica.id
          ).length;
          stats[tematica.id] = count;
        }
      });
      setEstatisticas(stats);
      setLoading(false);
    }, 1000);
  }, [filtroTematica]);

  if (loading) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__carregando">
          <div className="loading-spinner"></div>
          <p>Carregando projetos de lei...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projetos-lei">
      <div className="projetos-lei__container">
        {/* Cabeçalho */}
        <div className="projetos-lei__cabecalho">
          <h1 className="projetos-lei__titulo">
            <FileText size={32} />
            Projetos de Lei
          </h1>
          <p className="projetos-lei__subtitulo">
            Acompanhe os projetos de lei em tramitação no Congresso Nacional
          </p>
        </div>

        {/* Filtros por Temática */}
        <div className="projetos-lei__filtros">
          <h2 className="filtros-titulo">Por temática</h2>
          <div className="tematicas-grid">
            {tematicas.map((tematica) => {
              const IconeComponent = tematica.icone;
              const quantidade =
                tematica.id === "todas"
                  ? Object.values(estatisticas).reduce((a, b) => a + b, 0)
                  : estatisticas[tematica.id] || 0;

              return (
                <button
                  key={tematica.id}
                  className={`tematica-card ${
                    filtroTematica === tematica.id ? "ativo" : ""
                  }`}
                  onClick={() => setFiltroTematica(tematica.id)}
                >
                  <div className="tematica-card__icone">
                    <IconeComponent size={24} />
                  </div>
                  <div className="tematica-card__info">
                    <h3 className="tematica-card__nome">{tematica.nome}</h3>
                    <span className="tematica-card__quantidade">
                      {quantidade} {quantidade === 1 ? "lei" : "leis"} em 2025
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Projetos */}
        <div className="projetos-lei__lista">
          <div className="lista-cabecalho">
            <h2 className="lista-titulo">
              {filtroTematica === "todas"
                ? "Todos os Projetos"
                : `Projetos de ${
                    tematicas.find((t) => t.id === filtroTematica)?.nome
                  }`}
            </h2>
            <span className="lista-contador">
              {projetos.length}{" "}
              {projetos.length === 1
                ? "projeto encontrado"
                : "projetos encontrados"}
            </span>
          </div>

          {projetos.length === 0 ? (
            <div className="lista-vazia">
              <FileText size={48} />
              <p>Nenhum projeto encontrado para esta temática</p>
            </div>
          ) : (
            <div className="projetos-grid">
              {projetos.map((projeto) => (
                <HomeBoxItem
                  key={projeto.id}
                  item={{
                    id: projeto.id,
                    numero: projeto.numero,
                    titulo: projeto.titulo,
                    autor: projeto.autor,
                    partido: projeto.partido,
                    estado: projeto.estado,
                    data: projeto.data,
                    status: projeto.status,
                    categoria: projeto.categoria,
                    descricao: projeto.descricao,
                    tipo: "projeto",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas Resumidas */}
        <div className="projetos-lei__resumo">
          <h2 className="resumo-titulo">Resumo 2025</h2>
          <div className="resumo-stats">
            <div className="stat-card">
              <TrendingUp size={24} />
              <div className="stat-info">
                <span className="stat-numero">
                  {Object.values(estatisticas).reduce((a, b) => a + b, 0)}
                </span>
                <span className="stat-label">Total de Projetos</span>
              </div>
            </div>
            <div className="stat-card">
              <Calendar size={24} />
              <div className="stat-info">
                <span className="stat-numero">
                  {projetos.filter((p) => p.status === "Sancionada").length}
                </span>
                <span className="stat-label">Leis Sancionadas</span>
              </div>
            </div>
            <div className="stat-card">
              <FileText size={24} />
              <div className="stat-info">
                <span className="stat-numero">
                  {projetos.filter((p) => p.status === "Em tramitação").length}
                </span>
                <span className="stat-label">Em Tramitação</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetosLei;
