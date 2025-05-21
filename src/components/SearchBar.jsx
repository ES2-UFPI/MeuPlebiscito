/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
  const [result, setResult] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 200);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length > 1) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    if (!isFocused || !debouncedQuery) {
      setResult([]);
      return;
    }

    const filtered = allActions.filter((action) =>
      action.label.toLowerCase().includes(debouncedQuery.toLowerCase().trim())
    );

    setResult(filtered);
  }, [debouncedQuery, isFocused]);

  return (
    <div className="searchbar-container">
      <div className="searchbar-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setSelectedAction(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Buscar comandos, leis, ações..."
          className="searchbar-input"
        />
        <div className="searchbar-icon">
          <AnimatePresence mode="wait">
            {query.length > 0 ? (
              <motion.div
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Send size={16} />
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
        </div>
      </div>

      <AnimatePresence>
        {isFocused && result.length > 0 && !selectedAction && (
          <motion.ul
            className="searchbar-results"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {result.map((action) => (
              <li
                key={action.id}
                className="searchbar-item"
                onClick={() => setSelectedAction(action)}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
                <small>{action.description}</small>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
