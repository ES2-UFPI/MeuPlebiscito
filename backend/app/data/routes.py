from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from .schemas import DeputadoResumo, DeputadoDetalhado, SenadorResumo, SenadorDetalhado
from .service import (
    listar_deputados,
    detalhes_deputado,
    despesas_totais_deputado,
    buscar_deputado_por_nome,
    listar_senadores,
    detalhes_senador,
)

router = APIRouter()

# Função auxiliar para tratamento padrão de exceções
async def try_catch(func, *args, not_found_msg=None, internal_error_msg=None):
    try:
        return await func(*args)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=not_found_msg or str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=internal_error_msg or str(e))

# --- Deputados ---

@router.get("/deputados", response_model=List[DeputadoResumo])
async def get_deputados(
    nome: Optional[str] = Query(None),
    partido: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    sexo: Optional[str] = Query(None),
):
    return await try_catch(
        listar_deputados,
        nome, partido, estado, sexo,
        internal_error_msg="Erro ao listar deputados"
    )

@router.get("/deputados/{deputado_id}", response_model=DeputadoDetalhado)
async def get_detalhes_deputado(deputado_id: int):
    return await try_catch(
        detalhes_deputado,
        deputado_id,
        not_found_msg="Deputado não encontrado",
        internal_error_msg="Erro ao buscar detalhes do deputado"
    )

@router.get("/deputados/despesas/total")
async def get_despesas_totais(
    deputado_id: Optional[int] = Query(None, description="ID do deputado"),
    nome: Optional[str] = Query(None, description="Nome do deputado para busca"),
    anos: Optional[List[int]] = Query(None, description="Lista de anos, ex: anos=2019&anos=2020"),
    ano_inicio: Optional[int] = Query(None, description="Ano inicial para faixa"),
    ano_fim: Optional[int] = Query(None, description="Ano final para faixa"),
):
    if not deputado_id and not nome:
        raise HTTPException(status_code=400, detail="Informe deputado_id ou nome para busca")

    # Busca deputado pelo nome se deputado_id não foi fornecido
    if nome and not deputado_id:
        deputado = await buscar_deputado_por_nome(nome)
        if not deputado:
            raise HTTPException(status_code=404, detail="Deputado não encontrado pelo nome informado")
        deputado_id = deputado.id

    # Monta lista de anos a consultar
    anos_para_buscar = []
    if ano_inicio is not None and ano_fim is not None:
        if ano_fim < ano_inicio:
            raise HTTPException(status_code=400, detail="ano_fim deve ser maior ou igual a ano_inicio")
        anos_para_buscar = list(range(ano_inicio, ano_fim + 1))
    elif anos:
        anos_para_buscar = anos

    total = await try_catch(
        despesas_totais_deputado,
        deputado_id,
        anos_para_buscar,
        internal_error_msg="Erro ao calcular despesas totais"
    )
    return {
        "deputado_id": deputado_id,
        "anos": anos_para_buscar if anos_para_buscar else "todos os anos (limitado)",
        "total_despesas": total,
    }


# --- Senadores ---

@router.get("/senadores", response_model=List[SenadorResumo])
async def get_senadores(
    uf: Optional[str] = Query(None),
    participacao: Optional[str] = Query(None),
):
    # Passa os filtros para listar senadores se precisar estender
    return await try_catch(
        listar_senadores,
        uf,
        participacao,
        internal_error_msg="Erro ao listar senadores"
    )

@router.get("/senadores/{senador_id}", response_model=SenadorDetalhado)
async def get_detalhes_senador(senador_id: int):
    return await try_catch(
        detalhes_senador,
        senador_id,
        not_found_msg="Senador não encontrado",
        internal_error_msg="Erro ao buscar detalhes do senador"
    )
