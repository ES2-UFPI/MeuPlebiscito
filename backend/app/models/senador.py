from pydantic import BaseModel
from typing import Optional, List

class SenadorDetalhes(BaseModel):
    """
    Modelo para representar os detalhes de um senador
    """
    id: int
    nome: str
    partido: str
    estado: str
    foto: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    gabinete: Optional[str] = None
    biografia: Optional[str] = None
    comissoes: Optional[List[str]] = None
    legislaturas: Optional[List[int]] = None
    mandato_atual: Optional[dict] = None
    redes_sociais: Optional[dict] = None 