"""
Script para debugar problemas de importação
Execute: python debug_imports.py
"""

def testar_importacoes():
    """Testa todas as importações para identificar problemas"""
    print("🔍 Testando importações do projeto...")
    print("=" * 50)
    
    # Teste 1: Importar modelos
    try:
        print("1️⃣ Testando importação dos modelos...")
        from app.models.deputado import (
            DeputadoResumo, DeputadoCompleto, Participacao, 
            Projeto, Atividade, Orcamento, CategoriaOrcamento, HistoricoMensal
        )
        print("✅ Modelos importados com sucesso!")
        print(f"   - DeputadoResumo: {DeputadoResumo}")
        print(f"   - DeputadoCompleto: {DeputadoCompleto}")
        print(f"   - Participacao: {Participacao}")
        print(f"   - Projeto: {Projeto}")
        print(f"   - Atividade: {Atividade}")
        print(f"   - Orcamento: {Orcamento}")
        print(f"   - CategoriaOrcamento: {CategoriaOrcamento}")
        print(f"   - HistoricoMensal: {HistoricoMensal}")
    except Exception as e:
        print(f"❌ Erro ao importar modelos: {e}")
    
    print()
    
    # Teste 2: Importar serviços
    try:
        print("2️⃣ Testando importação dos serviços...")
        from app.services.deputados import DeputadosService
        print("✅ Serviços importados com sucesso!")
        print(f"   - DeputadosService: {DeputadosService}")
    except Exception as e:
        print(f"❌ Erro ao importar serviços: {e}")
    
    print()
    
    # Teste 3: Importar rotas
    try:
        print("3️⃣ Testando importação das rotas...")
        from app.data.routes import deputados_router
        print("✅ Rotas importadas com sucesso!")
        print(f"   - deputados_router: {deputados_router}")
    except Exception as e:
        print(f"❌ Erro ao importar rotas: {e}")
    
    print()
    
    # Teste 4: Testar criação de instâncias
    try:
        print("4️⃣ Testando criação de instâncias...")
        from app.models.deputado import DeputadoResumo
        
        deputado_teste = DeputadoResumo(
            id=123,
            nome="Teste",
            siglaPartido="TEST",
            siglaUf="SP"
        )
        print("✅ Instância criada com sucesso!")
        print(f"   - Deputado teste: {deputado_teste.nome}")
    except Exception as e:
        print(f"❌ Erro ao criar instância: {e}")
    
    print()
    print("=" * 50)
    print("🏁 Teste de importações concluído!")

if __name__ == "__main__":
    testar_importacoes()
