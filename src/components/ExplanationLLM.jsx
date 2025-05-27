import { User } from "lucide-react";

const ResultadoBusca = ({ deputado }) => {
  return (
    <div className="resultado-busca">
      <div className="resultado-busca__foto">
        {deputado.urlFoto ? (
          <img
            src={deputado.urlFoto || "/placeholder.svg"}
            alt={deputado.nome}
          />
        ) : (
          <div className="resultado-busca__foto-placeholder">
            <User size={32} />
          </div>
        )}
      </div>
      <div className="resultado-busca__info">
        <h3 className="resultado-busca__nome">{deputado.nome}</h3>
        <div className="resultado-busca__detalhes">
          <span className="resultado-busca__partido">
            {deputado.siglaPartido}
          </span>
          <span className="resultado-busca__separador">•</span>
          <span className="resultado-busca__estado">{deputado.siglaUf}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultadoBusca;
