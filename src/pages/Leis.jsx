"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, CheckCircle } from "lucide-react";

const LeiDetalhes = () => {
  const { id } = useParams();
  const [lei, setLei] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados da lei
    setTimeout(() => {
      setLei({
        id: id,
        numero: "PL 1234/2024",
        titulo:
          "Dispõe sobre a educação digital nas escolas públicas do Brasil",
        ementa:
          "Estabelece diretrizes para a implementação da educação digital nas escolas públicas, incluindo infraestrutura tecnológica, formação de professores e desenvolvimento de conteúdo educacional digital.",
        status: "Em tramitação",
        dataApresentacao: "15/03/2024",
        autor: {
          nome: "João Silva Santos",
          partido: "PT",
          estado: "PI",
          foto: "/placeholder.svg?height=60&width=60",
        },
        categoria: "Educação",
        tramitacao: [
          {
            data: "15/03/2024",
            orgao: "Mesa Diretora",
            acao: "Apresentação do projeto",
            situacao: "Recebido",
          },
          {
            data: "20/03/2024",
            orgao: "Comissão de Constituição e Justiça",
            acao: "Distribuição para relatoria",
            situacao: "Em análise",
          },
          {
            data: "25/03/2024",
            orgao: "Comissão de Educação",
            acao: "Parecer favorável",
            situacao: "Aprovado",
          },
        ],
        textoIntegral: `Art. 1º Esta Lei estabelece diretrizes para a implementação da educação digital nas escolas públicas de educação básica.

Art. 2º Para os efeitos desta Lei, considera-se educação digital o conjunto de práticas pedagógicas que utilizam tecnologias digitais como ferramentas de ensino e aprendizagem.

Art. 3º São objetivos da educação digital:
I - promover a inclusão digital dos estudantes;
II - desenvolver competências digitais essenciais;
III - preparar os estudantes para o mercado de trabalho digital;
IV - fomentar o pensamento crítico sobre o uso de tecnologias.

Art. 4º As escolas públicas deverão implementar gradualmente:
I - infraestrutura tecnológica adequada;
II - programas de formação continuada para professores;
III - conteúdo educacional digital alinhado à Base Nacional Comum Curricular.

Art. 5º Esta Lei entra em vigor na data de sua publicação.`,
        votacoes: [
          {
            orgao: "Comissão de Educação",
            data: "25/03/2024",
            resultado: "Aprovado",
            votos: { favoraveis: 15, contrarios: 2, abstencoes: 1 },
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__carregando">
          <div className="loading-spinner"></div>
          <p>Carregando informações da lei...</p>
        </div>
      </div>
    );
  }

  if (!lei) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__sem-resultados">
          <p>Lei não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lei-detalhes">
      <div className="lei-detalhes__container">
        {/* Cabeçalho */}
        <div className="lei-detalhes__cabecalho">
          <div className="lei-detalhes__numero-status">
            <h1 className="lei-detalhes__numero">{lei.numero}</h1>
            <span
              className={`lei-detalhes__status status-${lei.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {lei.status}
            </span>
          </div>
          <h2 className="lei-detalhes__titulo">{lei.titulo}</h2>
          <p className="lei-detalhes__ementa">{lei.ementa}</p>

          <div className="lei-detalhes__metadados">
            <div className="metadado-item">
              <Calendar size={16} />
              <span>Apresentado em {lei.dataApresentacao}</span>
            </div>
            <div className="metadado-item">
              <span className="categoria-tag">{lei.categoria}</span>
            </div>
          </div>
        </div>

        {/* Autor */}
        <div className="lei-detalhes__autor">
          <h3 className="secao-titulo">Autor</h3>
          <div className="autor-card">
            <img
              src={lei.autor.foto || "/placeholder.svg"}
              alt={lei.autor.nome}
              className="autor-foto"
            />
            <div className="autor-info">
              <h4 className="autor-nome">{lei.autor.nome}</h4>
              <p className="autor-detalhes">
                {lei.autor.partido} - {lei.autor.estado}
              </p>
            </div>
          </div>
        </div>

        {/* Tramitação */}
        <div className="lei-detalhes__tramitacao">
          <h3 className="secao-titulo">Tramitação</h3>
          <div className="tramitacao-timeline">
            {lei.tramitacao.map((etapa, index) => (
              <div key={index} className="tramitacao-item">
                <div className="tramitacao-item__marcador">
                  <CheckCircle size={16} />
                </div>
                <div className="tramitacao-item__conteudo">
                  <div className="tramitacao-item__cabecalho">
                    <span className="tramitacao-data">{etapa.data}</span>
                    <span className="tramitacao-orgao">{etapa.orgao}</span>
                  </div>
                  <p className="tramitacao-acao">{etapa.acao}</p>
                  <span
                    className={`tramitacao-situacao situacao-${etapa.situacao
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {etapa.situacao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Votações */}
        {lei.votacoes.length > 0 && (
          <div className="lei-detalhes__votacoes">
            <h3 className="secao-titulo">Votações</h3>
            {lei.votacoes.map((votacao, index) => (
              <div key={index} className="votacao-card">
                <div className="votacao-cabecalho">
                  <span className="votacao-orgao">{votacao.orgao}</span>
                  <span className="votacao-data">{votacao.data}</span>
                </div>
                <div className="votacao-resultado">
                  <span
                    className={`resultado-badge resultado-${votacao.resultado.toLowerCase()}`}
                  >
                    {votacao.resultado}
                  </span>
                </div>
                <div className="votacao-detalhes">
                  <span className="voto-tipo favoravel">
                    {votacao.votos.favoraveis} Favoráveis
                  </span>
                  <span className="voto-tipo contrario">
                    {votacao.votos.contrarios} Contrários
                  </span>
                  <span className="voto-tipo abstencao">
                    {votacao.votos.abstencoes} Abstenções
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Texto Integral */}
        <div className="lei-detalhes__texto">
          <h3 className="secao-titulo">Texto Integral</h3>
          <div className="texto-integral">
            <pre className="texto-conteudo">{lei.textoIntegral}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeiDetalhes;
