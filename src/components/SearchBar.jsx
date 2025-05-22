import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("nome"); // 'nome' ou 'sigla_partido'
  const [result, setResult] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDeputado, setSelectedDeputado] = useState(null);
  const blurTimeout = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFocus = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    setIsFocused(true);
    setSelectedDeputado(null);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleSelect = (dep) => {
    setSelectedDeputado(dep);
    setResult([]);
    setQuery(dep.nome);
    setIsFocused(false);
  };

  const clearSelection = () => {
    setSelectedDeputado(null);
    setQuery("");
    setResult([]);
  };

  const buscarDeputados = async () => {
    if (!query.trim()) {
      setResult([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchType === "nome") {
        params.append("nome", query);
      } else if (searchType === "sigla_partido") {
        params.append("sigla_partido", query);
      }

      const res = await fetch(
        `http://localhost:8000/deputados/?${params.toString()}`
      );
      if (!res.ok) throw new Error("Erro ao buscar deputados");
      const data = await res.json();

      const dadosFormatados = Array.isArray(data.dados) 
        ? data.dados 
        : Array.isArray(data) 
          ? data 
          : [];

      setResult(dadosFormatados);
      setIsFocused(true);
    } catch (err) {
      console.error(err);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      buscarDeputados();
    }
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-wrapper">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="searchbar-select"
        >
          <option value="nome">Nome</option>
          <option value="sigla_partido">Partido</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Buscar por nome ou partido..."
          className="searchbar-input"
        />

        <button
          className="searchbar-icon-button"
          onClick={buscarDeputados}
          disabled={loading}
          aria-label="Buscar deputados"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loading-spinner" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Search size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isFocused && result.length > 0 && !selectedDeputado && (
          <motion.ul
            className="searchbar-results"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {result.map((dep) => (
              <li
                key={dep.id}
                className="searchbar-item"
                onClick={() => handleSelect(dep)}
              >
                <span>{dep.nome || 'Nome não disponível'}</span>
                <small>
                  {(dep.siglaPartido || '?')} - {dep.siglaUf || '?'}
                </small>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {selectedDeputado && (
        <motion.div
          className="deputado-detalhes"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>{selectedDeputado.nome || 'Nome não disponível'}</h3>
          <p>
            Partido: <strong>{selectedDeputado.siglaPartido || '?'}</strong>
          </p>
          <p>
            Estado: <strong>{selectedDeputado.siglaUf || '?'}</strong>
          </p>
          {selectedDeputado.uri && (
            <p>
              <a
                href={selectedDeputado.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="link-perfil"
              >
                Perfil no site da Câmara
              </a>
            </p>
          )}
          <button 
            onClick={clearSelection}
            className="clear-button"
          >
            Limpar seleção
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
