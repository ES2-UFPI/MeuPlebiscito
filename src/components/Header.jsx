import React from "react";
import fotoPerfil from "../assets/Foto-Usuario.png";
import { Link } from "react-router-dom";

const Header = () => {
  const isLoggedIn = false;

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

      <Link to="/" className="header__titulo">
        MEU PLEBISCITO
      </Link>

      <div className="header__usuario">
        {isLoggedIn ? (
          <button
            className="usuario__botao"
            onClick={() => alert("Abrir pop-up de perfil")}
          >
            <img src={fotoPerfil} alt="Usuário" className="usuario__foto" />
            <span className="usuario__nome">Usuário</span>
          </button>
        ) : (
          <div className="header__auth">
            <Link to="/login" className="autenticacao__link">
              Fazer Login
            </Link>
            <span className="autenticacao__separador"> | </span>
            <Link to="/cadastro" className="autenticacao__link">
              Cadastrar-se
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
