import pytest
import respx
from httpx import Response
from fastapi.testclient import TestClient

# --- INÍCIO DA CORREÇÃO ---
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# --- FIM DA CORREÇÃO ---

from main import app  # Agora esta linha vai funcionar corretamente

client = TestClient(app)

# ... (o resto do seu código de teste permanece o mesmo) ...

# --- Rota de Mock para a API do Ollama ---
OLLAMA_API_MOCK_URL = "http://localhost:11434/api/generate"

@pytest.mark.asyncio
@respx.mock
async def test_perguntar_ia_sucesso():
    """Testa o endpoint /api/ia/perguntar em um cenário de sucesso."""
    # Prepara o mock da resposta do Ollama
    mock_response_data = {"response": "A resposta para tudo é 42."}
    respx.post(OLLAMA_API_MOCK_URL).mock(return_value=Response(200, json=mock_response_data))

    # Faz a requisição para a nossa API
    pergunta = {"pergunta": "Qual a resposta para a vida, o universo e tudo mais?"}
    response = client.post("/api/ia/perguntar", json=pergunta)

    # Verifica o resultado
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["resposta"] == "A resposta para tudo é 42."

# ... (resto das suas funções de teste) ...