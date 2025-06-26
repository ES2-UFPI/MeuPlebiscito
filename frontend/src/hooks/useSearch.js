"use client";

/**
 * Hook de busca unificado para deputados e senadores
 * Atualizado para integração com backend existente
 */

import { useState, useCallback } from "react";
import { deputadosService, senadoresService } from "../services/api";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  /**
   * Busca deputados com filtros
   * Integrado com o serviço atualizado
   */
  const searchDeputados = useCallback(async (filtros) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 [useSearch] Buscando deputados com filtros:", filtros);

      const data = await deputadosService.listarDeputados(filtros);
      setResults(data);

      console.log(`✅ [useSearch] Encontrados ${data.length} deputados`);
      return data;
    } catch (err) {
      const errorMessage = err.message || "Erro ao buscar deputados";
      console.error("❌ [useSearch] Erro ao buscar deputados:", errorMessage);

      setError(errorMessage);
      setResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca senadores com filtros
   * Placeholder para compatibilidade
   */
  const searchSenadores = useCallback(async (filtros) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 [useSearch] Buscando senadores com filtros:", filtros);
      console.warn("⚠️ [useSearch] Busca de senadores ainda não implementada");

      const data = await senadoresService.listarSenadores(filtros);
      setResults(data);

      return data;
    } catch (err) {
      const errorMessage = err.message || "Erro ao buscar senadores";
      console.error("❌ [useSearch] Erro ao buscar senadores:", errorMessage);

      setError(errorMessage);
      setResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca detalhes de um deputado específico
   */
  const getDeputadoDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [useSearch] Buscando detalhes do deputado ${id}`);

      const data = await deputadosService.buscarDetalhesDeputado(id);

      console.log(`✅ [useSearch] Detalhes do deputado ${id} carregados`);
      return data;
    } catch (err) {
      const errorMessage = err.message || "Erro ao buscar detalhes do deputado";
      console.error(
        `❌ [useSearch] Erro ao buscar deputado ${id}:`,
        errorMessage
      );

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca detalhes de um senador específico
   * Placeholder para compatibilidade
   */
  const getSenadorDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [useSearch] Buscando detalhes do senador ${id}`);
      console.warn("⚠️ [useSearch] Busca de senadores ainda não implementada");

      const data = await senadoresService.buscarDetalhesSenador(id);

      return data;
    } catch (err) {
      const errorMessage = err.message || "Erro ao buscar detalhes do senador";
      console.error(
        `❌ [useSearch] Erro ao buscar senador ${id}:`,
        errorMessage
      );

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa resultados e erros
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    console.log("🧹 [useSearch] Resultados limpos");
  }, []);

  /**
   * Limpa apenas erros
   */
  const clearError = useCallback(() => {
    setError(null);
    console.log("🧹 [useSearch] Erro limpo");
  }, []);

  return {
    loading,
    error,
    results,
    searchDeputados,
    searchSenadores,
    getDeputadoDetails,
    getSenadorDetails,
    clearResults,
    clearError,
  };
};
