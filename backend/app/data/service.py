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
    sigla_partido: Optional[str] = None
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
    df = ordenar_por_nome(df)

    # Converte de volta para dicionário
    dados['dados'] = df.to_dict(orient="records")

    return schemas.RespostaDeputados(**dados)
