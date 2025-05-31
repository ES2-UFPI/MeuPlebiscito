/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onOpenDetailedSearch }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDetailedSearchClick = () => {
    if (onOpenDetailedSearch) {
      onOpenDetailedSearch();
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
          placeholder="Buscar deputados, projetos de lei..."
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
    </div>
  );
};

export default SearchBar;
