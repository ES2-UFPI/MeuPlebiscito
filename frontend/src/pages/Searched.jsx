"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Search, X } from "lucide-react";
import SearchBar from "../components/SearchBar";
import SearchResultItem from "../components/SearchResultItem";
import BuscaDetalhada from "../components/BuscaDetalhada";
import { deputadosService } from "../services/api";

const Searched = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarBuscaDetalhada, setMostrarBuscaDetalhada] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const [erro, setErro] = useState(null);

  // Obtém o termo de busca da URL
  const query = new URLSearchParams(location.search).get("q");

  // Efeito para realizar a busca quando o termo de busca mudar
  useEffect(() => {
    const realizarBusca = async () => {
      if (!query) return;

      // setCarregando(true);
      // fetch(`http://localhost:8000/deputados?nome=${encodeURIComponent(query)}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data && data.dados) {
      //       setResultados(data.dados);
      //     } else {
      //       setResultados([]);
      //     }
      //   })
      //   .catch((error) => {
      setCarregando(true);
      try {
        const data = await deputadosService.listarDeputados({ nome: query });
        setResultados(data);
        setErro(null);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        setErro("Ocorreu um erro ao realizar a busca. Tente novamente.");
        setResultados([]);
      } finally {
        setCarregando(false);
      }
    };

    realizarBusca();
  }, [query]); // Dependência apenas no query

  // Função para realizar busca detalhada
  const handleBuscaDetalhada = async (filtros) => {
    setCarregando(true);
    setFiltrosAtivos(filtros);
    setErro(null);

    try {
      const dados = await deputadosService.listarDeputados(filtros);
      setResultados(dados);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setErro("Ocorreu um erro ao realizar a busca detalhada. Tente novamente.");
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  };

  // Função para limpar filtros e voltar à busca original
  const limparFiltros = async () => {
    setFiltrosAtivos({});
    if (query) {
      setCarregando(true);
      try {
        const data = await deputadosService.listarDeputados({ nome: query });
        setResultados(data);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        setErro("Ocorreu um erro ao realizar a busca. Tente novamente.");
        setResultados([]);
      } finally {
        setCarregando(false);
      }
    }
  };

  const voltarParaHome = () => {
    navigate("/");
  };

  const temFiltrosAtivos = Object.keys(filtrosAtivos).length > 0;

  return (
    <div className="searched-page">
      <div className="searched-page__container">
        {/* Cabeçalho com navegação */}
        <div className="searched-page__header">
          <div className="searched-page__nav">
            <button className="btn-voltar" onClick={voltarParaHome}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        {/* Seção de busca */}
        <div className="searched-page__search-section">
          <div className="search-container">
            <SearchBar onOpenDetailedSearch={() => setMostrarBuscaDetalhada(true)} />
          </div>
        </div>

        {/* Seção de informações da busca */}
        <div className="searched-page__info-section">
          <div className="search-info">
            <h2 className="search-title">
              {temFiltrosAtivos
                ? "Resultados da busca detalhada"
                : `Resultados para: "${query}"`}
            </h2>
            <div className="search-meta">
              <span className="result-count">
                {resultados.length} resultado(s) encontrado(s)
              </span>
            </div>
          </div>

          {/* Filtros ativos */}
          {temFiltrosAtivos && (
            <div className="filtros-ativos-section">
              <div className="filtros-ativos-header">
                <span className="filtros-label">Filtros aplicados:</span>
                <button className="btn-limpar-filtros" onClick={limparFiltros}>
                  <X size={16} />
                  Limpar filtros
                </button>
              </div>
              <div className="filtros-ativos-lista">
                {Object.entries(filtrosAtivos).map(([chave, valor]) => (
                  <span key={chave} className="filtro-ativo-tag">
                    <span className="filtro-chave">{chave}:</span>
                    <span className="filtro-valor">{valor}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="searched-page__content">
          {erro ? (
            <div className="error-message">
              <div className="error-icon">
                <X size={32} />
              </div>
              <div className="error-text">
                <h3>Erro na busca</h3>
                <p>{erro}</p>
              </div>
              <button className="btn-tentar-novamente" onClick={limparFiltros}>
                Tentar novamente
              </button>
            </div>
          ) : carregando ? (
            <div className="loading-section">
              <div className="loading-animation">
                <div className="loading-spinner"></div>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <p className="loading-text">Carregando resultados...</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="no-results-section">
              <div className="no-results-illustration">
                <Search size={64} />
              </div>
              <div className="no-results-content">
                <h3>Nenhum resultado encontrado</h3>
                <p>
                  Não encontramos resultados {query ? `para "${query}"` : ""}.
                  Tente ajustar sua busca ou usar a busca detalhada.
                </p>
                <div className="no-results-suggestions">
                  <h4>Sugestões:</h4>
                  <ul>
                    <li>Verifique se as palavras estão escritas corretamente</li>
                    <li>Tente termos mais gerais</li>
                    <li>Use a busca detalhada para refinar sua pesquisa</li>
                  </ul>
                </div>
                <div className="no-results-actions">
                  <button
                    className="btn-busca-avancada-alt"
                    onClick={() => setMostrarBuscaDetalhada(true)}
                  >
                    <Filter size={16} />
                    Usar busca detalhada
                  </button>
                  <button className="btn-voltar-home" onClick={voltarParaHome}>
                    Voltar para a página inicial
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="results-section">
              <div className="results-header">
                <div className="results-stats">
                  <div className="stat-item">
                    <Search size={20} />
                    <span>{resultados.length} resultados</span>
                  </div>
                </div>
              </div>
              <div className="results-grid">
                {resultados.map((deputado) => (
                  <div key={deputado.id} className="result-item">
                    <SearchResultItem deputado={deputado} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de busca detalhada */}
      {mostrarBuscaDetalhada && (
        <BuscaDetalhada
          isOpen={mostrarBuscaDetalhada}
          onClose={() => setMostrarBuscaDetalhada(false)}
          onSearch={handleBuscaDetalhada}
        />
      )}
    </div>
  );
};

export default Searched;
