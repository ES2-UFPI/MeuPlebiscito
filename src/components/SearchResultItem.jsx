import { User, MapPin, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResultItem = ({ deputado }) => {
  const obterCorPartido = (partido) => {
    // Cores baseadas no espectro político brasileiro
    const coresPartidos = {
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
      className="result-item"
      style={{
        background: obterCorPartido(deputado.default),
      }}
    >
      <div className="result-item__conteudo">
        <div className="result-item__foto">
          {deputado.urlFoto ? (
            <img
              src={deputado.urlFoto || "/placeholder.svg"}
              alt={`Foto de ${deputado.nome}`}
              className="result-item__imagem"
            />
          ) : (
            <div className="result-item__placeholder">
              <User size={32} />
            </div>
          )}
        </div>

        <div className="result-item__info">
          <h3 className="result-item__nome">{deputado.nome}</h3>

          <div className="result-item__detalhes">
            <div className="result-item__linha">
              <Users size={12} />
              <span>{deputado.siglaPartido}</span>
              <span className="separador">•</span>
              <span>{deputado.cargo || "Deputado Federal"}</span>
            </div>

            <div className="result-item__linha">
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
