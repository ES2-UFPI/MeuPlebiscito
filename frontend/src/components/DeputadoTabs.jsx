/* eslint-disable no-unused-vars */
"use client";

/**
 * Componente de abas para exibir dados do deputado
 * Criado para organizar melhor a visualização dos dados
 */

import { useState } from "react";
import {
  Calendar,
  FileText,
  Users,
  Award,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  PieChart,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

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
const EmptyState = ({ icon: Icon, message }) => (
  <div className="empty-state">
    <Icon size={48} className="empty-icon" />
    <p className="empty-message">{message}</p>
  </div>
);

/**
 * Aba de Participações
 */
const ParticipacaoTab = ({ deputado, onRetry }) => {
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
                <span className="participacao-tipo">{participacao.tipo}</span>
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
              <p className="participacao-descricao">{participacao.descricao}</p>
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
};

/**
 * Aba de Projetos/Proposições
 */
const ProjetosTab = ({ deputado, onRetry }) => {
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
   * Retorna ícone baseado no status do projeto
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case "Em Tramitação":
        return <Clock size={14} />;
      case "Aprovado":
        return <CheckCircle size={14} />;
      case "Arquivado":
        return <XCircle size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  return (
    <div className="aba-conteudo">
      <div className="aba-header">
        <h3 className="aba-titulo">
          <FileText size={20} />
          Proposições de Autoria
        </h3>
        <p className="aba-descricao">
          Projetos de lei e proposições apresentados pelo deputado
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
                  {getStatusIcon(projeto.status)}
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
            message="Nenhuma proposição encontrada para este deputado"
          />
        )}
      </div>
    </div>
  );
};

/**
 * Aba de Atividades
 */
const AtividadesTab = ({ deputado, onRetry }) => {
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
            <Users size={16} />
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
            <Award size={16} />
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
};

/**
 * Aba de Orçamento
 */
const OrcamentoTab = ({ deputado, onRetry }) => {
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
                      <span className="categoria-nome">{categoria.nome}</span>
                      <span className="categoria-valor">
                        {formatarMoeda(categoria.valor)}
                      </span>
                    </div>
                    <div className="categoria-barra">
                      <div
                        className="categoria-progresso"
                        style={{
                          width: `${Math.min(categoria.percentual || 0, 100)}%`,
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
};

/**
 * Componente principal das abas do deputado
 */
const DeputadoTabs = ({ deputado, statusCarregamento, onAtualizarDados }) => {
  const [abaSelecionada, setAbaSelecionada] = useState("participacao");

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
          onRetry={() => onAtualizarDados(abaSelecionada)}
          message={`Erro ao carregar dados de ${abaSelecionada}`}
        />
      );
    }

    switch (abaSelecionada) {
      case "participacao":
        return (
          <ParticipacaoTab
            deputado={deputado}
            onRetry={() => onAtualizarDados("participacao")}
          />
        );
      case "projetos":
        return (
          <ProjetosTab
            deputado={deputado}
            onRetry={() => onAtualizarDados("projetos")}
          />
        );
      case "atividades":
        return (
          <AtividadesTab
            deputado={deputado}
            onRetry={() => onAtualizarDados("atividades")}
          />
        );
      case "orcamento":
        return (
          <OrcamentoTab
            deputado={deputado}
            onRetry={() => onAtualizarDados("orcamento")}
          />
        );
      default:
        return (
          <div className="aba-conteudo">
            <p>Aba não encontrada</p>
          </div>
        );
    }
  };

  return (
    <div className="deputado-tabs">
      {/* Navegação por abas */}
      <div className="deputado-tabs__navegacao">
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
          <span>Proposições</span>
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
      <div className="deputado-tabs__conteudo">{renderizarConteudoAba()}</div>
    </div>
  );
};

export default DeputadoTabs;
