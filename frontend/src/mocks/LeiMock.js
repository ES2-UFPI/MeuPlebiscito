// Dados mockados para leis e projetos de lei
export const LEIS_RECENTES = [
  {
    id: 1,
    numero: "Lei 14.874/2024",
    titulo: "Lei de Proteção de Dados Pessoais em Saúde",
    descricao:
      "Estabelece normas para proteção de dados pessoais no setor de saúde pública e privada",
    status: "sancionada",
    dataStatus: "2024-01-15",
    autor: "Dep. Maria Silva",
    partido: "PT",
    uf: "SP",
    categoria: "Saúde",
    // Linha comentada para futura integração com API de imagens
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Esta lei visa proteger os dados pessoais dos pacientes e estabelecer diretrizes claras para o tratamento de informações sensíveis no setor de saúde.",
  },
  {
    id: 2,
    numero: "PL 3.847/2023",
    titulo: "Marco Legal da Inteligência Artificial",
    descricao: "Regulamenta o uso de inteligência artificial no Brasil",
    status: "em_votacao",
    dataStatus: "2024-01-10",
    autor: "Sen. João Santos",
    partido: "PSDB",
    uf: "RJ",
    categoria: "Tecnologia",
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Projeto que estabelece princípios, diretrizes e salvaguardas para o desenvolvimento e aplicação de sistemas de inteligência artificial no país.",
  },
  {
    id: 3,
    numero: "Lei 14.873/2024",
    titulo: "Programa Nacional de Energia Solar",
    descricao: "Institui incentivos para geração de energia solar residencial",
    status: "sancionada",
    dataStatus: "2024-01-08",
    autor: "Dep. Carlos Oliveira",
    partido: "MDB",
    uf: "MG",
    categoria: "Meio Ambiente",
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Lei que cria incentivos fiscais e facilita o acesso ao crédito para instalação de painéis solares em residências.",
  },
  {
    id: 4,
    numero: "PL 2.156/2023",
    titulo: "Lei de Proteção ao Trabalhador Digital",
    descricao:
      "Regulamenta direitos trabalhistas para profissionais de plataformas digitais",
    status: "em_votacao",
    dataStatus: "2024-01-05",
    autor: "Dep. Ana Costa",
    partido: "PSOL",
    uf: "BA",
    categoria: "Trabalho",
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Projeto que visa garantir direitos trabalhistas básicos para motoristas de aplicativo, entregadores e outros trabalhadores de plataformas digitais.",
  },
  {
    id: 5,
    numero: "Lei 14.872/2024",
    titulo: "Marco Legal do Ensino à Distância",
    descricao:
      "Estabelece diretrizes para educação à distância no ensino superior",
    status: "sancionada",
    dataStatus: "2024-01-03",
    autor: "Sen. Roberto Lima",
    partido: "PL",
    uf: "RS",
    categoria: "Educação",
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Lei que regulamenta a oferta de cursos superiores à distância e estabelece critérios de qualidade para modalidade EAD.",
  },
  {
    id: 6,
    numero: "PL 4.123/2023",
    titulo: "Lei de Incentivo ao Empreendedorismo Jovem",
    descricao: "Cria programa de apoio a jovens empreendedores",
    status: "em_votacao",
    dataStatus: "2024-01-02",
    autor: "Dep. Lucas Ferreira",
    partido: "NOVO",
    uf: "PR",
    categoria: "Economia",
    // urlImagem: await buscarImagemLei(id),
    urlImagem: null,
    resumo:
      "Projeto que estabelece linhas de crédito especiais e capacitação para jovens entre 18 e 29 anos que desejam empreender.",
  },
];

export const obterLeiPorId = (id) => {
  return LEIS_RECENTES.find((lei) => lei.id === Number.parseInt(id));
};

export const obterLeisPorStatus = (status) => {
  return LEIS_RECENTES.filter((lei) => lei.status === status);
};

export const obterLeisRecentes = (limite = 6) => {
  return LEIS_RECENTES.sort(
    (a, b) => new Date(b.dataStatus) - new Date(a.dataStatus)
  ).slice(0, limite);
};
