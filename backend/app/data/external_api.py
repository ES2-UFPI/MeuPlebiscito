import httpx
from typing import Optional

URL_BASE = "https://dadosabertos.camara.leg.br/api/v2"

async def buscar_deputados(
    id: Optional[int] = None,
    nome: Optional[str] = None,
    sigla_uf: Optional[str] = None,
    sigla_partido: Optional[str] = None
):
    parametros = {}
    if id:
        parametros["id"] = id
    if nome:
        parametros["nome"] = nome
    if sigla_uf:
        parametros["siglaUf"] = sigla_uf
    if sigla_partido:
        parametros["siglaPartido"] = sigla_partido

    async with httpx.AsyncClient() as cliente:
        resposta = await cliente.get(f"{URL_BASE}/deputados", params=parametros)
        resposta.raise_for_status()
        return resposta.json()
    

async def buscar_deputado_por_id(deputado_id: int):
    async with httpx.AsyncClient() as cliente:
        resposta = await cliente.get(f"{URL_BASE}/deputados/{deputado_id}")
        resposta.raise_for_status()
        return resposta.json()
    
    tessrssss