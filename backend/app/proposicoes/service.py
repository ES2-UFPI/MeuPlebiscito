# proposicoes/service.py

import httpx
from typing import Dict, Any, Optional
from collections import defaultdict


API_BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"

class ProposicaoService:
    async def _request_api(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        headers = {"Accept": "application/json"}
        # Remove chaves com valor None antes de fazer a requisição
        if params:
            params = {k: v for k, v in params.items() if v is not None}
            
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{API_BASE_URL}{endpoint}", params=params, headers=headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                raise Exception(f"Erro na API da Câmara: {e.response.status_code} - {e.response.text}")
            except httpx.RequestError as e:
                raise ConnectionError(f"Erro de conexão com a API da Câmara: {e}")

    async def get_proposicoes(self, params: Dict[str, Any]) -> Dict[str, Any]:
        return await self._request_api("/proposicoes", params=params)

    async def get_proposicao_by_id(self, id: int) -> Dict[str, Any]:
        return await self._request_api(f"/proposicoes/{id}")

    async def get_autores_proposicao(self, id: int) -> Dict[str, Any]:
        return await self._request_api(f"/proposicoes/{id}/autores")

    async def get_proposicoes_relacionadas(self, id: int) -> Dict[str, Any]:
        return await self._request_api(f"/proposicoes/{id}/relacionadas")

    async def get_temas_proposicao(self, id: int) -> Dict[str, Any]:
        return await self._request_api(f"/proposicoes/{id}/temas")

    async def get_tramitacoes_proposicao(self, id: int, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """GET /proposicoes/{id}/tramitacoes: Lista o histórico de tramitação."""
        return await self._request_api(f"/proposicoes/{id}/tramitacoes", params=params)

    async def get_votacoes_proposicao(self, id: int, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """GET /proposicoes/{id}/votacoes: Lista as votações de uma proposição."""
        return await self._request_api(f"/proposicoes/{id}/votacoes", params=params)

proposicao_service = ProposicaoService()


class EstatisticasProposicoes:
    def __init__(self,
                 total_proposicoes: int = 0,
                 por_tipo: Dict[str, int] = None,
                 por_ano: Dict[int, int] = None,
                 por_partido: Dict[str, int] = None,
                 por_uf: Dict[str, int] = None,
                 por_tema: Dict[str, int] = None):
        self.total_proposicoes = total_proposicoes
        self.por_tipo = por_tipo if por_tipo is not None else {}
        self.por_ano = por_ano if por_ano is not None else {}
        self.por_partido = por_partido if por_partido is not None else {}
        self.por_uf = por_uf if por_uf is not None else {}
        self.por_tema = por_tema if por_tema is not None else {}

async def estatisticas_proposicoes(
    ano_inicio: Optional[int] = None,
    ano_fim: Optional[int] = None,
    partido: Optional[str] = None,
    uf: Optional[str] = None,
    tema: Optional[str] = None
) -> EstatisticasProposicoes:
    """Calcula estatísticas de proposições com filtros"""
    params = {
        "dataInicio": f"{ano_inicio}-01-01" if ano_inicio else None,
        "dataFim": f"{ano_fim}-12-31" if ano_fim else None,
        "siglaPartidoAutor": partido,
        "siglaUfAutor": uf,
        "keywords": tema, # Usando keywords para tema, pode ser ajustado
        "itens": 100 # Buscar mais itens por página para cálculo de estatísticas
    }
    
    service = ProposicaoService()
    response = await service.get_proposicoes(params={k: v for k, v in params.items() if v is not None})
    
    proposicoes = response.get("dados", [])
    total_proposicoes = len(proposicoes)
    
    por_tipo = defaultdict(int)
    por_ano = defaultdict(int)
    por_partido = defaultdict(int)
    por_uf = defaultdict(int)
    por_tema = defaultdict(int)

    for prop in proposicoes:
        por_tipo[prop.get("siglaTipo")] += 1
        por_ano[prop.get("ano")] += 1
        
        # Autores e temas precisam de chamadas adicionais ou dados mais ricos na lista inicial
        # Para simplificar, vamos usar o que está disponível diretamente na lista
        if prop.get("statusProposicao") and prop["statusProposicao"].get("siglaPartido"): 
            por_partido[prop["statusProposicao"]["siglaPartido"]] += 1
        if prop.get("statusProposicao") and prop["statusProposicao"].get("siglaUf"): 
            por_uf[prop["statusProposicao"]["siglaUf"]] += 1
        
        # Temas não estão diretamente na lista, precisaríamos de outra chamada para cada proposição
        # ou um endpoint de API que agregue por tema. Por enquanto, será vazio.

    return EstatisticasProposicoes(
        total_proposicoes=total_proposicoes,
        por_tipo=dict(por_tipo),
        por_ano=dict(por_ano),
        por_partido=dict(por_partido),
        por_uf=dict(por_uf),
        por_tema=dict(por_tema)
    )

