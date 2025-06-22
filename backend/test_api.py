"""
Script de teste corrigido para verificar se a API está funcionando
Execute: python test_api.py
"""
import asyncio
import httpx
import json

async def testar_api():
    """Testa os endpoints principais da API"""
    base_url = "http://127.0.0.1:8000"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🧪 Testando Meu Plebiscito API...")
        print("=" * 50)
        
        # Teste 1: Health check principal
        try:
            print("1️⃣ Testando health check principal...")
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print("✅ Health check principal: OK")
                data = response.json()
                print(f"   Versão: {data.get('version')}")
                print(f"   Status: {data.get('status')}")
            else:
                print(f"❌ Health check principal falhou: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro no health check principal: {e}")
        
        print()
        
        # Teste 2: Health check deputados
        try:
            print("2️⃣ Testando health check deputados...")
            response = await client.get(f"{base_url}/api/deputados/health/check")
            if response.status_code == 200:
                print("✅ Health check deputados: OK")
                data = response.json()
                print(f"   Endpoints disponíveis: {len(data.get('endpoints', {}))}")
            else:
                print(f"❌ Health check deputados falhou: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro no health check deputados: {e}")
        
        print()
        
        # Teste 3: Listar deputados (sem filtros) - CORRIGIDO
        try:
            print("3️⃣ Testando listagem de deputados...")
            response = await client.get(f"{base_url}/api/deputados/")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Listagem de deputados: OK")
                print(f"   Deputados encontrados: {len(data)}")
                if data:
                    primeiro = data[0]
                    print(f"   Primeiro deputado: {primeiro.get('nome')} ({primeiro.get('siglaPartido')}-{primeiro.get('siglaUf')})")
            else:
                print(f"❌ Listagem de deputados falhou: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro na listagem de deputados: {e}")
        
        print()
        
        # Teste 4: Buscar deputado específico (se houver dados) - CORRIGIDO
        try:
            print("4️⃣ Testando busca de deputado específico...")
            # Primeiro pega um ID válido
            response = await client.get(f"{base_url}/api/deputados/")
            if response.status_code == 200:
                deputados = response.json()
                if deputados:
                    deputado_id = deputados[0]["id"]
                    response = await client.get(f"{base_url}/api/deputados/{deputado_id}")
                    if response.status_code == 200:
                        data = response.json()
                        print(f"✅ Busca de deputado específico: OK")
                        print(f"   Deputado: {data.get('nome')}")
                        print(f"   Participações: {len(data.get('participacoes', []))}")
                        print(f"   Projetos: {len(data.get('projetos', []))}")
                        print(f"   Orçamento disponível: {'Sim' if data.get('orcamento') else 'Não'}")
                    else:
                        print(f"❌ Busca de deputado específico falhou: {response.status_code}")
                        print(f"   Resposta: {response.text}")
                else:
                    print("⚠️ Nenhum deputado disponível para teste específico")
            else:
                print("⚠️ Não foi possível obter lista para teste específico")
        except Exception as e:
            print(f"❌ Erro na busca de deputado específico: {e}")
        
        print()
        
        # Teste 5: Busca com filtros - NOVO TESTE
        try:
            print("5️⃣ Testando busca com filtros...")
            response = await client.get(f"{base_url}/api/deputados/?nome=Maria")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Busca com filtros: OK")
                print(f"   Deputados encontrados com 'Maria': {len(data)}")
                if data:
                    print(f"   Primeiro resultado: {data[0].get('nome')}")
            else:
                print(f"❌ Busca com filtros falhou: {response.status_code}")
                print(f"   Resposta: {response.text}")
        except Exception as e:
            print(f"❌ Erro na busca com filtros: {e}")
        
        print()
        
        # Teste 6: Estatísticas
        try:
            print("6️⃣ Testando estatísticas...")
            response = await client.get(f"{base_url}/api/deputados/stats/overview")
            if response.status_code == 200:
                data = response.json()
                print("✅ Estatísticas: OK")
                print(f"   Total deputados Câmara: {data.get('total_deputados_camara')}")
                print(f"   Funcionalidades: {len(data.get('funcionalidades_disponiveis', []))}")
            else:
                print(f"❌ Estatísticas falharam: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro nas estatísticas: {e}")
        
        print()
        print("=" * 50)
        print("🏁 Testes concluídos!")
        print()
        print("📚 Para ver a documentação completa, acesse:")
        print("   http://127.0.0.1:8000/docs")
        print()
        print("🔧 URLs corretas para o frontend:")
        print("   Listar deputados: GET /api/deputados/")
        print("   Buscar deputado: GET /api/deputados/{id}")
        print("   Com filtros: GET /api/deputados/?nome=João&partido=PT")

if __name__ == "__main__":
    asyncio.run(testar_api())
