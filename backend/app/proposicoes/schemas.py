# proposicoes/schemas.py

from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import date, datetime

# ==============================================================================
# 1. SCHEMAS BÁSICOS E REUTILIZÁVEIS
# ==============================================================================

class Link(BaseModel):
    rel: str
    href: HttpUrl

class Autor(BaseModel):
    uri: str
    nome: str
    tipo: str
    codTipo: Optional[int] = None
    ordemAssinatura: Optional[int] = None

class Tema(BaseModel):
    codTema: int
    tema: str
    relevancia: int

# --- SCHEMA TRAMITAÇÃO ATUALIZADO ---
class Tramitacao(BaseModel):
    """Representa um passo na tramitação de uma proposição, conforme a documentação."""
    dataHora: datetime
    sequencia: int
    siglaOrgao: str
    uriOrgao: str
    uriUltimoRelator: Optional[str] = None
    regime: str
    descricaoTramitacao: str
    codTipoTramitacao: str
    descricaoSituacao: Optional[str] = None
    codSituacao: Optional[int] = None
    despacho: str
    url: Optional[HttpUrl] = None
    ambito: Optional[str] = None
    apreciacao: Optional[str] = None


class Votacao(BaseModel):
    """Representa uma votação associada a uma proposição."""
    id: str
    uri: str
    data: date
    dataHoraRegistro: datetime
    siglaOrgao: str
    uriOrgao: str
    descricao: str
    aprovacao: Optional[int] = None
    proposicaoObjeto: Optional[str] = None
    uriProposicaoObjeto: Optional[HttpUrl] = None
    uriEvento: Optional[HttpUrl] = None


class ProposicaoResumo(BaseModel):
    """Schema para o resumo de uma proposição, usado em listagens."""
    id: int
    uri: str
    siglaTipo: str
    codTipo: int
    numero: int
    ano: int
    ementa: Optional[str] = None

# ==============================================================================
# 2. SCHEMAS PRINCIPAIS PARA AS RESPOSTAS DOS ENDPOINTS
# ==============================================================================

class ProposicoesListaResponse(BaseModel):
    dados: List[ProposicaoResumo]
    links: List[Link]

# --- SCHEMA STATUS ATUALIZADO ---
class StatusProposicao(BaseModel):
    """Representa o status detalhado de uma proposição."""
    dataHora: datetime
    sequencia: int
    siglaOrgao: str
    uriOrgao: str
    regime: str
    descricaoTramitacao: str
    despacho: str
    url: Optional[HttpUrl] = None
    # Adicionando campos que podem estar presentes no status
    codSituacao: Optional[int] = None
    descricaoSituacao: Optional[str] = None
    apreciacao: Optional[str] = None


class ProposicaoDetalhes(BaseModel):
    """Schema para os dados detalhados de uma proposição."""
    id: int
    uri: str
    siglaTipo: str
    numero: int
    ano: int
    ementa: Optional[str] = None
    dataApresentacao: datetime
    statusProposicao: StatusProposicao
    uriAutores: str
    urlInteiroTeor: Optional[HttpUrl] = None


class ProposicaoDetalhesResponse(BaseModel):
    dados: ProposicaoDetalhes
    links: List[Link]
