@echo off
REM Script para iniciar o servidor no Windows
echo 🚀 Iniciando Meu Plebiscito API...
echo 📍 Servidor será iniciado em: http://127.0.0.1:8000
echo 📚 Documentação disponível em: http://127.0.0.1:8000/docs
echo.

REM Verifica se o ambiente virtual existe
if exist "venv\Scripts\activate.bat" (
    echo 🔧 Ativando ambiente virtual...
    call venv\Scripts\activate.bat
)

REM Instala dependências se necessário
if exist "requirements.txt" (
    echo 📦 Verificando dependências...
    pip install -r requirements.txt --quiet
)

echo 🏃 Iniciando servidor...
echo.

REM Inicia o servidor
uvicorn main:app --reload --host 127.0.0.1 --port 8000
