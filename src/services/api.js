/* eslint-disable no-unused-vars */
/**
 * Serviço de API CORRIGIDO para integração com backend
 * PROBLEMA RESOLVIDO: Removidas chamadas para endpoints inexistentes
 */

// Configuração da URL base da API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Classe base para serviços de API
 * Integrada com a arquitetura existente
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Método genérico para fazer requisições HTTP
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções da requisição
   * @returns {Promise} - Promise com os dados da resposta
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🚀 [API] Fazendo requisição para: ${url}`);
      console.log(`📋 [API] Parâmetros:`, config);

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.detail || `Erro HTTP: ${response.status}`;

        console.error(`❌ [API] Erro na requisição:`, {
          url,
          status: response.status,
          error: errorMessage,
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ [API] Requisição bem-sucedida para: ${url}`);
      console.log(`📊 [API] Dados recebidos:`, data);

      return data;
    } catch (error) {
      console.error(`❌ [API] Erro na requisição para ${url}:`, error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Erro de conexão. Verifique se o servidor está funcionando."
        );
      }

      throw error;
    }
  }
}

/**
 * Serviço específico para operações com deputados
 * CORRIGIDO: Usa apenas endpoints que existem no backend
 */
class DeputadosService extends ApiService {
  /**
   * Lista deputados com filtros opcionais
   * Compatível com SearchBar.jsx e BuscaDetalhada.jsx existentes
   */
  async listarDeputados(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.nome && filtros.nome.trim()) {
      params.append("nome", filtros.nome.trim());
    }
    if (filtros.partido && filtros.partido.trim()) {
      params.append("partido", filtros.partido.trim().toUpperCase());
    }
    if (filtros.estado && filtros.estado.trim()) {
      params.append("estado", filtros.estado.trim().toUpperCase());
    }
    if (filtros.sexo && filtros.sexo.trim()) {
      params.append("sexo", filtros.sexo.trim().toUpperCase());
    }

    const queryString = params.toString();
    const endpoint = `/api/deputados/${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint);
  }

  /**
   * Busca deputado completo por ID
   * CORRIGIDO: Usa apenas o endpoint principal que retorna todos os dados
   */
  async buscarDetalhesDeputado(id) {
    if (!id || id <= 0) {
      throw new Error(
        "ID do deputado é obrigatório e deve ser um número positivo"
      );
    }

    console.log(`🔍 [API] Buscando deputado completo: ${id}`);
    return this.request(`/api/deputados/${id}`);
  }

  /**
   * MÉTODOS CORRIGIDOS: Agora extraem dados do endpoint principal
   * Mantidos para compatibilidade com hooks existentes
   */
  async buscarParticipacoes(id) {
    console.log(`📅 [API] Extraindo participações do deputado: ${id}`);
    const deputado = await this.buscarDetalhesDeputado(id);
    return deputado.participacoes || [];
  }

  async buscarProjetos(id) {
    console.log(`📜 [API] Extraindo projetos do deputado: ${id}`);
    const deputado = await this.buscarDetalhesDeputado(id);
    return deputado.projetos || [];
  }

  async buscarAtividades(id) {
    console.log(`👥 [API] Extraindo atividades do deputado: ${id}`);
    const deputado = await this.buscarDetalhesDeputado(id);
    return deputado.atividades || { mandatos: [], comissoes: [] };
  }

  async buscarOrcamento(id, ano = null) {
    console.log(
      `💰 [API] Extraindo orçamento do deputado: ${id} (ano: ${ano})`
    );
    const deputado = await this.buscarDetalhesDeputado(id);
    return (
      deputado.orcamento || {
        totalGasto: 0,
        categorias: [],
        historico: [],
      }
    );
  }

  /**
   * Verifica se a API está funcionando
   */
  async verificarSaude() {
    return this.request("/api/deputados/health/check");
  }
}

/**
 * Serviço para senadores (placeholder para compatibilidade)
 * Mantido para não quebrar código existente
 */
class SenadoresService extends ApiService {
  async listarSenadores(filtros = {}) {
    console.warn("⚠️ [API] Serviço de senadores ainda não implementado");
    return [];
  }

  async buscarDetalhesSenador(id) {
    console.warn("⚠️ [API] Serviço de senadores ainda não implementado");
    return null;
  }
}

// Exporta instâncias dos serviços (padrão singleton)
export const deputadosService = new DeputadosService();
export const senadoresService = new SenadoresService();

// Exporta também as classes para casos especiais
export { DeputadosService, SenadoresService };

// Configurações úteis para o frontend
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

/**
 * Utilitário para verificar se a API está online
 */
export const verificarConexaoAPI = async () => {
  try {
    await deputadosService.verificarSaude();
    return true;
  } catch (error) {
    console.error("❌ [API] API não está respondendo:", error);
    return false;
  }
};
