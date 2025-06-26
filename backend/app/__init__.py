"""
Pacote principal da aplicação Meu Plebiscito
Corrigido para evitar erros de importação circular
"""
__version__ = "1.0.0"
__author__ = "Equipe Meu Plebiscito"

# Importações básicas - removidas as importações que causavam erro
__all__ = [
    "__version__",
    "__author__"
]
