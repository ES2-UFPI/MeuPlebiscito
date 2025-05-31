"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, FileText, Users, Award } from "lucide-react";
import { deputadoMockData } from "../mocks/DeputadoMock";

const DeputadoPagina = () => {
  const { id } = useParams();
  const [deputado, setDeputado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("participacao");

  useEffect(() => {
    // Simular carregamento de dados do deputado usando mocks
    setTimeout(() => {
      const deputadoData = deputadoMockData[id] || deputadoMockData[1];
      setDeputado(deputadoData);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__carregando">
          <div className="loading-spinner"></div>
          <p>Carregando informações do deputado...</p>
        </div>
      </div>
    );
  }

  if (!deputado) {
    return (
      <div className="pagina-busca">
        <div className="pagina-busca__sem-resultados">
          <p>Deputado não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deputado-detalhes">
      <div className="deputado-detalhes__container">
        {/* Cabeçalho com informações básicas */}
        <div className="deputado-detalhes__cabecalho">
          <div className="deputado-detalhes__foto-container">
            <img
              src={deputado.foto || "/placeholder.svg"}
              alt={deputado.nome}
              className="deputado-detalhes__foto"
            />
          </div>
          <div className="deputado-detalhes__info-principal">
            <h1 className="deputado-detalhes__nome">{deputado.nome}</h1>
            <p className="deputado-detalhes__cargo">{deputado.cargo}</p>
            <div className="deputado-detalhes__metadados">
              <span className="deputado-detalhes__partido">
                {deputado.partido}
              </span>
              <span className="separador">•</span>
              <span className="deputado-detalhes__estado">
                {deputado.estado}
              </span>
            </div>
          </div>
          <div className="deputado-detalhes__contato">
            <div className="contato-item">
              <span className="contato-label">Email:</span>
              <span className="contato-valor">{deputado.email}</span>
            </div>
            <div className="contato-item">
              <span className="contato-label">Telefone:</span>
              <span className="contato-valor">{deputado.telefone}</span>
            </div>
            <div className="contato-item">
              <span className="contato-label">Gabinete:</span>
              <span className="contato-valor">{deputado.gabinete}</span>
            </div>
          </div>
        </div>

        {/* Navegação por abas */}
        <div className="deputado-detalhes__navegacao">
          <button
            className={`aba-botao ${
              abaSelecionada === "participacao" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("participacao")}
          >
            <Users size={16} />
            Participação em Reuniões
          </button>
          <button
            className={`aba-botao ${
              abaSelecionada === "projetos" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("projetos")}
          >
            <FileText size={16} />
            Autoria em Projetos de Lei
          </button>
          <button
            className={`aba-botao ${
              abaSelecionada === "atividades" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("atividades")}
          >
            <Award size={16} />
            Atividades e Cargos
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div className="deputado-detalhes__conteudo">
          {abaSelecionada === "participacao" && (
            <div className="aba-conteudo">
              <h3 className="aba-titulo">Participação em Reuniões</h3>
              <div className="participacoes-lista">
                {deputado.participacoes.map((participacao, index) => (
                  <div key={index} className="participacao-item">
                    <div className="participacao-item__cabecalho">
                      <span className="participacao-tipo">
                        {participacao.tipo}
                      </span>
                      <span
                        className={`participacao-status ${
                          participacao.presente ? "presente" : "ausente"
                        }`}
                      >
                        {participacao.presente ? "Presente" : "Ausente"}
                      </span>
                    </div>
                    <p className="participacao-descricao">
                      {participacao.descricao}
                    </p>
                    <div className="participacao-data">
                      <Calendar size={14} />
                      {participacao.data}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaSelecionada === "projetos" && (
            <div className="aba-conteudo">
              <h3 className="aba-titulo">Projetos de Lei de Autoria</h3>
              <div className="projetos-lista">
                {deputado.projetos.map((projeto, index) => (
                  <div key={index} className="projeto-item">
                    <div className="projeto-item__cabecalho">
                      <span className="projeto-numero">{projeto.numero}</span>
                      <span
                        className={`projeto-status status-${projeto.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {projeto.status}
                      </span>
                    </div>
                    <h4 className="projeto-titulo">{projeto.titulo}</h4>
                    <div className="projeto-data">
                      <Calendar size={14} />
                      {projeto.data}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaSelecionada === "atividades" && (
            <div className="aba-conteudo">
              <h3 className="aba-titulo">Atividades e Cargos</h3>
              <div className="atividades-grid">
                <div className="atividade-secao">
                  <h4 className="atividade-secao__titulo">Mandatos</h4>
                  <ul className="atividade-lista">
                    {deputado.mandatos.map((mandato, index) => (
                      <li key={index} className="atividade-item">
                        {mandato}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="atividade-secao">
                  <h4 className="atividade-secao__titulo">Comissões</h4>
                  <ul className="atividade-lista">
                    {deputado.comissoes.map((comissao, index) => (
                      <li key={index} className="atividade-item">
                        {comissao}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeputadoPagina;
