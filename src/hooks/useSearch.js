import { useState, useCallback } from 'react';
import { deputadosService, senadoresService } from '../services/api';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  // Busca deputados
  const searchDeputados = useCallback(async (filtros) => {
    try {
      setLoading(true);
      setError(null);
      const data = await deputadosService.listarDeputados(filtros);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erro ao buscar deputados');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca senadores
  const searchSenadores = useCallback(async (filtros) => {
    try {
      setLoading(true);
      setError(null);
      const data = await senadoresService.listarSenadores(filtros);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erro ao buscar senadores');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca detalhes de um deputado
  const getDeputadoDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await deputadosService.buscarDetalhesDeputado(id);
      return data;
    } catch (err) {
      setError(err.message || 'Erro ao buscar detalhes do deputado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca detalhes de um senador
  const getSenadorDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await senadoresService.buscarDetalhesSenador(id);
      return data;
    } catch (err) {
      setError(err.message || 'Erro ao buscar detalhes do senador');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    results,
    searchDeputados,
    searchSenadores,
    getDeputadoDetails,
    getSenadorDetails,
  };
};
