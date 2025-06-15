from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

# ----------------------------------------
# Enums para Visualizações
# ----------------------------------------

class TipoVisualizacao(str, Enum):
    GRAFICO_BARRAS = "grafico_barras"
    GRAFICO_LINHAS = "grafico_linhas"
    GRAFICO_PIZZA = "grafico_pizza"
    GRAFICO_AREA = "grafico_area"
    GRAFICO_DISPERSAO = "grafico_dispersao"
    HEATMAP = "heatmap"
    TREEMAP = "treemap"
    GAUGE = "gauge"
    TABELA = "tabela"
    MAPA = "mapa"
    TIMELINE = "timeline"
    SANKEY = "sankey"

class PeriodoTempo(str, Enum):
    DIA = "dia"
    SEMANA = "semana"
    MES = "mes"
    TRIMESTRE = "trimestre"
    ANO = "ano"
    LEGISLATURA = "legislatura"

class TipoAgregacao(str, Enum):
    SOMA = "soma"
    MEDIA = "media"
    CONTAGEM = "contagem"
    MAXIMO = "maximo"
    MINIMO = "minimo"
    PERCENTUAL = "percentual"

# ----------------------------------------
# Modelos Base para Visualizações
# ----------------------------------------

class PontoGrafico(BaseModel):
    x: Union[str, int, float]
    y: Union[int, float]
    label: Optional[str] = None
    cor: Optional[str] = None
    tamanho: Optional[float] = None
    metadados: Dict[str, Any] = {}

class SerieGrafico(BaseModel):
    nome: str
    dados: List[PontoGrafico]
    cor: Optional[str] = None
    tipo: Optional[str] = None  # Para gráficos mistos
    eixo_y: Optional[str] = "principal"  # "principal" ou "secundario"

class ConfigVisualizacao(BaseModel):
    titulo: str
    subtitulo: Optional[str] = None
    tipo: TipoVisualizacao
    largura: Optional[int] = None
    altura: Optional[int] = None
    responsivo: bool = True
    tema: Optional[str] = "default"
    cores: Optional[List[str]] = None
    mostrar_legenda: bool = True
    mostrar_valores: bool = False
    animacao: bool = True

class DadosVisualizacao(BaseModel):
    config: ConfigVisualizacao
    series: List[SerieGrafico]
    eixos: Optional[Dict[str, Any]] = None
    metadados: Dict[str, Any] = {}
    data_geracao: datetime
    cache_valido_ate: Optional[datetime] = None

# ----------------------------------------
# Modelos para Dashboards
# ----------------------------------------

class WidgetDashboard(BaseModel):
    id: str
    titulo: str
    tipo: TipoVisualizacao
    posicao: Dict[str, int]  # x, y, width, height
    dados: DadosVisualizacao
    configuracao: Dict[str, Any] = {}
    atualizar_automaticamente: bool = True
    intervalo_atualizacao: Optional[int] = None  # em segundos

class Dashboard(BaseModel):
    id: str
    nome: str
    descricao: Optional[str] = None
    widgets: List[WidgetDashboard]
    layout: Dict[str, Any] = {}
    publico: bool = False
    usuario_criador: Optional[str] = None
    data_criacao: datetime
    data_modificacao: Optional[datetime] = None

# ----------------------------------------
# Modelos para Estatísticas Visuais
# ----------------------------------------

class EstatisticaVisual(BaseModel):
    titulo: str
    valor: Union[int, float, str]
    unidade: Optional[str] = None
    variacao: Optional[float] = None  # Percentual de variação
    variacao_periodo: Optional[str] = None
    cor: Optional[str] = None
    icone: Optional[str] = None
    formato: Optional[str] = None  # "numero", "moeda", "percentual"

class GrupoEstatisticas(BaseModel):
    titulo: str
    estatisticas: List[EstatisticaVisual]
    layout: Optional[str] = "horizontal"  # "horizontal" ou "vertical"

# ----------------------------------------
# Modelos para Gráficos Específicos
# ----------------------------------------

class GraficoBarras(BaseModel):
    titulo: str
    dados: List[Dict[str, Union[str, int, float]]]
    campo_x: str
    campo_y: str
    orientacao: str = "vertical"  # "vertical" ou "horizontal"
    empilhado: bool = False
    mostrar_valores: bool = True

class GraficoLinhas(BaseModel):
    titulo: str
    dados: List[Dict[str, Union[str, int, float]]]
    campo_x: str
    campos_y: List[str]
    suavizar: bool = False
    mostrar_pontos: bool = True
    area_preenchida: bool = False

class GraficoPizza(BaseModel):
    titulo: str
    dados: List[Dict[str, Union[str, int, float]]]
    campo_label: str
    campo_valor: str
    mostrar_percentuais: bool = True
    raio_interno: float = 0  # Para gráfico de rosca

class Heatmap(BaseModel):
    titulo: str
    dados: List[List[Union[int, float]]]
    labels_x: List[str]
    labels_y: List[str]
    escala_cor: Optional[List[str]] = None
    mostrar_valores: bool = True

# ----------------------------------------
# Modelos para Rankings Visuais
# ----------------------------------------

class ItemRanking(BaseModel):
    posicao: int
    id: str
    nome: str
    valor: Union[int, float]
    valor_formatado: Optional[str] = None
    variacao: Optional[float] = None
    metadados: Dict[str, Any] = {}

class RankingVisual(BaseModel):
    titulo: str
    metrica: str
    itens: List[ItemRanking]
    total_itens: int
    pagina_atual: int = 1
    itens_por_pagina: int = 10
    ordem: str = "desc"  # "asc" ou "desc"

# ----------------------------------------
# Modelos para Mapas e Geolocalização
# ----------------------------------------

class RegiaoMapa(BaseModel):
    codigo: str  # Código da região (UF, município, etc.)
    nome: str
    valor: Union[int, float]
    cor: Optional[str] = None
    metadados: Dict[str, Any] = {}

class MapaVisualizacao(BaseModel):
    titulo: str
    tipo: str  # "pontos", "regioes", "calor"
    regioes: Optional[List[RegiaoMapa]] = None
    centro: Optional[Dict[str, float]] = None  # lat, lng
    zoom: Optional[int] = None
    escala_cor: Optional[List[str]] = None

