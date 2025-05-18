// src/components/Header.jsx
import React from "react";
import fotoPerfil from "../assets/Foto-Usuario.png"; // Importando a imagem do usuário

const Header = () => {
  console.log("Header component rendered");
  return (
    <header className="bg-[#6B3F26] text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Ícone/menu */}
        <div className="flex items-center">
          <button className="text-white focus:outline-none mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-xl font-bold">MEU PLEBISCITO</span>
        </div>

        {/* Navegação */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline">
            Congresso Nacional
          </a>
          <a href="#" className="hover:underline">
            Meu Estado
          </a>
          <a href="#" className="hover:underline">
            Projetos de Lei
          </a>
          <a href="#" className="hover:underline">
            Em Tempo Real
          </a>
        </nav>

        {/* Barra de Pesquisa */}

        {/* Usuário */}
        <div className="flex items-center space-x-2">
          <img
            src={fotoPerfil}
            alt="Usuário"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden md:block">Usuário</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
