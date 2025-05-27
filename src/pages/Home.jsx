import SearchBar from "../components/SearchBar";
import HomeBox from "../components/HomeBox";
import Logo from "../assets/Meu-Plebiscito_Logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  const isLoggedIn = false; // Simulação de estado de login

  return (
    <div className="home-container">
      <main className="main-content">
        <section className="intro-section">
          <div className="home-logo-wrapper">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Logo do Meu Plebiscito"
              className="home-logo"
            />
          </div>
          <h1 className="intro-title">Bem-vindo ao Meu Plebiscito</h1>
          <p className="intro-subtitle">
            Acompanhe os projetos de lei em tempo real
          </p>
        </section>

        <div className="home-search-section">
          <SearchBar />
          {!isLoggedIn && (
            <div className="header__auth">
              <Link to="/login" className="autenticacao__link_Home">
                Fazer Login
              </Link>
              <span className="autenticacao__separador"> | </span>
              <Link to="/cadastro" className="autenticacao__link_Home">
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>

        <HomeBox />
      </main>
    </div>
  );
};

export default Home;
