"""
Serviço para integração com a API da Câmara dos Deputados
Integrado com a estrutura existente do projeto
"""
import httpx
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.deputado import (
    DeputadoResumo, DeputadoCompleto, Participacao, 
    Projeto, Atividades, Orcamento, CategoriaOrcamento, HistoricoMensal
)

# Configuração do logger
logger = logging.getLogger(__name__)

# URL base da API oficial da Câmara dos Deputados
CAMARA_API_URL = "https://dadosabertos.camara.leg.br/api/v2"

class DeputadosService:
    """
    Serviço principal para operações com deputados
    Integrado com a arquitetura existente do projeto
    """
    
    def __init__(self):
        """Inicializa o serviço com cliente HTTP configurado"""
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "User-Agent": "MeuPlebiscito/1.0 (Aplicacao Educacional)"
            }
        )
    
    async def __aenter__(self):
        """Context manager para uso com async with"""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Fecha conexões ao sair do context manager"""
        await self.client.aclose()

    def _calcular_idade(self, data_nascimento: str) -> Optional[int]:
        """
        Calcula idade a partir da data de nascimento
        
        Args:
            data_nascimento: Data no formato YYYY-MM-DD
            
        Returns:
            Idade em anos ou None se data inválida
        """
        if not data_nascimento:
            return None
        
        try:
            nascimento = datetime.strptime(data_nascimento, "%Y-%m-%d")
            hoje = datetime.now()
            idade = hoje.year - nascimento.year
            
            if hoje.month < nascimento.month or (hoje.month == nascimento.month and hoje.day < nascimento.day):
                idade -= 1
                
            return idade
        except ValueError as e:
            logger.warning(f"Data de nascimento inválida: {data_nascimento} - {e}")
            return None

    async def listar_deputados(
        self, 
        nome: Optional[str] = None,
        partido: Optional[str] = None,
        estado: Optional[str] = None,
        sexo: Optional[str] = None
    ) -> List[DeputadoResumo]:
        """
        Lista deputados com filtros opcionais
        Compatível com SearchBar.jsx e BuscaDetalhada.jsx existentes
        """
        logger.info(f"🔍 Listando deputados - nome: {nome}, partido: {partido}, estado: {estado}, sexo: {sexo}")
        
        try:
            # Prepara parâmetros da requisição
            params = {}
            if nome:
                params["nome"] = nome
            if partido:
                params["siglaPartido"] = partido.upper()
            if estado:
                params["siglaUf"] = estado.upper()
            if sexo:
                params["siglaSexo"] = sexo.upper()

            # Faz requisição para a API da Câmara
            response = await self.client.get(f"{CAMARA_API_URL}/deputados", params=params)
            response.raise_for_status()
            
            dados_api = response.json().get("dados", [])
            logger.info(f"📊 API retornou {len(dados_api)} deputados")
            
            deputados = []
            
            # Processa cada deputado (limitando para performance)
            for i, deputado_data in enumerate(dados_api[:50]):
                try:
                    # Busca dados detalhados para calcular idade
                    detalhes_response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_data['id']}")
                    detalhes_response.raise_for_status()
                    detalhes = detalhes_response.json().get("dados", {})
                    
                    idade = self._calcular_idade(detalhes.get("dataNascimento"))
                    
                    deputado = DeputadoResumo(
                        id=deputado_data["id"],
                        nome=deputado_data["nome"],
                        siglaPartido=deputado_data["siglaPartido"],
                        siglaUf=deputado_data["siglaUf"],
                        urlFoto=deputado_data.get("urlFoto"),
                        cargo="Deputado Federal",
                        idade=idade
                    )
                    deputados.append(deputado)
                    
                    if (i + 1) % 10 == 0:
                        logger.debug(f"Processados {i + 1}/{len(dados_api)} deputados")
                    
                except Exception as e:
                    logger.warning(f"⚠️ Erro ao processar deputado {deputado_data.get('id', 'unknown')}: {str(e)}")
                    # Adiciona sem idade se houver erro nos detalhes
                    deputado = DeputadoResumo(
                        id=deputado_data["id"],
                        nome=deputado_data["nome"],
                        siglaPartido=deputado_data["siglaPartido"],
                        siglaUf=deputado_data["siglaUf"],
                        urlFoto=deputado_data.get("urlFoto"),
                        cargo="Deputado Federal"
                    )
                    deputados.append(deputado)
            
            logger.info(f"✅ Retornando {len(deputados)} deputados processados")
            return deputados
            
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ Erro HTTP ao listar deputados: {e.response.status_code} - {e.response.text}")
            raise Exception(f"Erro na API da Câmara: {e.response.status_code}")
        except Exception as e:
            logger.error(f"❌ Erro inesperado ao listar deputados: {str(e)}")
            raise

    async def buscar_deputado_completo(self, deputado_id: int) -> Optional[DeputadoCompleto]:
        """
        Busca dados completos de um deputado específico
        Compatível com Deputados.jsx existente
        """
        logger.info(f"🔍 Buscando deputado completo: {deputado_id}")
        
        try:
            # 1. Buscar dados básicos do deputado
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}")
            response.raise_for_status()
            
            dados = response.json().get("dados", {})
            if not dados:
                logger.warning(f"Deputado {deputado_id} não encontrado na API")
                return None
            
            ultimo_status = dados.get("ultimoStatus", {})
            gabinete = ultimo_status.get("gabinete", {})
            
            # 2. Buscar dados das abas em paralelo
            import asyncio
            participacoes_task = self._buscar_participacoes(deputado_id)
            projetos_task = self._buscar_projetos(deputado_id)
            atividades_task = self._buscar_atividades(deputado_id)
            orcamento_task = self._buscar_orcamento(deputado_id)
            
            participacoes, projetos, atividades, orcamento = await asyncio.gather(
                participacoes_task,
                projetos_task,
                atividades_task,
                orcamento_task,
                return_exceptions=True
            )
            
            # Trata erros individuais
            if isinstance(participacoes, Exception):
                logger.warning(f"Erro ao buscar participações: {participacoes}")
                participacoes = []
            if isinstance(projetos, Exception):
                logger.warning(f"Erro ao buscar projetos: {projetos}")
                projetos = []
            if isinstance(atividades, Exception):
                logger.warning(f"Erro ao buscar atividades: {atividades}")
                atividades = Atividades()
            if isinstance(orcamento, Exception):
                logger.warning(f"Erro ao buscar orçamento: {orcamento}")
                orcamento = None
            
            # 3. Monta objeto completo
            deputado_completo = DeputadoCompleto(
                # Dados básicos
                id=dados["id"],
                nome=ultimo_status.get("nome", dados.get("nomeCivil", "")),
                siglaPartido=ultimo_status.get("siglaPartido", ""),
                siglaUf=ultimo_status.get("siglaUf", ""),
                urlFoto=ultimo_status.get("urlFoto"),
                
                # Contato
                email=gabinete.get("email"),
                telefone=gabinete.get("telefone"),
                gabinete=f"Prédio {gabinete.get('predio', 'N/A')}, Sala {gabinete.get('sala', 'N/A')}" if gabinete.get('predio') or gabinete.get('sala') else None,
                
                # Dados pessoais
                nomeCivil=dados.get("nomeCivil"),
                sexo=dados.get("sexo"),
                dataNascimento=dados.get("dataNascimento"),
                escolaridade=dados.get("escolaridade"),
                situacao=ultimo_status.get("situacao"),
                
                # Dados das abas
                participacoes=participacoes,
                projetos=projetos,
                atividades=atividades,
                orcamento=orcamento
            )
            
            logger.info(f"✅ Deputado completo {deputado_id} carregado com sucesso")
            return deputado_completo
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                logger.warning(f"Deputado {deputado_id} não encontrado (404)")
                return None
            logger.error(f"❌ Erro HTTP ao buscar deputado {deputado_id}: {e.response.status_code}")
            raise Exception(f"Erro na API da Câmara: {e.response.status_code}")
        except Exception as e:
            logger.error(f"❌ Erro inesperado ao buscar deputado completo {deputado_id}: {str(e)}")
            raise

    async def _buscar_participacoes(self, deputado_id: int) -> List[Participacao]:
        """Busca participações em eventos do deputado"""
        try:
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}/eventos")
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            participacoes = []
            
            for evento in dados[:20]:
                participacao = Participacao(
                    tipo=evento.get("descricaoTipo", "Evento"),
                    descricao=evento.get("descricao", "")[:200] + "..." if len(evento.get("descricao", "")) > 200 else evento.get("descricao", ""),
                    data=evento.get("dataHoraInicio", ""),
                    presente=True
                )
                participacoes.append(participacao)
            
            return participacoes
            
        except Exception as e:
            logger.warning(f"Erro ao buscar participações do deputado {deputado_id}: {str(e)}")
            return []

    async def _buscar_projetos(self, deputado_id: int) -> List[Projeto]:
        """Busca projetos de lei do deputado"""
        try:
            response = await self.client.get(
                f"{CAMARA_API_URL}/deputados/{deputado_id}/proposicoes",
                params={"itens": 20, "ordem": "DESC", "ordenarPor": "id"}
            )
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            projetos = []
            
            for proposicao in dados:
                numero = f"{proposicao.get('siglaTipo', '')} {proposicao.get('numero', '')}/{proposicao.get('ano', '')}"
                titulo = proposicao.get("ementa", "")
                if len(titulo) > 200:
                    titulo = titulo[:200] + "..."
                
                projeto = Projeto(
                    numero=numero.strip(),
                    titulo=titulo,
                    data=proposicao.get("dataApresentacao", ""),
                    status=self._mapear_status_proposicao(proposicao.get("statusProposicao", {}))
                )
                projetos.append(projeto)
            
            return projetos
            
        except Exception as e:
            logger.warning(f"Erro ao buscar projetos do deputado {deputado_id}: {str(e)}")
            return []

    def _mapear_status_proposicao(self, status_data: Dict[str, Any]) -> str:
        """Mapeia status da proposição para formato amigável"""
        descricao = status_data.get("descricaoSituacao", "").lower()
        
        if "arquivad" in descricao:
            return "Arquivado"
        elif "aprovad" in descricao or "sancionad" in descricao:
            return "Aprovado"
        elif "tramitação" in descricao or "tramitando" in descricao:
            return "Em Tramitação"
        elif "rejeitad" in descricao:
            return "Rejeitado"
        else:
            return status_data.get("descricaoSituacao", "Status não informado")

    async def _buscar_atividades(self, deputado_id: int) -> Atividades:
        """Busca atividades e cargos do deputado"""
        try:
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}/orgaos")
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            comissoes = []
            
            for orgao in dados:
                nome_orgao = orgao.get("nome", "")
                cargo = orgao.get("cargo", "")
                
                if cargo and cargo.lower() != "membro":
                    comissoes.append(f"{nome_orgao} ({cargo})")
                else:
                    comissoes.append(nome_orgao)
            
            comissoes = sorted(list(set(comissoes)))
            mandatos = ["Deputado Federal - Legislatura atual"]
            
            return Atividades(
                mandatos=mandatos,
                comissoes=comissoes
            )
            
        except Exception as e:
            logger.warning(f"Erro ao buscar atividades do deputado {deputado_id}: {str(e)}")
            return Atividades(mandatos=[], comissoes=[])

    async def _buscar_orcamento(self, deputado_id: int) -> Optional[Orcamento]:
        """Busca dados orçamentários do deputado"""
        try:
            ano_atual = datetime.now().year
            
            response = await self.client.get(
                f"{CAMARA_API_URL}/deputados/{deputado_id}/despesas",
                params={"ano": ano_atual, "itens": 100}
            )
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            
            if not dados:
                return None
            
            total_gasto = sum(float(despesa.get("valorLiquido", 0)) for despesa in dados)
            
            # Agrupa por categoria e mês
            categorias_dict = {}
            historico_dict = {}
            
            for despesa in dados:
                categoria = despesa.get("tipoDespesa", "Outros")
                valor = float(despesa.get("valorLiquido", 0))
                mes = despesa.get("mes", 1)
                
                if categoria not in categorias_dict:
                    categorias_dict[categoria] = 0
                categorias_dict[categoria] += valor
                
                chave_mes = f"{mes:02d}/{ano_atual}"
                if chave_mes not in historico_dict:
                    historico_dict[chave_mes] = 0
                historico_dict[chave_mes] += valor
            
            # Formata categorias com percentuais
            categorias = []
            for nome, valor in categorias_dict.items():
                percentual = (valor / total_gasto * 100) if total_gasto > 0 else 0
                categorias.append(CategoriaOrcamento(
                    nome=nome,
                    valor=valor,
                    percentual=round(percentual, 2)
                ))
            
            categorias.sort(key=lambda x: x.valor, reverse=True)
            
            # Formata histórico mensal ordenado
            historico = [
                HistoricoMensal(mes=mes, valor=valor)
                for mes, valor in sorted(historico_dict.items())
            ]
            
            return Orcamento(
                totalGasto=total_gasto,
                categorias=categorias,
                historico=historico
            )
            
        except Exception as e:
            logger.warning(f"Erro ao buscar orçamento do deputado {deputado_id}: {str(e)}")
            return None
