# proposicoes/service.py

import httpx
from typing import Dict, Any, Optional

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