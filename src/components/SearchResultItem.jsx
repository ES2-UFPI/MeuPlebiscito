import { User, MapPin, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResultItem = ({ deputado }) => {
  const obterCorPartido = (partido) => {
    // Cores baseadas no espectro político brasileiro
    const coresPartidos = {
      PT: "#e53e3e", // Vermelho
      PSDB: "#3182ce", // Azul
      MDB: "#38a169", // Verde
      PL: "#d69e2e", // Amarelo/Dourado
      PSOL: "#e53e3e", // Vermelho
      PDT: "#e53e3e", // Vermelho
      PSB: "#e53e3e", // Vermelho
      REPUBLICANOS: "#3182ce", // Azul
      PP: "#3182ce", // Azul
      UNIÃO: "#805ad5", // Roxo
      PSD: "#38a169", // Verde
      PODE: "#d69e2e", // Amarelo
      NOVO: "#e53e3e", // Vermelho
      CIDADANIA: "#3182ce", // Azul
      REDE: "#38a169", // Verde
      PCdoB: "#e53e3e", // Vermelho
      AVANTE: "#805ad5", // Roxo
      SOLIDARIEDADE: "#d69e2e", // Amarelo
      default: "#6b3f26", // Cor padrão do tema
    };

    return coresPartidos[partido] || coresPartidos.default;
  };

  // eslint-disable-next-line no-unused-vars
  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    return idade;
  };

  return (
    <Link
      to={`/deputado/${deputado.id}`}
      className="search-result-item-moderno"
      style={{
        background: `linear-gradient(135deg, ${obterCorPartido(
          deputado.siglaPartido
        )}dd, ${obterCorPartido(deputado.siglaPartido)}aa)`,
      }}
    >
      <div className="search-result-item-moderno__conteudo">
        <div className="search-result-item-moderno__foto">
          {deputado.urlFoto ? (
            <img
              src={deputado.urlFoto || "/placeholder.svg"}
              alt={`Foto de ${deputado.nome}`}
              className="search-result-item-moderno__imagem"
            />
          ) : (
            <div className="search-result-item-moderno__placeholder">
              <User size={32} />
            </div>
          )}
        </div>

        <div className="search-result-item-moderno__info">
          <h3 className="search-result-item-moderno__nome">{deputado.nome}</h3>

          <div className="search-result-item-moderno__detalhes">
            <div className="search-result-item-moderno__linha">
              <Users size={12} />
              <span>{deputado.siglaPartido}</span>
              <span className="separador">•</span>
              <span>{deputado.cargo || "Deputado Federal"}</span>
            </div>

            <div className="search-result-item-moderno__linha">
              <MapPin size={12} />
              <span>{deputado.siglaUf}</span>
              {deputado.idade && (
                <>
                  <span className="separador">•</span>
                  <Calendar size={12} />
                  <span>{deputado.idade}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;
