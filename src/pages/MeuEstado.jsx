"use client";

import { useState, useEffect } from "react";
import { Users, FileText, TrendingUp } from "lucide-react";
import HomeBoxItem from "../components/HomeBoxItem";
// import MapaBrasil from "../components/MapaBrasil";
import { estadosMockData } from "../mocks/DeputadoMock";

const MeuEstado = () => {
  const [estadoSelecionado, setEstadoSelecionado] = useState("PI");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visualizacao, setVisualizacao] = useState("mapa"); // "mapa" ou "lista"

  useEffect(() => {
    setLoading(true);
    // Simular carregamento de dados do estado
    setTimeout(() => {
      const estadoInfo = estadosMockData.find(
        (e) => e.sigla === estadoSelecionado
      );
      setDados({
        estado: estadoInfo,
        estatisticas: {
          deputados: Math.floor(Math.random() * 20) + 5,
          senadores: 3,
          projetos: Math.floor(Math.random() * 50) + 20,
          leisSancionadas: Math.floor(Math.random() * 15) + 5,
        },
        deputados: [
          {
            id: 1,
            nome: "João Silva Santos",
            partido: "PT",
            foto: "/placeholder.svg?height=60&width=60",
            projetos: 8,
            status: "Ativo",
          },
          {
            id: 2,
            nome: "Maria Oliveira Costa",
            partido: "PSDB",
            foto: "/placeholder.svg?height=60&width=60",
            projetos: 12,
            status: "Ativo",
          },
          {
            id: 3,
            nome: "Carlos Pereira Lima",
            partido: "MDB",
            foto: "/placeholder.svg?height=60&width=60",
            projetos: 6,
            status: "Ativo",
          },
        ],
        ultimosDestaques: [
          {
            id: 1,
            tipo: "projeto",
            numero: "PL 1234/2024",
            titulo: `Lei de incentivo à agricultura familiar em ${estadoInfo?.nome}`,
            autor: "João Silva Santos",
            data: "28/01/2025",
            status: "Em tramitação",
          },
          {
            id: 2,
            tipo: "projeto",
            numero: "PL 5678/2024",
            titulo: "Programa de digitalização das escolas rurais",
            autor: "Maria Oliveira Costa",
            data: "25/01/2025",
            status: "Aprovado",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [estadoSelecionado]);

  const handleEstadoClick = (siglaEstado) => {
    setEstadoSelecionado(siglaEstado);
  };

  if (loading) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__carregando">
          <div className="loading-spinner"></div>
          <p>Carregando dados do estado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meu-estado">
      <div className="meu-estado__container">
        {/* Cabeçalho */}
        <div className="meu-estado__cabecalho">
          <h1 className="meu-estado__titulo">Meu Estado</h1>
          <p className="meu-estado__subtitulo">
            Explore os dados políticos do seu estado ou de qualquer estado
            brasileiro
          </p>
        </div>

        {/* Seletor de Visualização */}
        <div className="meu-estado__controles">
          <div className="visualizacao-toggle">
            <button
              className={`toggle-btn ${visualizacao === "mapa" ? "ativo" : ""}`}
              onClick={() => setVisualizacao("mapa")}
            >
              Mapa Interativo
            </button>
            <button
              className={`toggle-btn ${
                visualizacao === "lista" ? "ativo" : ""
              }`}
              onClick={() => setVisualizacao("lista")}
            >
              Lista de Estados
            </button>
          </div>
        </div>

        {/* Seletor de Estado */}
        <div className="meu-estado__seletor">
          {visualizacao === "mapa" ? (
            <div className="mapa-container">
              <h2 className="seletor-titulo">Clique em um estado no mapa:</h2>
              <MapaBrasil
                estadoSelecionado={estadoSelecionado}
                onEstadoClick={handleEstadoClick}
              />
              <div className="estado-atual">
                <span className="estado-atual__label">Estado selecionado:</span>
                <span className="estado-atual__nome">
                  {dados?.estado?.nome} ({estadoSelecionado})
                </span>
              </div>
            </div>
          ) : (
            <div className="lista-container">
              <h2 className="seletor-titulo">Selecione um Estado:</h2>
              <select
                id="estado-select"
                value={estadoSelecionado}
                onChange={(e) => setEstadoSelecionado(e.target.value)}
                className="estado-seletor__select"
              >
                {estadosMockData.map((estado) => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.nome} ({estado.sigla})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Estatísticas do Estado */}
        <div className="meu-estado__estatisticas">
          <div className="estatistica-card">
            <div className="estatistica-icone">
              <Users size={24} />
            </div>
            <div className="estatistica-info">
              <span className="estatistica-numero">
                {dados.estatisticas.deputados}
              </span>
              <span className="estatistica-label">Deputados Federais</span>
            </div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica-icone">
              <Users size={24} />
            </div>
            <div className="estatistica-info">
              <span className="estatistica-numero">
                {dados.estatisticas.senadores}
              </span>
              <span className="estatistica-label">Senadores</span>
            </div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica-icone">
              <FileText size={24} />
            </div>
            <div className="estatistica-info">
              <span className="estatistica-numero">
                {dados.estatisticas.projetos}
              </span>
              <span className="estatistica-label">Projetos em 2025</span>
            </div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica-icone">
              <TrendingUp size={24} />
            </div>
            <div className="estatistica-info">
              <span className="estatistica-numero">
                {dados.estatisticas.leisSancionadas}
              </span>
              <span className="estatistica-label">Leis Sancionadas</span>
            </div>
          </div>
        </div>

        {/* Últimos Destaques */}
        <div className="meu-estado__destaques">
          <h2 className="secao-titulo">
            {dados.estado.nome}, últimos destaques
          </h2>
          <div className="destaques-lista">
            {dados.ultimosDestaques.map((destaque) => (
              <HomeBoxItem
                key={destaque.id}
                item={{
                  id: destaque.id,
                  numero: destaque.numero,
                  titulo: destaque.titulo,
                  autor: destaque.autor,
                  data: destaque.data,
                  status: destaque.status,
                  tipo: destaque.tipo,
                }}
              />
            ))}
          </div>
        </div>

        {/* Representantes do Estado */}
        <div className="meu-estado__representantes">
          <h2 className="secao-titulo">
            Representantes de {dados.estado.nome}
          </h2>
          <div className="representantes-grid">
            {dados.deputados.map((deputado) => (
              <div key={deputado.id} className="representante-card">
                <img
                  src={deputado.foto || "/placeholder.svg"}
                  alt={deputado.nome}
                  className="representante-foto"
                />
                <div className="representante-info">
                  <h3 className="representante-nome">{deputado.nome}</h3>
                  <p className="representante-partido">{deputado.partido}</p>
                  <div className="representante-stats">
                    <span className="stat-item">
                      {deputado.projetos} projetos
                    </span>
                    <span
                      className={`status-badge status-${deputado.status.toLowerCase()}`}
                    >
                      {deputado.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuEstado;
