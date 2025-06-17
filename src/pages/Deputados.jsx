/* eslint-disable no-unused-vars */
"use client";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, AlertCircle } from "lucide-react";
import DeputadoDetalhes from "../components/DeputadoDetalhes";

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
 * Componente principal da página de deputados
 * Integrado com a estrutura existente do projeto
 */
const DeputadosPagina = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Se não há ID, redireciona para busca
  if (!id) {
    return (
      <div className="deputado-erro">
        <h2>ID do deputado não fornecido</h2>
        <p>Por favor, acesse esta página através de uma busca válida.</p>
      </div>
    );
  }

  // Renderiza o componente de detalhes atualizado
  return <DeputadoDetalhes />;
};

export default DeputadosPagina;
