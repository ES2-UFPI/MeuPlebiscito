from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa os roteadores dos seus módulos
# Assumindo que a estrutura de pastas é:
# /main.py
# /app/data/routes.py (para deputados)
# /proposicoes/routes.py (para proposições)
from app.data.routes import router as deputados_router
from app.proposicoes.routes import router as proposicoes_router

app = FastAPI(
    title="API MeuPlebiscito",
    description="Endpoints para consultar dados parlamentares como Deputados e Proposições.",
    version="1.1" # Versionamento sugerido para indicar a adição de novas funcionalidades
)

# Middleware CORS para permitir que seu frontend acesse a API
# Nenhuma alteração necessária aqui
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os roteadores na aplicação principal
# Cada conjunto de rotas terá seu próprio grupo na documentação (/docs)
app.include_router(deputados_router, prefix="/api", tags=["Deputados"])
app.include_router(proposicoes_router, prefix="/api", tags=["Proposições"])

@app.on_event("startup")
async def startup_event():
    print("API MeuPlebiscito iniciada com sucesso!")

@app.get("/", tags=["Home"])
def read_root():
    return {"mensagem": "API MeuPlebiscito no ar! Acesse /docs para ver os endpoints."}
