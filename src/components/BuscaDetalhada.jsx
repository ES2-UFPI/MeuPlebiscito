/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BuscaDetalhada = ({ onSearch, onClose, isOpen }) => {
  if (!isOpen) return null;

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [filtros, setFiltros] = useState({
    nome: "",
    partidos: [],
    estados: [],
    genero: "",
    idade: { min: "", max: "" },
    comissoes: [],
  });

  // Dados de exemplo para os filtros
  const partidos = [
    { id: "PT", nome: "Partido dos Trabalhadores", sigla: "PT" },
    {
      id: "PSDB",
      nome: "Partido da Social Democracia Brasileira",
      sigla: "PSDB",
    },
    { id: "MDB", nome: "Movimento Democrático Brasileiro", sigla: "MDB" },
    { id: "PL", nome: "Partido Liberal", sigla: "PL" },
    { id: "PP", nome: "Progressistas", sigla: "PP" },
    { id: "PDT", nome: "Partido Democrático Trabalhista", sigla: "PDT" },
    { id: "REPUBLICANOS", nome: "Republicanos", sigla: "REPUBLICANOS" },
    { id: "PSB", nome: "Partido Socialista Brasileiro", sigla: "PSB" },
    { id: "UNIÃO", nome: "União Brasil", sigla: "UNIÃO" },
    { id: "PSOL", nome: "Partido Socialismo e Liberdade", sigla: "PSOL" },
  ];

  const estados = [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" },
  ];

  const generos = [
    { id: "M", nome: "Masculino" },
    { id: "F", nome: "Feminino" },
  ];

  const comissoes = [
    "Comissão de Educação",
    "Comissão de Saúde",
    "Comissão de Meio Ambiente",
    "Comissão de Direitos Humanos",
    "Comissão de Economia",
  ];

  const handlePartidoToggle = (partido) => {
    setFiltros((prev) => ({
      ...prev,
      partidos: prev.partidos.includes(partido.id)
        ? prev.partidos.filter((p) => p !== partido.id)
        : [...prev.partidos, partido.id],
    }));
  };

  const handleEstadoToggle = (estado) => {
    setFiltros((prev) => ({
      ...prev,
      estados: prev.estados.includes(estado.sigla)
        ? prev.estados.filter((e) => e !== estado.sigla)
        : [...prev.estados, estado.sigla],
    }));
  };

  const handleGeneroChange = (genero) => {
    setFiltros((prev) => ({
      ...prev,
      genero: prev.genero === genero ? "" : genero,
    }));
  };

  const handleComissaoToggle = (comissao) => {
    setFiltros((prev) => ({
      ...prev,
      comissoes: prev.comissoes.includes(comissao)
        ? prev.comissoes.filter((c) => c !== comissao)
        : [...prev.comissoes, comissao],
    }));
  };

  const proximaEtapa = () => {
    if (etapaAtual < 3) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const executarBusca = () => {
    // Corrigir lógica: se nenhum partido selecionado, buscar em qualquer partido
    const filtrosFinais = {
      ...filtros,
      partidos: filtros.partidos.length === 0 ? "qualquer" : filtros.partidos,
      estados: filtros.estados.length === 0 ? "qualquer" : filtros.estados,
    };
    onSearch(filtrosFinais);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="busca-detalhada-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="busca-detalhada"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="busca-detalhada__header">
              <h2 className="busca-detalhada__titulo">Busca Detalhada</h2>
              <button className="busca-detalhada__fechar" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {/* Wizard Steps */}
            <div className="busca-detalhada__steps">
              <div
                className={`step ${
                  etapaAtual === 1
                    ? "active"
                    : etapaAtual > 1
                    ? "completed"
                    : ""
                }`}
              >
                <div className="step-number">1</div>
                <div className="step-label">Informações Pessoais</div>
              </div>
              <div className="step-connector"></div>
              <div
                className={`step ${
                  etapaAtual === 2
                    ? "active"
                    : etapaAtual > 2
                    ? "completed"
                    : ""
                }`}
              >
                <div className="step-number">2</div>
                <div className="step-label">Informações Políticas</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${etapaAtual === 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <div className="step-label">Período e Ordenação</div>
              </div>
            </div>

            <div className="busca-detalhada__content">
              {etapaAtual === 1 && (
                <div className="busca-detalhada__etapa">
                  <h3 className="etapa-titulo">Informações Pessoais</h3>

                  <div className="campo-grupo">
                    <label className="campo-label">Nome do Deputado</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="Digite o nome ou parte do nome"
                      value={filtros.nome}
                      onChange={(e) =>
                        setFiltros((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="campo-grupo">
                    <label className="campo-label">Gênero</label>
                    <div className="opcoes-grid">
                      {generos.map((genero) => (
                        <button
                          key={genero.id}
                          className={`opcao-item ${
                            filtros.genero === genero.id ? "selecionado" : ""
                          }`}
                          onClick={() => handleGeneroChange(genero.id)}
                        >
                          {genero.nome}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="campo-grupo">
                    <label className="campo-label">Faixa Etária</label>
                    <div className="idade-range">
                      <input
                        type="number"
                        className="campo-input idade-input"
                        placeholder="Idade mínima"
                        value={filtros.idade.min}
                        onChange={(e) =>
                          setFiltros((prev) => ({
                            ...prev,
                            idade: { ...prev.idade, min: e.target.value },
                          }))
                        }
                      />
                      <span className="idade-separador">até</span>
                      <input
                        type="number"
                        className="campo-input idade-input"
                        placeholder="Idade máxima"
                        value={filtros.idade.max}
                        onChange={(e) =>
                          setFiltros((prev) => ({
                            ...prev,
                            idade: { ...prev.idade, max: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {etapaAtual === 2 && (
                <div className="busca-detalhada__etapa">
                  <h3 className="etapa-titulo">Informações Políticas</h3>

                  <div className="campo-grupo">
                    <label className="campo-label">Partidos</label>
                    <p className="campo-descricao">
                      Selecione os partidos de interesse. Se nenhum for
                      selecionado, buscaremos em qualquer partido.
                    </p>
                    <div className="partidos-grid">
                      {partidos.map((partido) => (
                        <button
                          key={partido.id}
                          className={`partido-card ${
                            filtros.partidos.includes(partido.id)
                              ? "selecionado"
                              : ""
                          }`}
                          onClick={() => handlePartidoToggle(partido)}
                        >
                          <span className="partido-sigla">{partido.sigla}</span>
                          <span className="partido-nome">{partido.nome}</span>
                        </button>
                      ))}
                    </div>
                    <div className="info-selecao">
                      {filtros.partidos.length === 0
                        ? "Qualquer partido será considerado"
                        : `${filtros.partidos.length} partido(s) selecionado(s)`}
                    </div>
                  </div>

                  <div className="campo-grupo">
                    <label className="campo-label">Estados</label>
                    <div className="estados-grid">
                      {estados.map((estado) => (
                        <button
                          key={estado.sigla}
                          className={`estado-card ${
                            filtros.estados.includes(estado.sigla)
                              ? "selecionado"
                              : ""
                          }`}
                          onClick={() => handleEstadoToggle(estado)}
                        >
                          <span className="estado-sigla">{estado.sigla}</span>
                          <span className="estado-nome">{estado.nome}</span>
                        </button>
                      ))}
                    </div>
                    <div className="info-selecao">
                      {filtros.estados.length === 0
                        ? "Todos os estados serão considerados"
                        : `${filtros.estados.length} estado(s) selecionado(s)`}
                    </div>
                  </div>
                </div>
              )}

              {etapaAtual === 3 && (
                <div className="busca-detalhada__etapa">
                  <h3 className="etapa-titulo">Período e Ordenação</h3>

                  <div className="campo-grupo">
                    <label className="campo-label">Comissões</label>
                    <div className="comissoes-grid">
                      {comissoes.map((comissao) => (
                        <button
                          key={comissao}
                          className={`comissao-card ${
                            filtros.comissoes.includes(comissao)
                              ? "selecionado"
                              : ""
                          }`}
                          onClick={() => handleComissaoToggle(comissao)}
                        >
                          {comissao}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="campo-grupo">
                    <label className="campo-label">Ordenar por</label>
                    <select
                      className="campo-select"
                      onChange={(e) =>
                        setFiltros((prev) => ({
                          ...prev,
                          ordenacao: e.target.value,
                        }))
                      }
                      value={filtros.ordenacao || "nome"}
                    >
                      <option value="nome">Nome (A-Z)</option>
                      <option value="partido">Partido</option>
                      <option value="estado">Estado</option>
                      <option value="idade">Idade</option>
                    </select>
                  </div>

                  <div className="resumo-filtros">
                    <h4 className="resumo-titulo">Resumo da Busca</h4>
                    <div className="resumo-item">
                      <span className="resumo-label">Nome:</span>
                      <span className="resumo-valor">
                        {filtros.nome || "Qualquer"}
                      </span>
                    </div>
                    <div className="resumo-item">
                      <span className="resumo-label">Partidos:</span>
                      <span className="resumo-valor">
                        {filtros.partidos.length === 0
                          ? "Qualquer partido"
                          : filtros.partidos.join(", ")}
                      </span>
                    </div>
                    <div className="resumo-item">
                      <span className="resumo-label">Estados:</span>
                      <span className="resumo-valor">
                        {filtros.estados.length === 0
                          ? "Todos os estados"
                          : filtros.estados.join(", ")}
                      </span>
                    </div>
                    <div className="resumo-item">
                      <span className="resumo-label">Gênero:</span>
                      <span className="resumo-valor">
                        {filtros.genero === "M"
                          ? "Masculino"
                          : filtros.genero === "F"
                          ? "Feminino"
                          : "Qualquer"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="busca-detalhada__actions">
              <button
                className="btn-secundario"
                onClick={etapaAnterior}
                disabled={etapaAtual === 1}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              {etapaAtual < 3 ? (
                <button className="btn-primario" onClick={proximaEtapa}>
                  Próximo
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn-buscar" onClick={executarBusca}>
                  <Search size={16} />
                  Buscar Deputados
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuscaDetalhada;
