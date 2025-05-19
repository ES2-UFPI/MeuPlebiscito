from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from . import service, schemas

router = APIRouter(prefix="/deputados", tags=["Deputados"])

@router.get("/", response_model=schemas.RespostaDeputados)
async def listar_deputados_endpoint(
    id: Optional[int] = Query(None),
    nome: Optional[str] = Query(None),
    sigla_uf: Optional[str] = Query(None),
    sigla_partido: Optional[str] = Query(None)
):
    return await service.listar_deputados(
        id=id,
        nome=nome,
        sigla_uf=sigla_uf,
        sigla_partido=sigla_partido
    )

@router.get("/{deputado_id}")
async def obter_deputado_endpoint(deputado_id: int):
    try:
        return await service.obter_deputado_por_id(deputado_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Deputado não encontrado")
