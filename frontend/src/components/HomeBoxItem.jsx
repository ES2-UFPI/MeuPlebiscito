import { Calendar, User, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const HomeBoxItem = ({ lei }) => {
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obterCorStatus = (status) => {
    switch (status) {
      case "sancionada":
        return "status-sancionada";
      case "em_votacao":
        return "status-votacao";
      default:
        return "status-default";
    }
  };

  const obterTextoStatus = (status) => {
    switch (status) {
      case "sancionada":
        return "Sancionada";
      case "em_votacao":
        return "Em Votação";
      default:
        return "Status Desconhecido";
    }
  };

  return (
    <Link to={`/lei/${lei.id}`} className="home-box-item">
      <div className="home-box-item__cabecalho">
        <div className="home-box-item__numero">{lei.numero}</div>
        <div className={`home-box-item__status ${obterCorStatus(lei.status)}`}>
          {obterTextoStatus(lei.status)}
        </div>
      </div>

      <div className="home-box-item__conteudo">
        {/* Área para futura imagem da lei */}
        <div className="home-box-item__imagem">
          {lei.urlImagem ? (
            <img
              src={lei.urlImagem || "/placeholder.svg"}
              alt={`Imagem relacionada à ${lei.numero}`}
              className="home-box-item__foto"
            />
          ) : (
            <div className="home-box-item__placeholder">
              <FileText size={32} />
            </div>
          )}
        </div>

        <div className="home-box-item__info">
          <h3 className="home-box-item__titulo">{lei.titulo}</h3>
          <p className="home-box-item__descricao">{lei.descricao}</p>

          <div className="home-box-item__metadados">
            <div className="home-box-item__autor">
              <User size={14} />
              <span>
                {lei.autor} ({lei.partido})
              </span>
            </div>
            <div className="home-box-item__localizacao">
              <MapPin size={14} />
              <span>{lei.uf}</span>
            </div>
            <div className="home-box-item__data">
              <Calendar size={14} />
              <span>{formatarData(lei.dataStatus)}</span>
            </div>
          </div>

          <div className="home-box-item__categoria">
            <span className="categoria-tag">{lei.categoria}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeBoxItem;
