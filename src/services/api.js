import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço para Deputados
export const deputadosService = {
  // Lista deputados com filtros
  listarDeputados: async (filtros = {}) => {
    const { nome, partido, estado, sexo } = filtros;
    const params = new URLSearchParams();
    
    if (nome) params.append('nome', nome);
    if (partido) params.append('partido', partido);
    if (estado) params.append('estado', estado);
    if (sexo) params.append('sexo', sexo);

    const response = await api.get(`/deputados?${params.toString()}`);
    return response.data;
  },

  // Busca detalhes de um deputado
  buscarDetalhesDeputado: async (id) => {
    const response = await api.get(`/deputados/${id}`);
    return response.data;
  },

  // Busca despesas totais de um deputado
  buscarDespesasTotais: async (params) => {
    const response = await api.get('/deputados/despesas/total', { params });
    return response.data;
  },
};

// Serviço para Senadores
export const senadoresService = {
  // Lista senadores com filtros
  listarSenadores: async (filtros = {}) => {
    const { uf, participacao } = filtros;
    const params = new URLSearchParams();
    
    if (uf) params.append('uf', uf);
    if (participacao) params.append('participacao', participacao);

    const response = await api.get(`/senadores?${params.toString()}`);
    return response.data;
  },

  // Busca detalhes de um senador
  buscarDetalhesSenador: async (id) => {
    const response = await api.get(`/senadores/${id}`);
    return response.data;
  },
};