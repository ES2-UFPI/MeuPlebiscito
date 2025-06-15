import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa os roteadores dos seus módulos
from app.data.routes import router as deputados_router
from app.proposicoes.routes import router as proposicoes_router
# Adiciona a importação para o novo módulo de preview
from app.preview.routes import router as preview_router


# Configurações da aplicação FastAPI
app = FastAPI(
    title="API MeuPlebiscito",
    description="Endpoints para consultar dados parlamentares como Deputados e Proposições.",
    version="1.2" # Versionamento atualizado para refletir a nova funcionalidade
)

# Middleware CORS para permitir que seu frontend acesse a API
app.add_middleware(
    CORSMiddleware,
    # Em produção, restrinja para o domínio do seu frontend
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os roteadores na aplicação principal
# Cada conjunto de rotas terá seu próprio grupo na documentação (/docs)
app.include_router(deputados_router, prefix="/api", tags=["Dados Políticos"])
app.include_router(proposicoes_router, prefix="/api", tags=["Proposições"])
# Inclui a nova rota de visualizações
app.include_router(preview_router, prefix="/api/preview", tags=["Visualizações"])


@app.on_event("startup")
async def startup_event():
    """
    Função executada na inicialização da API.
    """
    print("API MeuPlebiscito iniciada com sucesso!")
    print(f"Acesse a documentação em: http://127.0.0.1:8000/docs")


@app.get("/", tags=["Home"])
def read_root():
    """
    Endpoint raiz para verificar se a API está funcionando.
    """
    return {"mensagem": "API MeuPlebiscito no ar! Acesse /docs para ver os endpoints."}


# Bloco para executar o servidor de desenvolvimento com Uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
