# proposicoes/routes.py

from fastapi import APIRouter, Query, Path, Depends
from typing import List, Optional
from datetime import date
from enum import Enum


# Importa os schemas e o serviço que já criamos
from .schemas import (
    ProposicoesListaResponse,
    ProposicaoDetalhesResponse,
    DadosResponse,
    Autor,
    ProposicaoResumo,
    Tema,
    Tramitacao,
    Votacao,
)
from .service import ProposicaoService, proposicao_service

# --- NOVO: Enums para validação de parâmetros com valores restritos ---
class OrdemEnum(str, Enum):
    asc = "ASC"
    desc = "DESC"

class OrdenarPorEnum(str, Enum):
    id = "id"
    codTipo = "codTipo"
    siglaTipo = "siglaTipo"
    numero = "numero"
    ano = "ano"

class OrdenarVotacaoPorEnum(str, Enum):
    id = "id"
    dataHoraRegistro = "dataHoraRegistro"

# --------------------------------------------------------------------

router = APIRouter(
    prefix="/proposicoes",
    tags=["Proposições"],
    responses={404: {"description": "Não encontrado"}},
)

# Injeção de dependência do serviço
def get_service() -> ProposicaoService:
    return proposicao_service


# --- Função utilitária para limpar parâmetros ---
def clean_params(params: dict) -> dict:
    cleaned = {}
    for key, value in params.items():
        if value is not None:
            if isinstance(value, list):
                cleaned[key] = ",".join(map(str, value))
            elif isinstance(value, date):
                cleaned[key] = value.strftime("%Y-%m-%d")
            else:
                cleaned[key] = value
    return cleaned


# --- ROTA Principal ---
@router.get(
    "/",
    response_model=ProposicoesListaResponse,
    summary="Lista configurável de proposições na Câmara",
    description="Recupera uma lista de informações básicas sobre projetos de lei, resoluções, medidas provisórias, etc."
)
async def get_proposicoes_route(
    # Parâmetros de identificação
    id: Optional[List[int]] = Query(None, description="ID(s) da(s) proposição(ões), separados por vírgula."),
    siglaTipo: Optional[List[str]] = Query(None, description="Sigla(s) do(s) tipo(s) de proposição."),
    numero: Optional[List[int]] = Query(None, description="Número(s) oficial(is) da(s) proposição(ões)."),
    ano: Optional[List[int]] = Query(None, description="Ano(s) de apresentação da(s) proposição(ões)."),
    codTipo: Optional[List[int]] = Query(None, description="Código(s) numérico(s) do(s) tipo(s) de proposição."),

    # Parâmetros de autoria
    idDeputadoAutor: Optional[List[int]] = Query(None, description="ID(s) do(s) deputado(s) autor(es).", alias="idDeputadoAutor"),
    autor: Optional[str] = Query(None, description="Nome ou parte do nome do(s) autor(es)."),
    siglaPartidoAutor: Optional[List[str]] = Query(None, description="Sigla(s) do(s) partido(s) do(s) autor(es)."),
    idPartidoAutor: Optional[int] = Query(None, description="ID do partido do autor."),
    siglaUfAutor: Optional[List[str]] = Query(None, description="Sigla(s) da UF do(s) autor(es)."),

    # Parâmetros de data
    dataInicio: Optional[date] = Query(None, description="Data de início (AAAA-MM-DD) para o intervalo de tramitação."),
    dataFim: Optional[date] = Query(None, description="Data de fim (AAAA-MM-DD) para o intervalo de tramitação."),
    dataApresentacaoInicio: Optional[date] = Query(None, description="Data de início (AAAA-MM-DD) do período de apresentação."),
    dataApresentacaoFim: Optional[date] = Query(None, description="Data de fim (AAAA-MM-DD) do período de apresentação."),

    # Parâmetros de conteúdo e situação
    keywords: Optional[List[str]] = Query(None, description="Palavra(s)-chave(s) sobre o tema."),
    tramitacaoSenado: Optional[bool] = Query(None, description="Incluir apenas proposições que tramitaram no Senado."),
    codSituacao: Optional[List[int]] = Query(None, description="Código(s) da(s) situação(ões) da(s) proposição(ões)."),
    codTema: Optional[List[int]] = Query(None, description="Código(s) numérico(s) da(s) área(s) temática(s)."),

    # Parâmetros de paginação e ordenação
    pagina: int = Query(1, description="Número da página de resultados."),
    itens: int = Query(15, description="Número máximo de itens por página."),
    ordem: OrdemEnum = Query(OrdemEnum.asc, description="Sentido da ordenação."),
    ordenarPor: OrdenarPorEnum = Query(OrdenarPorEnum.id, description="Campo para ordenação."),

    service: ProposicaoService = Depends(get_service)
):
    #Obtém uma lista de proposições com filtros avançados.
    params = {
        "id": id, "siglaTipo": siglaTipo, "numero": numero, "ano": ano,
        "codTipo": codTipo, "idDeputadoAutor": idDeputadoAutor, "autor": autor,
        "siglaPartidoAutor": siglaPartidoAutor, "idPartidoAutor": idPartidoAutor,
        "siglaUfAutor": siglaUfAutor, "keywords": keywords,
        "tramitacaoSenado": tramitacaoSenado, "dataInicio": dataInicio,
        "dataFim": dataFim, "dataApresentacaoInicio": dataApresentacaoInicio,
        "dataApresentacaoFim": dataApresentacaoFim, "codSituacao": codSituacao,
        "codTema": codTema, "pagina": pagina, "itens": itens, "ordem": ordem.value,
        "ordenarPor": ordenarPor.value
    }
    
    # Limpa os parâmetros que não foram fornecidos (são None)
    # e formata as listas para o formato esperado pela API da Câmara (string separada por vírgula)
    cleaned_params = {}
    for key, value in params.items():
        if value is not None:
            if isinstance(value, list):
                cleaned_params[key] = ",".join(map(str, value))
            elif isinstance(value, date):
                cleaned_params[key] = value.strftime("%Y-%m-%d")
            else:
                cleaned_params[key] = value

    return await service.get_proposicoes(params=cleaned_params)

@router.get("/{id}", response_model=ProposicaoDetalhesResponse, summary="Detalhes de uma Proposição")
async def get_proposicao_by_id_route(
    id: int = Path(..., description="ID da proposição. Ex: 2321334"),
    service: ProposicaoService = Depends(get_service)
):
    return await service.get_proposicao_by_id(id)

@router.get("/{id}/autores", response_model=DadosResponse[Autor], summary="Autores da Proposição")
async def get_autores_proposicao_route(
    id: int = Path(..., description="ID da proposição"),
    service: ProposicaoService = Depends(get_service)
):
    return await service.get_autores_proposicao(id)

@router.get("/{id}/relacionadas", response_model=DadosResponse[ProposicaoResumo], summary="Proposições Relacionadas")
async def get_proposicoes_relacionadas_route(
    id: int = Path(..., description="ID da proposição"),
    service: ProposicaoService = Depends(get_service)
):
    return await service.get_proposicoes_relacionadas(id)

@router.get("/{id}/temas", response_model=DadosResponse[Tema], summary="Temas da Proposição")
async def get_temas_proposicao_route(
    id: int = Path(..., description="ID da proposição"),
    service: ProposicaoService = Depends(get_service)
):
    return await service.get_temas_proposicao(id)

# --- ROTA DE TRAMITAÇÕES CORRIGIDA (REMOVIDO 'pagina' e 'itens') ---
@router.get(
    "/{id}/tramitacoes",
    response_model=DadosResponse[Tramitacao],
    summary="Tramitações da Proposição"
)
async def get_tramitacoes_proposicao_route(
    id: int = Path(..., description="ID da proposição"),

    # Filtros de data permanecem, pois são suportados
    dataInicio: Optional[date] = Query(None, description="Filtra tramitações a partir de (AAAA-MM-DD)."),
    dataFim: Optional[date] = Query(None, description="Filtra tramitações até (AAAA-MM-DD)."),

    # Os parâmetros de paginação foram removidos
    # pagina: int = Query(...),
    # itens: int = Query(...),

    service: ProposicaoService = Depends(get_service)
):
    # Dicionário de parâmetros agora contém apenas os filtros válidos
    params = {
        "dataInicio": dataInicio,
        "dataFim": dataFim,
    }
    return await service.get_tramitacoes_proposicao(id=id, params=clean_params(params))

@router.get(
    "/{id}/votacoes",
    response_model=DadosResponse[Votacao],
    summary="Votações da Proposição"
)
async def get_votacoes_proposicao_route(
    id: int = Path(..., description="ID da proposição."),
    ordem: OrdemEnum = Query(OrdemEnum.desc, description="Sentido da ordenação: ASC ou DESC."),
    ordenarPor: OrdenarVotacaoPorEnum = Query(
        OrdenarVotacaoPorEnum.dataHoraRegistro,
        description="Campo para ordenação."
    ),
    service: ProposicaoService = Depends(get_service)
):
    # Parâmetros de paginação foram removidos daqui
    params = {
        "ordem": ordem.value,
        "ordenarPor": ordenarPor.value
    }
    return await service.get_votacoes_proposicao(id=id, params=clean_params(params))
