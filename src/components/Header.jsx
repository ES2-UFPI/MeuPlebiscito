import React from "react";
import fotoPerfil from "../assets/Foto-Usuario.png";

const Header = () => {
  return (
    <div className="header">
      <div className="header__menu">
        <button className="menu__botao">
          <svg
            className="menu__icone"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <h1 className="header__titulo">MEU PLEBISCITO</h1>

      <div className="header__usuario">
        <img src={fotoPerfil} alt="Usuário" className="usuario__foto" />
        <span className="usuario__nome">Usuário</span>
      </div>
    </div>
  );
};

export default Header;
