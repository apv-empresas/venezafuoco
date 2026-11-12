window.CARDAPIO_CONFIG = {
  site: {
    nome: "Sr. Ofrélio Pizza House",
    nomeCurto: "Sr. Ofrélio",
    tituloPagina: "Cardápio | Sr. Ofrélio Pizza House",
    logo: "logo.png",
    favicon: "logo.png",
    slogan: "Sabor que ilumina, energia que conecta e momentos que ficam pra sempre.",
    textoBoasVindas: "Seja bem-vindo",
    subtituloBoasVindas: "Escolha sua categoria e monte seu pedido com calma. O WhatsApp é o canal principal para concluir a compra.",
    tituloCardapio: "Cardápio Sr. Ofrélio",
    subtituloCardapio: "Pizzas artesanais. O verdadeiro sabor de Cianorte.",
    cidadeResumo: "Cianorte - PR"
  },

  seo: {
    descricao: "Cardápio da Sr. Ofrélio Pizza House em Cianorte. Escolha sua pizza, adicionais e finalize o pedido pelo WhatsApp.",
    robots: "index,follow",
    themeColor: "#183321"
  },

  tema: {
    gold: "#d6b779",
    goldHover: "#e6c88b",
    darkBg: "#183321",
    cardBg: "#21402a",
    textLight: "#f4ecd8",
    textMuted: "#b8c4bc",
    priceGreen: "#2ecc71",
    whatsappGreen: "#25D366",
    ifoodRed: "#ea1d2c",
    aiqfomePurple: "#7b1fa2",
    fontePrincipal: "'Montserrat', sans-serif",
    fonteTitulos: "'Oswald', sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Oswald:wght@400;600;700&display=swap"
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
    aiqfome: "Continuar no aiqfome"
  },

  links: {
    sitePrincipal: "https://example.com/?destino=site-proprio",
    instagram: "https://www.instagram.com/sr.ofrelio/",
    ifood: "https://www.ifood.com.br/delivery/cianorte-pr/sr-ofrelio---pizza-house-centro/00c2b64a-5d8b-423d-b87d-c7ec87d9e7d6?UTM_Medium=share",
    aiqfome: "https://example.com/?destino=aiqfome",
    googleMaps: "https://www.google.com/maps/place/sr+ofrelio/data=!4m2!3m1!1s0x94ed5b007fb6c6a9:0x114feadf11b52e56?sa=X&ved=1t:242&ictx=111"
  },

  contato: {
    whatsapp: "5544988011991",
    whatsappExibicao: "(44) 98801-1991"
  },

  endereco: {
    texto: "Av. Brasil, 604 - Centro, Cianorte - PR, 87200-167",
    rua: "Av. Brasil, 604 - Centro",
    cidade: "Cianorte",
    estado: "PR",
    cep: "87200-167",
    latitude: -23.6563203,
    longitude: -52.6052691,
    googleMaps: "https://www.google.com/maps?q=Sr.%20Ofr%C3%A9lio%20Pizza%20House%2C%20Av.%20Brasil%2C%20604%20-%20Centro%2C%20Cianorte%20-%20PR%2C%2087200-167"
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
    { id: "aiqfome", nome: "aiqfome", ativo: true, principal: false }
  ],

  integracoes: {
    whatsapp: "5544988011991",
    n8nAtivo: false,
    n8nWebhook: "https://SEU-N8N.com/webhook/pedido-pizza",
    googleAppsScriptAtivo: false,
    googleAppsScript: "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec",
    ifoodUrl: "https://www.ifood.com.br/",
    aiqfomeUrl: "https://example.com/?destino=aiqfome"
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
