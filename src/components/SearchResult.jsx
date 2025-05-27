import { User, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResult = ({ deputado }) => {
  return (
    <Link to={`/deputado/${deputado.id}`} className="card-deputado">
      <div className="card-deputado__conteudo">
        <div className="card-deputado__foto">
          {deputado.urlFoto ? (
            <img
              src={deputado.urlFoto || "/placeholder.svg"}
              alt={`Foto de ${deputado.nome}`}
              className="card-deputado__imagem"
            />
          ) : (
            <div className="card-deputado__placeholder">
              <User size={40} />
            </div>
          )}
        </div>

        <div className="card-deputado__info">
          <h3 className="card-deputado__nome">{deputado.nome}</h3>

          <div className="card-deputado__metadados">
            <div className="card-deputado__partido">
              <Users size={14} />
              <span>{deputado.siglaPartido}</span>
            </div>
            <div className="card-deputado__estado">
              <MapPin size={14} />
              <span>{deputado.siglaUf}</span>
            </div>
          </div>

          <div className="card-deputado__detalhes">
            <span className="card-deputado__cargo">
              {deputado.cargo || "Deputado Federal"}
            </span>
            {deputado.idade && (
              <span className="card-deputado__idade">{deputado.idade}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResult;
