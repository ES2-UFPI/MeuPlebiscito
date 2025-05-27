import pandas as pd

def padronizar_partidos(df):
    df['siglaPartido'] = df['siglaPartido'].str.upper()
    return df

def formatar_datas(df, coluna):
    df[coluna] = pd.to_datetime(df[coluna], errors='coerce').dt.strftime('%d/%m/%Y')
    return df

def ordenar_por_nome(df):
    return df.sort_values(by='nome')

def filtrar_por_partido(df, partido):
    return df[df['siglaPartido'] == partido.upper()]
