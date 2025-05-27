from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.data.routes import router as deputados

app = FastAPI(
    title="API MeuPlebiscito - Deputados",
    description="Endpoints para listar e detalhar deputados",
    version="1.0"
)

# CORS para permitir o frontend acessar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deputados, prefix="/api", tags=["deputados"])

app.add_event_handler("startup", lambda: print("API MeuPlebiscito - Deputados iniciada"))
