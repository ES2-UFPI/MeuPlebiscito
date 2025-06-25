import React from "react";

const DeputadoCard = ({ deputado }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <img src={deputado.foto} alt={deputado.nome} width={100} />
      <h3>{deputado.nome}</h3>
      <p><strong>Partido:</strong> {deputado.partido}</p>
      <p><strong>UF:</strong> {deputado.estado}</p>
      <p><strong>Email:</strong> {deputado.email}</p>
      <p><strong>Telefone:</strong> {deputado.telefone}</p>
    </div>
  );
};

export default DeputadoCard;
