from typing import Optional, List
from ..models.senador import SenadorDetalhes

async def buscar_senador(id: int) -> Optional[SenadorDetalhes]:
    """
    Busca os detalhes de um senador específico pelo ID
    
    Args:
        id (int): ID do senador
        
    Returns:
        Optional[SenadorDetalhes]: Detalhes do senador ou None se não encontrado
    """
    # TODO: Implementar integração com a API do Senado
    # Por enquanto, retornando dados mockados para teste
    return SenadorDetalhes(
        id=id,
        nome="Senador Teste",
        partido="PTB",
        estado="SP",
        foto="https://www.senado.leg.br/senadores/img/fotos-oficiais/senador123.jpg",
        email="senador.teste@senado.leg.br",
        telefone="(61) 3303-1234",
        gabinete="Sala 123",
        biografia="Biografia do senador...",
        comissoes=["Comissão de Constituição e Justiça", "Comissão de Educação"],
        legislaturas=[56, 57],
        mandato_atual={
            "inicio": "2023-02-01",
            "fim": "2027-01-31"
        },
        redes_sociais={
            "twitter": "@senadorteste",
            "instagram": "senadorteste"
        }
    )

async def listar_senadores(uf: Optional[str] = None, participacao: Optional[float] = None) -> List[dict]:
    """
    Lista todos os senadores com filtros opcionais
    
    Args:
        uf (Optional[str]): Filtro por estado
        participacao (Optional[float]): Filtro por taxa de participação
        
    Returns:
        List[dict]: Lista de senadores
    """
    # TODO: Implementar integração com a API do Senado
    # Por enquanto, retornando dados mockados para teste
    return [
        {
            "id": 1,
            "nome": "Senador Teste 1",
            "partido": "PTB",
            "estado": "SP",
            "foto": "https://www.senado.leg.br/senadores/img/fotos-oficiais/senador1.jpg"
        },
        {
            "id": 2,
            "nome": "Senador Teste 2",
            "partido": "MDB",
            "estado": "RJ",
            "foto": "https://www.senado.leg.br/senadores/img/fotos-oficiais/senador2.jpg"
        }
    ] 