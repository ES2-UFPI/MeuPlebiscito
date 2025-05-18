import React from "react";
import Header from "../components/Header";
import MainNav from "../components/MainNav";
import SearchBar from "../components/SearchBar";
import Logo from "../assets/Meu-Plebiscito_Logo.png";

const Home = () => {
  return (
    <div className="home-container">
      <main className="main-content">
        <section className="intro-section">
          <div className="home-logo-wrapper">
            <img
              src={Logo}
              alt="Logo do Meu Plebiscito"
              className="home-logo"
            />
          </div>
          <h1 className="intro-title">Bem-vindo ao Meu Plebiscito</h1>
          <p className="intro-subtitle">
            Acompanhe os projetos de lei em tempo real
          </p>
        </section>

        <SearchBar />
      </main>
    </div>
  );
};

export default Home;
