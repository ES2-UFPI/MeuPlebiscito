# service.py
# service.py
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Union
from collections import defaultdict, Counter
import statistics

from .schemas import (
    DadosVisualizacao, ConfigVisualizacao, SerieGrafico, PontoGrafico,
    TipoVisualizacao, GraficoBarras, GraficoLinhas, GraficoPizza,
    RankingVisual, ItemRanking, EstatisticaVisual, GrupoEstatisticas,
    MapaVisualizacao, RegiaoMapa, Heatmap
)

# Importa serviços dos outros módulos
from ..data.service import (
    listar_deputados, detalhes_deputado, despesas_totais_deputado,
    despesas_detalhadas_deputado, votacoes_deputado, listar_senadores
)
from ..proposicoes.service import (
    estatisticas_proposicoes
)

# ----------------------------------------
# Classe Principal do Serviço de Visualizações
# ----------------------------------------

class ServicoVisualizacoes:
    def __init__(self):
        self.cache = {}
        self.cores_padrao = [
            "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6",
            "#1abc9c", "#34495e", "#e67e22", "#95a5a6", "#f1c40f"
        ]
        self.cores_partidos = {
            "PT": "#e74c3c",
            "PSDB": "#3498db", 
            "MDB": "#2ecc71",
            "PP": "#9b59b6",
            "PL": "#f39c12",
            "PSB": "#e67e22",
            "PDT": "#1abc9c",
            "REPUBLICANOS": "#34495e",
            "UNIÃO": "#f1c40f",
            "PSOL": "#e74c3c"
        }
    
    # ----------------------------------------
    # Visualizações de Deputados
    # ----------------------------------------
    
    async def grafico_deputados_por_partido(
        self, 
        estado: Optional[str] = None,
        incluir_percentuais: bool = True
    ) -> DadosVisualizacao:
        """Gera gráfico de deputados por partido"""
        
        # Busca deputados
        deputados = await listar_deputados(estado=estado)
        
        # Conta por partido
        contagem_partidos = Counter([dep.siglaPartido for dep in deputados])
        
        # Prepara dados para o gráfico
        dados_grafico = []
        total_deputados = len(deputados)
        
        for partido, quantidade in contagem_partidos.most_common():
            percentual = (quantidade / total_deputados * 100) if total_deputados > 0 else 0
            cor = self.cores_partidos.get(partido, self.cores_padrao[len(dados_grafico) % len(self.cores_padrao)])
            
            dados_grafico.append(PontoGrafico(
                x=partido,
                y=quantidade,
                label=f"{partido}: {quantidade} ({percentual:.1f}%)" if incluir_percentuais else f"{partido}: {quantidade}",
                cor=cor,
                metadados={
                    "partido": partido,
                    "quantidade": quantidade,
                    "percentual": round(percentual, 2)
                }
            ))
        
        config = ConfigVisualizacao(
            titulo=f"Deputados por Partido{' - ' + estado if estado else ''}",
            tipo=TipoVisualizacao.GRAFICO_BARRAS,
            cores=[ponto.cor for ponto in dados_grafico],
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome="Deputados",
            dados=dados_grafico
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={
                "total_deputados": total_deputados,
                "total_partidos": len(contagem_partidos),
                "estado_filtro": estado
            },
            data_geracao=datetime.now()
        )
    
    async def grafico_deputados_por_estado(self) -> DadosVisualizacao:
        """Gera gráfico de deputados por estado"""
        
        deputados = await listar_deputados()
        
        # Conta por estado
        contagem_estados = Counter([dep.siglaUf for dep in deputados])
        
        # Prepara dados para o gráfico
        dados_grafico = []
        for estado, quantidade in sorted(contagem_estados.items()):
            dados_grafico.append(PontoGrafico(
                x=estado,
                y=quantidade,
                label=f"{estado}: {quantidade}",
                metadados={"estado": estado, "quantidade": quantidade}
            ))
        
        config = ConfigVisualizacao(
            titulo="Deputados por Estado",
            tipo=TipoVisualizacao.GRAFICO_BARRAS,
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome="Deputados",
            dados=dados_grafico
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={"total_estados": len(contagem_estados)},
            data_geracao=datetime.now()
        )
    
    async def ranking_deputados_despesas(
        self, 
        ano: Optional[int] = None,
        limite: int = 20,
        estado: Optional[str] = None,
        partido: Optional[str] = None
    ) -> RankingVisual:
        """Gera ranking de deputados por despesas"""
        
        # Busca deputados com filtros
        deputados = await listar_deputados(estado=estado, partido=partido)
        
        # Calcula despesas para cada deputado
        deputados_despesas = []
        anos_busca = [ano] if ano else [datetime.now().year]
        
        for deputado in deputados[:50]:  # Limita para performance
            try:
                total_despesas = await despesas_totais_deputado(deputado.id, anos_busca)
                deputados_despesas.append({
                    "deputado": deputado,
                    "despesas": total_despesas
                })
            except:
                continue  # Pula deputados com erro
        
        # Ordena por despesas
        deputados_despesas.sort(key=lambda x: x["despesas"], reverse=True)
        
        # Prepara itens do ranking
        itens_ranking = []
        for i, item in enumerate(deputados_despesas[:limite]):
            deputado = item["deputado"]
            despesas = item["despesas"]
            
            itens_ranking.append(ItemRanking(
                posicao=i + 1,
                id=str(deputado.id),
                nome=f"{deputado.nome} ({deputado.siglaPartido}-{deputado.siglaUf})",
                valor=despesas,
                valor_formatado=f"R$ {despesas:,.2f}",
                metadados={
                    "deputado_id": deputado.id,
                    "partido": deputado.siglaPartido,
                    "uf": deputado.siglaUf,
                    "ano": ano or "atual"
                }
            ))
        
        return RankingVisual(
            titulo=f"Ranking de Deputados por Despesas{' - ' + str(ano) if ano else ' (Ano Atual)'}",
            metrica="Despesas Totais",
            itens=itens_ranking,
            total_itens=len(deputados_despesas),
            itens_por_pagina=limite
        )
    
    async def heatmap_votacoes_deputados(
        self,
        deputados_ids: List[int],
        limite_votacoes: int = 50
    ) -> Heatmap:
        """Gera heatmap de votações de deputados"""
        
        # Busca votações para cada deputado
        dados_votacoes = {}
        votacoes_unicas = set()
        
        for deputado_id in deputados_ids:
            try:
                votacoes = await votacoes_deputado(deputado_id)
                dados_votacoes[deputado_id] = {}
                
                for votacao in votacoes[:limite_votacoes]:
                    if votacao.uri_votacao:
                        votacoes_unicas.add(votacao.uri_votacao)
                        # Converte voto para valor numérico
                        valor_voto = 0
                        if votacao.voto:
                            if votacao.voto.upper() == "SIM":
                                valor_voto = 1
                            elif votacao.voto.upper() == "NÃO":
                                valor_voto = -1
                            # Abstenção, obstrução = 0
                        
                        dados_votacoes[deputado_id][votacao.uri_votacao] = valor_voto
            except:
                dados_votacoes[deputado_id] = {}
        
        # Prepara matriz para heatmap
        votacoes_lista = list(votacoes_unicas)[:limite_votacoes]
        matriz_dados = []
        labels_deputados = []
        
        for deputado_id in deputados_ids:
            try:
                deputado = await detalhes_deputado(deputado_id)
                labels_deputados.append(f"{deputado.nome[:20]}...")
            except:
                labels_deputados.append(f"Deputado {deputado_id}")
            
            linha = []
            for votacao_uri in votacoes_lista:
                valor = dados_votacoes.get(deputado_id, {}).get(votacao_uri, 0)
                linha.append(valor)
            matriz_dados.append(linha)
        
        labels_votacoes = [f"Votação {i+1}" for i in range(len(votacoes_lista))]
        
        return Heatmap(
            titulo="Heatmap de Votações de Deputados",
            dados=matriz_dados,
            labels_x=labels_votacoes,
            labels_y=labels_deputados,
            escala_cor=["#e74c3c", "#f8f9fa", "#2ecc71"],  # Vermelho, Neutro, Verde
            mostrar_valores=False
        )
    
    # ----------------------------------------
    # Visualizações de Proposições
    # ----------------------------------------
    
    async def grafico_proposicoes_por_tipo(
        self,
        ano: Optional[int] = None,
        partido_autor: Optional[str] = None
    ) -> DadosVisualizacao:
        """Gera gráfico de proposições por tipo"""
        
        # Busca estatísticas de proposições
        estatisticas = await estatisticas_proposicoes(
            ano_inicio=ano,
            ano_fim=ano,
            partido=partido_autor
        )
        
        # Prepara dados para o gráfico
        dados_grafico = []
        for tipo, quantidade in estatisticas.por_tipo.items():
            dados_grafico.append(PontoGrafico(
                x=tipo,
                y=quantidade,
                label=f"{tipo}: {quantidade}",
                metadados={"tipo": tipo, "quantidade": quantidade}
            ))
        
        # Ordena por quantidade
        dados_grafico.sort(key=lambda x: x.y, reverse=True)
        
        config = ConfigVisualizacao(
            titulo=f"Proposições por Tipo{' - ' + str(ano) if ano else ''}",
            tipo=TipoVisualizacao.GRAFICO_BARRAS,
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome="Proposições",
            dados=dados_grafico
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={
                "total_proposicoes": estatisticas.total_proposicoes,
                "ano_filtro": ano,
                "partido_filtro": partido_autor
            },
            data_geracao=datetime.now()
        )
    
    async def timeline_proposicoes(
        self,
        tipo_proposicao: Optional[str] = None,
        anos: int = 5
    ) -> DadosVisualizacao:
        """Gera timeline de proposições por ano"""
        
        ano_atual = datetime.now().year
        dados_timeline = []
        
        for ano in range(ano_atual - anos + 1, ano_atual + 1):
            try:
                estatisticas = await estatisticas_proposicoes(
                    ano_inicio=ano,
                    ano_fim=ano
                )
                
                if tipo_proposicao:
                    quantidade = estatisticas.por_tipo.get(tipo_proposicao, 0)
                else:
                    quantidade = estatisticas.total_proposicoes
                
                dados_timeline.append(PontoGrafico(
                    x=str(ano),
                    y=quantidade,
                    label=f"{ano}: {quantidade}",
                    metadados={"ano": ano, "quantidade": quantidade}
                ))
            except:
                dados_timeline.append(PontoGrafico(
                    x=str(ano),
                    y=0,
                    label=f"{ano}: 0",
                    metadados={"ano": ano, "quantidade": 0}
                ))
        
        config = ConfigVisualizacao(
            titulo=f"Timeline de Proposições{' - ' + tipo_proposicao if tipo_proposicao else ''}",
            tipo=TipoVisualizacao.GRAFICO_LINHAS,
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome=tipo_proposicao or "Todas as Proposições",
            dados=dados_timeline
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={
                "periodo_anos": anos,
                "tipo_filtro": tipo_proposicao
            },
            data_geracao=datetime.now()
        )
    
    # ----------------------------------------
    # Visualizações de Despesas
    # ----------------------------------------
    
    async def grafico_despesas_por_mes(
        self,
        deputado_id: int,
        ano: Optional[int] = None
    ) -> DadosVisualizacao:
        """Gera gráfico de despesas por mês para um deputado"""
        
        ano_busca = ano or datetime.now().year
        
        # Busca despesas detalhadas
        despesas = await despesas_detalhadas_deputado(deputado_id, ano=ano_busca)
        
        # Agrupa por mês
        despesas_por_mes = defaultdict(float)
        for despesa in despesas:
            try:
                # Extrai mês da data do documento
                data_doc = despesa.get("dataDocumento", "")
                if data_doc and len(data_doc) >= 7:
                    mes = int(data_doc[5:7])
                    valor = float(despesa.get("valorLiquido", 0))
                    despesas_por_mes[mes] += valor
            except:
                continue
        
        # Prepara dados para o gráfico
        meses_nomes = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ]
        
        dados_grafico = []
        for mes in range(1, 13):
            valor = despesas_por_mes.get(mes, 0)
            dados_grafico.append(PontoGrafico(
                x=meses_nomes[mes - 1],
                y=valor,
                label=f"{meses_nomes[mes - 1]}: R$ {valor:,.2f}",
                metadados={"mes": mes, "valor": valor}
            ))
        
        # Busca nome do deputado
        try:
            deputado = await detalhes_deputado(deputado_id)
            nome_deputado = deputado.nome
        except:
            nome_deputado = f"Deputado {deputado_id}"
        
        config = ConfigVisualizacao(
            titulo=f"Despesas Mensais - {nome_deputado} ({ano_busca})",
            tipo=TipoVisualizacao.GRAFICO_LINHAS,
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome="Despesas",
            dados=dados_grafico,
            cor="#e74c3c"
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={
                "deputado_id": deputado_id,
                "ano": ano_busca,
                "total_despesas": sum(despesas_por_mes.values())
            },
            data_geracao=datetime.now()
        )
    
    async def grafico_despesas_por_tipo(
        self,
        deputado_id: int,
        ano: Optional[int] = None,
        limite_tipos: int = 10
    ) -> DadosVisualizacao:
        """Gera gráfico de despesas por tipo para um deputado"""
        
        ano_busca = ano or datetime.now().year
        
        # Busca despesas detalhadas
        despesas = await despesas_detalhadas_deputado(deputado_id, ano=ano_busca)
        
        # Agrupa por tipo de despesa
        despesas_por_tipo = defaultdict(float)
        for despesa in despesas:
            tipo = despesa.get("tipoDespesa", "Outros")
            valor = float(despesa.get("valorLiquido", 0))
            despesas_por_tipo[tipo] += valor
        
        # Ordena e limita tipos
        tipos_ordenados = sorted(despesas_por_tipo.items(), key=lambda x: x[1], reverse=True)
        tipos_principais = tipos_ordenados[:limite_tipos]
        
        # Agrupa o resto em "Outros"
        if len(tipos_ordenados) > limite_tipos:
            valor_outros = sum(valor for _, valor in tipos_ordenados[limite_tipos:])
            tipos_principais.append(("Outros", valor_outros))
        
        # Prepara dados para o gráfico
        dados_grafico = []
        total_despesas = sum(valor for _, valor in tipos_principais)
        
        for tipo, valor in tipos_principais:
            percentual = (valor / total_despesas * 100) if total_despesas > 0 else 0
            dados_grafico.append(PontoGrafico(
                x=tipo,
                y=valor,
                label=f"{tipo}: R$ {valor:,.2f} ({percentual:.1f}%)",
                metadados={
                    "tipo": tipo,
                    "valor": valor,
                    "percentual": round(percentual, 2)
                }
            ))
        
        # Busca nome do deputado
        try:
            deputado = await detalhes_deputado(deputado_id)
            nome_deputado = deputado.nome
        except:
            nome_deputado = f"Deputado {deputado_id}"
        
        config = ConfigVisualizacao(
            titulo=f"Despesas por Tipo - {nome_deputado} ({ano_busca})",
            tipo=TipoVisualizacao.GRAFICO_PIZZA,
            mostrar_valores=True
        )
        
        serie = SerieGrafico(
            nome="Despesas",
            dados=dados_grafico
        )
        
        return DadosVisualizacao(
            config=config,
            series=[serie],
            metadados={
                "deputado_id": deputado_id,
                "ano": ano_busca,
                "total_despesas": total_despesas,
                "total_tipos": len(despesas_por_tipo)
            },
            data_geracao=datetime.now()
        )
    
    # ----------------------------------------
    # Visualizações de Mapas
    # ----------------------------------------
    
    async def mapa_deputados_por_estado(self) -> MapaVisualizacao:
        """Gera mapa com número de deputados por estado"""
        
        deputados = await listar_deputados()
        
        # Conta deputados por estado
        contagem_estados = Counter([dep.siglaUf for dep in deputados])
        
        # Prepara regiões para o mapa
        regioes = []
        for estado, quantidade in contagem_estados.items():
            regioes.append(RegiaoMapa(
                codigo=estado,
                nome=estado,
                valor=quantidade,
                metadados={
                    "estado": estado,
                    "deputados": quantidade
                }
            ))
        
        return MapaVisualizacao(
            titulo="Deputados por Estado",
            tipo="regioes",
            regioes=regioes,
            centro={"lat": -14.235, "lng": -51.925},  # Centro do Brasil
            zoom=4
        )
    
    # ----------------------------------------
    # Estatísticas Visuais
    # ----------------------------------------
    
    async def estatisticas_gerais_deputados(self) -> GrupoEstatisticas:
        """Gera estatísticas gerais sobre deputados"""
        
        deputados = await listar_deputados()
        
        # Calcula estatísticas
        total_deputados = len(deputados)
        contagem_partidos = len(set([dep.siglaPartido for dep in deputados]))
        contagem_estados = len(set([dep.siglaUf for dep in deputados]))
        
        # Conta por sexo (se disponível)
        deputados_com_detalhes = 0
        homens = 0
        mulheres = 0
        
        for deputado in deputados[:50]:  # Amostra para performance
            try:
                detalhes = await detalhes_deputado(deputado.id)
                deputados_com_detalhes += 1
                if detalhes.sexo == "M":
                    homens += 1
                elif detalhes.sexo == "F":
                    mulheres += 1
            except:
                continue
        
        # Extrapola para todos os deputados
        if deputados_com_detalhes > 0:
            percentual_mulheres = (mulheres / deputados_com_detalhes) * 100
        else:
            percentual_mulheres = 0
        
        estatisticas = [
            EstatisticaVisual(
                titulo="Total de Deputados",
                valor=total_deputados,
                formato="numero",
                icone="users"
            ),
            EstatisticaVisual(
                titulo="Partidos Representados",
                valor=contagem_partidos,
                formato="numero",
                icone="flag"
            ),
            EstatisticaVisual(
                titulo="Estados Representados",
                valor=contagem_estados,
                formato="numero",
                icone="map"
            ),
            EstatisticaVisual(
                titulo="Percentual de Mulheres",
                valor=round(percentual_mulheres, 1),
                unidade="%",
                formato="percentual",
                icone="female",
                cor="#e74c3c" if percentual_mulheres < 30 else "#2ecc71"
            )
        ]
        
        return GrupoEstatisticas(
            titulo="Estatísticas Gerais - Deputados",
            estatisticas=estatisticas
        )
    
    # ----------------------------------------
    # Métodos Auxiliares
    # ----------------------------------------
    
    def _formatar_valor_monetario(self, valor: float) -> str:
        """Formata valor monetário"""
        if valor >= 1_000_000:
            return f"R$ {valor/1_000_000:.1f}M"
        elif valor >= 1_000:
            return f"R$ {valor/1_000:.1f}K"
        else:
            return f"R$ {valor:.2f}"
    
    def _obter_cor_partido(self, partido: str) -> str:
        """Obtém cor para um partido"""
        return self.cores_partidos.get(partido, self.cores_padrao[hash(partido) % len(self.cores_padrao)])

# Instância global do serviço
servico_visualizacoes = ServicoVisualizacoes()

