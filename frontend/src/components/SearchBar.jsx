/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onOpenDetailedSearch }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Sugestões populares para busca
  const popularSuggestions = [
    "Educação",
    "Saúde",
    "Meio Ambiente",
    "Economia",
    "Direitos Humanos",
    "Tecnologia",
    "Agricultura",
    "Segurança",
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/buscar?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleDetailedSearchClick = () => {
    if (onOpenDetailedSearch) {
      onOpenDetailedSearch();
      setShowSuggestions(false);
    }
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Buscar deputados, projetos de lei, temas políticos..."
          className="searchbar-input"
        />

        <div className="searchbar-actions">
          {/* Botão de busca detalhada - só aparece na página de busca */}
          {onOpenDetailedSearch && (
            <button
              className="searchbar-filter-button"
              onClick={handleDetailedSearchClick}
              title="Busca detalhada"
              aria-label="Abrir busca detalhada"
            >
              <Filter size={16} />
            </button>
          )}

          <button className="searchbar-icon-button" onClick={handleSearch}>
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
          </button>
        </div>
      </div>

      {/* Sugestões de busca */}
      {showSuggestions && query.length === 0 && (
        <div className="searchbar-suggestions">
          <div className="searchbar-suggestions-header">
            Sugestões populares:
          </div>
          <div className="searchbar-suggestions-list">
            {popularSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="searchbar-suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search size={14} />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
