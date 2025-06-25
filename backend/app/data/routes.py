"""
Rotas da API REST para consulta de deputados
Corrigido para importações e compatibilidade
"""
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import logging
# from .schemas import *
# from .service import *



# Importações corrigidas - usando importação absoluta para evitar problemas
try:
    from app.models.deputado import DeputadoResumo, DeputadoCompleto
    from app.services.deputados import DeputadosService
except ImportError:
    # Fallback para importação relativa
    from ..models.deputado import DeputadoResumo, DeputadoCompleto
    from ..services.deputados import DeputadosService

# Configuração do logger
logger = logging.getLogger(__name__)

# Cria o router para deputados
deputados_router = APIRouter(prefix="/deputados", tags=["Deputados"])

# Dependency para injeção do serviço
async def get_deputados_service():
    """Dependency que fornece uma instância do serviço de deputados"""
    async with DeputadosService() as service:
        yield service

@deputados_router.get("/", response_model=List[DeputadoResumo])
async def listar_deputados(
    nome: Optional[str] = Query(None, description="Nome do deputado para busca parcial"),
    partido: Optional[str] = Query(None, description="Sigla do partido (ex: PT, PSDB, MDB)"),
    estado: Optional[str] = Query(None, description="Sigla do estado (ex: SP, RJ, MG)"),
    sexo: Optional[str] = Query(None, description="Sexo do deputado (M ou F)"),
    service: DeputadosService = Depends(get_deputados_service)
):
    """
    Lista deputados federais com filtros opcionais
    
    Compatível com:
    - SearchBar.jsx (busca simples por nome)
    - BuscaDetalhada.jsx (busca avançada com filtros)
    - SearchResultItem.jsx (formato dos resultados)
    
    Parâmetros de busca são opcionais e podem ser combinados.
    """
    try:
        logger.info(f"📋 Requisição de listagem - nome: {nome}, partido: {partido}, estado: {estado}, sexo: {sexo}")
        
        # Valida parâmetros de entrada
        if partido and len(partido) > 10:
            raise HTTPException(status_code=400, detail="Sigla do partido deve ter no máximo 10 caracteres")
        if estado and len(estado) != 2:
            raise HTTPException(status_code=400, detail="Sigla do estado deve ter exatamente 2 caracteres")
        if sexo and sexo.upper() not in ['M', 'F']:
            raise HTTPException(status_code=400, detail="Sexo deve ser 'M' ou 'F'")
        
        # Chama o serviço para buscar deputados
        deputados = await service.listar_deputados(nome, partido, estado, sexo)
        
        logger.info(f"✅ Retornando {len(deputados)} deputados para o frontend")
        return deputados
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro interno ao listar deputados: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Erro interno do servidor. Tente novamente em alguns instantes."
        )

@deputados_router.get("/{deputado_id}", response_model=DeputadoCompleto)
async def buscar_deputado(
    deputado_id: int,
    service: DeputadosService = Depends(get_deputados_service)
):
    """
    Busca dados completos de um deputado específico
    
    Compatível com:
    - Deputados.jsx (página de detalhes completa)
    - useDeputadoData.js (hook de gerenciamento de dados)
    
    Retorna todas as informações necessárias para as abas:
    - Participação em Reuniões
    - Autoria em Projetos de Lei  
    - Atividades e Cargos
    - Orçamento
    """
    try:
        logger.info(f"🔍 Buscando deputado completo: {deputado_id}")
        
        if deputado_id <= 0:
            raise HTTPException(status_code=400, detail="ID do deputado deve ser um número positivo")
        
        deputado = await service.buscar_deputado_completo(deputado_id)
        
        if not deputado:
            logger.warning(f"⚠️ Deputado {deputado_id} não encontrado")
            raise HTTPException(
                status_code=404, 
                detail=f"Deputado com ID {deputado_id} não foi encontrado"
            )
        
        logger.info(f"✅ Deputado {deputado_id} ({deputado.nome}) encontrado e retornado")
        return deputado
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro interno ao buscar deputado {deputado_id}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Erro interno do servidor. Tente novamente em alguns instantes."
        )

@deputados_router.get("/health/check")
async def health_check_deputados():
    """
    Endpoint de verificação de saúde da API de deputados
    """
#     return await try_catch(
#         listar_deputados,
#         nome, partido, estado, sexo,
#         internal_error_msg="Erro ao listar deputados"
#     )

# @router.get("/deputados/{deputado_id}", response_model=DeputadoDetalhado)
# async def get_detalhes_deputado(deputado_id: int):
#     return await try_catch(
#         detalhes_deputado,
#         deputado_id,
#         not_found_msg="Deputado não encontrado",
#         internal_error_msg="Erro ao buscar detalhes do deputado"
#     )

# @router.get("/deputados/{deputado_id}/despesas/total")
# async def get_despesas_totais_deputado(
#     deputado_id: int,
#     anos: Optional[List[int]] = Query(None, description="Lista de anos, ex: anos=2019&anos=2020"),
#     ano_inicio: Optional[int] = Query(None, description="Ano inicial para faixa"),
#     ano_fim: Optional[int] = Query(None, description="Ano final para faixa"),
# ):
#     # Monta lista de anos a consultar
#     anos_para_buscar = []
#     if ano_inicio is not None and ano_fim is not None:
#         if ano_fim < ano_inicio:
#             raise HTTPException(status_code=400, detail="ano_fim deve ser maior ou igual a ano_inicio")
#         anos_para_buscar = list(range(ano_inicio, ano_fim + 1))
#     elif anos:
#         anos_para_buscar = anos

#     total = await try_catch(
#         despesas_totais_deputado,
#         deputado_id,
#         anos_para_buscar,
#         internal_error_msg="Erro ao calcular despesas totais"
#     )
    return {
        "status": "healthy",
        "message": "🏛️ API de Deputados funcionando corretamente",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "listar_deputados": "/api/deputados/",
            "buscar_deputado": "/api/deputados/{id}"
        },
        "external_dependencies": {
            "camara_api": "https://dadosabertos.camara.leg.br/api/v2",
            "status": "available"
        }
    }

# Rota adicional para estatísticas (opcional)
@deputados_router.get("/stats/overview")
async def estatisticas_deputados():
    """
    Endpoint com estatísticas básicas sobre deputados
    
    Pode ser usado para dashboards ou páginas de estatísticas
    """
    return {
        "total_deputados_camara": 513,
        "fonte_dados": "API Dados Abertos da Câmara dos Deputados",
        "url_fonte": "https://dadosabertos.camara.leg.br/swagger/api.html",
        "funcionalidades_disponiveis": [
            "Listagem com filtros",
            "Busca por nome, partido, estado, sexo",
            "Dados completos do deputado",
            "Participações em reuniões",
            "Projetos de lei de autoria",
            "Atividades e cargos",
            "Análise orçamentária"
        ],
        "atualizacao": "Dados em tempo real da API oficial"
    }
# @router.get("/deputados/{deputado_id}/despesas/detalhadas")
# async def get_despesas_detalhadas_deputado(
#     deputado_id: int,
#     ano: Optional[int] = Query(None, description="Ano específico"),
#     mes: Optional[int] = Query(None, description="Mês específico (1-12)"),
#     cnpj_cpf_fornecedor: Optional[str] = Query(None, description="CNPJ/CPF do fornecedor"),
# ):
#     despesas = await try_catch(
#         despesas_detalhadas_deputado,
#         deputado_id, ano, mes, cnpj_cpf_fornecedor,
#         internal_error_msg="Erro ao buscar despesas detalhadas"
#     )
#     return {
#         "deputado_id": deputado_id,
#         "filtros": {
#             "ano": ano,
#             "mes": mes,
#             "cnpj_cpf_fornecedor": cnpj_cpf_fornecedor
#         },
#         "total_registros": len(despesas),
#         "despesas": despesas
#     }
    
# @router.get("/deputados/{deputado_id}/mandatos", response_model=List[MandatoDeputado])
# async def get_mandatos_deputado(deputado_id: int):
#     return await try_catch(
#         historico_mandatos_deputado,
#         deputado_id,
#         internal_error_msg="Erro ao buscar histórico de mandatos"
#     )

# @router.get("/deputados/{deputado_id}/partidos", response_model=List[HistoricoPartidoDeputado])
# async def get_historico_partidos_deputado(deputado_id: int):
#     return await try_catch(
#         historico_partidos_deputado,
#         deputado_id,
#         internal_error_msg="Erro ao buscar histórico de partidos"
#     )


# @router.get("/deputados/{deputado_id}/estatisticas")
# async def get_estatisticas_deputado(deputado_id: int):
#     """Calcula estatísticas consolidadas de um deputado"""
#     try:
#         # Busca votações
#         votacoes = await votacoes_deputado(deputado_id)
        
#         # Calcula estatísticas de votação
#         total_votacoes = len(votacoes)
#         votacoes_sim = len([v for v in votacoes if v.voto and v.voto.upper() == "SIM"])
#         votacoes_nao = len([v for v in votacoes if v.voto and v.voto.upper() == "NÃO"])
#         votacoes_abstencao = len([v for v in votacoes if v.voto and v.voto.upper() == "ABSTENÇÃO"])
#         votacoes_obstrucao = len([v for v in votacoes if v.voto and v.voto.upper() == "OBSTRUÇÃO"])
#         votacoes_ausente = len([v for v in votacoes if not v.voto or v.voto.upper() in ["AUSENTE", ""]])
        
#         percentual_presenca = ((total_votacoes - votacoes_ausente) / total_votacoes * 100) if total_votacoes > 0 else 0
        
#         # Busca despesas do ano atual
#         from datetime import datetime
#         ano_atual = datetime.now().year
#         despesas_ano_atual = await despesas_detalhadas_deputado(deputado_id, ano=ano_atual)
#         total_despesas_ano = sum(float(d.get("valorLiquido", 0)) for d in despesas_ano_atual)
#         media_despesas_mensal = total_despesas_ano / 12 if total_despesas_ano > 0 else 0
        
#         return EstatisticasDeputado(
#             total_votacoes=total_votacoes,
#             votacoes_sim=votacoes_sim,
#             votacoes_nao=votacoes_nao,
#             votacoes_abstencao=votacoes_abstencao,
#             votacoes_obstrucao=votacoes_obstrucao,
#             votacoes_ausente=votacoes_ausente,
#             percentual_presenca=round(percentual_presenca, 2),
#             total_despesas_ano_atual=total_despesas_ano,
#             media_despesas_mensal=round(media_despesas_mensal, 2)
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao calcular estatísticas: {str(e)}")

    
# # --- Senadores ---

# @router.get("/senadores", response_model=List[SenadorResumo])
# async def get_senadores(
#     uf: Optional[str] = Query(None),
#     participacao: Optional[str] = Query(None),
# ):
#     return await try_catch(
#         listar_senadores,
#         uf, participacao,
#         internal_error_msg="Erro ao listar senadores"
#     )

# @router.get("/senadores/{senador_id}", response_model=SenadorDetalhado)
# async def get_detalhes_senador(senador_id: int):
#     return await try_catch(
#         detalhes_senador,
#         senador_id,
#         not_found_msg="Senador não encontrado",
#         internal_error_msg="Erro ao buscar detalhes do senador"
#     )

# @router.get("/senadores/{senador_id}/mandatos")
# async def get_mandatos_senador(senador_id: int):
#     return await try_catch(
#         mandatos_senador,
#         senador_id,
#         internal_error_msg="Erro ao buscar mandatos do senador"
#     )

# @router.get("/senadores/{senador_id}/votacoes")
# async def get_votacoes_senador(
#     senador_id: int,
#     ano: Optional[int] = Query(None, description="Ano específico"),
# ):
#     return await try_catch(
#         votacoes_senador,
#         senador_id, ano,
#         internal_error_msg="Erro ao buscar votações do senador"
#     )

# @router.get("/senadores/{senador_id}/estatisticas")
# async def get_estatisticas_senador(senador_id: int):
#     """Calcula estatísticas consolidadas de um senador"""
#     try:
#         # Busca votações
#         votacoes = await votacoes_senador(senador_id)
        
#         # Calcula estatísticas de votação
#         total_votacoes = len(votacoes)
#         votacoes_sim = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "SIM"])
#         votacoes_nao = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "NÃO"])
#         votacoes_abstencao = len([v for v in votacoes if v.get("descricao_voto", "").upper() == "ABSTENÇÃO"])
        
#         percentual_presenca = ((total_votacoes - (total_votacoes - votacoes_sim - votacoes_nao - votacoes_abstencao)) / total_votacoes * 100) if total_votacoes > 0 else 0
        
#         # Busca mandatos
#         mandatos = await mandatos_senador(senador_id)
#         total_mandatos = len(mandatos)
        
#         # Encontra mandato atual (sem data fim)
#         mandato_atual = None
#         for mandato in mandatos:
#             if not mandato.get("data_fim"):
#                 mandato_atual = mandato
#                 break
        
#         return EstatisticasSenador(
#             total_votacoes=total_votacoes,
#             votacoes_sim=votacoes_sim,
#             votacoes_nao=votacoes_nao,
#             votacoes_abstencao=votacoes_abstencao,
#             percentual_presenca=round(percentual_presenca, 2),
#             total_mandatos=total_mandatos,
#             mandato_atual=mandato_atual
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao calcular estatísticas: {str(e)}")
