"use client";

import { useState, useEffect } from "react";
import { X, Search, Filter, Calendar, Users, Building } from "lucide-react";

const BuscaDetalhada = ({ isOpen, onClose, onSearch }) => {
  const [filtros, setFiltros] = useState({
    nome: "",
    siglaPartido: "",
    siglaUf: "",
    sexo: "",
    ordenarPor: "nome",
    ordem: "asc",
    dataInicio: "",
    dataFim: "",
    situacao: "",
  });

  // Estados brasileiros para o filtro
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  // Principais partidos brasileiros
  const partidos = [
    "PT",
    "PL",
    "UNIÃO",
    "PP",
    "MDB",
    "PSD",
    "REPUBLICANOS",
    "PSB",
    "PSDB",
    "PDT",
    "PODE",
    "PSOL",
    "AVANTE",
    "PCdoB",
    "PSC",
    "CIDADANIA",
    "SOLIDARIEDADE",
    "NOVO",
    "REDE",
    "PMB",
    "UP",
    "AGIR",
    "PRD",
  ];

  const opcoesSexo = [
    { value: "", label: "Todos" },
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
  ];

  const opcoesOrdenacao = [
    { value: "nome", label: "Nome" },
    { value: "siglaPartido", label: "Partido" },
    { value: "siglaUf", label: "Estado" },
    { value: "dataUltimaAtualizacao", label: "Última Atualização" },
  ];

  const opcoesSituacao = [
    { value: "", label: "Todas" },
    { value: "Exercício", label: "Em Exercício" },
    { value: "Afastado", label: "Afastado" },
    { value: "Licença", label: "Em Licença" },
  ];

  const handleInputChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remove campos vazios para otimizar a consulta
    const filtrosLimpos = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(filtros).filter(([_, value]) => value !== "")
    );

    onSearch(filtrosLimpos);
    onClose();
  };

  const limparFiltros = () => {
    setFiltros({
      nome: "",
      siglaPartido: "",
      siglaUf: "",
      sexo: "",
      ordenarPor: "nome",
      ordem: "asc",
      dataInicio: "",
      dataFim: "",
      situacao: "",
    });
  };

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="busca-detalhada-overlay">
      <div className="busca-detalhada-modal">
        <div className="busca-detalhada__cabecalho">
          <div className="busca-detalhada__titulo">
            <Filter size={24} />
            <h2>Busca Detalhada</h2>
          </div>
          <button className="busca-detalhada__fechar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="busca-detalhada__formulario">
          <div className="busca-detalhada__secao">
            <h3 className="busca-detalhada__secao-titulo">
              <Users size={18} />
              Informações Pessoais
            </h3>
            <div className="busca-detalhada__campos">
              <div className="campo-grupo">
                <label htmlFor="nome">Nome do Deputado</label>
                <input
                  type="text"
                  id="nome"
                  value={filtros.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Digite o nome completo ou parcial"
                  className="campo-input"
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="sexo">Sexo</label>
                <select
                  id="sexo"
                  value={filtros.sexo}
                  onChange={(e) => handleInputChange("sexo", e.target.value)}
                  className="campo-select"
                >
                  {opcoesSexo.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="busca-detalhada__secao">
            <h3 className="busca-detalhada__secao-titulo">
              <Building size={18} />
              Informações Políticas
            </h3>
            <div className="busca-detalhada__campos">
              <div className="campo-grupo">
                <label htmlFor="partido">Partido</label>
                <select
                  id="partido"
                  value={filtros.siglaPartido}
                  onChange={(e) =>
                    handleInputChange("siglaPartido", e.target.value)
                  }
                  className="campo-select"
                >
                  <option value="">Todos os partidos</option>
                  {partidos.map((partido) => (
                    <option key={partido} value={partido}>
                      {partido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-grupo">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  value={filtros.siglaUf}
                  onChange={(e) => handleInputChange("siglaUf", e.target.value)}
                  className="campo-select"
                >
                  <option value="">Todos os estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-grupo">
                <label htmlFor="situacao">Situação</label>
                <select
                  id="situacao"
                  value={filtros.situacao}
                  onChange={(e) =>
                    handleInputChange("situacao", e.target.value)
                  }
                  className="campo-select"
                >
                  {opcoesSituacao.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="busca-detalhada__secao">
            <h3 className="busca-detalhada__secao-titulo">
              <Calendar size={18} />
              Período e Ordenação
            </h3>
            <div className="busca-detalhada__campos">
              <div className="campo-grupo">
                <label htmlFor="dataInicio">Data Início</label>
                <input
                  type="date"
                  id="dataInicio"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    handleInputChange("dataInicio", e.target.value)
                  }
                  className="campo-input"
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="dataFim">Data Fim</label>
                <input
                  type="date"
                  id="dataFim"
                  value={filtros.dataFim}
                  onChange={(e) => handleInputChange("dataFim", e.target.value)}
                  className="campo-input"
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="ordenarPor">Ordenar por</label>
                <select
                  id="ordenarPor"
                  value={filtros.ordenarPor}
                  onChange={(e) =>
                    handleInputChange("ordenarPor", e.target.value)
                  }
                  className="campo-select"
                >
                  {opcoesOrdenacao.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-grupo">
                <label htmlFor="ordem">Ordem</label>
                <select
                  id="ordem"
                  value={filtros.ordem}
                  onChange={(e) => handleInputChange("ordem", e.target.value)}
                  className="campo-select"
                >
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
            </div>
          </div>

          <div className="busca-detalhada__acoes">
            <button
              type="button"
              onClick={limparFiltros}
              className="botao-secundario"
            >
              Limpar Filtros
            </button>
            <button type="submit" className="botao-primario">
              <Search size={18} />
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuscaDetalhada;
