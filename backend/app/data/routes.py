from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from .schemas import *
from .service import *



router = APIRouter()

# Função auxiliar para tratamento padrão de exceções
async def try_catch(func, *args, not_found_msg=None, internal_error_msg=None):
    try:
        return await func(*args)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=not_found_msg or str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=internal_error_msg or str(e))

# --- Deputados ---

@router.get("/deputados", response_model=List[DeputadoResumo])
async def get_deputados(
    nome: Optional[str] = Query(None),
    partido: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    sexo: Optional[str] = Query(None),
):
    return await try_catch(
        listar_deputados,
        nome, partido, estado, sexo,
        internal_error_msg="Erro ao listar deputados"
    )

@router.get("/deputados/{deputado_id}", response_model=DeputadoDetalhado)
async def get_detalhes_deputado(deputado_id: int):
    return await try_catch(
        detalhes_deputado,
        deputado_id,
        not_found_msg="Deputado não encontrado",
        internal_error_msg="Erro ao buscar detalhes do deputado"
    )

@router.get("/deputados/{deputado_id}/despesas/total")
async def get_despesas_totais_deputado(
    deputado_id: int,
    anos: Optional[List[int]] = Query(None, description="Lista de anos, ex: anos=2019&anos=2020"),
    ano_inicio: Optional[int] = Query(None, description="Ano inicial para faixa"),
    ano_fim: Optional[int] = Query(None, description="Ano final para faixa"),
):
    # Monta lista de anos a consultar
    anos_para_buscar = []
    if ano_inicio is not None and ano_fim is not None:
        if ano_fim < ano_inicio:
            raise HTTPException(status_code=400, detail="ano_fim deve ser maior ou igual a ano_inicio")
        anos_para_buscar = list(range(ano_inicio, ano_fim + 1))
    elif anos:
        anos_para_buscar = anos

    total = await try_catch(
        despesas_totais_deputado,
        deputado_id,
        anos_para_buscar,
        internal_error_msg="Erro ao calcular despesas totais"
    )
    return {
        "deputado_id": deputado_id,
        "anos": anos_para_buscar if anos_para_buscar else "todos os anos (limitado)",
        "total_despesas": total,
    }

@router.get("/deputados/{deputado_id}/despesas/detalhadas")
async def get_despesas_detalhadas_deputado(
    deputado_id: int,
    ano: Optional[int] = Query(None, description="Ano específico"),
    mes: Optional[int] = Query(None, description="Mês específico (1-12)"),
    cnpj_cpf_fornecedor: Optional[str] = Query(None, description="CNPJ/CPF do fornecedor"),
):
    despesas = await try_catch(
        despesas_detalhadas_deputado,
        deputado_id, ano, mes, cnpj_cpf_fornecedor,
        internal_error_msg="Erro ao buscar despesas detalhadas"
    )
    return {
        "deputado_id": deputado_id,
        "filtros": {
            "ano": ano,
            "mes": mes,
            "cnpj_cpf_fornecedor": cnpj_cpf_fornecedor
        },
        "total_registros": len(despesas),
        "despesas": despesas
    }
    
@router.get("/deputados/{deputado_id}/mandatos", response_model=List[MandatoDeputado])
async def get_mandatos_deputado(deputado_id: int):
    return await try_catch(
        historico_mandatos_deputado,
        deputado_id,
        internal_error_msg="Erro ao buscar histórico de mandatos"
    )

@router.get("/deputados/{deputado_id}/partidos", response_model=List[HistoricoPartidoDeputado])
async def get_historico_partidos_deputado(deputado_id: int):
    return await try_catch(
        historico_partidos_deputado,
        deputado_id,
        internal_error_msg="Erro ao buscar histórico de partidos"
    )


@router.get("/deputados/{deputado_id}/estatisticas")
async def get_estatisticas_deputado(deputado_id: int):
    """Calcula estatísticas consolidadas de um deputado"""
    try:
        # Busca votações
        votacoes = await votacoes_deputado(deputado_id)
        
        # Calcula estatísticas de votação
        total_votacoes = len(votacoes)
        votacoes_sim = len([v for v in votacoes if v.voto and v.voto.upper() == "SIM"])
        votacoes_nao = len([v for v in votacoes if v.voto and v.voto.upper() == "NÃO"])
        votacoes_abstencao = len([v for v in votacoes if v.voto and v.voto.upper() == "ABSTENÇÃO"])
        votacoes_obstrucao = len([v for v in votacoes if v.voto and v.voto.upper() == "OBSTRUÇÃO"])
        votacoes_ausente = len([v for v in votacoes if not v.voto or v.voto.upper() in ["AUSENTE", ""]])
        
        percentual_presenca = ((total_votacoes - votacoes_ausente) / total_votacoes * 100) if total_votacoes > 0 else 0
        
        # Busca despesas do ano atual
        from datetime import datetime
        ano_atual = datetime.now().year
        despesas_ano_atual = await despesas_detalhadas_deputado(deputado_id, ano=ano_atual)
        total_despesas_ano = sum(float(d.get("valorLiquido", 0)) for d in despesas_ano_atual)
        media_despesas_mensal = total_despesas_ano / 12 if total_despesas_ano > 0 else 0
        
        return EstatisticasDeputado(
            total_votacoes=total_votacoes,
            votacoes_sim=votacoes_sim,
            votacoes_nao=votacoes_nao,
            votacoes_abstencao=votacoes_abstencao,
            votacoes_obstrucao=votacoes_obstrucao,
            votacoes_ausente=votacoes_ausente,
            percentual_presenca=round(percentual_presenca, 2),
            total_despesas_ano_atual=total_despesas_ano,
            media_despesas_mensal=round(media_despesas_mensal, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao calcular estatísticas: {str(e)}")

    
# --- Senadores ---

@router.get("/senadores", response_model=List[SenadorResumo])
async def get_senadores(
    uf: Optional[str] = Query(None),
    participacao: Optional[str] = Query(None),
):
    return await try_catch(
        listar_senadores,
        uf, participacao,
        internal_error_msg="Erro ao listar senadores"
    )

@router.get("/senadores/{senador_id}", response_model=SenadorDetalhado)
async def get_detalhes_senador(senador_id: int):
    return await try_catch(
        detalhes_senador,
        senador_id,
        not_found_msg="Senador não encontrado",
        internal_error_msg="Erro ao buscar detalhes do senador"
    )

@router.get("/senadores/{senador_id}/mandatos")
async def get_mandatos_senador(senador_id: int):
    return await try_catch(
        mandatos_senador,
        senador_id,
        internal_error_msg="Erro ao buscar mandatos do senador"
    )

@router.get("/senadores/{senador_id}/votacoes")
async def get_votacoes_senador(
    senador_id: int,
    ano: Optional[int] = Query(None, description="Ano específico"),
):
    return await try_catch(
        votacoes_senador,
        senador_id, ano,
        internal_error_msg="Erro ao buscar votações do senador"
    )

@router.get("/senadores/{senador_id}/estatisticas")
async def get_estatisticas_senador(senador_id: int):
    """Calcula estatísticas consolidadas de um senador"""
    try:
        # Busca votações
        votacoes = await votacoes_senador(senador_id)
        
        # Calcula estatísticas de votação
        total_votacoes = len(votacoes)
        votacoes_sim = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "SIM"])
        votacoes_nao = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "NÃO"])
        votacoes_abstencao = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "ABSTENÇÃO"])
        
        percentual_presenca = ((total_votacoes - (total_votacoes - votacoes_sim - votacoes_nao - votacoes_abstencao)) / total_votacoes * 100) if total_votacoes > 0 else 0
        
        # Busca mandatos
        mandatos = await mandatos_senador(senador_id)
        total_mandatos = len(mandatos)
        
        # Encontra mandato atual (sem data fim)
        mandato_atual = None
        for mandato in mandatos:
            if not mandato.get("data_fim"):
                mandato_atual = mandato
                break
        
        return EstatisticasSenador(
            total_votacoes=total_votacoes,
            votacoes_sim=votacoes_sim,
            votacoes_nao=votacoes_nao,
            votacoes_abstencao=votacoes_abstencao,
            percentual_presenca=round(percentual_presenca, 2),
            total_mandatos=total_mandatos,
            mandato_atual=mandato_atual
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao calcular estatísticas: {str(e)}")
