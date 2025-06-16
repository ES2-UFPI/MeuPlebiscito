"use client";

/**
 * Página de detalhes do deputado
 * Atualizada para integração com a estrutura existente
 */

import { useState } from "react";
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
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useDeputadoData } from "../hooks/useDeputadoData";

/**
 * Componente de carregamento para seções individuais
 */
const LoadingSection = ({ message = "Carregando dados..." }) => (
  <div className="loading-section">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

/**
 * Componente de erro para seções individuais
 */
const ErrorSection = ({ onRetry, message = "Erro ao carregar dados" }) => (
  <div className="error-section">
    <AlertCircle size={24} className="error-icon" />
    <p className="error-message">{message}</p>
    {onRetry && (
      <button className="btn-retry" onClick={onRetry}>
        <RefreshCw size={16} />
        Tentar novamente
      </button>
    )}
  </div>
);

/**
 * Componente para lista vazia
 */
// eslint-disable-next-line no-unused-vars
const EmptyState = ({ icon: Icon, message }) => (
  <div className="empty-state">
    <Icon size={48} className="empty-icon" />
    <p className="empty-message">{message}</p>
  </div>
);

/**
 * Componente principal da página de deputados
 * Integrado com a estrutura existente do projeto
 */
const Deputados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abaSelecionada, setAbaSelecionada] = useState("participacao");

  // Usa o hook personalizado para gerenciar os dados
  const {
    dados: deputado,
    carregando,
    erro,
    statusCarregamento,
    atualizarDados,
    recarregarTudo,
  } = useDeputadoData(id);

  /**
   * Navega de volta para a página anterior
   */
  const voltarPaginaAnterior = () => {
    navigate(-1);
  };

  /**
   * Formata data para exibição em português
   */
  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";

    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  };

  /**
   * Formata valor monetário para exibição
   */
  const formatarMoeda = (valor) => {
    if (typeof valor !== "number") return "R$ 0,00";

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  /**
   * Renderiza o conteúdo da aba selecionada
   */
  const renderizarConteudoAba = () => {
    if (!deputado) {
      return <LoadingSection message="Carregando informações do deputado..." />;
    }

    // Verifica se a seção específica teve erro
    if (!statusCarregamento[abaSelecionada]) {
      return (
        <ErrorSection
          onRetry={() => atualizarDados(abaSelecionada)}
          message={`Erro ao carregar dados de ${abaSelecionada}`}
        />
      );
    }

    switch (abaSelecionada) {
      case "participacao":
        return (
          <div className="aba-conteudo">
            <div className="aba-header">
              <h3 className="aba-titulo">
                <Users size={20} />
                Participação em Reuniões
              </h3>
              <p className="aba-descricao">
                Eventos e reuniões que o deputado participou recentemente
              </p>
            </div>

            <div className="participacoes-lista">
              {deputado.participacoes && deputado.participacoes.length > 0 ? (
                deputado.participacoes.map((participacao, index) => (
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
                        {participacao.presente ? (
                          <>
                            <CheckCircle size={14} />
                            Presente
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Ausente
                          </>
                        )}
                      </span>
                    </div>
                    <p className="participacao-descricao">
                      {participacao.descricao}
                    </p>
                    <div className="participacao-data">
                      <Calendar size={14} />
                      {formatarData(participacao.data)}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={Users}
                  message="Nenhuma participação encontrada para este deputado"
                />
              )}
            </div>
          </div>
        );

      case "projetos":
        return (
          <div className="aba-conteudo">
            <div className="aba-header">
              <h3 className="aba-titulo">
                <FileText size={20} />
                Projetos de Lei de Autoria
              </h3>
              <p className="aba-descricao">
                Proposições e projetos de lei apresentados pelo deputado
              </p>
            </div>

            <div className="projetos-lista">
              {deputado.projetos && deputado.projetos.length > 0 ? (
                deputado.projetos.map((projeto, index) => (
                  <div key={index} className="projeto-item">
                    <div className="projeto-item__cabecalho">
                      <span className="projeto-numero">{projeto.numero}</span>
                      <span
                        className={`projeto-status status-${projeto.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {projeto.status === "Em Tramitação" && (
                          <Clock size={14} />
                        )}
                        {projeto.status === "Aprovado" && (
                          <CheckCircle size={14} />
                        )}
                        {projeto.status === "Arquivado" && (
                          <XCircle size={14} />
                        )}
                        {projeto.status}
                      </span>
                    </div>
                    <h4 className="projeto-titulo">{projeto.titulo}</h4>
                    <div className="projeto-data">
                      <Calendar size={14} />
                      Apresentado em {formatarData(projeto.data)}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={FileText}
                  message="Nenhum projeto de lei encontrado para este deputado"
                />
              )}
            </div>
          </div>
        );

      case "atividades":
        return (
          <div className="aba-conteudo">
            <div className="aba-header">
              <h3 className="aba-titulo">
                <Award size={20} />
                Atividades e Cargos
              </h3>
              <p className="aba-descricao">
                Mandatos, comissões e cargos ocupados pelo deputado
              </p>
            </div>

            <div className="atividades-grid">
              <div className="atividade-secao">
                <h4 className="atividade-secao__titulo">
                  <User size={16} />
                  Mandatos
                </h4>
                <ul className="atividade-lista">
                  {deputado.atividades?.mandatos &&
                  deputado.atividades.mandatos.length > 0 ? (
                    deputado.atividades.mandatos.map((mandato, index) => (
                      <li key={index} className="atividade-item">
                        <CheckCircle size={14} className="atividade-icon" />
                        {mandato}
                      </li>
                    ))
                  ) : (
                    <li className="atividade-item atividade-item--vazio">
                      Nenhum mandato registrado
                    </li>
                  )}
                </ul>
              </div>

              <div className="atividade-secao">
                <h4 className="atividade-secao__titulo">
                  <Users size={16} />
                  Comissões e Órgãos
                </h4>
                <ul className="atividade-lista">
                  {deputado.atividades?.comissoes &&
                  deputado.atividades.comissoes.length > 0 ? (
                    deputado.atividades.comissoes.map((comissao, index) => (
                      <li key={index} className="atividade-item">
                        <Award size={14} className="atividade-icon" />
                        {comissao}
                      </li>
                    ))
                  ) : (
                    <li className="atividade-item atividade-item--vazio">
                      Nenhuma comissão registrada
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );

      case "orcamento":
        return (
          <div className="aba-conteudo">
            <div className="aba-header">
              <h3 className="aba-titulo">
                <DollarSign size={20} />
                Análise Orçamentária
              </h3>
              <p className="aba-descricao">
                Gastos e despesas do gabinete em {new Date().getFullYear()}
              </p>
            </div>

            {deputado.orcamento ? (
              <>
                {/* Resumo Total */}
                <div className="orcamento-resumo">
                  <div className="orcamento-card orcamento-card--principal">
                    <div className="orcamento-card__icone">
                      <DollarSign size={32} />
                    </div>
                    <div className="orcamento-card__info">
                      <span className="orcamento-valor">
                        {formatarMoeda(deputado.orcamento.totalGasto)}
                      </span>
                      <span className="orcamento-label">
                        Total Gasto em {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gastos por Categoria */}
                <div className="orcamento-secao">
                  <h4 className="orcamento-secao__titulo">
                    <PieChart size={20} />
                    Gastos por Categoria
                  </h4>
                  <div className="categorias-lista">
                    {deputado.orcamento.categorias &&
                    deputado.orcamento.categorias.length > 0 ? (
                      deputado.orcamento.categorias.map((categoria, index) => (
                        <div key={index} className="categoria-item">
                          <div className="categoria-info">
                            <span className="categoria-nome">
                              {categoria.nome}
                            </span>
                            <span className="categoria-valor">
                              {formatarMoeda(categoria.valor)}
                            </span>
                          </div>
                          <div className="categoria-barra">
                            <div
                              className="categoria-progresso"
                              style={{
                                width: `${Math.min(
                                  categoria.percentual || 0,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="categoria-percentual">
                            {(categoria.percentual || 0).toFixed(1)}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="lista-vazia-texto">
                        Nenhuma categoria de gasto encontrada
                      </p>
                    )}
                  </div>
                </div>

                {/* Histórico Mensal */}
                <div className="orcamento-secao">
                  <h4 className="orcamento-secao__titulo">
                    <TrendingUp size={20} />
                    Evolução Mensal dos Gastos
                  </h4>
                  <div className="historico-lista">
                    {deputado.orcamento.historico &&
                    deputado.orcamento.historico.length > 0 ? (
                      deputado.orcamento.historico.map((mes, index) => (
                        <div key={index} className="historico-item">
                          <span className="historico-mes">{mes.mes}</span>
                          <span className="historico-valor">
                            {formatarMoeda(mes.valor)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="lista-vazia-texto">
                        Nenhum histórico mensal encontrado
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={DollarSign}
                message="Dados de orçamento não disponíveis para este deputado"
              />
            )}
          </div>
        );

      default:
        return (
          <div className="aba-conteudo">
            <p>Aba não encontrada</p>
          </div>
        );
    }
  };

  // Estados de carregamento e erro principais
  if (carregando) {
    return (
      <div className="pagina-deputado">
        <div className="pagina-deputado__carregando">
          <LoadingSection message="Carregando informações do deputado..." />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="pagina-deputado">
        <div className="pagina-deputado__erro">
          <AlertCircle size={48} />
          <h3>Erro ao carregar deputado</h3>
          <p>{erro}</p>
          <div className="erro-acoes">
            <button className="btn-retry" onClick={recarregarTudo}>
              <RefreshCw size={16} />
              Tentar novamente
            </button>
            <button className="btn-voltar" onClick={voltarPaginaAnterior}>
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!deputado) {
    return (
      <div className="pagina-deputado">
        <div className="pagina-deputado__sem-resultados">
          <AlertCircle size={48} />
          <h3>Deputado não encontrado</h3>
          <p>
            O deputado solicitado não foi encontrado em nossa base de dados.
          </p>
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
        {/* Cabeçalho com botão de volta */}
        <div className="deputado-detalhes__header-actions">
          <button className="btn-voltar" onClick={voltarPaginaAnterior}>
            <ArrowLeft size={20} />
            Voltar
          </button>
          <button
            className="btn-atualizar"
            onClick={recarregarTudo}
            title="Atualizar dados"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Cabeçalho com informações básicas */}
        <div className="deputado-detalhes__cabecalho">
          <div className="deputado-detalhes__foto-container">
            <img
              src={deputado.urlFoto || "/placeholder.svg?height=200&width=200"}
              alt={`Foto de ${deputado.nome || "Deputado"}`}
              className="deputado-detalhes__foto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg?height=200&width=200";
              }}
            />
          </div>

          <div className="deputado-detalhes__info-principal">
            <h1 className="deputado-detalhes__nome">
              {deputado.nome || "Nome não disponível"}
            </h1>
            <p className="deputado-detalhes__cargo">Deputado Federal</p>
            <div className="deputado-detalhes__metadados">
              <span className="deputado-detalhes__partido">
                {deputado.siglaPartido || "Partido não informado"}
              </span>
              <span className="separador">•</span>
              <span className="deputado-detalhes__estado">
                {deputado.siglaUf || "Estado não informado"}
              </span>
              {deputado.situacao && (
                <>
                  <span className="separador">•</span>
                  <span className="deputado-detalhes__situacao">
                    {deputado.situacao}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="deputado-detalhes__contato">
            {deputado.email && (
              <div className="contato-item">
                <Mail size={16} />
                <span className="contato-label">Email:</span>
                <a
                  href={`mailto:${deputado.email}`}
                  className="contato-valor contato-link"
                >
                  {deputado.email}
                </a>
              </div>
            )}
            {deputado.telefone && (
              <div className="contato-item">
                <Phone size={16} />
                <span className="contato-label">Telefone:</span>
                <a
                  href={`tel:${deputado.telefone}`}
                  className="contato-valor contato-link"
                >
                  {deputado.telefone}
                </a>
              </div>
            )}
            {deputado.gabinete && (
              <div className="contato-item">
                <MapPin size={16} />
                <span className="contato-label">Gabinete:</span>
                <span className="contato-valor">{deputado.gabinete}</span>
              </div>
            )}
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
            <span>Participação</span>
          </button>
          <button
            className={`aba-botao ${
              abaSelecionada === "projetos" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("projetos")}
          >
            <FileText size={16} />
            <span>Projetos</span>
          </button>
          <button
            className={`aba-botao ${
              abaSelecionada === "atividades" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("atividades")}
          >
            <Award size={16} />
            <span>Atividades</span>
          </button>
          <button
            className={`aba-botao ${
              abaSelecionada === "orcamento" ? "ativo" : ""
            }`}
            onClick={() => setAbaSelecionada("orcamento")}
          >
            <DollarSign size={16} />
            <span>Orçamento</span>
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div className="deputado-detalhes__conteudo">
          {renderizarConteudoAba()}
        </div>
      </div>
    </div>
  );
};

export default Deputados;
