"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  Users,
  Award,
  DollarSign,
  ArrowLeft,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { deputadoMockData } from "../mocks/DeputadoMock";

const DeputadosPagina = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deputado, setDeputado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("participacao");

  useEffect(() => {
    // Simular carregamento de dados do deputado usando mocks
    setTimeout(() => {
      const deputadoData = deputadoMockData[id] || deputadoMockData[1];
      const deputadoComOrcamento = {
        // Valores mockados para orçamento
        ...deputadoData,
        orcamento: {
          totalGasto: 125000.5,
          categorias: [
            { nome: "Passagens Aéreas", valor: 45000.0, percentual: 36 },
            { nome: "Hospedagem", valor: 28000.0, percentual: 22 },
            { nome: "Alimentação", valor: 18500.0, percentual: 15 },
            { nome: "Combustível", valor: 15000.0, percentual: 12 },
            { nome: "Telefonia", valor: 12000.5, percentual: 10 },
            { nome: "Outros", valor: 6500.0, percentual: 5 },
          ],
          historico: [
            { mes: "Jan/2025", valor: 12500.0 },
            { mes: "Dez/2024", valor: 11800.0 },
            { mes: "Nov/2024", valor: 13200.0 },
            { mes: "Out/2024", valor: 10900.0 },
            { mes: "Set/2024", valor: 14100.0 },
            { mes: "Ago/2024", valor: 12300.0 },
          ],
        },
      };

      setDeputado(deputadoComOrcamento);
      setLoading(false);
    }, 1000);
  }, [id]);

  const voltarPaginaAnterior = () => {
    navigate(-1); // Volta para a página anterior (pode ser Searched.jsx ou Home.jsx)
  };

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
          <button className="btn-voltar" onClick={voltarPaginaAnterior}>
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="deputado-detalhes">
      <div className="deputado-detalhes__container">
        {/* Botão de volta */}
        <div className="deputado-detalhes__header-actions">
          <button className="btn-voltar" onClick={voltarPaginaAnterior}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
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
          <button
            className={`aba-botao ${
              abaSelecionada === "orcamento" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("orcamento")}
          >
            <DollarSign size={16} />
            Orçamento
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

          {/* aba de Orçamento */}
          {abaSelecionada === "orcamento" && (
            <div className="aba-conteudo">
              <h3 className="aba-titulo">Análise Orçamentária</h3>

              {/* Resumo financeiro */}
              <div className="orcamento-resumo">
                <div className="orcamento-card">
                  <div className="orcamento-card__icone">
                    <DollarSign size={24} />
                  </div>
                  <div className="orcamento-card__info">
                    <span className="orcamento-valor">
                      R${" "}
                      {deputado.orcamento.totalGasto.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="orcamento-label">Total Gasto em 2024</span>
                  </div>
                </div>
              </div>

              {/* Gráfico de categorias */}
              <div className="orcamento-secao">
                <h4 className="orcamento-secao__titulo">
                  <PieChart size={20} />
                  Gastos por Categoria
                </h4>
                <div className="categorias-lista">
                  {deputado.orcamento.categorias.map((categoria, index) => (
                    <div key={index} className="categoria-item">
                      <div className="categoria-info">
                        <span className="categoria-nome">{categoria.nome}</span>
                        <span className="categoria-valor">
                          R${" "}
                          {categoria.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="categoria-barra">
                        <div
                          className="categoria-progresso"
                          style={{ width: `${categoria.percentual}%` }}
                        ></div>
                      </div>
                      <span className="categoria-percentual">
                        {categoria.percentual}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico mensal */}
              <div className="orcamento-secao">
                <h4 className="orcamento-secao__titulo">
                  <TrendingUp size={20} />
                  Histórico Mensal
                </h4>
                <div className="historico-lista">
                  {deputado.orcamento.historico.map((mes, index) => (
                    <div key={index} className="historico-item">
                      <span className="historico-mes">{mes.mes}</span>
                      <span className="historico-valor">
                        R${" "}
                        {mes.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeputadosPagina;
