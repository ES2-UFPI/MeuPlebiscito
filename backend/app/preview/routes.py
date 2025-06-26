from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from .schemas import (
    DadosVisualizacao, RankingVisual, GrupoEstatisticas,
    MapaVisualizacao, Heatmap, TipoVisualizacao
)
from .service import servico_visualizacoes

router = APIRouter()

# ----------------------------------------
# Endpoints de Visualizações de Deputados
# ----------------------------------------

@router.get("/deputados/por-partido", response_model=DadosVisualizacao)
async def grafico_deputados_por_partido(
    estado: Optional[str] = Query(None, description="Filtrar por estado (UF)"),
    incluir_percentuais: bool = Query(True, description="Incluir percentuais no gráfico")
):
    """Gera gráfico de deputados por partido"""
    try:
        return await servico_visualizacoes.grafico_deputados_por_partido(
            estado=estado,
            incluir_percentuais=incluir_percentuais
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

@router.get("/deputados/por-estado", response_model=DadosVisualizacao)
async def grafico_deputados_por_estado():
    """Gera gráfico de deputados por estado"""
    try:
        return await servico_visualizacoes.grafico_deputados_por_estado()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

@router.get("/deputados/ranking-despesas", response_model=RankingVisual)
async def ranking_deputados_despesas(
    ano: Optional[int] = Query(None, description="Ano para ranking"),
    limite: int = Query(20, description="Número de deputados no ranking", ge=1, le=100),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    partido: Optional[str] = Query(None, description="Filtrar por partido")
):
    """Gera ranking de deputados por despesas"""
    try:
        return await servico_visualizacoes.ranking_deputados_despesas(
            ano=ano,
            limite=limite,
            estado=estado,
            partido=partido
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar ranking: {str(e)}")

@router.get("/deputados/heatmap-votacoes", response_model=Heatmap)
async def heatmap_votacoes_deputados(
    deputados_ids: List[int] = Query(..., description="IDs dos deputados para comparar"),
    limite_votacoes: int = Query(50, description="Número máximo de votações", ge=1, le=100)
):
    """Gera heatmap de votações de deputados"""
    if len(deputados_ids) > 20:
        raise HTTPException(status_code=400, detail="Máximo de 20 deputados permitido")
    
    try:
        return await servico_visualizacoes.heatmap_votacoes_deputados(
            deputados_ids=deputados_ids,
            limite_votacoes=limite_votacoes
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar heatmap: {str(e)}")

@router.get("/deputados/estatisticas-gerais", response_model=GrupoEstatisticas)
async def estatisticas_gerais_deputados():
    """Gera estatísticas gerais sobre deputados"""
    try:
        return await servico_visualizacoes.estatisticas_gerais_deputados()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar estatísticas: {str(e)}")

# ----------------------------------------
# Endpoints de Visualizações de Proposições
# ----------------------------------------

@router.get("/proposicoes/por-tipo", response_model=DadosVisualizacao)
async def grafico_proposicoes_por_tipo(
    ano: Optional[int] = Query(None, description="Ano para filtrar"),
    partido_autor: Optional[str] = Query(None, description="Partido do autor")
):
    """Gera gráfico de proposições por tipo"""
    try:
        return await servico_visualizacoes.grafico_proposicoes_por_tipo(
            ano=ano,
            partido_autor=partido_autor
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

@router.get("/proposicoes/timeline", response_model=DadosVisualizacao)
async def timeline_proposicoes(
    tipo_proposicao: Optional[str] = Query(None, description="Tipo de proposição (PL, PEC, etc.)"),
    anos: int = Query(5, description="Número de anos para timeline", ge=1, le=10)
):
    """Gera timeline de proposições por ano"""
    try:
        return await servico_visualizacoes.timeline_proposicoes(
            tipo_proposicao=tipo_proposicao,
            anos=anos
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar timeline: {str(e)}")

# ----------------------------------------
# Endpoints de Visualizações de Despesas
# ----------------------------------------

@router.get("/despesas/por-mes/{deputado_id}", response_model=DadosVisualizacao)
async def grafico_despesas_por_mes(
    deputado_id: int,
    ano: Optional[int] = Query(None, description="Ano para análise")
):
    """Gera gráfico de despesas por mês para um deputado"""
    try:
        return await servico_visualizacoes.grafico_despesas_por_mes(
            deputado_id=deputado_id,
            ano=ano
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

@router.get("/despesas/por-tipo/{deputado_id}", response_model=DadosVisualizacao)
async def grafico_despesas_por_tipo(
    deputado_id: int,
    ano: Optional[int] = Query(None, description="Ano para análise"),
    limite_tipos: int = Query(10, description="Número máximo de tipos", ge=1, le=20)
):
    """Gera gráfico de despesas por tipo para um deputado"""
    try:
        return await servico_visualizacoes.grafico_despesas_por_tipo(
            deputado_id=deputado_id,
            ano=ano,
            limite_tipos=limite_tipos
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar gráfico: {str(e)}")

# ----------------------------------------
# Endpoints de Mapas
# ----------------------------------------

@router.get("/mapas/deputados-por-estado", response_model=MapaVisualizacao)
async def mapa_deputados_por_estado():
    """Gera mapa com número de deputados por estado"""
    try:
        return await servico_visualizacoes.mapa_deputados_por_estado()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar mapa: {str(e)}")

# ----------------------------------------
# Endpoints de Dashboards
# ----------------------------------------

@router.get("/dashboard/deputados")
async def dashboard_deputados(
    estado: Optional[str] = Query(None, description="Filtrar por estado")
):
    """Gera dados para dashboard de deputados"""
    try:
        # Coleta múltiplas visualizações
        grafico_partidos = await servico_visualizacoes.grafico_deputados_por_partido(estado=estado)
        grafico_estados = await servico_visualizacoes.grafico_deputados_por_estado()
        estatisticas = await servico_visualizacoes.estatisticas_gerais_deputados()
        ranking_despesas = await servico_visualizacoes.ranking_deputados_despesas(limite=10)
        
        return {
            "titulo": f"Dashboard de Deputados{' - ' + estado if estado else ''}",
            "widgets": [
                {
                    "id": "grafico_partidos",
                    "titulo": "Deputados por Partido",
                    "tipo": "grafico_barras",
                    "dados": grafico_partidos,
                    "posicao": {"x": 0, "y": 0, "width": 6, "height": 4}
                },
                {
                    "id": "estatisticas_gerais",
                    "titulo": "Estatísticas Gerais",
                    "tipo": "estatisticas",
                    "dados": estatisticas,
                    "posicao": {"x": 6, "y": 0, "width": 6, "height": 2}
                },
                {
                    "id": "ranking_despesas",
                    "titulo": "Top 10 - Despesas",
                    "tipo": "ranking",
                    "dados": ranking_despesas,
                    "posicao": {"x": 6, "y": 2, "width": 6, "height": 4}
                },
                {
                    "id": "grafico_estados",
                    "titulo": "Deputados por Estado",
                    "tipo": "grafico_barras",
                    "dados": grafico_estados,
                    "posicao": {"x": 0, "y": 4, "width": 12, "height": 4}
                }
            ],
            "data_geracao": datetime.now().isoformat(),
            "filtros_aplicados": {"estado": estado}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar dashboard: {str(e)}")

@router.get("/dashboard/proposicoes")
async def dashboard_proposicoes(
    ano: Optional[int] = Query(None, description="Ano para análise")
):
    """Gera dados para dashboard de proposições"""
    try:
        # Coleta múltiplas visualizações
        grafico_tipos = await servico_visualizacoes.grafico_proposicoes_por_tipo(ano=ano)
        timeline = await servico_visualizacoes.timeline_proposicoes(anos=5)
        
        return {
            "titulo": f"Dashboard de Proposições{' - ' + str(ano) if ano else ''}",
            "widgets": [
                {
                    "id": "grafico_tipos",
                    "titulo": "Proposições por Tipo",
                    "tipo": "grafico_barras",
                    "dados": grafico_tipos,
                    "posicao": {"x": 0, "y": 0, "width": 6, "height": 4}
                },
                {
                    "id": "timeline",
                    "titulo": "Timeline de Proposições",
                    "tipo": "grafico_linhas",
                    "dados": timeline,
                    "posicao": {"x": 6, "y": 0, "width": 6, "height": 4}
                }
            ],
            "data_geracao": datetime.now().isoformat(),
            "filtros_aplicados": {"ano": ano}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar dashboard: {str(e)}")

@router.get("/dashboard/despesas/{deputado_id}")
async def dashboard_despesas_deputado(
    deputado_id: int,
    ano: Optional[int] = Query(None, description="Ano para análise")
):
    """Gera dados para dashboard de despesas de um deputado"""
    try:
        # Coleta múltiplas visualizações
        grafico_mensal = await servico_visualizacoes.grafico_despesas_por_mes(deputado_id, ano)
        grafico_tipos = await servico_visualizacoes.grafico_despesas_por_tipo(deputado_id, ano)
        
        return {
            "titulo": f"Dashboard de Despesas - Deputado {deputado_id}",
            "widgets": [
                {
                    "id": "grafico_mensal",
                    "titulo": "Despesas por Mês",
                    "tipo": "grafico_linhas",
                    "dados": grafico_mensal,
                    "posicao": {"x": 0, "y": 0, "width": 12, "height": 4}
                },
                {
                    "id": "grafico_tipos",
                    "titulo": "Despesas por Tipo",
                    "tipo": "grafico_pizza",
                    "dados": grafico_tipos,
                    "posicao": {"x": 0, "y": 4, "width": 12, "height": 4}
                }
            ],
            "data_geracao": datetime.now().isoformat(),
            "filtros_aplicados": {"deputado_id": deputado_id, "ano": ano}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar dashboard: {str(e)}")

# ----------------------------------------
# Endpoints de Configuração e Metadados
# ----------------------------------------

@router.get("/tipos-visualizacao")
async def obter_tipos_visualizacao():
    """Lista os tipos de visualização disponíveis"""
    return {
        "tipos": [
            {
                "codigo": "grafico_barras",
                "nome": "Gráfico de Barras",
                "descricao": "Gráfico de barras verticais ou horizontais",
                "adequado_para": ["comparacao", "ranking", "distribuicao"]
            },
            {
                "codigo": "grafico_linhas",
                "nome": "Gráfico de Linhas",
                "descricao": "Gráfico de linhas para séries temporais",
                "adequado_para": ["timeline", "tendencia", "evolucao"]
            },
            {
                "codigo": "grafico_pizza",
                "nome": "Gráfico de Pizza",
                "descricao": "Gráfico circular para mostrar proporções",
                "adequado_para": ["proporcao", "distribuicao", "percentuais"]
            },
            {
                "codigo": "heatmap",
                "nome": "Mapa de Calor",
                "descricao": "Visualização de matriz com cores",
                "adequado_para": ["correlacao", "comparacao_multipla", "padroes"]
            },
            {
                "codigo": "mapa",
                "nome": "Mapa Geográfico",
                "descricao": "Visualização em mapa geográfico",
                "adequado_para": ["distribuicao_geografica", "regioes"]
            },
            {
                "codigo": "ranking",
                "nome": "Ranking/Lista",
                "descricao": "Lista ordenada com posições",
                "adequado_para": ["ranking", "top_n", "classificacao"]
            }
        ]
    }

@router.get("/cores-partidos")
async def obter_cores_partidos():
    """Obtém as cores padrão para partidos políticos"""
    return {
        "cores_partidos": servico_visualizacoes.cores_partidos,
        "cores_padrao": servico_visualizacoes.cores_padrao
    }

@router.get("/metricas-disponiveis")
async def obter_metricas_disponiveis():
    """Lista as métricas disponíveis para visualização"""
    return {
        "deputados": [
            {"codigo": "quantidade", "nome": "Quantidade de Deputados"},
            {"codigo": "despesas_totais", "nome": "Despesas Totais"},
            {"codigo": "despesas_mensais", "nome": "Despesas Mensais"},
            {"codigo": "votacoes", "nome": "Número de Votações"},
            {"codigo": "presenca", "nome": "Percentual de Presença"}
        ],
        "proposicoes": [
            {"codigo": "quantidade", "nome": "Quantidade de Proposições"},
            {"codigo": "por_tipo", "nome": "Proposições por Tipo"},
            {"codigo": "por_ano", "nome": "Proposições por Ano"},
            {"codigo": "por_autor", "nome": "Proposições por Autor"}
        ],
        "despesas": [
            {"codigo": "valor_total", "nome": "Valor Total"},
            {"codigo": "valor_mensal", "nome": "Valor Mensal"},
            {"codigo": "por_tipo", "nome": "Despesas por Tipo"},
            {"codigo": "por_fornecedor", "nome": "Despesas por Fornecedor"}
        ]
    }

# ----------------------------------------
# Endpoints de Cache e Performance
# ----------------------------------------

@router.get("/cache/status")
async def status_cache():
    """Obtém status do cache de visualizações"""
    return {
        "cache_ativo": len(servico_visualizacoes.cache) > 0,
        "total_itens": len(servico_visualizacoes.cache),
        "memoria_estimada_mb": len(str(servico_visualizacoes.cache)) / 1024 / 1024
    }

@router.delete("/cache/limpar")
async def limpar_cache():
    """Limpa o cache de visualizações"""
    try:
        itens_removidos = len(servico_visualizacoes.cache)
        servico_visualizacoes.cache.clear()
        return {
            "mensagem": f"Cache limpo com sucesso",
            "itens_removidos": itens_removidos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar cache: {str(e)}")

# ----------------------------------------
# Endpoints de Análise Comparativa
# ----------------------------------------

@router.get("/comparacao/deputados")
async def comparacao_deputados(
    deputados_ids: List[int] = Query(..., description="IDs dos deputados para comparar"),
    metricas: List[str] = Query(["despesas", "votacoes"], description="Métricas para comparar"),
    ano: Optional[int] = Query(None, description="Ano para análise")
):
    """Gera comparação visual entre deputados"""
    if len(deputados_ids) > 10:
        raise HTTPException(status_code=400, detail="Máximo de 10 deputados permitido")
    
    try:
        # Implementação básica de comparação
        dados_comparacao = []
        
        for deputado_id in deputados_ids:
            try:
                deputado = await detalhes_deputado(deputado_id)
                dados_deputado = {
                    "id": deputado_id,
                    "nome": deputado.nome,
                    "partido": deputado.siglaPartido,
                    "uf": deputado.siglaUf
                }
                
                # Adiciona métricas solicitadas
                if "despesas" in metricas:
                    anos_busca = [ano] if ano else [datetime.now().year]
                    total_despesas = await despesas_totais_deputado(deputado_id, anos_busca)
                    dados_deputado["despesas"] = total_despesas
                
                if "votacoes" in metricas:
                    votacoes = await votacoes_deputado(deputado_id)
                    dados_deputado["total_votacoes"] = len(votacoes)
                    dados_deputado["votacoes_sim"] = len([v for v in votacoes if v.voto and v.voto.upper() == "SIM"])
                
                dados_comparacao.append(dados_deputado)
            except:
                continue
        
        return {
            "titulo": "Comparação de Deputados",
            "deputados": dados_comparacao,
            "metricas": metricas,
            "ano": ano,
            "data_geracao": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar comparação: {str(e)}")

