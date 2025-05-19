from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.routes import router as rota_deputados

app = FastAPI(title="API MeuPlebiscito")

# Configuração do CORS para liberar o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # endereço do frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rota_deputados)

@app.get("/")
async def raiz():
    return {"mensagem": "API do MeuPlebiscito está no ar 🚀"}
