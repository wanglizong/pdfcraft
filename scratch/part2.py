import json

part2 = {
  "organize-pdf": {
    "title": "Organizar PDF",
    "metaDescription": "Reordene, duplique e exclua páginas de PDF. Arraste e solte para reorganizar seus documentos.",
    "keywords": [
      "organizar pdf",
      "reordenar paginas de pdf",
      "reorganizar pdf",
      "organizador de paginas de pdf"
    ],
    "description": "\n      <p>A ferramenta Organizar PDF oferece uma interface intuitiva de arrastar e soltar para reorganizar as páginas nos seus documentos PDF. Reordene páginas, duplique seções importantes ou remova páginas indesejadas com facilidade.</p>\n      <p>As miniaturas visuais das páginas facilitam a identificação do conteúdo e a organização das páginas exatamente como você precisa. Perfeito para reestruturar documentos, criar ordens de páginas personalizadas ou limpar arquivos digitalizados.</p>\n      <p>Toda a organização ocorre localmente no seu navegador, garantindo a privacidade dos seus documentos.</p>\n    ",
    "howToUse": [
      {
        "step": 1,
        "title": "Carregar seu PDF",
        "description": "Arraste e solte seu arquivo PDF ou clique para selecionar o documento que deseja organizar."
      },
      {
        "step": 2,
        "title": "Reorganizar Páginas",
        "description": "Arraste as miniaturas das páginas para reordená-las. Clique nos botões de duplicar ou excluir em cada página, conforme necessário."
      },
      {
        "step": 3,
        "title": "Salvar e Baixar",
        "description": "Clique em Salvar para aplicar as alterações e baixar o PDF reorganizado."
      }
    ],
    "useCases": [
      {
        "title": "Corrigir Ordem das Páginas",
        "description": "Corrija a ordem de páginas que foram digitalizadas ou combinadas incorretamente.",
        "icon": "arrow-up-down"
      },
      {
        "title": "Criar Ordem Personalizada",
        "description": "Organize as páginas em uma sequência específica para apresentações ou relatórios.",
        "icon": "list"
      },
      {
        "title": "Remover Páginas Indesejadas",
        "description": "Exclua páginas em branco, duplicadas ou conteúdo irrelevante de documentos.",
        "icon": "trash-2"
      }
    ],
    "faq": [
      {
        "question": "Posso duplicar páginas?",
        "answer": "Sim, você pode duplicar qualquer página e colocar a cópia em qualquer lugar do documento."
      },
      {
        "question": "Existe uma função de desfazer?",
        "answer": "Sim, você pode desfazer e refazer alterações. Também pode redefinir para a ordem original a qualquer momento."
      },
      {
        "question": "Posso organizar múltiplos PDFs juntos?",
        "answer": "Esta ferramenta funciona com um PDF por vez. Para combinar e organizar vários PDFs, primeiro junte-os usando a ferramenta Juntar PDF (ou Mesclar PDF)."
      }
    ]
  },
  "delete-pages": {
    "title": "Excluir Páginas",
    "metaDescription": "Remova páginas indesejadas de arquivos PDF. Selecione e exclua páginas específicas facilmente.",
    "keywords": [
      "excluir paginas pdf",
      "remover paginas pdf",
      "removedor de paginas de pdf",
      "deletar paginas de pdf"
    ],
    "description": "\n      <p>A ferramenta Excluir Páginas permite remover páginas indesejadas de seus documentos PDF de forma rápida e fácil. Quer você precise remover páginas em branco, conteúdo desatualizado ou informações confidenciais, este ferramenta torna isso simples.</p>\n      <p>As miniaturas visuais de página ajudam a identificar exatamente quais páginas deseja remover. Você pode excluir páginas individuais ou várias páginas de uma só vez.</p>\n      <p>Todo o processamento ocorre localmente no seu navegador, garantindo que seus documentos permaneçam privados.</p>\n    ",
    "howToUse": [
      {
        "step": 1,
        "title": "Carregar seu PDF",
        "description": "Arraste e solte seu arquivo PDF ou clique para selecionar o documento do qual deseja excluir as páginas."
      },
      {
        "step": 2,
        "title": "Selecionar Páginas para Excluir",
        "description": "Clique nas miniaturas das páginas para marcá-las para exclusão ou insira os números das páginas no campo de entrada."
      },
      {
        "step": 3,
        "title": "Excluir e Baixar",
        "description": "Clique em Excluir para remover as páginas selecionadas e baixar seu PDF atualizado."
      }
    ],
    "useCases": [
      {
        "title": "Remover Páginas em Branco",
        "description": "Limpe os documentos removendo páginas em branco incluídas acidentalmente.",
        "icon": "file-x"
      },
      {
        "title": "Remover Conteúdo Confidencial",
        "description": "Exclua páginas contendo informações confidenciais antes de compartilhar documentos.",
        "icon": "shield"
      },
      {
        "title": "Simplificar Documentos",
        "description": "Remova páginas desatualizadas ou irrelevantes para criar documentos mais focados.",
        "icon": "filter"
      }
    ],
    "faq": [
      {
        "question": "Posso recuperar páginas excluídas?",
        "answer": "A exclusão é permanente no arquivo gerado. Mantenha um backup do seu documento original caso precise das páginas mais tarde."
      },
      {
        "question": "Posso excluir várias páginas de uma só vez?",
        "answer": "Sim, você pode selecionar e excluir várias páginas simultaneamente."
      },
      {
        "question": "Excluir páginas afetará os marcadores?",
        "answer": "Os marcadores que apontam para as páginas excluídas serão removidos. Os marcadores das páginas restantes são preservados."
      }
    ]
  },
  "bookmark": {
    "title": "Editar Marcadores",
    "metaDescription": "Adicione, edite e gerencie marcadores de PDF. Crie uma estrutura de navegação para seus documentos.",
    "keywords": [
      "marcadores pdf",
      "editar marcadores",
      "adicionar marcadores pdf",
      "navegação de pdf",
      "indice de pdf"
    ],
    "description": "\n      <p>A ferramenta Editar Marcadores permite criar, modificar e organizar marcadores em seus documentos PDF. Os marcadores fornecem navegação rápida para seções específicas, tornando documentos longos mais fáceis de usar.</p>\n      <p>Você pode adicionar novos marcadores, editar os existentes, reorganizar a hierarquia de marcadores ou importar marcadores de fontes externas. Esta ferramenta é essencial para criar documentos profissionais e navegáveis.</p>\n      <p>Toda a edição ocorre localmente no seu navegador, garantindo a privacidade dos seus documentos.</p>\n    ",
    "howToUse": [
      {
        "step": 1,
        "title": "Carregar seu PDF",
        "description": "Arraste e solte seu arquivo PDF ou clique para selecionar o documento que deseja editar."
      },
      {
        "step": 2,
        "title": "Gerenciar Marcadores",
        "description": "Adicione novos marcadores, edite os existentes ou arraste para reorganizar a hierarquia."
      },
      {
        "step": 3,
        "title": "Salvar e Baixar",
        "description": "Clique em Salvar para aplicar as alterações e baixar o PDF com os marcadores atualizados."
      }
    ],
    "useCases": [
      {
        "title": "Criar Navegação",
        "description": "Adicione marcadores a documentos longos para ajudar os leitores a navegar rapidamente para seções específicas.",
        "icon": "navigation"
      },
      {
        "title": "Organizar Capítulos",
        "description": "Crie uma estrutura de marcadores hierárquica que reflita a organização dos capítulos do seu documento.",
        "icon": "book-open"
      },
      {
        "title": "Melhorar Acessibilidade",
        "description": "Adicione marcadores para tornar os documentos mais acessíveis e amigáveis ao usuário.",
        "icon": "accessibility"
      }
    ],
    "faq": [
      {
        "question": "Posso criar marcadores aninhados?",
        "answer": "Sim, você pode criar uma estrutura hierárquica com marcadores pai e filho."
      },
      {
        "question": "Posso importar marcadores de um arquivo?",
        "answer": "Sim, você pode importar estruturas de marcadores de arquivos JSON ou de texto."
      },
      {
        "question": "Os marcadores funcionarão em todos os leitores de PDF?",
        "answer": "Sim, os marcadores são um recurso padrão do PDF suportado por todos os principais leitores de PDF."
      }
    ]
  },
  "table-of-contents": {
    "title": "Sumário",
    "metaDescription": "Gere um sumário para o seu PDF. Crie navegação clicável a partir de marcadores.",
    "keywords": [
      "sumario pdf",
      "gerador de sumario",
      "indice de pdf",
      "navegacao de documento"
    ],
    "description": "\n      <p>A ferramenta Sumário gera uma página de sumário navegável para seus documentos PDF. O sumário pode ser criado a partir de marcadores existentes ou entradas personalizadas, fornecendo aos leitores uma visão geral e navegação rápida.</p>\n      <p>Personalize a aparência com diferentes estilos, fontes e layouts. O sumário gerado inclui links clicáveis que saltam diretamente para as páginas referenciadas.</p>\n      <p>Todo o processamento ocorre localmente no seu navegador, garantindo que seus documentos permaneçam privados.</p>\n    ",
    "howToUse": [
      {
        "step": 1,
        "title": "Carregar seu PDF",
        "description": "Arraste e solte seu arquivo PDF ou clique para selecionar o documento."
      },
      {
        "step": 2,
        "title": "Configurar Sumário",
        "description": "Escolha gerar a partir de marcadores ou crie entradas personalizadas. Selecione opções de estilo e posicionamento."
      },
      {
        "step": 3,
        "title": "Gerar e Baixar",
        "description": "Clique em Gerar para criar o sumário e baixar seu PDF atualizado."
      }
    ],
    "useCases": [
      {
        "title": "Trabalhos Acadêmicos",
        "description": "Adicione um sumário profissional a teses, dissertações e artigos de pesquisa.",
        "icon": "graduation-cap"
      },
      {
        "title": "Relatórios Comerciais",
        "description": "Crie relatórios navegáveis com listagens de seções claras para as partes interessadas.",
        "icon": "bar-chart"
      },
      {
        "title": "Manuais do Usuário",
        "description": "Gere sumários abrangentes para documentação técnica e guias de usuário.",
        "icon": "book"
      }
    ],
    "faq": [
      {
        "question": "Posso personalizar a aparência do sumário?",
        "answer": "Sim, você pode escolher entre diferentes estilos, fontes e layouts para o seu sumário."
      },
      {
        "question": "Onde o sumário é inserido?",
        "answer": "Por padrão, o sumário é inserido no início do documento, mas você pode escolher uma localização diferente."
      },
      {
        "question": "As entradas do sumário são clicáveis?",
        "answer": "Sim, cada entrada é um link clicável que navega para a página correspondente."
      }
    ]
  },
  "page-numbers": {
    "title": "Números de Página",
    "metaDescription": "Adicione números de página a documentos PDF. Personalize posição, formato e número inicial.",
    "keywords": [
      "adicionar numeros de pagina",
      "numeros de pagina pdf",
      "numerar paginas pdf",
      "paginacao de pdf"
    ],
    "description": "\n      <p>A ferramenta Números de Página adiciona numeração de página personalizável aos seus documentos PDF. Escolha entre vários formatos, posições e estilos para combinar com o design do seu documento.</p>\n      <p>Você pode definir o número inicial, pular certas páginas e usar diferentes formatos de numeração (1, 2, 3 ou i, ii, iii). Perfeito para criar documentos profissionais com paginação adequada.</p>\n      <p>Todo o processamento ocorre localmente no seu navegador, garantindo que seus documentos permaneçam privados.</p>\n    ",
    "howToUse": [
      {
        "step": 1,
        "title": "Carregar seu PDF",
        "description": "Arraste e solte seu arquivo PDF ou clique para selecionar o documento."
      },
      {
        "step": 2,
        "title": "Configurar Numeração",
        "description": "Escolha posição, formato, número inicial e quais páginas numerar."
      },
      {
        "step": 3,
        "title": "Aplicar e Baixar",
        "description": "Clique em Aplicar para adicionar números de página e baixar o PDF atualizado."
      }
    ],
    "useCases": [
      {
        "title": "Documentos Profissionais",
        "description": "Adicione números de página a relatórios, propostas e documentos comerciais.",
        "icon": "file-text"
      },
      {
        "title": "Trabalhos Acadêmicos",
        "description": "Numere as páginas de acordo com os requisitos de formatação acadêmica.",
        "icon": "graduation-cap"
      },
      {
        "title": "Documentos Jurídicos",
        "description": "Adicione paginação adequada a contratos e petições judiciais.",
        "icon": "scale"
      }
    ],
    "faq": [
      {
        "question": "Posso pular a primeira página?",
        "answer": "Sim, você pode especificar quais páginas numerar e quais pular, como páginas de título ou capas."
      },
      {
        "question": "Quais formatos de número estão disponíveis?",
        "answer": "Você pode usar algarismos arábicos (1, 2, 3), algarismos romanos (i, ii, iii ou I, II, III) ou letras (a, b, c)."
      },
      {
        "question": "Posso adicionar o formato \"Página X de Y\"?",
        "answer": "Sim, você pode incluir a contagem total de páginas no seu formato de numeração."
      }
    ]
  }
}

with open('d:/NextProject/pdfcraft/scratch/part2.json', 'w', encoding='utf-8') as f:
    json.dump(part2, f, ensure_ascii=False, indent=2)
