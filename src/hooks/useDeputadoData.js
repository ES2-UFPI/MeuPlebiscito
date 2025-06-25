"use client";

/**
 * Hook personalizado para gerenciar dados de deputado
 * CORRIGIDO: Usa apenas endpoint principal que existe no backend
 */

import { useState, useEffect, useCallback } from "react";
import { deputadosService } from "../services/api";

// Cache simples para evitar requisições desnecessárias
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook principal para gerenciar dados de deputado
 * CORRIGIDO: Não faz mais chamadas para endpoints inexistentes
 */
export const useDeputadoData = (id) => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Status de carregamento por seção (para compatibilidade)
  const [statusCarregamento, setStatusCarregamento] = useState({
    participacao: false,
    projetos: false,
    atividades: false,
    orcamento: false,
  });

  /**
   * Verifica se os dados estão em cache e ainda são válidos
   */
  const verificarCache = useCallback((chave) => {
    if (cache.has(chave)) {
      const { dados, timestamp } = cache.get(chave);
      const agora = Date.now();

      if (agora - timestamp < CACHE_DURATION) {
        console.log(`📦 [Cache] Dados encontrados no cache para: ${chave}`);
        return dados;
      } else {
        console.log(`⏰ [Cache] Cache expirado para: ${chave}`);
        cache.delete(chave);
      }
    }
    return null;
  }, []);

  /**
   * Salva dados no cache
   */
  const salvarCache = useCallback((chave, dados) => {
    cache.set(chave, {
      dados,
      timestamp: Date.now(),
    });
    console.log(`💾 [Cache] Dados salvos no cache para: ${chave}`);
  }, []);

  /**
   * Função para carregar dados com retry automático
   */
  const carregarDadosComRetry = useCallback(
    async (funcaoCarregamento, chave, maxTentativas = 3) => {
      let tentativa = 0;

      while (tentativa < maxTentativas) {
        try {
          console.log(
            `🔄 [${chave}] Tentativa ${tentativa + 1}/${maxTentativas}`
          );
          const resultado = await funcaoCarregamento();

          console.log(`✅ [${chave}] Carregamento bem-sucedido`);
          return resultado;
        } catch (error) {
          tentativa++;
          console.warn(
            `⚠️ [${chave}] Tentativa ${tentativa} falhou:`,
            error.message
          );

          if (tentativa === maxTentativas) {
            console.error(`❌ [${chave}] Todas as tentativas falharam:`, error);
            throw error;
          }

          const tempoEspera = Math.pow(2, tentativa) * 1000;
          console.log(
            `⏳ [${chave}] Aguardando ${tempoEspera}ms antes da próxima tentativa`
          );
          await new Promise((resolve) => setTimeout(resolve, tempoEspera));
        }
      }
    },
    []
  );

  /**
   * CORRIGIDO: Carrega todos os dados do deputado de uma só vez
   * Usa apenas o endpoint principal que existe no backend
   */
  const carregarDados = useCallback(async () => {
    if (!id) {
      setCarregando(false);
      setErro("ID do deputado não fornecido");
      return;
    }

    const deputadoId = Number.parseInt(id);
    if (isNaN(deputadoId) || deputadoId <= 0) {
      setCarregando(false);
      setErro("ID do deputado inválido");
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      console.log(
        `🔍 [useDeputadoData] Iniciando carregamento do deputado ${deputadoId}`
      );

      // Verifica cache primeiro
      const chaveCache = `deputado_${deputadoId}`;
      const dadosCache = verificarCache(chaveCache);

      if (dadosCache) {
        setDados(dadosCache);
        setStatusCarregamento({
          participacao: true,
          projetos: true,
          atividades: true,
          orcamento: true,
        });
        setCarregando(false);
        return;
      }

      // CORRIGIDO: Carrega dados completos com retry usando apenas endpoint principal
      const dadosCompletos = await carregarDadosComRetry(
        () => deputadosService.buscarDetalhesDeputado(deputadoId),
        "DadosCompletos"
      );

      // Salva no cache e atualiza estado
      salvarCache(chaveCache, dadosCompletos);
      setDados(dadosCompletos);

      // Marca todas as seções como carregadas com sucesso
      setStatusCarregamento({
        participacao: true,
        projetos: true,
        atividades: true,
        orcamento: true,
      });

      console.log(
        `✅ [useDeputadoData] Deputado ${deputadoId} carregado com sucesso:`,
        dadosCompletos.nome
      );
    } catch (error) {
      console.error(
        `❌ [useDeputadoData] Erro ao carregar deputado ${deputadoId}:`,
        error
      );

      let mensagemErro = "Erro ao carregar dados do deputado.";

      if (error.message.includes("404")) {
        mensagemErro = "Deputado não encontrado.";
      } else if (error.message.includes("conexão")) {
        mensagemErro = "Erro de conexão. Verifique sua internet.";
      } else if (error.message.includes("500")) {
        mensagemErro = "Erro no servidor. Tente novamente em alguns instantes.";
      }

      setErro(mensagemErro);

      setStatusCarregamento({
        participacao: false,
        projetos: false,
        atividades: false,
        orcamento: false,
      });
    } finally {
      setCarregando(false);
    }
  }, [id, verificarCache, salvarCache, carregarDadosComRetry]);

  /**
   * CORRIGIDO: Função para atualizar dados específicos
   * Agora recarrega tudo pois os dados vêm de um endpoint só
   */
  const atualizarDados = useCallback(
    async (tipo) => {
      if (!id) {
        console.warn(
          `⚠️ [atualizarDados] ID não disponível para atualizar ${tipo}`
        );
        return;
      }

      console.log(
        `🔄 [atualizarDados] Recarregando todos os dados para atualizar ${tipo}`
      );

      // Limpa cache e recarrega tudo
      const deputadoId = Number.parseInt(id);
      const chaveCache = `deputado_${deputadoId}`;
      cache.delete(chaveCache);

      await carregarDados();
    },
    [id, carregarDados]
  );

  /**
   * Função para recarregar todos os dados (limpa cache)
   */
  const recarregarTudo = useCallback(() => {
    if (id) {
      const chaveCache = `deputado_${Number.parseInt(id)}`;
      cache.delete(chaveCache);
      console.log(`🗑️ [recarregarTudo] Cache limpo para deputado ${id}`);
    }
    carregarDados();
  }, [id, carregarDados]);

  // Carrega dados quando o ID muda
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    dados,
    carregando,
    erro,
    statusCarregamento,
    atualizarDados,
    recarregarTudo,
  };
};

/**
 * Hook para busca de deputados com filtros
 * Compatível com Searched.jsx e BuscaDetalhada.jsx existentes
 */
export const useBuscaDeputados = () => {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});

  /**
   * Executa busca com filtros
   */
  const buscar = useCallback(async (filtros = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      setFiltrosAtivos(filtros);

      console.log(
        "🔍 [useBuscaDeputados] Executando busca com filtros:",
        filtros
      );

      const deputados = await deputadosService.listarDeputados(filtros);

      setResultados(deputados);

      console.log(
        `✅ [useBuscaDeputados] Busca concluída: ${deputados.length} deputados encontrados`
      );
    } catch (error) {
      console.error("❌ [useBuscaDeputados] Erro na busca:", error);

      let mensagemErro = "Erro ao buscar deputados.";
      if (error.message.includes("conexão")) {
        mensagemErro = "Erro de conexão. Verifique sua internet.";
      }

      setErro(mensagemErro);
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  /**
   * Limpa filtros e resultados
   */
  const limpar = useCallback(() => {
    setResultados([]);
    setFiltrosAtivos({});
    setErro(null);
    console.log("🧹 [useBuscaDeputados] Busca limpa");
  }, []);

  return {
    resultados,
    carregando,
    erro,
    filtrosAtivos,
    buscar,
    limpar,
  };
};
