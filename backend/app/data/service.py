from . import external_api, schemas
from typing import Optional
from app.data.tratamento_dados import (
    padronizar_partidos,
    formatar_datas,
    ordenar_por_nome
)
import pandas as pd

async def listar_deputados(
    id: Optional[int] = None,
    nome: Optional[str] = None,
    sigla_uf: Optional[str] = None,
    sigla_partido: Optional[str] = None,
    ordenar_por: Optional[str] = None
) -> schemas.RespostaDeputados:
    dados = await external_api.buscar_deputados(
        id=id,
        nome=nome,
        sigla_uf=sigla_uf,
        sigla_partido=sigla_partido
    )

    df = pd.DataFrame(dados['dados'])

    df = padronizar_partidos(df)
    df = formatar_datas(df, 'dataNascimento')

    if id:
        df = df[df['id'] == id]
    if nome:
        df = df[df['nome'].str.contains(nome, case=False, na=False)]
    if sigla_uf:
        df = df[df['siglaUf'] == sigla_uf.upper()]
    if sigla_partido:
        df = df[df['siglaPartido'] == sigla_partido.upper()]

    if ordenar_por == "nome":
        df = df.sort_values(by='nome')
    elif ordenar_por == "partido":
        df = df.sort_values(by='siglaPartido')

    dados['dados'] = df.to_dict(orient="records")
    return schemas.RespostaDeputados(**dados)
