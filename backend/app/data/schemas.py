# schemas.py
from pydantic import BaseModel
from typing import List

class Deputado(BaseModel):
    id: int
    nome: str
    siglaPartido: str
    siglaUf: str
    uri: str

class RespostaDeputados(BaseModel):
    dados: List[Deputado]
