# service.py
import httpx
import xmltodict
from typing import List, Optional, Dict, Any
from datetime import datetime
from .schemas import *
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

    async with httpx.AsyncClient(verify=False) as client:
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

async def despesas_detalhadas_deputado(
    deputado_id: int, 
    ano: Optional[int] = None,
    mes: Optional[int] = None,
    cnpj_cpf_fornecedor: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Busca despesas detalhadas de um deputado com filtros opcionais"""
    params = {
        "ordem": "DESC",
        "ordenarPor": "dataDocumento",
        "itens": 100
    }
    
    if ano:
        params["ano"] = ano
    if mes:
        params["mes"] = mes
    if cnpj_cpf_fornecedor:
        params["cnpjCpfFornecedor"] = cnpj_cpf_fornecedor

    despesas = []
    async with httpx.AsyncClient() as client:
        pagina = 1
        while True:
            params["pagina"] = pagina
            url = f"{BASE_URL_CAMARA}/deputados/{deputado_id}/despesas"
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            
            dados_pagina = data.get("dados", [])
            despesas.extend(dados_pagina)
            
            # Checa se há próxima página
            links = data.get("links", [])
            prox_pagina = next(
                (int(link.get("pagina")) for link in links if link.get("rel") == "next"), None
            )
            if not prox_pagina or pagina >= prox_pagina:
                break
            pagina += 1

    return despesas


async def historico_mandatos_deputado(deputado_id: int) -> List[MandatoDeputado]:
    """Busca o histórico de mandatos de um deputado"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_CAMARA}/deputados/{deputado_id}")
        resp.raise_for_status()
        dados = resp.json().get("dados", {})
        
        if not dados:
            raise ValueError("Deputado não encontrado")
        
        # Busca histórico de ocupações
        mandatos = []
        ocupacoes = dados.get("redeSocial", [])  # Placeholder - API real pode ter endpoint específico
        
        # Para demonstração, vamos buscar dados do status atual
        ultimo_status = dados.get("ultimoStatus", {})
        if ultimo_status:
            mandatos.append(MandatoDeputado(
                id_legislatura=ultimo_status.get("idLegislatura"),
                nome_legislatura=f"Legislatura {ultimo_status.get('idLegislatura')}",
                data_inicio=ultimo_status.get("data"),
                data_fim=None,  # Mandato atual
                sigla_partido=ultimo_status.get("siglaPartido"),
                sigla_uf=ultimo_status.get("siglaUf"),
                situacao=ultimo_status.get("situacao"),
                condicao_eleitoral=ultimo_status.get("condicaoEleitoral")
            ))
        
        return mandatos
    


async def historico_partidos_deputado(deputado_id: int) -> List[HistoricoPartidoDeputado]:
    """Busca o histórico de partidos de um deputado"""
    # Nota: A API da Câmara não tem endpoint específico para histórico de partidos
    # Esta é uma implementação de exemplo que pode ser expandida
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_CAMARA}/deputados/{deputado_id}")
        resp.raise_for_status()
        dados = resp.json().get("dados", {})
        
        if not dados:
            raise ValueError("Deputado não encontrado")
        
        historico = []
        ultimo_status = dados.get("ultimoStatus", {})
        if ultimo_status:
            historico.append(HistoricoPartidoDeputado(
                sigla_partido=ultimo_status.get("siglaPartido"),
                nome_partido=ultimo_status.get("siglaPartido"),  # Placeholder
                data_inicio=ultimo_status.get("data"),
                data_fim=None,  # Partido atual
                id_legislatura=ultimo_status.get("idLegislatura")
            ))
        
        return historico
    
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


async def mandatos_senador(codigo: int) -> List[Dict[str, Any]]:
    """Busca os mandatos de um senador"""
    params = {"v": 5}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_SENADO}/senador/{codigo}/mandatos", params=params)
        resp.raise_for_status()
        data = xmltodict.parse(resp.text)
        
        mandatos_data = data.get("MandatosParlamentar", {}).get("Mandato", [])
        if isinstance(mandatos_data, dict):
            mandatos_data = [mandatos_data]
        
        mandatos = []
        for mandato in mandatos_data:
            mandatos.append({
                "codigo_mandato": mandato.get("CodigoMandato"),
                "descricao_participacao": mandato.get("DescricaoParticipacao"),
                "data_inicio": mandato.get("PrimeiraLegislaturaDoMandato", {}).get("DataInicio"),
                "data_fim": mandato.get("SegundaLegislaturaDoMandato", {}).get("DataFim"),
                "uf_mandato": mandato.get("UfParlamentar")
            })
        
        return mandatos

async def votacoes_senador(codigo: int, ano: Optional[int] = None) -> List[Dict[str, Any]]:
    """Busca as votações de um senador"""
    params = {"v": 5}
    if ano:
        params["ano"] = ano
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL_SENADO}/senador/{codigo}/votacoes", params=params)
        resp.raise_for_status()
        data = xmltodict.parse(resp.text)
        
        votacoes_data = data.get("VotacoesParlamentar", {}).get("Votacao", [])
        if isinstance(votacoes_data, dict):
            votacoes_data = [votacoes_data]
        
        votacoes = []
        for votacao in votacoes_data:
            votacoes.append({
                "sessao_codigo": votacao.get("SessaoPlenaria", {}).get("CodigoSessao"),
                "sessao_data": votacao.get("SessaoPlenaria", {}).get("DataSessao"),
                "descricao_voto": votacao.get("DescricaoVoto"),
                "materia_codigo": votacao.get("Materia", {}).get("CodigoMateria"),
                "materia_ementa": votacao.get("Materia", {}).get("EmentaMateria")
            })
        
        return votacoes

