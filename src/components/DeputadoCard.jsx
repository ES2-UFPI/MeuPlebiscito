import React from "react";

const DeputadoCard = ({ nome, partido, uf, email }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h3>{nome}</h3>
      <p>Partido: {partido}</p>
      <p>UF: {uf}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default DeputadoCard;
