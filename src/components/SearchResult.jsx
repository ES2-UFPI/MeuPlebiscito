import { User } from "lucide-react";

const SearchResult = ({ deputado }) => {
  return (
    <div className="result-search">
      <div className="result-search__foto">
        {deputado.urlFoto ? (
          <img
            src={deputado.urlFoto || "/placeholder.svg"}
            alt={deputado.nome}
          />
        ) : (
          <div className="result-search__foto-placeholder">
            <User size={32} />
          </div>
        )}
      </div>
      <div className="result-search__info">
        <h3 className="result-search__nome">{deputado.nome}</h3>
        <div className="result-search__detalhes">
          <span className="result-search__partido">
            {deputado.siglaPartido}
          </span>
          <span className="result-search__separador">•</span>
          <span className="result-search__estado">{deputado.siglaUf}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
