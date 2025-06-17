"""
Modelos Pydantic para dados de deputados
Compatível com a API da Câmara dos Deputados e estrutura existente
CORRIGIDO: Adicionado modelo Atividades que estava faltando
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DeputadoResumo(BaseModel):
    """
    Modelo resumido para listagem de deputados
    Compatível com SearchResultItem.jsx existente
    """
    id: int = Field(..., description="ID único do deputado")
    nome: str = Field(..., description="Nome parlamentar do deputado")
    siglaPartido: str = Field(..., description="Sigla do partido político")
    siglaUf: str = Field(..., description="Sigla do estado que representa")
    urlFoto: Optional[str] = Field(None, description="URL da foto oficial")
    cargo: str = Field(default="Deputado Federal", description="Cargo ocupado")
    idade: Optional[int] = Field(None, description="Idade calculada automaticamente")

class Participacao(BaseModel):
    """
    Modelo para participações em reuniões e eventos
    Dados da API: GET /deputados/{id}/eventos
    """
    tipo: str = Field(..., description="Tipo do evento (Reunião, Sessão, etc.)")
    descricao: str = Field(..., description="Descrição detalhada do evento")
    data: str = Field(..., description="Data do evento em formato ISO")
    presente: bool = Field(default=True, description="Status de presença")

class Projeto(BaseModel):
    """
    Modelo para projetos de lei e proposições
    Dados da API: GET /proposicoes?idDeputadoAutor={id}
    """
    numero: str = Field(..., description="Número da proposição (ex: PL 1234/2023)")
    titulo: str = Field(..., description="Ementa/título do projeto")
    data: str = Field(..., description="Data de apresentação")
    status: str = Field(..., description="Status atual da tramitação")

class Atividades(BaseModel):
    """
    Modelo para atividades parlamentares e cargos ocupados
    Dados das APIs:
    - GET /deputados/{id}/mandatosExternos
    - GET /deputados/{id}/historico  
    - GET /deputados/{id}/orgaos
    """
    mandatos: List[str] = Field(default_factory=list, description="Lista de mandatos e histórico")
    comissoes: List[str] = Field(default_factory=list, description="Comissões e órgãos que participa")

class CategoriaOrcamento(BaseModel):
    """
    Modelo para categorias de gastos orçamentários
    """
    nome: str = Field(..., description="Nome da categoria de despesa")
    valor: float = Field(..., description="Valor total gasto na categoria")
    percentual: float = Field(..., description="Percentual do total de gastos")

class HistoricoMensal(BaseModel):
    """
    Modelo para histórico mensal de gastos
    """
    mes: str = Field(..., description="Mês no formato MM/AAAA")
    valor: float = Field(..., description="Valor gasto no mês")

class Orcamento(BaseModel):
    """
    Modelo completo para dados orçamentários
    Dados da API: GET /deputados/{id}/despesas?ano=&ordem=ASC&ordenarPor=ano
    """
    totalGasto: float = Field(..., description="Total gasto no período analisado")
    categorias: List[CategoriaOrcamento] = Field(default_factory=list, description="Gastos por categoria")
    historico: List[HistoricoMensal] = Field(default_factory=list, description="Evolução mensal dos gastos")

class DeputadoCompleto(BaseModel):
    """
    Modelo completo do deputado para página de detalhes
    Compatível com DeputadoDetalhes.jsx e useDeputadoData.js
    """
    # Informações básicas obrigatórias
    id: int = Field(..., description="ID único do deputado")
    nome: str = Field(..., description="Nome parlamentar")
    siglaPartido: str = Field(..., description="Partido político")
    siglaUf: str = Field(..., description="Estado que representa")
    
    # Informações opcionais de contato
    urlFoto: Optional[str] = Field(None, description="URL da foto oficial")
    email: Optional[str] = Field(None, description="Email de contato")
    telefone: Optional[str] = Field(None, description="Telefone do gabinete")
    gabinete: Optional[str] = Field(None, description="Localização do gabinete")
    
    # Dados pessoais adicionais
    nomeCivil: Optional[str] = Field(None, description="Nome civil completo")
    sexo: Optional[str] = Field(None, description="Sexo (M/F)")
    dataNascimento: Optional[str] = Field(None, description="Data de nascimento")
    escolaridade: Optional[str] = Field(None, description="Nível de escolaridade")
    situacao: Optional[str] = Field(None, description="Situação atual do mandato")
    
    # Dados das abas da interface
    participacoes: List[Participacao] = Field(default_factory=list, description="Participações em eventos")
    projetos: List[Projeto] = Field(default_factory=list, description="Projetos de autoria")
    atividades: Optional[Atividades] = Field(None, description="Atividades e cargos")
    orcamento: Optional[Orcamento] = Field(None, description="Dados orçamentários")

class FiltrosBusca(BaseModel):
    """
    Modelo para filtros de busca de deputados
    Compatível com BuscaDetalhada.jsx existente
    """
    nome: Optional[str] = Field(None, description="Nome para busca parcial")
    partido: Optional[str] = Field(None, description="Sigla do partido")
    estado: Optional[str] = Field(None, description="Sigla do estado")
    sexo: Optional[str] = Field(None, description="Sexo (M/F)")
    
    class Config:
        """Configuração do modelo"""
        json_schema_extra = {
            "example": {
                "nome": "João",
                "partido": "PT",
                "estado": "SP",
                "sexo": "M"
            }
        }
