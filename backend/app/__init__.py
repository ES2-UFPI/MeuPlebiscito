"""
Pacote principal da aplicação Meu Plebiscito
Integrado com a estrutura existente
"""
__version__ = "1.0.0"
__author__ = "Equipe Meu Plebiscito"

# Importações principais para facilitar o uso
from .models.deputado import (
    DeputadoResumo,
    DeputadoCompleto,
    Participacao,
    Projeto,
    Atividades,
    Orcamento,
    FiltrosBusca
)

from .services.deputados import DeputadosService
from .data.routes import deputados_router

__all__ = [
    "DeputadoResumo",
    "DeputadoCompleto", 
    "Participacao",
    "Projeto",
    "Atividades",
    "Orcamento",
    "FiltrosBusca",
    "DeputadosService",
    "deputados_router"
]
