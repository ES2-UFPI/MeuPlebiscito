import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import "../styles/SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <div className="search-bar__wrapper">
        <FontAwesomeIcon
          className="single-item__icon"
          icon={faMagnifyingGlass}
        />
        <input
          type="text"
          placeholder="Pesquisar"
          className="search-bar__input"
        />
      </div>
      <div className="search-bar__auth">
        <a href="#" className="search-bar__link">
          Fazer Login
        </a>
        <span>|</span>
        <a href="#" className="search-bar__link">
          Cadastrar-se
        </a>
      </div>
    </div>
  );
};

export default SearchBar;
