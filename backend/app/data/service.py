# service.py
import httpx
import xmltodict
from typing import List, Optional
from datetime import datetime
from .schemas import DeputadoResumo, DeputadoDetalhado, SenadorResumo, SenadorDetalhado

# URLs base
BASE_URL_CAMARA = "https://dadosabertos.camara.leg.br/api/v2"
BASE_URL_SENADO = "https://legis.senado.leg.br/dadosabertos"

# --------- Deputados ---------

async def listar_deputados(
    nome: Optional[str] = None,
    partido: Optional[str] = None,
    estado: Optional[str] = None,
    sexo: Optional[str] = None
) -> List[DeputadoResumo]:
    params = {}
    if nome:
        params["nome"] = nome
    if partido:
        params["siglaPartido"] = partido.upper()
    if estado:
        params["siglaUf"] = estado.upper()
    if sexo:
        params["siglaSexo"] = sexo.upper()

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_CAMARA}/deputados", params=params)
        resp.raise_for_status()
        dados = resp.json().get("dados", [])
        return [DeputadoResumo(**dep) for dep in dados]

async def detalhes_deputado(deputado_id: int) -> DeputadoDetalhado:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_CAMARA}/deputados/{deputado_id}")
        resp.raise_for_status()
        dados = resp.json().get("dados", {})
        if not dados:
            raise ValueError("Deputado não encontrado")
        return DeputadoDetalhado.from_api_data(dados)

async def buscar_deputado_por_nome(nome: str) -> Optional[DeputadoResumo]:
    params = {"nome": nome}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_CAMARA}/deputados", params=params)
        resp.raise_for_status()
        dados = resp.json().get("dados", [])
        if dados:
            return DeputadoResumo(**dados[0])
        return None

async def despesas_totais_deputado(deputado_id: int, anos: Optional[List[int]] = None) -> float:
    total = 0.0
    async with httpx.AsyncClient() as client:
        anos_para_buscar = anos or list(range(2010, datetime.now().year + 1))

        for ano in anos_para_buscar:
            pagina = 1
            while True:
                params = {
                    "ano": ano,
                    "ordem": "ASC",
                    "ordenarPor": "ano",
                    "pagina": pagina,
                    "itens": 100
                }
                url = f"{BASE_URL_CAMARA}/deputados/{deputado_id}/despesas"
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
                despesas = data.get("dados", [])
                total += sum(float(gasto.get("valorLiquido", 0)) for gasto in despesas)

                # Checa se há próxima página
                links = data.get("links", [])
                prox_pagina = next(
                    (int(link.get("pagina")) for link in links if link.get("rel") == "next"), None
                )
                if not prox_pagina or pagina >= prox_pagina:
                    break
                pagina += 1

    return total


# --------- Senadores ---------

async def listar_senadores(
    uf: Optional[str] = None,
    participacao: Optional[str] = None
) -> List[SenadorResumo]:
    params = {"v": 4}  # versão do serviço
    if uf:
        params["uf"] = uf.upper()
    if participacao:
        params["participacao"] = participacao.upper()

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_SENADO}/senador/lista/atual", params=params)
        resp.raise_for_status()
        data = xmltodict.parse(resp.text)

        parlamentares = data.get("ListaParlamentarEmExercicio", {}) \
                          .get("Parlamentares", {}) \
                          .get("Parlamentar", [])
        if isinstance(parlamentares, dict):
            parlamentares = [parlamentares]

        senadores = []
        for p in parlamentares:
            ident = p.get("IdentificacaoParlamentar", {})
            senadores.append(SenadorResumo(
                codigo_parlamentar=int(ident.get("CodigoParlamentar")),
                nome_parlamentar=ident.get("NomeParlamentar", ""),
                nome_completo_parlamentar=ident.get("NomeCompletoParlamentar", ""),
                sexo_parlamentar=ident.get("SexoParlamentar"),
                url_foto_parlamentar=ident.get("UrlFotoParlamentar"),
                url_pagina_parlamentar=ident.get("UrlPaginaParlamentar"),
                email_parlamentar=ident.get("EmailParlamentar"),
                sigla_partido_parlamentar=ident.get("SiglaPartidoParlamentar"),
                uf_parlamentar=ident.get("UfParlamentar"),
            ))
        return senadores

async def detalhes_senador(codigo: int) -> SenadorDetalhado:
    params = {"v": 6}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_SENADO}/senador/{codigo}", params=params)
        resp.raise_for_status()
        data = xmltodict.parse(resp.text)

        parlamentar = data.get("DetalheParlamentar", {}).get("Parlamentar", {})
        ident = parlamentar.get("IdentificacaoParlamentar", {})
        dados_basicos = parlamentar.get("DadosBasicosParlamentar", {})

        return SenadorDetalhado(
            codigo_parlamentar=int(ident.get("CodigoParlamentar")),
            nome_parlamentar=ident.get("NomeParlamentar", ""),
            nome_completo_parlamentar=ident.get("NomeCompletoParlamentar", ""),
            sexo_parlamentar=ident.get("SexoParlamentar"),
            url_foto_parlamentar=ident.get("UrlFotoParlamentar"),
            url_pagina_parlamentar=ident.get("UrlPaginaParlamentar"),
            email_parlamentar=ident.get("EmailParlamentar"),
            sigla_partido_parlamentar=ident.get("SiglaPartidoParlamentar"),
            uf_parlamentar=ident.get("UfParlamentar"),
            data_nascimento=dados_basicos.get("DataNascimento"),
            naturalidade=dados_basicos.get("Naturalidade"),
            uf_naturalidade=dados_basicos.get("UfNaturalidade"),
            endereco_parlamentar=dados_basicos.get("EnderecoParlamentar"),
        )
