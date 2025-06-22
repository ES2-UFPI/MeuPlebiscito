"""
Serviço completo para integração com APIs oficiais
Implementa todos os endpoints específicos solicitados
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

# URLs das APIs oficiais
CAMARA_API_URL = "https://dadosabertos.camara.leg.br/api/v2"
TRANSPARENCIA_API_URL = "https://api.portaldatransparencia.gov.br"

class DeputadosService:
    """
    Serviço principal para operações com deputados
    Integrado com APIs oficiais da Câmara e Portal da Transparência
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
        Endpoint: GET /deputados
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
        Integra todos os endpoints necessários
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
            
            # 2. Buscar dados das abas em paralelo usando endpoints específicos
            import asyncio
            participacoes_task = self._buscar_participacoes_eventos(deputado_id)
            projetos_task = self._buscar_proposicoes_por_autor(deputado_id)
            atividades_task = self._buscar_atividades_completas(deputado_id)
            orcamento_task = self._buscar_despesas_detalhadas(deputado_id)
            
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

    async def _buscar_participacoes_eventos(self, deputado_id: int) -> List[Participacao]:
        """
        Busca participações em eventos do deputado
        Endpoint: GET /deputados/{id}/eventos
        """
        try:
            logger.info(f"🔍 Buscando eventos do deputado {deputado_id}")
            
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}/eventos")
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            participacoes = []
            
            logger.info(f"📊 Encontrados {len(dados)} eventos do deputado {deputado_id}")
            
            for evento in dados[:20]:  # Limita a 20 eventos mais recentes
                participacao = Participacao(
                    tipo=evento.get("descricaoTipo", "Evento"),
                    descricao=evento.get("descricao", "")[:200] + "..." if len(evento.get("descricao", "")) > 200 else evento.get("descricao", ""),
                    data=evento.get("dataHoraInicio", ""),
                    presente=True  # API não fornece status de presença diretamente
                )
                participacoes.append(participacao)
            
            logger.info(f"✅ Processados {len(participacoes)} eventos do deputado {deputado_id}")
            return participacoes
            
        except Exception as e:
            logger.warning(f"Erro ao buscar eventos do deputado {deputado_id}: {str(e)}")
            return []

    async def _buscar_proposicoes_por_autor(self, deputado_id: int) -> List[Projeto]:
        """
        Busca proposições por autor usando endpoint específico
        Endpoint: GET /proposicoes?idDeputadoAutor={id}
        """
        try:
            logger.info(f"🔍 Buscando proposições do deputado {deputado_id}")
            
            # Usa o endpoint específico para proposições por autor
            response = await self.client.get(
                f"{CAMARA_API_URL}/proposicoes",
                params={
                    "idDeputadoAutor": deputado_id,
                    "itens": 20,
                    "ordem": "DESC",
                    "ordenarPor": "id"
                }
            )
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            projetos = []
            
            logger.info(f"📊 Encontradas {len(dados)} proposições do deputado {deputado_id}")
            
            for proposicao in dados:
                # Monta o número da proposição
                numero = f"{proposicao.get('siglaTipo', '')} {proposicao.get('numero', '')}/{proposicao.get('ano', '')}"
                
                # Limita o tamanho da ementa
                titulo = proposicao.get("ementa", "")
                if len(titulo) > 200:
                    titulo = titulo[:200] + "..."
                
                # Mapeia o status
                status_situacao = proposicao.get("statusProposicao", {})
                status = self._mapear_status_proposicao(status_situacao)
                
                projeto = Projeto(
                    numero=numero.strip(),
                    titulo=titulo,
                    data=proposicao.get("dataApresentacao", ""),
                    status=status
                )
                projetos.append(projeto)
            
            logger.info(f"✅ Processadas {len(projetos)} proposições do deputado {deputado_id}")
            return projetos
            
        except Exception as e:
            logger.warning(f"Erro ao buscar proposições do deputado {deputado_id}: {str(e)}")
            return []

    async def _buscar_atividades_completas(self, deputado_id: int) -> Atividades:
        """
        Busca atividades completas do deputado
        Endpoints: 
        - /deputados/{id}/mandatosExternos
        - /deputados/{id}/historico
        - /deputados/{id}/orgaos
        """
        try:
            logger.info(f"🔍 Buscando atividades completas do deputado {deputado_id}")
            
            # Busca dados em paralelo
            import asyncio
            mandatos_task = self._buscar_mandatos_externos(deputado_id)
            historico_task = self._buscar_historico_deputado(deputado_id)
            orgaos_task = self._buscar_orgaos_deputado(deputado_id)
            
            mandatos_externos, historico, orgaos = await asyncio.gather(
                mandatos_task,
                historico_task,
                orgaos_task,
                return_exceptions=True
            )
            
            # Processa mandatos
            mandatos = ["Deputado Federal - Legislatura atual"]
            if not isinstance(mandatos_externos, Exception) and mandatos_externos:
                mandatos.extend(mandatos_externos)
            if not isinstance(historico, Exception) and historico:
                mandatos.extend(historico)
            
            # Processa comissões e órgãos
            comissoes = []
            if not isinstance(orgaos, Exception) and orgaos:
                comissoes = orgaos
            
            return Atividades(
                mandatos=list(set(mandatos)),  # Remove duplicatas
                comissoes=comissoes
            )
            
        except Exception as e:
            logger.warning(f"Erro ao buscar atividades do deputado {deputado_id}: {str(e)}")
            return Atividades(mandatos=[], comissoes=[])

    async def _buscar_mandatos_externos(self, deputado_id: int) -> List[str]:
        """Busca mandatos externos do deputado"""
        try:
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}/mandatosExternos")
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            mandatos = []
            
            for mandato in dados:
                descricao = f"{mandato.get('cargo', '')} - {mandato.get('entidade', '')}"
                if mandato.get('anoInicio'):
                    descricao += f" ({mandato.get('anoInicio')}"
                    if mandato.get('anoFim'):
                        descricao += f"-{mandato.get('anoFim')}"
                    descricao += ")"
                mandatos.append(descricao.strip())
            
            return mandatos
            
        except Exception as e:
            logger.warning(f"Erro ao buscar mandatos externos: {str(e)}")
            return []

    async def _buscar_historico_deputado(self, deputado_id: int) -> List[str]:
        """Busca histórico do deputado"""
        try:
            response = await self.client.get(f"{CAMARA_API_URL}/deputados/{deputado_id}/historico")
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            historico = []
            
            for item in dados:
                if item.get('legislatura'):
                    descricao = f"Legislatura {item.get('legislatura')}"
                    if item.get('situacao'):
                        descricao += f" - {item.get('situacao')}"
                    historico.append(descricao)
            
            return historico
            
        except Exception as e:
            logger.warning(f"Erro ao buscar histórico: {str(e)}")
            return []

    async def _buscar_orgaos_deputado(self, deputado_id: int) -> List[str]:
        """Busca órgãos e comissões do deputado"""
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
            
            return sorted(list(set(comissoes)))
            
        except Exception as e:
            logger.warning(f"Erro ao buscar órgãos: {str(e)}")
            return []

    async def _buscar_despesas_detalhadas(self, deputado_id: int) -> Optional[Orcamento]:
        """
        Busca dados orçamentários detalhados do deputado
        Endpoint: GET /deputados/{id}/despesas?ano=&ordem=ASC&ordenarPor=ano
        """
        try:
            logger.info(f"🔍 Buscando despesas do deputado {deputado_id}")
            
            ano_atual = datetime.now().year
            
            response = await self.client.get(
                f"{CAMARA_API_URL}/deputados/{deputado_id}/despesas",
                params={
                    "ano": ano_atual,
                    "ordem": "ASC",
                    "ordenarPor": "ano",
                    "itens": 100
                }
            )
            response.raise_for_status()
            
            dados = response.json().get("dados", [])
            
            if not dados:
                logger.info(f"Nenhuma despesa encontrada para o deputado {deputado_id}")
                return None
            
            total_gasto = sum(float(despesa.get("valorLiquido", 0)) for despesa in dados)
            
            # Agrupa por categoria e mês
            categorias_dict = {}
            historico_dict = {}
            
            for despesa in dados:
                categoria = despesa.get("tipoDespesa", "Outros")
                valor = float(despesa.get("valorLiquido", 0))
                mes = despesa.get("mes", 1)
                
                # Agrupa por categoria
                if categoria not in categorias_dict:
                    categorias_dict[categoria] = 0
                categorias_dict[categoria] += valor
                
                # Agrupa por mês
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
            
            logger.info(f"✅ Processadas despesas do deputado {deputado_id}: R$ {total_gasto:,.2f}")
            
            return Orcamento(
                totalGasto=total_gasto,
                categorias=categorias,
                historico=historico
            )
            
        except Exception as e:
            logger.warning(f"Erro ao buscar despesas do deputado {deputado_id}: {str(e)}")
            return None

    def _mapear_status_proposicao(self, status_data: Dict[str, Any]) -> str:
        """Mapeia status da proposição para formato amigável"""
        if not status_data:
            return "Status não informado"
            
        descricao = status_data.get("descricaoSituacao", "").lower()
        
        if "arquivad" in descricao:
            return "Arquivado"
        elif "aprovad" in descricao or "sancionad" in descricao:
            return "Aprovado"
        elif "tramitação" in descricao or "tramitando" in descricao:
            return "Em Tramitação"
        elif "rejeitad" in descricao:
            return "Rejeitado"
        elif "pronto" in descricao:
            return "Pronto para Pauta"
        else:
            return status_data.get("descricaoSituacao", "Status não informado")
