"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ResultadoBusca from "../components/SearchResult";
import ExplicacaoLLM from "../components/ExplanationLLM";
import { Info } from "lucide-react";

const Searched = () => {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
  const [explicacao, setExplicacao] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [carregandoExplicacao, setCarregandoExplicacao] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    setCarregando(true);
    fetch(`http://localhost:8000/deputados?nome=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.deputados) {
          setResultados(data.deputados);
        } else {
          setResultados([]);
        }
      })
      .catch(() => setResultados([]))
      .finally(() => setCarregando(false));
  }, [query]);

  const gerarExplicacao = async () => {
    if (!query) return;

    setCarregandoExplicacao(true);
    setMostrarExplicacao(true);
    setExplicacao("");

    try {
      // mock de chamada para API de LLM
      //  substituir por uma chamada real para API de LLM
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Texto de exemplo - substitua pela resposta real da API
      const textoExplicacao = `O termo "${query}" refere-se a um representante político no Brasil. 
      Deputados são membros do poder legislativo eleitos para representar os interesses da população 
      e criar leis. Eles podem ser deputados federais (Câmara dos Deputados) ou estaduais 
      (Assembleias Legislativas). Suas principais funções incluem propor, discutir e votar projetos 
      de lei, fiscalizar o poder executivo e representar os interesses de seus eleitores.`;

      setExplicacao(textoExplicacao);
    } catch (error) {
      console.error("Erro ao gerar explicação:", error);
      setExplicacao(
        "Não foi possível gerar uma explicação no momento. Tente novamente mais tarde."
      );
    } finally {
      setCarregandoExplicacao(false);
    }
  };

  return (
    <div className="pagina-busca">
      <div className="pagina-busca__cabecalho">
        <div className="pagina-busca__barra">
          <SearchBar />
          <button
            className="botao-explicacao"
            onClick={gerarExplicacao}
            title="Obter explicação sobre esta busca"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="pagina-busca__conteudo">
        <div className="pagina-busca__resultados">
          <h2 className="pagina-busca__titulo">
            Resultados para: <strong>{query}</strong>
          </h2>

          {carregando ? (
            <div className="pagina-busca__carregando">
              <div className="loading-spinner"></div>
              <p>Carregando resultados...</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="pagina-busca__sem-resultados">
              <p>Nenhum resultado encontrado para "{query}".</p>
              <p>Tente buscar por outro termo ou verifique a ortografia.</p>
            </div>
          ) : (
            <ul className="pagina-busca__lista">
              {resultados.map((deputado) => (
                <li key={deputado.id} className="pagina-busca__item">
                  <ResultadoBusca deputado={deputado} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {mostrarExplicacao && (
          <div className="pagina-busca__explicacao">
            <ExplicacaoLLM
              query={query}
              explicacao={explicacao}
              onClose={() => setMostrarExplicacao(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Searched;
