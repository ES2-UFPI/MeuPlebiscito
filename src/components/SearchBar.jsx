/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  BarChart2,
  Globe,
  Video,
  PlaneTakeoff,
  AudioLines,
} from "lucide-react";
import useDebounce from "../hooks/UseDebounce";
import { useNavigate } from "react-router-dom";

const allActions = [
  {
    id: "1",
    label: "Book tickets",
    icon: <PlaneTakeoff size={16} />,
    description: "Operator",
    short: "⌘K",
    end: "Agent",
  },
  {
    id: "2",
    label: "Summarize",
    icon: <BarChart2 size={16} />,
    description: "gpt-4o",
    short: "⌘cmd+p",
    end: "Command",
  },
  {
    id: "3",
    label: "Screen Studio",
    icon: <Video size={16} />,
    description: "gpt-4o",
    end: "Application",
  },
  {
    id: "4",
    label: "Talk to Jarvis",
    icon: <AudioLines size={16} />,
    description: "gpt-4o voice",
    end: "Active",
  },
  {
    id: "5",
    label: "Translate",
    icon: <Globe size={16} />,
    description: "gpt-4o",
    end: "Command",
  },
];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("nome");
  const [result, setResult] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const blurTimeout = useRef(null);
  const navigate = useNavigate();

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setIsFocused(true);
    setSelectedItem(null);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setIsFocused(false), 200);
  };

  const clearSelection = () => {
    setSelectedItem(null);
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
      if (searchType === "nome") params.append("nome", query);
      else if (searchType === "sigla_partido")
        params.append("sigla_partido", query);

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

  const buscarComandos = () => {
    const filtered = allActions.filter((action) =>
      action.label.toLowerCase().includes(query.toLowerCase().trim())
    );
    setResult(filtered);
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchType === "nome" || searchType === "sigla_partido") {
        buscarDeputados();
      } else {
        buscarComandos();
      }
    }
  };

  const handleSearchClick = () => {
    if (searchType === "nome" || searchType === "sigla_partido") {
      buscarDeputados();
    } else {
      buscarComandos();
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setResult([]);
    setQuery(item.nome || item.label || "");
    setIsFocused(false);
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-wrapper">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="searchbar-select"
        >
          <option value="nome">Deputado: Nome</option>
          <option value="sigla_partido">Deputado: Partido</option>
          <option value="comandos">Comandos</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Buscar por nome, partido ou comandos..."
          className="searchbar-input"
        />

        <div className="searchbar-icon-button" onClick={handleSearchClick}>
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
                {query.length > 0 ? <Send size={16} /> : <Search size={16} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && result.length > 0 && !selectedItem && (
          <motion.ul
            className="searchbar-results"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {result.map((item) => (
              <li
                key={item.id || item.label}
                className="searchbar-item"
                onClick={() => handleSelect(item)}
              >
                {searchType === "comandos" ? (
                  <>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </>
                ) : (
                  <>
                    <span>{item.nome || "Nome não disponível"}</span>
                    <small>
                      {item.siglaPartido || "?"} - {item.siglaUf || "?"}
                    </small>
                  </>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {selectedItem && searchType !== "comandos" && (
        <motion.div
          className="deputado-detalhes"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>{selectedItem.nome || "Nome não disponível"}</h3>
          <p>
            Partido: <strong>{selectedItem.siglaPartido || "?"}</strong>
          </p>
          <p>
            Estado: <strong>{selectedItem.siglaUf || "?"}</strong>
          </p>
          {selectedItem.uri && (
            <p>
              <a
                href={selectedItem.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="link-perfil"
              >
                Perfil no site da Câmara
              </a>
            </p>
          )}
          <button onClick={clearSelection} className="clear-button">
            Limpar seleção
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
