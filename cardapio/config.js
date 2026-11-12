window.CARDAPIO_CONFIG = {
  site: {
    nome: "VENEZA FUOCO",
    nomeCurto: "VENEZA FUOCO",
    tituloPagina: "Cardápio | VENEZA FUOCO",
    logo: "logo-marca-horizontal.png",
    favicon: "../favicon-veneza.png",
    slogan: "Tradição italiana, sabores que aproximam.",
    textoBoasVindas: "Seja bem-vindo",
    subtituloBoasVindas: "Escolha sua categoria e monte seu pedido com calma. O WhatsApp é o canal principal para concluir a compra.",
    tituloCardapio: "Cardápio VENEZA FUOCO",
    subtituloCardapio: "Pizzas artesanais. A tradição italiana em São Paulo.",
    cidadeResumo: "São Paulo - SP"
  },

  seo: {
    descricao: "Cardápio da VENEZA FUOCO em São Paulo. Escolha sua pizza, adicionais e finalize o pedido pelo WhatsApp.",
    robots: "index,follow",
    themeColor: "#080706"
  },

  tema: {
    gold: "#DDAF59",
    goldHover: "#F0CE86",
    darkBg: "#080706",
    cardBg: "#191411",
    textLight: "#FFF3D8",
    textMuted: "#C7B9A3",
    priceGreen: "#90C89D",
    whatsappGreen: "#25D366",
    ifoodRed: "#ea1d2c",
    dochefPurple: "#7b1fa2",
    fontePrincipal: "'Montserrat', sans-serif",
    fonteTitulos: "'Cormorant Garamond', Georgia, serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap"
  },

  botoes: {
    voltarSite: "← Voltar para o site",
    voltarCategorias: "← Voltar para categorias",
    prepararPizza: "Montar pedido",
    adicionarCarrinho: "Adicionar ao pedido",
    finalizarPedido: "Finalizar pelo WhatsApp",
    abrirCarrinho: "Ver pedido",
    continuarComprando: "Continuar escolhendo",
    esvaziarCarrinho: "Esvaziar pedido",
    ifood: "Continuar no iFood",
    dochef: "Continuar no Dochef"
  },

  links: {
    sitePrincipal: "../index.html",
    instagram: "https://www.instagram.com/venezafuoco/",
    ifood: "https://www.ifood.com.br/delivery/cianorte-pr/sr-ofrelio---pizza-house-centro/00c2b64a-5d8b-423d-b87d-c7ec87d9e7d6?UTM_Medium=share",
    dochef: "https://app.entregadochef.com/cianorte/srofrelio",
    googleMaps: "https://www.google.com/maps/place/Avenida+Brigadeiro+Faria+Lima,+1461/@-23.5581665,-46.6625583,17z/"
  },

  contato: {
    whatsapp: "5511916072188",
    whatsappExibicao: "(11) 91607-2188"
  },

  endereco: {
    texto: "Avenida Brigadeiro Faria Lima, 1461 — São Paulo, SP",
    rua: "Avenida Brigadeiro Faria Lima, 1461",
    cidade: "São Paulo",
    estado: "SP",
    cep: "",
    latitude: -23.5581665,
    longitude: -46.6625583,
    googleMaps: "https://www.google.com/maps/place/Avenida+Brigadeiro+Faria+Lima,+1461/@-23.5581665,-46.6625583,17z/"
  },

  /* Mesma estrutura de horários do site principal. Copie o mesmo bloco para os dois projetos. */
  horarios: {
    timezone: "America/Sao_Paulo",
    preAtendimentoInicio: "10:00",
    preAtendimentoFim: "18:59",
    abertoInicio: "19:00",
    abertoFim: "22:59",
    fechadoInicio: "23:00",
    fechadoFim: "09:59",
    horaTeste: "",
    dataTeste: "",
    diasFuncionamento: {
      domingo: true,
      segunda: false,
      terca: true,
      quarta: true,
      quinta: true,
      sexta: true,
      sabado: true
    },
    excecoesFuncionamento: [],
    textoFooter: ""
  },

  textosEstado: {
    aberto: {
      status: "Aberto agora",
      explicacao: "Pedidos disponíveis para entrega ou retirada.",
      acao: "Finalizar pelo WhatsApp"
    },
    preAtendimento: {
      status: "Pré-atendimento",
      explicacao: "Você pode montar o pedido agora e agendar para a abertura.",
      acao: "Agendar para hoje no WhatsApp"
    },
    fechado: {
      status: "Fechado no momento",
      explicacao: "Monte seu pedido e envie como agendamento para o próximo atendimento.",
      acao: "Agendar pedido no WhatsApp"
    }
  },

  checkout: {
    whatsappPrincipal: true,
    exigirNome: true,
    exigirFormaAtendimento: true,
    exigirEnderecoNaEntrega: true,
    exigirPagamento: true,
    permitirRetirada: true,
    tiposAtendimento: [
      { id: "entrega", nome: "Entrega" },
      { id: "retirada", nome: "Retirada no balcão" }
    ],
    pagamentos: ["PIX", "Dinheiro", "Cartão na entrega/retirada"],
    pedirTrocoQuandoDinheiro: true,
    chaveLocalStorage: "sr-ofrelio-cardapio-v2",
    observacaoTotal: "Total estimado. Taxas de entrega, quando aplicáveis, podem ser confirmadas no atendimento."
  },

  canaisPedido: [
    { id: "whatsapp", nome: "WhatsApp", ativo: true, principal: true },
    { id: "ifood", nome: "iFood", ativo: true, principal: false },
    { id: "dochef", nome: "Dochef", ativo: true, principal: false }
  ],

  integracoes: {
    whatsapp: "5511916072188",
    n8nAtivo: false,
    n8nWebhook: "https://SEU-N8N.com/webhook/pedido-pizza",
    googleAppsScriptAtivo: false,
    googleAppsScript: "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec",
    ifoodUrl: "https://www.ifood.com.br/",
    dochefUrl: "https://app.entregadochef.com/cianorte/srofrelio"
  },

  secoes: {
    canaisPedido: true,
    categorias: true,
    rodape: true,
    upsells: true,
    carrinho: true,
    statusLoja: true
  },

  categorias: [
    { nome: "Pizzas Tradicionais", ativo: true, destaque: true },
    { nome: "Pizzas Doces", ativo: true, destaque: false },
    { nome: "Pizzas Vegetarianas", ativo: true, destaque: false }
  ],

  upsells: [
    { id: "coca2l", nome: "Coca-Cola 2L", preco: 14 },
    { id: "borda", nome: "Borda recheada", preco: 12 },
    { id: "sobremesa", nome: "Pizza doce pequena", preco: 25 },
    { id: "guarana", nome: "Guaraná 2L", preco: 12 }
  ],

  /* Oferta adicional exibida no carrinho. Ajuste estes campos para administrar a promoção. */
  upsellCarrinho: {
    ativo: true,
    produtoId: "sensacao",
    percentualDesconto: 10
  },

  pizzas: [
    {
      id: "bufala",
      categoria: "Pizzas Tradicionais",
      nome: "Muçarela de Búfala com Tomate",
      descricao: "Muçarela de búfala, tomate fresco, molho artesanal e manjericão.",
      preco: 65,
      imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9tJrTW_zdSrwDkMDU4e9LZx1FR4AAHD6htBudqVJmB1ja1IO1T7pkb3h1&s=10",
      tamanho: "Grande",
      pedacos: 8,
      serve: "2 a 3 pessoas",
      selo: "",
      ativo: true,
      upsells: ["coca2l", "borda", "sobremesa"]
    },
    {
      id: "calabresa",
      categoria: "Pizzas Tradicionais",
      nome: "Calabresa Especial",
      descricao: "Calabresa fatiada, cebola, muçarela, molho da casa e orégano.",
      preco: 55,
      imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVpOgnXc4l04gycW894vLtXevx3WSHVlkqVKN6c_-aJkEJssvkmPlfMR-w&s=10",
      tamanho: "Grande",
      pedacos: 8,
      serve: "2 a 3 pessoas",
      selo: "🔥 Mais pedida",
      ativo: true,
      upsells: ["coca2l", "guarana", "borda"]
    },
    {
      id: "sensacao",
      categoria: "Pizzas Doces",
      nome: "Pizza Sensação",
      descricao: "Chocolate ao leite, morangos frescos e um toque de leite condensado.",
      preco: 50,
      imagem: "https://media-cdn.tripadvisor.com/media/photo-s/0e/1f/02/c9/pizza-sensacao.jpg",
      tamanho: "Grande",
      pedacos: 8,
      serve: "2 a 3 pessoas",
      selo: "",
      ativo: true,
      upsells: ["coca2l", "guarana"]
    },
    {
      id: "brigadeiro",
      categoria: "Pizzas Doces",
      nome: "Pizza Brigadeiro",
      descricao: "Chocolate cremoso com brigadeiro e granulado, finalizado com leite condensado.",
      preco: 50,
      imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5LJXWGeD920CdeSgpVuTEQl8d-8dVePP5sRiHXZAnfbgfsyIlaHehnMs&s=10",
      tamanho: "Grande",
      pedacos: 8,
      serve: "2 a 3 pessoas",
      selo: "🍫 Doce",
      ativo: true,
      upsells: ["coca2l", "guarana"]
    },
    {
      id: "veganissima",
      categoria: "Pizzas Vegetarianas",
      nome: "Veganíssima Ofrélio",
      descricao: "Mix de cogumelos, pimentões assados, brócolis, cebola roxa e queijo vegano artesanal.",
      preco: 70,
      imagem: "https://cdn.shopify.com/s/files/1/0191/9978/files/Pizza-Veggie-Supreme-blog.jpg?v=1652775259",
      tamanho: "Grande",
      pedacos: 8,
      serve: "2 a 3 pessoas",
      selo: "🌱 Vegetariana",
      ativo: true,
      upsells: ["guarana"]
    }
  ]
};
