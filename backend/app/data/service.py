from . import external_api, schemas
from typing import Optional

async def listar_deputados(
    id: Optional[int] = None,
    nome: Optional[str] = None,
    sigla_uf: Optional[str] = None,
    sigla_partido: Optional[str] = None
) -> schemas.RespostaDeputados:
    dados = await external_api.buscar_deputados(
        id=id,
        nome=nome,
        sigla_uf=sigla_uf,
        sigla_partido=sigla_partido
    )
    return schemas.RespostaDeputados(**dados)

async def obter_deputado_por_id(deputado_id: int):
    return await external_api.buscar_deputado_por_id(deputado_id)
