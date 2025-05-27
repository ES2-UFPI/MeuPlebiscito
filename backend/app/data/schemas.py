# schemas.py
from pydantic import BaseModel
from typing import List, Optional

class DeputadoResumo(BaseModel):
    id: int
    nome: str
    urlFoto: str
    idLegislatura: int
    siglaPartido: str
    siglaUf: str

    class Config:
        extra = "ignore"

class DeputadoDetalhado(BaseModel):
    id: int
    nome: str
    urlFoto: str
    idLegislatura: int
    siglaPartido: str
    siglaUf: str
    situacao: str
    condicao: str
    data: str

    nomeCivil: str
    cpf: str
    sexo: str
    ufNascimento: str
    municipioNascimento: str
    dataNascimento: str
    escolaridade: str

    class Config:
        extra = "ignore"

    @classmethod
    def from_api_data(cls, data: dict):
        status = data.get("ultimoStatus", {})
        return cls(
            id=data.get("id", 0),
            nome=status.get("nome", ""),
            urlFoto=status.get("urlFoto", ""),
            idLegislatura=status.get("idLegislatura", 0),
            siglaPartido=status.get("siglaPartido", ""),
            siglaUf=status.get("siglaUf", ""),
            situacao=status.get("situacao", ""),
            condicao=status.get("condicaoEleitoral", ""),
            data=status.get("data", ""),
            nomeCivil=data.get("nomeCivil", ""),
            cpf=data.get("cpf", ""),
            sexo=data.get("sexo", ""),
            ufNascimento=data.get("ufNascimento", ""),
            municipioNascimento=data.get("municipioNascimento", ""),
            dataNascimento=data.get("dataNascimento", ""),
            escolaridade=data.get("escolaridade", ""),
        )

class DespesaTotalResponse(BaseModel):
    deputado_id: int
    anos: List[int]
    total_despesas: float

# ----------------------------------------
# Senadores
from pydantic import BaseModel
from typing import Optional

class SenadorResumo(BaseModel):
    codigo_parlamentar: int
    nome_parlamentar: str
    nome_completo_parlamentar: str
    sexo_parlamentar: Optional[str]
    url_foto_parlamentar: Optional[str]
    url_pagina_parlamentar: Optional[str]
    email_parlamentar: Optional[str]
    sigla_partido_parlamentar: Optional[str]
    uf_parlamentar: Optional[str]

    class Config:
        allow_population_by_field_name = True

class SenadorDetalhado(SenadorResumo):
    data_nascimento: Optional[str]
    naturalidade: Optional[str]
    uf_naturalidade: Optional[str]
    endereco_parlamentar: Optional[str]
