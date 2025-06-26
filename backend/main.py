"""
Arquivo principal do backend FastAPI
Corrigido para importação correta e tratamento de erros
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys
from typing import Dict, Any

# Configuração de logging melhorada
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app.log", encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# Importa as rotas antes da criação da app
try:
    from app.data.routes import deputados_router
    from app.ia.routes import router as ia_router
except ImportError as e:
    logger.error(f"Erro ao importar rotas: {str(e)}")
    raise

try:
   from app.proposicoes.routes import router as proposicoes_router
except ImportError as e:
    logger.error(f"Erro ao importar rotas: {str(e)}")
    raise

# Cria a aplicação FastAPI
app = FastAPI(
    title="Meu Plebiscito API",
    description="API para consulta de dados políticos brasileiros - Deputados Federais",
    version="1.3.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração do CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # React dev server alternativo
        "http://localhost:8080",  # Possível servidor de produção
        "*"  # Em produção, substituir por domínios específicos
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Inclui as rotas
app.include_router(deputados_router, prefix="/api", tags=["Deputados"])
app.include_router(ia_router, prefix="/api", tags=["Inteligência Artificial"])
app.include_router(proposicoes_router, prefix="/api", tags=["Proposições"])

# Tratamento global de erros
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handler global para exceções não tratadas"""
    logger.error(f"❌ Erro não tratado: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "Erro interno do servidor",
            "detail": str(exc) if app.debug else "Tente novamente mais tarde"
        }
    )

# Log das rotas registradas
@app.on_event("startup")
async def startup_event():
    """Evento executado na inicialização"""
    try:
        logger.info("Meu Plebiscito API iniciada!")
        logger.info("Servidor disponível em: http://127.0.0.1:8000")
        logger.info("Documentação em: http://127.0.0.1:8000/docs")
        logger.info("Rotas registradas:")
        logger.info("   GET / - Health check principal")
        logger.info("   GET /health - Health check detalhado")
        logger.info("   GET /api/deputados/ - Listar deputados")
        logger.info("   GET /api/deputados/{id} - Buscar deputado")
        logger.info("   GET /api/deputados/health/check - Health check deputados")
        logger.info("   GET /api/deputados/stats/overview - Estatísticas")
    except Exception as e:
        logger.error(f"Erro na inicialização: {str(e)}")
        raise

# Rota de verificação de saúde principal
@app.get("/", tags=["Health"])
async def root() -> Dict[str, Any]:
    """Endpoint de verificação básica da API"""
    return {
        "message": "Meu Plebiscito API está funcionando!",
        "status": "healthy",
        "docs": "http://127.0.0.1:8000/docs",
        "frontend": "http://localhost:5173",
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    """Endpoint detalhado de verificação de saúde"""
    return {
        "status": "healthy",
        "service": "Meu Plebiscito API",
        "version": "1.0.0",
        "endpoints": {
            "deputados_list": "/api/deputados/",
            "deputado_details": "/api/deputados/{id}",
            "deputados_health": "/api/deputados/health/check"
        },
        "external_apis": {
            "camara_deputados": "https://dadosabertos.camara.leg.br/api/v2"
        }
    }

# Executar com: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    try:
        logger.info("Iniciando Meu Plebiscito API...")
        uvicorn.run(
            "main:app", 
            host="127.0.0.1", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Erro ao iniciar servidor: {str(e)}")
        sys.exit(1)
