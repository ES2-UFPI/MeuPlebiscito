#!/bin/bash
# Script para iniciar o servidor de desenvolvimento
# Torna mais fácil iniciar o backend

echo "🚀 Iniciando Meu Plebiscito API..."
echo "📍 Servidor será iniciado em: http://127.0.0.1:8000"
echo "📚 Documentação disponível em: http://127.0.0.1:8000/docs"
echo ""

# Ativa o ambiente virtual se existir
if [ -d "venv" ]; then
    echo "🔧 Ativando ambiente virtual..."
    source venv/bin/activate
fi

# Instala dependências se necessário
if [ -f "requirements.txt" ]; then
    echo "📦 Verificando dependências..."
    pip install -r requirements.txt --quiet
fi

echo "🏃 Iniciando servidor..."
echo ""

# Inicia o servidor
uvicorn main:app --reload --host 127.0.0.1 --port 8000
