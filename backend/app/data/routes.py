"""
Rotas da API REST para consulta de deputados
Corrigido para importações e compatibilidade
"""
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import logging

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
