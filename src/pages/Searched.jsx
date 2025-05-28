"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import BuscaDetalhada from "../components/BuscaDetalhada";
import { buscarDeputados } from "../services/Buscador";

const Searched = () => {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarBuscaDetalhada, setMostrarBuscaDetalhada] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  // fatapi dev main
  useEffect(() => {
    if (!query) return;

    setCarregando(true);
    fetch(`http://localhost:8000/deputados?nome=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.dados) {
          setResultados(data.dados);
        } else {
          setResultados([]);
        }
      })
      .catch(() => setResultados([]))
      .finally(() => setCarregando(false));
  }, [query]);

  const handleBuscaDetalhada = async (filtros) => {
    setCarregando(true);
    setFiltrosAtivos(filtros);

    try {
      const dados = await buscarDeputados(filtros);
      setResultados(dados);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  };

  const temFiltrosAtivos = Object.keys(filtrosAtivos).length > 0;

  return (
    <div className="pagina-busca">
      <div className="pagina-busca__cabecalho">
        <div className="pagina-busca__barra">
          <SearchBar
            onOpenDetailedSearch={() => setMostrarBuscaDetalhada(true)}
          />
        </div>
      </div>

      <div className="pagina-busca__conteudo">
        <div className="pagina-busca__resultados">
          <div className="pagina-busca__info">
            <h2 className="pagina-busca__titulo">
              {temFiltrosAtivos
                ? "Resultados da busca detalhada"
                : `Resultados para: "${query}"`}
            </h2>

            {temFiltrosAtivos && (
              <div className="filtros-ativos">
                <span className="filtros-ativos__label">
                  Filtros aplicados:
                </span>
                {Object.entries(filtrosAtivos).map(([chave, valor]) => (
                  <span key={chave} className="filtro-ativo-tag">
                    {chave}: {valor}
                  </span>
                ))}
              </div>
            )}
          </div>

          {carregando ? (
            <div className="pagina-busca__carregando">
              <div className="loading-spinner"></div>
              <p>Carregando resultados...</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="pagina-busca__sem-resultados">
              <p>
                Nenhum resultado encontrado{query ? ` para "${query}"` : ""}.
              </p>
              <p>Tente buscar por outro termo ou use a busca detalhada.</p>
            </div>
          ) : (
            <ul className="pagina-busca__lista-moderna">
              {resultados.map((deputado) => (
                <li key={deputado.id} className="pagina-busca__item-moderno">
                  <SearchResult deputado={deputado} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <BuscaDetalhada
        isOpen={mostrarBuscaDetalhada}
        onClose={() => setMostrarBuscaDetalhada(false)}
        onSearch={handleBuscaDetalhada}
      />
    </div>
  );
};

export default Searched;
