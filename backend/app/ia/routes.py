# /backend/app/ia/routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

# --- Pydantic Model para a requisição ---
class PerguntaRequest(BaseModel):
    pergunta: str

# --- Configurações do Ollama ---
OLLAMA_URL = 'http://localhost:11434/api/generate'
OLLAMA_MODEL = 'llama3.2' # ou o modelo que você estiver usando

# --- Router da IA ---
router = APIRouter(
    prefix="/ia",
    tags=["Inteligência Artificial"],
)

async def consultar_ollama(pergunta: str):
    """Função para se comunicar com a API do Ollama."""
    payload = {
        'model': OLLAMA_MODEL,
        'prompt': pergunta,
        'stream': False
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(OLLAMA_URL, json=payload, timeout=60.0)
            response.raise_for_status() # Lança exceção para status 4xx/5xx
            return response.json().get('response', 'Nenhuma resposta do modelo.')
        except httpx.RequestError as e:
            # Erro de conexão
            raise HTTPException(status_code=503, detail=f"Erro de comunicação com o serviço de IA: {e}")
        except httpx.HTTPStatusError as e:
            # Erro retornado pela API do Ollama
            raise HTTPException(status_code=502, detail=f"Erro no serviço de IA: {e.response.text}")

@router.post("/perguntar")
async def perguntar_ia(request: PerguntaRequest):
    """
    Recebe uma pergunta e a envia para o modelo de linguagem Ollama.
    """
    if not request.pergunta:
        raise HTTPException(status_code=400, detail='O campo "pergunta" não pode ser vazio.')
    
    resposta_modelo = await consultar_ollama(request.pergunta)
    
    return {"resposta": resposta_modelo}