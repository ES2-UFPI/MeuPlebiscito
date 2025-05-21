import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Searched = () => {
  const [resultados, setResultados] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    fetch(`http://localhost:8000/deputados?nome=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.deputados) {
          setResultados(data.deputados);
        } else {
          setResultados([]);
        }
      })
      .catch(() => setResultados([]));
  }, [query]);

  return (
    <div className="pagina-busca">
      <SearchBar />
      <h2>
        Resultados para: <strong>{query}</strong>
      </h2>
      {resultados.length === 0 ? (
        <p>Nenhum resultado encontrado.</p>
      ) : (
        <ul>
          {resultados.map((dep) => (
            <li key={dep.id}>
              <h3>{dep.nome}</h3>
              <p>
                Partido: {dep.sigla_partido} — Estado: {dep.sigla_uf}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searched;
