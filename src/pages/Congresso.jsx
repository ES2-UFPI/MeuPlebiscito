"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Users,
  FileText,
  Scale,
  Vote,
  BookOpen,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Congresso = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("introducao");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    // Animar estatísticas quando a página carrega
    const timer = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const secoes = [
    { id: "introducao", titulo: "Visão Geral", icone: BookOpen },
    { id: "estrutura", titulo: "Como Funciona", icone: Building },
    { id: "camara", titulo: "Câmara dos Deputados", icone: Users },
    { id: "senado", titulo: "Senado Federal", icone: Scale },
    { id: "processo", titulo: "Criação de Leis", icone: FileText },
    { id: "participacao", titulo: "Sua Participação", icone: Vote },
  ];

  const estatisticas = [
    {
      numero: "594",
      label: "Parlamentares",
      descricao: "Total de deputados e senadores",
    },
    {
      numero: "513",
      label: "Deputados",
      descricao: "Representantes da população",
    },
    {
      numero: "81",
      label: "Senadores",
      descricao: "Representantes dos estados",
    },
    {
      numero: "27",
      label: "Estados",
      descricao: "Unidades federativas representadas",
    },
  ];

  const faqItems = [
    {
      pergunta: "Como posso acompanhar as votações?",
      resposta:
        "Você pode acompanhar as votações através do site oficial da Câmara e do Senado, ou usar plataformas como esta para ter acesso simplificado às informações.",
    },
    {
      pergunta: "Posso propor uma lei como cidadão?",
      resposta:
        "Sim! Através da iniciativa popular, você pode propor projetos de lei com o apoio de pelo menos 1% do eleitorado nacional, distribuído em pelo menos 5 estados.",
    },
    {
      pergunta: "Qual a diferença entre deputado e senador?",
      resposta:
        "Deputados representam a população proporcionalmente, enquanto senadores representam os estados de forma igualitária. Deputados têm mandato de 4 anos e senadores de 8 anos.",
    },
    {
      pergunta: "Como funciona o processo de impeachment?",
      resposta:
        "O impeachment é um processo político-jurídico. A Câmara autoriza o processo e o Senado julga. É usado para crimes de responsabilidade do Presidente da República.",
    },
  ];

  return (
    <div className="congresso-moderno">
      <div className="congresso-moderno__container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Entenda o
                <span className="hero-highlight"> Congresso Nacional</span>
              </h1>
              <p className="hero-subtitle">
                Descubra como funciona o coração da democracia brasileira, onde
                são criadas as leis que regem nosso país
              </p>
              <div className="hero-actions">
                <button className="btn-primary-hero">
                  <Play size={20} />
                  Assistir Introdução
                </button>
                <button className="btn-secondary-hero">
                  <Download size={20} />
                  Baixar Guia PDF
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-placeholder">
                <Building size={120} />
                <div className="hero-image-overlay">
                  <span>Congresso Nacional</span>
                  <small>Brasília - DF</small>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas animadas */}
          <div className="hero-stats">
            {estatisticas.map((stat, index) => (
              <div
                key={index}
                className={`stat-card ${animatedStats ? "animated" : ""}`}
              >
                <div className="stat-number">{stat.numero}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.descricao}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Navegação por abas moderna */}
        <section className="tabs-section">
          <div className="tabs-container">
            <div className="tabs-nav">
              {secoes.map((secao) => {
                const IconeComponente = secao.icone;
                return (
                  <button
                    key={secao.id}
                    className={`tab-button ${
                      secaoAtiva === secao.id ? "active" : ""
                    }`}
                    onClick={() => setSecaoAtiva(secao.id)}
                  >
                    <IconeComponente size={20} />
                    <span>{secao.titulo}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Conteúdo das seções */}
        <section className="content-section">
          {secaoAtiva === "introducao" && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>O Que é o Congresso Nacional?</h2>
                <p>O poder que representa você na criação das leis do Brasil</p>
              </div>

              <div className="intro-grid">
                <div className="intro-card">
                  <div className="intro-image">
                    <div className="image-placeholder building-exterior">
                      <Building size={48} />
                      <span>Fachada do Congresso</span>
                    </div>
                  </div>
                  <div className="intro-content">
                    <h3>Sede do Poder Legislativo</h3>
                    <p>
                      Localizado em Brasília, o Congresso Nacional é onde os
                      representantes do povo brasileiro se reúnem para debater e
                      aprovar as leis que regem nosso país. É o coração da
                      democracia brasileira.
                    </p>
                  </div>
                </div>

                <div className="intro-card">
                  <div className="intro-image">
                    <div className="image-placeholder plenario">
                      <Users size={48} />
                      <span>Plenário em Sessão</span>
                    </div>
                  </div>
                  <div className="intro-content">
                    <h3>Representação Popular</h3>
                    <p>
                      Composto por deputados e senadores eleitos pelo povo, o
                      Congresso garante que todas as regiões e grupos sociais
                      tenham voz na criação das leis que nos governam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="funcoes-principais">
                <h3>Principais Funções</h3>
                <div className="funcoes-grid">
                  <div className="funcao-card">
                    <FileText size={32} />
                    <h4>Criar Leis</h4>
                    <p>
                      Elaborar e aprovar leis federais que regem todo o país
                    </p>
                  </div>
                  <div className="funcao-card">
                    <Scale size={32} />
                    <h4>Fiscalizar</h4>
                    <p>Controlar e fiscalizar os atos do Poder Executivo</p>
                  </div>
                  <div className="funcao-card">
                    <Vote size={32} />
                    <h4>Representar</h4>
                    <p>Representar os interesses e necessidades da população</p>
                  </div>
                  <div className="funcao-card">
                    <Building size={32} />
                    <h4>Orçamento</h4>
                    <p>Aprovar e controlar o orçamento público da União</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {secaoAtiva === "estrutura" && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>Como o Congresso se Organiza</h2>
                <p>
                  Entenda a estrutura bicameral do poder legislativo brasileiro
                </p>
              </div>

              <div className="estrutura-visual-moderna">
                <div className="congresso-diagram">
                  <div className="diagram-header">
                    <h3>Congresso Nacional</h3>
                    <p>Poder Legislativo Federal</p>
                  </div>

                  <div className="casas-diagram">
                    <div className="casa-moderna camara-moderna">
                      <div className="casa-icon">
                        <Users size={40} />
                      </div>
                      <h4>Câmara dos Deputados</h4>
                      <div className="casa-stats">
                        <div className="stat">
                          <strong>513</strong>
                          <span>Deputados</span>
                        </div>
                        <div className="stat">
                          <strong>4 anos</strong>
                          <span>Mandato</span>
                        </div>
                      </div>
                      <div className="casa-description">
                        <p>
                          Representa o povo de forma proporcional à população de
                          cada estado
                        </p>
                      </div>
                    </div>

                    <div className="conexao-diagram">
                      <div className="linha-conexao"></div>
                      <div className="conexao-texto">Trabalham juntos</div>
                    </div>

                    <div className="casa-moderna senado-moderno">
                      <div className="casa-icon">
                        <Scale size={40} />
                      </div>
                      <h4>Senado Federal</h4>
                      <div className="casa-stats">
                        <div className="stat">
                          <strong>81</strong>
                          <span>Senadores</span>
                        </div>
                        <div className="stat">
                          <strong>8 anos</strong>
                          <span>Mandato</span>
                        </div>
                      </div>
                      <div className="casa-description">
                        <p>
                          Representa os estados de forma igualitária (3
                          senadores por estado)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="representacao-explicacao">
                <h3>Sistema de Representação</h3>
                <div className="explicacao-cards">
                  <div className="explicacao-card proporcional">
                    <h4>Representação Proporcional</h4>
                    <div className="card-visual">
                      <div className="visual-placeholder">
                        <Users size={32} />
                        <span>Estados mais populosos = mais deputados</span>
                      </div>
                    </div>
                    <p>
                      Na Câmara, cada estado elege deputados proporcionalmente à
                      sua população. São Paulo elege 70 deputados, enquanto
                      estados menores elegem 8.
                    </p>
                  </div>

                  <div className="explicacao-card igualitaria">
                    <h4>Representação Igualitária</h4>
                    <div className="card-visual">
                      <div className="visual-placeholder">
                        <Scale size={32} />
                        <span>Todos os estados = 3 senadores</span>
                      </div>
                    </div>
                    <p>
                      No Senado, todos os estados têm o mesmo peso: 3 senadores
                      cada. Isso garante equilíbrio entre estados grandes e
                      pequenos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {secaoAtiva === "processo" && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>Como uma Lei é Criada</h2>
                <p>Acompanhe o caminho de uma ideia até se tornar lei</p>
              </div>

              <div className="processo-timeline">
                <div className="timeline-header">
                  <h3>Processo Legislativo Brasileiro</h3>
                  <p>Do projeto à sanção presidencial</p>
                </div>

                <div className="timeline-steps">
                  <div className="timeline-step">
                    <div className="step-marker">1</div>
                    <div className="step-content">
                      <h4>Iniciativa</h4>
                      <p>
                        Deputados, senadores, Presidente ou cidadãos propõem um
                        projeto
                      </p>
                      <div className="step-visual">
                        <div className="visual-placeholder small">
                          <FileText size={24} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-connector">
                    <ArrowRight size={20} />
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">2</div>
                    <div className="step-content">
                      <h4>Comissões</h4>
                      <p>Especialistas analisam e emitem pareceres técnicos</p>
                      <div className="step-visual">
                        <div className="visual-placeholder small">
                          <Users size={24} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-connector">
                    <ArrowRight size={20} />
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">3</div>
                    <div className="step-content">
                      <h4>Plenário</h4>
                      <p>Todos os parlamentares debatem e votam</p>
                      <div className="step-visual">
                        <div className="visual-placeholder small">
                          <Vote size={24} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-connector">
                    <ArrowRight size={20} />
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">4</div>
                    <div className="step-content">
                      <h4>Casa Revisora</h4>
                      <p>A outra casa (Câmara ou Senado) revisa o projeto</p>
                      <div className="step-visual">
                        <div className="visual-placeholder small">
                          <Scale size={24} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="timeline-connector">
                    <ArrowRight size={20} />
                  </div>

                  <div className="timeline-step">
                    <div className="step-marker">5</div>
                    <div className="step-content">
                      <h4>Sanção</h4>
                      <p>Presidente sanciona ou veta o projeto aprovado</p>
                      <div className="step-visual">
                        <div className="visual-placeholder small">
                          <Building size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tipos-lei">
                <h3>Tipos de Proposições</h3>
                <div className="tipos-grid">
                  <div className="tipo-card">
                    <div className="tipo-icon">PL</div>
                    <h4>Projeto de Lei</h4>
                    <p>Cria, modifica ou revoga leis ordinárias</p>
                    <span className="tipo-exemplo">
                      Ex: Lei de proteção de dados
                    </span>
                  </div>
                  <div className="tipo-card">
                    <div className="tipo-icon">PEC</div>
                    <h4>Emenda Constitucional</h4>
                    <p>Modifica a Constituição Federal</p>
                    <span className="tipo-exemplo">
                      Ex: Teto de gastos públicos
                    </span>
                  </div>
                  <div className="tipo-card">
                    <div className="tipo-icon">MP</div>
                    <h4>Medida Provisória</h4>
                    <p>Ato do Presidente com força de lei</p>
                    <span className="tipo-exemplo">
                      Ex: Auxílio emergencial
                    </span>
                  </div>
                  <div className="tipo-card">
                    <div className="tipo-icon">PLP</div>
                    <h4>Lei Complementar</h4>
                    <p>Regulamenta dispositivos constitucionais</p>
                    <span className="tipo-exemplo">
                      Ex: Lei de responsabilidade fiscal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {secaoAtiva === "participacao" && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>Sua Voz no Congresso</h2>
                <p>
                  Descubra como participar ativamente da democracia brasileira
                </p>
              </div>

              <div className="participacao-hero">
                <div className="participacao-content">
                  <h3>A democracia precisa de você!</h3>
                  <p>
                    Não basta apenas votar. Existem várias formas de influenciar
                    as decisões que afetam sua vida e a de milhões de
                    brasileiros.
                  </p>
                </div>
                <div className="participacao-visual">
                  <div className="visual-placeholder participacao-img">
                    <Vote size={64} />
                    <span>Participação Cidadã</span>
                  </div>
                </div>
              </div>

              <div className="formas-participacao">
                <h3>Como Participar</h3>
                <div className="participacao-grid">
                  <div className="participacao-card destaque">
                    <div className="card-header">
                      <Vote size={32} />
                      <h4>Voto Consciente</h4>
                    </div>
                    <p>
                      Eleja representantes alinhados com seus valores e
                      acompanhe sua atuação
                    </p>
                    <div className="card-action">
                      <button className="btn-card">
                        <ExternalLink size={16} />
                        Conheça os candidatos
                      </button>
                    </div>
                  </div>

                  <div className="participacao-card">
                    <div className="card-header">
                      <FileText size={32} />
                      <h4>Iniciativa Popular</h4>
                    </div>
                    <p>Proponha leis com apoio de 1% do eleitorado nacional</p>
                    <div className="card-stats">
                      <span>~1,5 milhão de assinaturas necessárias</span>
                    </div>
                  </div>

                  <div className="participacao-card">
                    <div className="card-header">
                      <Users size={32} />
                      <h4>Audiências Públicas</h4>
                    </div>
                    <p>Participe de debates sobre temas de interesse público</p>
                    <div className="card-stats">
                      <span>Abertas a todos os cidadãos</span>
                    </div>
                  </div>

                  <div className="participacao-card">
                    <div className="card-header">
                      <BookOpen size={32} />
                      <h4>Acompanhamento</h4>
                    </div>
                    <p>Monitore a atuação dos seus representantes</p>
                    <div className="card-stats">
                      <span>Use plataformas como esta</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dicas-participacao">
                <h3>Dicas para uma Participação Efetiva</h3>
                <div className="dicas-accordion">
                  {[
                    {
                      titulo: "Mantenha-se Informado",
                      conteudo:
                        "Acompanhe as votações, projetos em tramitação e posicionamentos dos seus representantes. Use fontes confiáveis e diversificadas.",
                    },
                    {
                      titulo: "Contate seus Representantes",
                      conteudo:
                        "Use os canais oficiais para expressar suas opiniões. E-mails, telefonemas e redes sociais são formas válidas de comunicação.",
                    },
                    {
                      titulo: "Participe de Organizações",
                      conteudo:
                        "Junte-se a ONGs, sindicatos, associações e movimentos que defendem causas de seu interesse. A união faz a força.",
                    },
                    {
                      titulo: "Eduque-se Politicamente",
                      conteudo:
                        "Entenda como funcionam os processos democráticos, seus direitos e deveres como cidadão. Conhecimento é poder.",
                    },
                  ].map((dica, index) => (
                    <div key={index} className="dica-accordion-item">
                      <button
                        className="dica-header"
                        onClick={() =>
                          setExpandedFaq(expandedFaq === index ? null : index)
                        }
                      >
                        <span>{dica.titulo}</span>
                        {expandedFaq === index ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="dica-content">
                          <p>{dica.conteudo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-header">
            <h2>Perguntas Frequentes</h2>
            <p>Tire suas dúvidas sobre o Congresso Nacional</p>
          </div>

          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <h4>{item.pergunta}</h4>
                <p>{item.resposta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Pronto para Participar?</h2>
            <p>
              Comece agora a acompanhar seus representantes e fazer a diferença
              na democracia brasileira
            </p>
            <div className="cta-actions">
              <button className="btn-cta-primary">Explorar Deputados</button>
              <button className="btn-cta-secondary">Ver Projetos de Lei</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Congresso;
