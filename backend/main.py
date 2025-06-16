"""
Arquivo principal do backend FastAPI
Atualizado com logging melhorado para debug
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.data.routes import deputados_router
import logging

# Configuração de logging melhorada
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Cria a aplicação FastAPI
app = FastAPI(
    title="Meu Plebiscito API",
    description="API para consulta de dados políticos brasileiros - Deputados Federais",
    version="1.0.0",
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
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Inclui as rotas de deputados com prefixo /api
app.include_router(deputados_router, prefix="/api", tags=["Deputados"])

# Log das rotas registradas
@app.on_event("startup")
async def startup_event():
    """Evento executado na inicialização"""
    logger.info("🚀 Meu Plebiscito API iniciada!")
    logger.info("📍 Servidor disponível em: http://127.0.0.1:8000")
    logger.info("📚 Documentação em: http://127.0.0.1:8000/docs")
    logger.info("🔗 Rotas registradas:")
    logger.info("   GET / - Health check principal")
    logger.info("   GET /health - Health check detalhado")
    logger.info("   GET /api/deputados/ - Listar deputados")
    logger.info("   GET /api/deputados/{id} - Buscar deputado")
    logger.info("   GET /api/deputados/health/check - Health check deputados")
    logger.info("   GET /api/deputados/stats/overview - Estatísticas")

# Rota de verificação de saúde principal
@app.get("/", tags=["Health"])
async def root():
    """Endpoint de verificação básica da API"""
    return {
        "message": "🏛️ Meu Plebiscito API está funcionando!",
        "status": "healthy",
        "docs": "http://127.0.0.1:8000/docs",
        "frontend": "http://localhost:5173",
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health"])
async def health_check():
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
    logger.info("🚀 Iniciando Meu Plebiscito API...")
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True,
        log_level="info"
    )
