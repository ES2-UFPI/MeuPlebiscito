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

class DespesaDetalhada(BaseModel):
    ano: int
    mes: int
    tipo_despesa: str
    cod_documento: int
    tipo_documento: str
    cod_tipo_documento: int
    data_documento: str
    numero_documento: str
    valor_documento: float
    url_documento: str
    nome_fornecedor: str
    cnpj_cpf_fornecedor: str
    valor_liquido: float
    valor_glosa: float
    numero_ressarcimento: Optional[str]
    cod_lote: int
    parcela: int

class MandatoDeputado(BaseModel):
    id_legislatura: Optional[int]
    nome_legislatura: Optional[str]
    data_inicio: Optional[str]
    data_fim: Optional[str]
    sigla_partido: Optional[str]
    sigla_uf: Optional[str]
    situacao: Optional[str]
    condicao_eleitoral: Optional[str]

class HistoricoPartidoDeputado(BaseModel):
    sigla_partido: Optional[str]
    nome_partido: Optional[str]
    data_inicio: Optional[str]
    data_fim: Optional[str]
    id_legislatura: Optional[int]
    

    
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


class MandatoSenador(BaseModel):
    codigo_mandato: Optional[str]
    descricao_participacao: Optional[str]
    data_inicio: Optional[str]
    data_fim: Optional[str]
    uf_mandato: Optional[str]
    
class VotacaoSenador(BaseModel):
    sessao_codigo: Optional[str]
    sessao_data: Optional[str]
    descricao_voto: Optional[str]
    materia_codigo: Optional[str]
    materia_ementa: Optional[str]

# ----------------------------------------
# Estatísticas e Análises

class EstatisticasDeputado(BaseModel):
    total_votacoes: int
    votacoes_sim: int
    votacoes_nao: int
    votacoes_abstencao: int
    votacoes_obstrucao: int
    votacoes_ausente: int
    percentual_presenca: float
    total_despesas_ano_atual: float
    media_despesas_mensal: float

class EstatisticasSenador(BaseModel):
    total_votacoes: int
    votacoes_sim: int
    votacoes_nao: int
    votacoes_abstencao: int
    percentual_presenca: float
    total_mandatos: int
    mandato_atual: Optional[MandatoSenador]

# ----------------------------------------
# Filtros e Buscas Avançadas

class FiltroAvancadoDeputados(BaseModel):
    nome: Optional[str] = None
    partido: Optional[str] = None
    estado: Optional[str] = None
    sexo: Optional[str] = None
    id_legislatura: Optional[int] = None
    situacao: Optional[str] = None
    condicao_eleitoral: Optional[str] = None
    escolaridade: Optional[str] = None
    faixa_etaria_min: Optional[int] = None
    faixa_etaria_max: Optional[int] = None
    despesa_min: Optional[float] = None
    despesa_max: Optional[float] = None
    presenca_min: Optional[float] = None
    presenca_max: Optional[float] = None

class ResultadoBuscaAvancada(BaseModel):
    deputados: List[DeputadoResumo]
    total_encontrados: int
    filtros_aplicados: FiltroAvancadoDeputados
    estatisticas_gerais: dict
