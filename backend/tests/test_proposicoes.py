"""
Script simples para testar detalhes de uma proposição,
rota de proposições da API, e autores da proposição
Execute: python test_proposicoes_completo.py
"""

import asyncio
import httpx

async def testar_proposicao_por_id():
    base_url = "http://127.0.0.1:8000"
    proposicao_id = 14999
    url = f"{base_url}/api/proposicoes/{proposicao_id}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🧪 Testando detalhes da proposição...")
        print("=" * 50)
        try:
            response = await client.get(url)
            if response.status_code == 200:
                print("✅ Detalhes da proposição retornados com sucesso!")
                data = response.json()
                dados = data.get("dados", {})
                print(f"   ID: {dados.get('id')}")
                print(f"   Tipo: {dados.get('siglaTipo')}, Nº: {dados.get('numero')}, Ano: {dados.get('ano')}")
                print(f"   Ementa: {dados.get('ementa')}")
                print(f"   Situação atual: {dados.get('statusProposicao', {}).get('descricaoSituacao')}")
            else:
                print(f"❌ Falha ao obter detalhes da proposição: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")

        print("=" * 50)
        print("🏁 Teste detalhes da proposição finalizado.\n")

async def testar_proposicoes():
    base_url = "http://127.0.0.1:8000"
    endpoint = "/api/proposicoes/"
    params = {
        "id": 14999,
        "pagina": 1,
        "itens": 15,
        "ordem": "ASC",
        "ordenarPor": "id"
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🧪 Testando endpoint /api/proposicoes/ ...")
        print("=" * 50)
        try:
            response = await client.get(f"{base_url}{endpoint}", params=params)
            if response.status_code == 200:
                print("✅ Rota /api/proposicoes/ funcionando!")
                data = response.json()
                print(f"   Proposições retornadas: {len(data.get('dados', []))}")
                if data.get("dados"):
                    prop = data["dados"][0]
                    print(f"   ID: {prop.get('id')}, Tipo: {prop.get('siglaTipo')}, Nº: {prop.get('numero')}, Ano: {prop.get('ano')}")
            else:
                print(f"❌ Falha na rota /api/proposicoes/: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro ao testar rota de proposições: {e}")

        print("=" * 50)
        print("🏁 Teste rota /api/proposicoes/ finalizado.\n")

async def testar_autores_da_proposicao():
    base_url = "http://127.0.0.1:8000"
    proposicao_id = 14999
    url = f"{base_url}/api/proposicoes/{proposicao_id}/autores"

    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🧪 Testando autores da proposição...")
        print("=" * 50)
        try:
            response = await client.get(url)
            if response.status_code == 200:
                print("✅ Autores da proposição retornados com sucesso!")
                data = response.json()
                autores = data.get("dados", [])
                print(f"   Total de autores: {len(autores)}")
                for autor in autores:
                    print(f"   Nome: {autor.get('nome')}, Tipo: {autor.get('tipo')}, Ordem de assinatura: {autor.get('ordemAssinatura')}")
            else:
                print(f"❌ Falha ao obter autores da proposição: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro na requisição: {e}")

        print("=" * 50)
        print("🏁 Teste autores da proposição finalizado.\n")

async def main():
    await testar_proposicao_por_id()
    await testar_proposicoes()
    await testar_autores_da_proposicao()

if __name__ == "__main__":
    asyncio.run(main())
