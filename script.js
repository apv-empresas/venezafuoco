"use strict";

const APP = window.SITE_CONFIG || {};

const DEFAULT_CONFIG = {
    marca: {
        nome: "",
        nomeCurto: "",
        slogan: "",
        segmento: "",
        logoPrincipal: "",
        logoFavicon: "",
    },
    seo: {
        titulo: "",
        descricao: "",
        palavrasChave: "",
        imagemSocial: "",
        tipoNegocio: "Restaurant",
        cozinha: "",
        faixaPreco: ""
    },
    cores: {},
    botoes: {
        coresTexto: {}
    },
    tipografia: {},
    contato: {
        whatsappNumero: "",
        telefoneExibicao: "",
        telefoneReserva: "",
        telefoneEventos: "",
        mensagens: {
            saudacao: "",
            pedido: "",
            reserva: "",
            agendamentoHoje: "",
            agendamentoAmanha: ""
        }
    },
    links: {
        cardapio: "#",
        siteProprio: "#",
        ifood: "#",
        aiqfome: "#",
        instagram: "#",
        facebook: "#",
        googleMapsRota: "#"
    },
    modais: {
        comercial: {
            ativo: true,
            modoSemModal: "botoes",
            quandoDesativado: "whatsapp",
            canaisPadrao: ["whatsapp", "ifood", "aiqfome"]
        },
        qualificador: {
            ativo: true,
            quandoDesativado: "whatsapp"
        },
        eventos: {
            ativo: true,
            quandoDesativado: "whatsapp"
        },
        roleta: {
            ativo: true
        }
    },
    iconesCanais: {},
    endereco: {},
    horarios: {
        timezone: "America/Sao_Paulo",
        preAtendimentoInicio: "",
        preAtendimentoFim: "",
        abertoInicio: "",
        abertoFim: "",
        fechadoInicio: "",
        fechadoFim: "",
        textoFooter: "",
        horaTeste: "",
        dataTeste: "",
        diasFuncionamento: null,
        excecoesFuncionamento: []
    },
    topBar: {
        ativo: false,
        texto: ""
    },
    promocoes: {
        topBar: {
            ativo: false,
            texto: ""
        },
        popups: {
            ativo: true,
            atrasoMs: 22000,
            percentualRolagem: 0.6,
            produtosVisualizados: 2,
            intervaloHoras: 18,
            antecedenciaRodizioDias: 1,
            tipos: {
                sugestao: true,
                promocao: true,
                rodizio: true
            }
        }
    },
    destaqueSemanal: {
        ativo: false,
        modoExibicao: "automatico",
        diaSemana: "quinta",
        selo: "",
        titulo: "",
        destaque: "",
        texto: "",
        linhas: [],
        imagem: "",
        imagemAlt: "",
        cta: {
            ativo: false,
            texto: "",
            tipo: "whatsapp",
            url: "",
            mensagem: ""
        }
    },
    hero: {
        videoSrc: "",
        videoType: "auto",
        poster: "",
        titulo: "",
        subtitulo: "",
        promocao: ""
    },
    telaAbertura: {
        ativo: false,
        logo: "",
        textoSuperior: "",
        titulo: "",
        subtitulo: "",
        textoRodape: "",
        imagem: { ativo: false, src: "", alt: "" },
        video: { ativo: false, src: "", poster: "" },
        audio: {
            ativo: false,
            src: "",
            volume: 0.35,
            autoplay: false,
            loop: true,
            textoAtivar: "Ativar som",
            textoDesativar: "Desativar som"
        },
        tema: {},
        botoes: []
    },
    barraEstrategica: {
        canais: [],
        botaoAgendarHoje: "",
        botaoAgendarAmanha: ""
    },
    sugestaoChef: {
        ativo: false,
        tituloSecao: "",
        badge: "",
        produto: "",
        preco: "",
        texto: "",
        imagemCard: "",
        imagemModal: "",
        adicionalNome: "",
        adicionalPreco: "",
        adicionalImagem: ""
    },
    produtos: [],
    reels: [],
    depoimentos: [],
    eventos: {
        telefoneDestino: "",
        configuracaoFormulario: {
            mostrarHorarioEmTodos: true,
            horarioObrigatorioEmTodos: false,
            horarioObrigatorioReserva: true
        },
        reserva: {},
        aniversario: { minPessoas: 10, descontoPct: 15 },
        confraternizacao: { minPessoas: 20, descontoPct: 20 },
        tiposConfraternizacao: []
    },
    roleta: {
        ativo: false,
        abrirAutomaticamente: false,
        tempoParaAbrirMs: 0,
        titulo: "",
        subtitulo: "",
        botaoGirar: "",
        chaveLocalStorage: "",
        prefixoVoucher: "",
        textoSorteando: "",
        textoPremio: "",
        premios: []
    },
    automacoes: {
        n8nAtivo: false,
        appScriptAtivo: false,
        urlN8N: "",
        urlAppScript: "",
        enviarReservas: true,
        enviarRoleta: true,
        enviarPedidos: false
    },
    textosEstado: {
        aberto: {
            status: "",
            botaoHeader: "",
            botaoProduto: "",
            tituloBarra: "",
            subtituloBarra: "",
            sugestaoTexto: ""
        },
        fechado: {
            status: "",
            botaoHeader: "",
            botaoProduto: "",
            tituloBarra: "",
            subtituloBarra: "",
            sugestaoTexto: ""
        },
        preAtendimento: {
            status: "",
            botaoHeader: "",
            botaoProduto: "",
            tituloBarra: "",
            subtituloBarra: "",
            sugestaoTexto: ""
        }
    },
    textosSecoes: {},
    localizacao: {},
    formulario: {
        horarioOpcionalTexto: "",
        horarioPadraoTexto: "",
        observacoesPadraoTexto: "",
        atendimentoTitulo: "",
        mensagensEvento: {}
    },
    footer: {}
};

let CONFIG = deepMerge(DEFAULT_CONFIG, APP);
let idiomaAtual = obterIdiomaInicial();

let estadoGlobalLoja = -1;
let contextoGlobalHorario = null;
let tipoEventoAtual = "";
let roletaGirando = false;
let temporizadorSomRoleta = null;
let contextoAudioRoleta = null;
const DURACAO_GIRO_ROLETA_MS = 8000;
let ultimoElementoFocadoAntesDoModal = null;
let observadorVideosReels = null;
let contadorProdutosVisualizados = 0;
let popupProductsObserver = null;
let popupTriggerReached = false;
let tipoPopupAtual = null;

function deepMerge(base, extra) {
    const output = clonarConfiguracao(base);

    if (!extra || typeof extra !== "object") return output;

    Object.keys(extra).forEach(key => {
        const baseValue = output[key];
        const extraValue = extra[key];

        if (
            baseValue &&
            extraValue &&
            typeof baseValue === "object" &&
            typeof extraValue === "object" &&
            !Array.isArray(baseValue) &&
            !Array.isArray(extraValue)
        ) {
            output[key] = deepMerge(baseValue, extraValue);
        } else {
            output[key] = clonarConfiguracao(extraValue);
        }
    });
    return output;
}

function obterIdiomaInicial() {
    const idiomas = ["pt", "en", "es"];
    const idiomaUrl = new URLSearchParams(window.location.search).get("lang");
    if (idiomas.includes(idiomaUrl)) return idiomaUrl;

    try {
        const idiomaSalvo = window.localStorage.getItem("sr-ofrelio-language");
        return idiomas.includes(idiomaSalvo) ? idiomaSalvo : "pt";
    } catch (erro) {
        console.warn("[Idioma] Não foi possível ler a preferência salva:", erro);
        return "pt";
    }
}

function obterRotuloIdioma(idioma = idiomaAtual) {
    return window.SITE_TRANSLATIONS?.ui?.[idioma] || window.SITE_TRANSLATIONS?.ui?.pt || {};
}

function textoIdioma(chave, fallback = "") {
    return obterRotuloIdioma()[chave] || fallback;
}

function clonarConfiguracao(valor) {
    if (Array.isArray(valor)) return valor.map(clonarConfiguracao);
    if (valor && typeof valor === "object") {
        return Object.fromEntries(
            Object.entries(valor).map(([chave, item]) => [chave, clonarConfiguracao(item)])
        );
    }
    return valor;
}

function formatarDataExibicao(valor) {
    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor || ""));
    if (!partes) return valor;
    const data = new Date(Date.UTC(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3])));
    const locais = { pt: "pt-BR", en: "en-US", es: "es-ES" };
    return new Intl.DateTimeFormat(locais[idiomaAtual], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC"
    }).format(data);
}

function aplicarTraducoesConfiguracao(configuracao, traducoes) {
    Object.entries(traducoes || {}).forEach(([caminho, valor]) => {
        const partes = caminho.split(".");
        let destino = configuracao;
        for (const parte of partes.slice(0, -1)) {
            if (destino?.[parte] === undefined) return;
            destino = destino[parte];
        }
        const chave = partes[partes.length - 1];
        if (destino && Object.prototype.hasOwnProperty.call(destino, chave)) {
            destino[chave] = valor;
        }
    });
    return configuracao;
}

function montarConfiguracaoIdioma(idioma) {
    const base = deepMerge(DEFAULT_CONFIG, APP);
    return aplicarTraducoesConfiguracao(
        base,
        window.SITE_TRANSLATIONS?.config?.[idioma]
    );
}

function urlCardapioComIdioma(url) {
    const valor = String(url || "").trim();
    if (!valor || valor === "#") return valor || "#";

    try {
        const destino = new URL(valor, window.location.href);
        const cardapio = new URL(CONFIG.links?.cardapio || "", window.location.href);
        if (destino.origin === cardapio.origin && destino.pathname === cardapio.pathname) {
            destino.searchParams.set("lang", idiomaAtual);
            return destino.href;
        }
        return valor;
    } catch (erro) {
        console.warn("[Idioma] Não foi possível acrescentar o idioma ao link:", erro);
        return valor;
    }
}

function idiomaAlterado(idioma) {
    if (!["pt", "en", "es"].includes(idioma) || idioma === idiomaAtual) return;
    idiomaAtual = idioma;

    try {
        window.localStorage.setItem("sr-ofrelio-language", idiomaAtual);
    } catch (erro) {
        console.warn("[Idioma] Não foi possível salvar a preferência de idioma:", erro);
    }

    try {
        const urlAtual = new URL(window.location.href);
        if (urlAtual.searchParams.has("lang")) {
            urlAtual.searchParams.set("lang", idiomaAtual);
            window.history.replaceState(window.history.state, "", urlAtual.href);
        }
    } catch (erro) {
        console.warn("[Idioma] Não foi possível atualizar o idioma no endereço da página:", erro);
    }

    CONFIG = montarConfiguracaoIdioma(idiomaAtual);
    document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : idiomaAtual;
    aplicarIdiomaInterface();
    aplicarConfiguracoesGlobais();
    renderizarTudo();
    sincronizarInterfaceComEstado(obterEstadoOperacionalAtual());
    atualizarTelaAberturaIdioma();
    if (tipoPopupAtual) preencherPopupPromocional(tipoPopupAtual);
    atualizarCarrinhoSite();
}

function montarBotoesIdioma(seletor) {
    const alvo = document.querySelector(seletor);
    if (!alvo) return;
    alvo.innerHTML = "";

    const idiomas = [
        { id: "pt", nome: "Português", bandeira: '<circle cx="12" cy="12" r="12" fill="#159447"/><path d="M3 12 12 5l9 7-9 7z" fill="#ffdf00"/><circle cx="12" cy="12" r="4.2" fill="#2454a4"/>' },
        { id: "en", nome: "English", bandeira: '<circle cx="12" cy="12" r="12" fill="#fff"/><path d="M1 4h22M1 8h22M1 12h22M1 16h22M1 20h22" stroke="#c8102e" stroke-width="2"/><path d="M2 3h10v9H2z" fill="#012169"/><path d="m2 3 10 9m0-9L2 12" stroke="#fff" stroke-width="2"/><path d="m2 3 10 9m0-9L2 12" stroke="#c8102e" stroke-width=".8"/><path d="M7 3v9M2 7.5h10" stroke="#fff" stroke-width="3"/><path d="M7 3v9M2 7.5h10" stroke="#c8102e" stroke-width="1.4"/>' },
        { id: "es", nome: "Español", bandeira: '<circle cx="12" cy="12" r="12" fill="#aa151b"/><path d="M1 8h22v8H1z" fill="#f1bf00"/>' }
    ];

    idiomas.forEach(({ id, nome, bandeira }) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "language-option";
        botao.dataset.language = id;
        botao.setAttribute("aria-label", nome);
        botao.setAttribute("aria-pressed", String(id === idiomaAtual));
        botao.title = nome;
        botao.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><clipPath id="flag-${seletor.replace(/[^a-z0-9]/gi, "")}-${id}"><circle cx="12" cy="12" r="12"/></clipPath></defs><g clip-path="url(#flag-${seletor.replace(/[^a-z0-9]/gi, "")}-${id})">${bandeira}</g></svg><span>${id.toUpperCase()}</span>`;
        botao.addEventListener("click", () => idiomaAlterado(id));
        alvo.appendChild(botao);
    });
}

function aplicarIdiomaInterface() {
    const ui = obterRotuloIdioma();
    document.querySelectorAll("[data-i18n]").forEach(elemento => {
        const texto = ui[elemento.dataset.i18n];
        if (!texto) return;
        if (elemento.id === "opening-enter") {
            elemento.innerHTML = `${sanitizeText(texto)} <span aria-hidden="true">↓</span>`;
        } else {
            elemento.textContent = texto;
        }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(elemento => {
        const texto = ui[elemento.dataset.i18nAria];
        if (texto) elemento.setAttribute("aria-label", texto);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(elemento => {
        const texto = ui[elemento.dataset.i18nTitle];
        if (texto) elemento.title = texto;
    });

    document.querySelectorAll(".language-switcher").forEach(seletor => {
        seletor.setAttribute("aria-label", ui.chooseLanguage || "Select language");
        const classe = Array.from(seletor.classList).find(nome => nome.startsWith("language-switcher-"));
        if (classe) montarBotoesIdioma(`.${classe}`);
    });
    document.querySelectorAll(".language-option").forEach(botao => {
        botao.setAttribute("aria-pressed", String(botao.dataset.language === idiomaAtual));
    });
    const toggle = byId("mobile-menu-toggle");
    const menu = byId("mobile-menu");
    if (toggle) {
        const chave = menu && !menu.hidden ? "closeMenu" : "openMenu";
        toggle.setAttribute("aria-label", ui[chave] || "Open menu");
    }
    const brandLink = document.querySelector(".opening-brand");
    if (brandLink) brandLink.setAttribute("aria-label", ui.openingBrand || "Go to the site");
    const selectedDate = document.querySelector("#evData");
    if (selectedDate) selectedDate.setAttribute("lang", idiomaAtual);
}

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function byId(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const el = byId(id);
    if (el) el.innerText = value || "";
}

function setHTML(id, value) {
    const el = byId(id);
    if (el) el.innerHTML = value || "";
}

function setHref(id, value) {
    const el = byId(id);
    if (el) {
        const href = value || "#";
        el.href = id.includes("cardapio") ? urlCardapioComIdioma(href) : href;
    }
}

function setSrc(id, value) {
    const el = byId(id);
    if (!el) return;

    if (value) {
        el.src = value;
    } else {
        el.removeAttribute("src");
    }
}

function setMetaContent(id, value) {
    const el = byId(id);
    if (!el) return;

    const texto = String(value || "").trim();
    if (texto) {
        el.setAttribute("content", texto);
    } else {
        el.removeAttribute("content");
    }
}

function urlConfiguradaValida(url) {
    const valor = String(url || "").trim();
    if (!valor || valor === "#") return false;

    try {
        const parsed = new URL(valor, window.location?.href || "https://example.com/");
        return ["http:", "https:"].includes(parsed.protocol);
    } catch (_) {
        return false;
    }
}

function obterMensagemContato(chave) {
    return CONFIG.contato?.mensagens?.[chave] || "";
}

function preencherModelo(texto, valores = {}) {
    return String(texto || "").replace(/\{(\w+)\}/g, (_, chave) => valores[chave] ?? "");
}

function sanitizeText(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function sanitizeAttr(value) {
    return sanitizeText(value).replaceAll("`", "");
}

function gerarLinkWpp(mensagem, numeroPersonalizado) {
    const numero = String(numeroPersonalizado || CONFIG.contato.whatsappNumero || "").replace(/\D/g, "");
    const texto = encodeURIComponent(mensagem || obterMensagemContato("saudacao"));
    return `https://wa.me/${numero}?text=${texto}`;
}

function abrirLink(url) {
    if (!url || url === "#") return;
    window.open(url, "_blank", "noopener,noreferrer");
}

function modalEstaAtivo(nome) {
    return CONFIG.modais?.[nome]?.ativo !== false;
}

function obterAcaoModalDesativado(nome, padrao = "whatsapp") {
    return CONFIG.modais?.[nome]?.quandoDesativado || padrao;
}

function abrirDestinoExterno(acao, mensagem, linkExterno = "", numeroPersonalizado = "") {
    if (acao === "ifood" && CONFIG.links.ifood && CONFIG.links.ifood !== "#") {
        abrirLink(CONFIG.links.ifood);
        return;
    }

    if (acao === "cardapio" && CONFIG.links.cardapio && CONFIG.links.cardapio !== "#") {
        abrirLink(urlCardapioComIdioma(CONFIG.links.cardapio));
        return;
    }

    if (acao === "siteProprio" && CONFIG.links.siteProprio && CONFIG.links.siteProprio !== "#") {
        abrirLink(CONFIG.links.siteProprio);
        return;
    }

    if (acao === "linkExterno" && linkExterno && linkExterno !== "#") {
        abrirLink(linkExterno);
        return;
    }

    abrirLink(gerarLinkWpp(mensagem, numeroPersonalizado));
}

function modoBotoesSemModalAtivo() {
    return !modalEstaAtivo("comercial") && (CONFIG.modais?.comercial?.modoSemModal || "botoes") === "botoes";
}

function obterEstadoLojaCalculado() {
    return obterContextoHorarioOperacional().estado;
}

function obterEstadoOperacionalAtual() {
    return estadoGlobalLoja === -1 ? obterEstadoLojaCalculado() : estadoGlobalLoja;
}

function montarMensagemPedidoDireto(nome, origem, mensagemPersonalizada = "") {
    if (mensagemPersonalizada) return mensagemPersonalizada;
    const estado = obterEstadoOperacionalAtual();
    const tipoMensagem = estado === 1 ? "pedido" : estado === 2 ? "agendamentoAmanha" : "agendamentoHoje";
    const origens = {
        "Produto": idiomaAtual === "en" ? "Product" : idiomaAtual === "es" ? "Producto" : "Produto",
        "Sugestão do Chef": idiomaAtual === "en" ? "Chef's Pick" : idiomaAtual === "es" ? "Recomendación del chef" : "Sugestão do Chef",
        "Reels": "Reels",
        "Site": idiomaAtual === "en" ? "Website" : idiomaAtual === "es" ? "Sitio web" : "Site"
    };
    return preencherModelo(obterMensagemContato(tipoMensagem), { origem: origens[origem] || origem, nome });
}

function obterTextoCanal(tipo, texto, compacto = false) {
    if (texto) return texto;

    const mapaCompleto = {
        whatsapp: CONFIG.botoes?.textos?.canalWhatsapp || "",
        wpp: CONFIG.botoes?.textos?.canalWhatsapp || "",
        ifood: CONFIG.botoes?.textos?.canalIfood || "",
        aiqfome: CONFIG.botoes?.textos?.canalAiqfome || "",
        cardapio: CONFIG.botoes?.textos?.canalCardapio || "",
        site: CONFIG.botoes?.textos?.canalSite || "",
        siteProprio: CONFIG.botoes?.textos?.canalSite || "",
        link: CONFIG.botoes?.textos?.canalPedir || "",
        externo: CONFIG.botoes?.textos?.canalPedir || ""
    };

    const mapaCompacto = {
        whatsapp: CONFIG.botoes?.textos?.canalWhatsapp || "",
        wpp: CONFIG.botoes?.textos?.canalWhatsapp || "",
        ifood: CONFIG.botoes?.textos?.canalIfood || "",
        aiqfome: CONFIG.botoes?.textos?.canalAiqfome || "",
        cardapio: CONFIG.botoes?.textos?.canalCardapio || "",
        site: CONFIG.botoes?.textos?.canalSite || "",
        siteProprio: CONFIG.botoes?.textos?.canalSite || "",
        link: CONFIG.botoes?.textos?.canalPedir || "",
        externo: CONFIG.botoes?.textos?.canalPedir || ""
    };

    const mapa = compacto ? mapaCompacto : mapaCompleto;
    return mapa[tipo] || "Pedir";
}

function normalizarCanalPedido(canal) {
    if (typeof canal === "string") {
        return { tipo: canal, texto: obterTextoCanal(canal) };
    }

    if (!canal || typeof canal !== "object") return null;

    const tipo = canal.tipo || canal.nome || "link";

    return {
        ...canal,
        tipo,
        texto: canal.texto || obterTextoCanal(tipo),
        textoCurto: canal.textoCurto || obterTextoCanal(tipo, "", true)
    };
}

function obterUrlPadraoDoCanal(tipo) {
    if (tipo === "ifood") return CONFIG.links.ifood || "#";
    if (tipo === "aiqfome") return CONFIG.links.aiqfome || "#";
    if (tipo === "cardapio") return urlCardapioComIdioma(CONFIG.links.cardapio || "#");
    if (tipo === "site" || tipo === "siteProprio") return CONFIG.links.siteProprio || "#";
    return "#";
}

function canalTemDestinoValido(canal) {
    if (!canal) return false;

    const tipo = canal.tipo || "link";

    if (tipo === "whatsapp" || tipo === "wpp" || tipo === "wa") return true;

    const url = canal.url || canal.link || obterUrlPadraoDoCanal(tipo);
    return Boolean(url && url !== "#");
}

function obterCanaisPedido(item = {}) {
    const canaisDoItem = Array.isArray(item.canais) ? item.canais : [];
    const canaisBase = canaisDoItem.length
        ? canaisDoItem
        : (Array.isArray(CONFIG.modais?.comercial?.canaisPadrao) ? CONFIG.modais.comercial.canaisPadrao : ["whatsapp"]);

    return canaisBase
        .map(normalizarCanalPedido)
        .filter(canalTemDestinoValido);
}

function montarBotoesCanaisPedido(item = {}, origem = "Site", contexto = "produto") {
    const canais = obterCanaisPedido(item);

    if (!canais.length) {
        return `<span class="action-link dynamic-action-btn">${sanitizeText(CONFIG.textosEstado.aberto.botaoProduto)}</span>`;
    }

    const classeGrupo = contexto === "reel" ? "reel-channel-buttons" : contexto === "sugestao" ? "suggestion-channel-buttons" : "product-channel-buttons";
    const compacto = contexto === "reel";

    const botoes = canais.map(canal => {
        const tipo = canal.tipo || "link";
        const texto = compacto ? (canal.textoCurto || canal.texto || obterTextoCanal(tipo, "", true)) : (canal.texto || obterTextoCanal(tipo));
        const url = canal.url || canal.link || obterUrlPadraoDoCanal(tipo);
        const mensagem = canal.mensagem || item.mensagem || "";
        const numero = canal.numero || canal.whatsappNumero || "";
        const classeCanal = sanitizeAttr(String(tipo).toLowerCase());

        return `
            <a
                href="#"
                class="channel-order-btn channel-${classeCanal}"
                target="_blank"
                rel="noopener noreferrer"
                onclick="abrirCanalPedido(event, this)"
                data-canal-tipo="${sanitizeAttr(tipo)}"
                data-canal-url="${sanitizeAttr(url)}"
                data-canal-mensagem="${sanitizeAttr(mensagem)}"
                data-canal-numero="${sanitizeAttr(numero)}"
                data-item-nome="${sanitizeAttr(item.nome || item.produto || item.titulo || "Produto")}" 
                data-item-origem="${sanitizeAttr(origem)}"
            >${sanitizeText(texto)}</a>
        `;
    }).join("");

    return `<div class="${classeGrupo}">${botoes}</div>`;
}

function resolverUrlCanalPedido(tipo, url, mensagem, numeroPersonalizado) {
    const canal = String(tipo || "").trim();
    const destinoInformado = String(url || "").trim();

    if (canal === "whatsapp" || canal === "wpp" || canal === "wa") {
        return gerarLinkWpp(mensagem, numeroPersonalizado);
    }

    if (canal === "ifood") return destinoInformado && destinoInformado !== "#" ? destinoInformado : CONFIG.links.ifood;
    if (canal === "aiqfome") return destinoInformado && destinoInformado !== "#" ? destinoInformado : CONFIG.links.aiqfome;
    if (canal === "cardapio") return urlCardapioComIdioma(destinoInformado && destinoInformado !== "#" ? destinoInformado : CONFIG.links.cardapio);
    if (canal === "site" || canal === "siteProprio") return destinoInformado && destinoInformado !== "#" ? destinoInformado : CONFIG.links.siteProprio;
    if (canal === "link" || canal === "externo" || canal === "linkExterno") return destinoInformado;

    return destinoInformado || gerarLinkWpp(mensagem, numeroPersonalizado);
}

function abrirCanalPedido(event, botao) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!botao) return;

    const tipo = botao.dataset.canalTipo || "whatsapp";
    const url = botao.dataset.canalUrl || "";
    const nome = botao.dataset.itemNome || "Produto";
    const origem = botao.dataset.itemOrigem || "Site";
    const mensagemBase = botao.dataset.canalMensagem || "";
    const numero = botao.dataset.canalNumero || "";
    const mensagem = montarMensagemPedidoDireto(nome, origem, mensagemBase);
    const destino = resolverUrlCanalPedido(tipo, url, mensagem, numero);

    if (!destino || destino === "#") {
        abrirLink(gerarLinkWpp(mensagem, numero));
        return;
    }

    abrirLink(destino);

    if (CONFIG.automacoes.enviarPedidos) {
        dispararWebhookCondicional("pedido_canal", {
            origem,
            produto: nome,
            canal: tipo,
            destino,
            estado_loja: obterEstadoOperacionalAtual(),
            data_envio: new Date().toISOString()
        });
    }
}

function aplicarConfiguracoesGlobais() {
    aplicarCores();
    aplicarCoresTextoBotoes();
    aplicarTipografia();
    aplicarMetaTags();
    aplicarMarca();
    aplicarTopBar();
    aplicarHero();
    aplicarLinksFixos();
    aplicarLocalizacao();
    aplicarFooter();
    aplicarSchemaRestaurant();
    aplicarConteudoConfiguravel();
    aplicarDestaqueSemanal();
}

function configurarTelaAbertura() {
    const tela = byId("opening-screen");
    const cfg = CONFIG.telaAbertura || {};
    if (!tela || cfg.ativo !== true) return false;

    const tema = cfg.tema || {};
    const variaveisTema = {
        "--opening-accent": tema.corDestaque,
        "--opening-text": tema.corTexto,
        "--opening-text-muted": tema.corTextoSecundario,
        "--opening-font": tema.fonte,
        "--opening-title-size": tema.tamanhoTitulo,
        "--opening-bg": tema.fundo,
        "--opening-glass": tema.vidro,
        "--opening-border": tema.borda,
        "--opening-shadow": tema.sombra,
        "--opening-blur": tema.blur,
        "--opening-radius": tema.raio,
        "--opening-duration": tema.duracao
    };
    Object.entries(variaveisTema).forEach(([nome, valor]) => {
        if (valor) tela.style.setProperty(nome, valor);
    });

    const logo = byId("opening-logo");
    const imagem = cfg.imagem || {};
    const videoCfg = cfg.video || {};
    const audioCfg = cfg.audio || {};

    if (logo && cfg.logo) {
        logo.src = cfg.logo;
        logo.alt = CONFIG.marca.nome ? `Logo ${CONFIG.marca.nome}` : "";
    } else if (logo) {
        logo.hidden = true;
        logo.removeAttribute("src");
    }
    setText("opening-brand-name", CONFIG.marca.nomeCurto || CONFIG.marca.nome);
    setText("opening-eyebrow", cfg.textoSuperior);
    setText("opening-title", cfg.titulo || CONFIG.hero?.titulo || CONFIG.marca.nome);
    setText("opening-subtitle", cfg.subtitulo || CONFIG.hero?.subtitulo || CONFIG.marca.slogan);
    setText("opening-footer-text", cfg.textoRodape);

    const backdropImage = byId("opening-image");
    if (backdropImage && imagem.ativo && imagem.src) {
        backdropImage.src = imagem.src;
        backdropImage.alt = imagem.alt || "";
    } else if (backdropImage) {
        backdropImage.hidden = true;
        backdropImage.removeAttribute("src");
    }

    const backdropVideo = byId("opening-video");
    if (backdropVideo && videoCfg.ativo && videoCfg.src) {
        backdropVideo.src = videoCfg.src;
        if (videoCfg.poster) backdropVideo.poster = videoCfg.poster;
        backdropVideo.addEventListener("error", () => {
            backdropVideo.hidden = true;
            setText("opening-media-status", textoIdioma("videoLoadError"));
        }, { once: true });
        backdropVideo.play().catch(() => {
            backdropVideo.hidden = true;
            setText("opening-media-status", textoIdioma("videoPlayError"));
        });
    } else if (backdropVideo) {
        backdropVideo.hidden = true;
    }

    atualizarAcoesTelaAbertura();

    const audio = byId("opening-audio");
    const soundButton = byId("opening-sound");
    if (audio && soundButton && audioCfg.ativo && audioCfg.src) {
        audio.src = audioCfg.src;
        audio.volume = Math.min(1, Math.max(0, Number(audioCfg.volume ?? 0.35)));
        audio.loop = audioCfg.loop !== false;
        soundButton.hidden = false;
        atualizarBotaoSom(false);
        soundButton.addEventListener("click", alternarSomTelaAbertura);
        audio.addEventListener("error", () => {
            soundButton.disabled = true;
            soundButton.textContent = textoIdioma("audioUnavailable");
            setText("opening-media-status", textoIdioma("audioLoadError"));
        }, { once: true });

        if (audioCfg.autoplay === true) {
            audio.play().then(() => {
                atualizarBotaoSom(true);
            }).catch(() => {
                soundButton.textContent = audioCfg.textoAtivar || "Ativar som";
                setText("opening-media-status", textoIdioma("audioAutoplayBlocked"));
            });
        }
    } else if (soundButton) {
        soundButton.hidden = true;
    }

    tela.hidden = false;
    tela.classList.add("is-visible");
    document.body.classList.add("opening-screen-active");
    document.addEventListener("keydown", tratarTeclaTelaAbertura);
    byId("opening-enter")?.addEventListener("click", fecharTelaAbertura);
    byId("opening-brand-name")?.closest("a")?.addEventListener("click", fecharTelaAbertura);
    const focarPrimeiraAcao = () => {
        if (!tela.hidden) {
            tela.querySelector(".opening-action, .opening-enter, .opening-sound")?.focus({ preventScroll: true });
        }
    };
    if (document.readyState === "complete") focarPrimeiraAcao();
    else window.addEventListener("load", focarPrimeiraAcao, { once: true });
    return true;
}

function atualizarAcoesTelaAbertura() {
    const actions = byId("opening-actions");
    if (!actions) return;
    actions.innerHTML = "";
    const buttonItems = Array.isArray(CONFIG.telaAbertura?.botoes) ? CONFIG.telaAbertura.botoes : [];

    buttonItems.filter(item => item && item.texto && item.url).forEach(item => {
        const link = document.createElement("a");
        link.className = "opening-action";
        link.href = urlCardapioComIdioma(item.url);
        try {
            const url = new URL(link.href, window.location.href);
            if (url.hostname === "wa.me") {
                url.searchParams.set("text", obterMensagemContato("pedido"));
                link.href = url.href;
            }
        } catch (erro) {
            console.warn("[Idioma] Não foi possível preparar o link de pedido:", erro);
        }
        link.target = item.alvo === "_blank" ? "_blank" : "_self";
        if (link.target === "_blank") link.rel = "noopener noreferrer";
        const icon = document.createElement("span");
        icon.className = "opening-action-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.icone || "↗";

        const copy = document.createElement("span");
        copy.className = "opening-action-copy";
        const title = document.createElement("strong");
        title.textContent = item.texto;
        const description = document.createElement("small");
        description.textContent = item.descricao || "";
        copy.append(title, description);
        link.append(icon, copy);
        link.addEventListener("click", fecharTelaAbertura);
        actions.appendChild(link);
    });
}

function atualizarTelaAberturaIdioma() {
    const cfg = CONFIG.telaAbertura || {};
    const imagem = byId("opening-image");
    setText("opening-brand-name", CONFIG.marca.nomeCurto || CONFIG.marca.nome);
    setText("opening-eyebrow", cfg.textoSuperior);
    setText("opening-title", cfg.titulo || CONFIG.hero?.titulo || CONFIG.marca.nome);
    setText("opening-subtitle", cfg.subtitulo || CONFIG.hero?.subtitulo || CONFIG.marca.slogan);
    setText("opening-footer-text", cfg.textoRodape);
    if (imagem) imagem.alt = cfg.imagem?.alt || "";
    const logo = byId("opening-logo");
    if (logo) logo.alt = CONFIG.marca.nome ? `Logo ${CONFIG.marca.nome}` : "";
    atualizarAcoesTelaAbertura();
    atualizarBotaoSom(Boolean(byId("opening-audio") && !byId("opening-audio").paused));
}

function atualizarBotaoSom(estaTocando) {
    const soundButton = byId("opening-sound");
    const audioCfg = CONFIG.telaAbertura?.audio || {};
    if (!soundButton) return;
    soundButton.textContent = estaTocando
        ? (audioCfg.textoDesativar || "Desativar som")
        : (audioCfg.textoAtivar || "Ativar som");
    soundButton.setAttribute("aria-pressed", String(estaTocando));
}

function alternarSomTelaAbertura() {
    const audio = byId("opening-audio");
    if (!audio) return;
    if (!audio.paused) {
        audio.pause();
        atualizarBotaoSom(false);
        return;
    }
    audio.play().then(() => {
        atualizarBotaoSom(true);
        setText("opening-media-status", "");
    }).catch(() => {
        setText("opening-media-status", textoIdioma("audioPlayError"));
    });
}

function fecharTelaAbertura(event) {
    const tela = byId("opening-screen");
    if (!tela || tela.hidden || tela.classList.contains("is-leaving")) return;
    const link = event?.currentTarget instanceof HTMLAnchorElement ? event.currentTarget : null;
    const destinoInterno = link?.getAttribute("href")?.startsWith("#")
        ? link.getAttribute("href")
        : "";
    if (destinoInterno) event.preventDefault();
    tela.classList.add("is-leaving");
    const audio = byId("opening-audio");
    if (audio && !audio.paused) audio.pause();

    window.setTimeout(() => {
        tela.hidden = true;
        tela.classList.remove("is-visible", "is-leaving");
        document.body.classList.remove("opening-screen-active");
        if (destinoInterno) {
            window.location.hash = destinoInterno;
        }
        inicializarVideoCabecalho();
        byId("btn-header-cardapio")?.focus({ preventScroll: true });
    }, Number.parseFloat(getComputedStyle(tela).getPropertyValue("--opening-duration")) || 650);
}

function tratarTeclaTelaAbertura(event) {
    const tela = byId("opening-screen");
    if (!tela || tela.hidden) return;
    if (event.key === "Escape") {
        fecharTelaAbertura();
        return;
    }
    if (event.key !== "Tab") return;

    const elementosFocaveis = Array.from(tela.querySelectorAll(
        'a[href]:not([hidden]), button:not([hidden]):not(:disabled)'
    ));
    if (!elementosFocaveis.length) return;

    const primeiro = elementosFocaveis[0];
    const ultimo = elementosFocaveis[elementosFocaveis.length - 1];
    if (!elementosFocaveis.includes(document.activeElement)) {
        event.preventDefault();
        primeiro.focus();
    } else if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
    }
}

function aplicarConteudoConfiguravel() {
    const textos = CONFIG.textosSecoes || {};
    const botoes = CONFIG.botoes?.textos || {};
    const modais = CONFIG.modais?.textos || {};
    const formulario = CONFIG.formulario || {};

    setHTML("testimonials-title", textos.depoimentosTitulo);
    setText("testimonials-subtitle", textos.depoimentosSubtitulo);
    setHTML("reels-title", preencherModelo(textos.reelsTitulo, { nome: CONFIG.marca.nomeCurto }));
    setText("reels-subtitle", textos.reelsSubtitulo);
    setHTML("products-section-title", textos.produtosTitulo);
    setText("products-section-subtitle", textos.produtosSubtitulo);
    setHTML("events-section-title", textos.eventosTitulo);
    setText("events-section-subtitle", textos.eventosSubtitulo);
    setText("hero-promo", CONFIG.hero?.promocao);

    setText("btn-header-cardapio", botoes.verCardapio);
    setText("btn-header-pedir", botoes.pedirAgora);
    setText("btn-google-route", CONFIG.localizacao?.textoBotao);
    setText("btn-qualifier-sugestao", botoes.receberSugestao);
    setText("btn-qualifier-cardapio", botoes.verCardapio);
    setText("modal-btn-wpp", botoes.concluirPedido);
    setText("modal-btn-sem-adicional", botoes.continuarSemAdicional);
    setText("modal-btn-ifood", botoes.pedirIfood);
    setText("event-submit-btn", botoes.enviarReserva);
    setText("premio-voucher-label", modais.voucherLabel);
    setText("btn-resgatar-roleta", botoes.resgatarRoleta);
    setText("footer-contact-title", formulario.atendimentoTitulo);
    document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : idiomaAtual;

    const ofertaEspecial = modais.ofertaEspecial || "";
    if (ofertaEspecial) {
        document.documentElement.style.setProperty("--upsell-label", `"${ofertaEspecial.replaceAll('"', '\\"')}"`);
    }

    const qualifierImage = byId("qualifier-img");
    if (qualifierImage) {
        qualifierImage.src = CONFIG.modais?.qualificador?.imagem || "";
        qualifierImage.alt = CONFIG.marca.nome ? `Destaque ${CONFIG.marca.nome}` : "";
    }

    const labels = {
        evNome: [formulario.nomeLabel, formulario.nomePlaceholder],
        evWpp: [formulario.whatsappLabel, formulario.whatsappPlaceholder],
        evData: [formulario.dataLabel, ""],
        evHora: [formulario.horarioLabel, ""],
        evPessoas: [formulario.pessoasLabel, formulario.pessoasPlaceholder],
        evTipo: [formulario.tipoEventoLabel, ""],
        evObs: [formulario.observacoesLabel, formulario.observacoesPlaceholder]
    };

    Object.entries(labels).forEach(([id, [labelText, placeholder]]) => {
        const field = byId(id);
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) label.innerText = labelText || "";
        if (field && placeholder !== undefined) field.placeholder = placeholder || "";
    });
}

function aplicarCoresTextoBotoes() {
    const root = document.documentElement;
    const cores = CONFIG.botoes?.coresTexto || {};

    const mapa = {
        "--btn-header-cardapio-text": cores.headerCardapio,
        "--btn-header-pedir-text": cores.headerPedir,
        "--btn-modal-whatsapp-text": cores.modalWhatsapp,
        "--btn-modal-ifood-text": cores.modalIfood,
        "--btn-continuar-sem-text": cores.continuarSemAdicional,
        "--btn-qualificador-whatsapp-text": cores.qualificadorWhatsapp,
        "--btn-qualificador-cardapio-text": cores.qualificadorCardapio,
        "--btn-rota-google-text": cores.rotaGoogleMaps,
        "--btn-footer-pedido-text": cores.footerPedido,
        "--btn-roleta-girar-text": cores.roletaGirar,
        "--btn-roleta-resgatar-text": cores.roletaResgatar,
        "--btn-evento-card-text": cores.eventoCard,
        "--btn-evento-card-hover-text": cores.eventoCardHover,
        "--btn-canal-whatsapp-text": cores.canalWhatsapp,
        "--btn-canal-ifood-text": cores.canalIfood,
        "--btn-canal-aiqfome-text": cores.canalAiqfome,
        "--btn-canal-cardapio-text": cores.canalCardapio,
        "--btn-canal-site-text": cores.canalSite,
        "--btn-reel-pedir-text": cores.reelPedir,
        "--btn-agendar-text": cores.agendar
    };

    Object.entries(mapa).forEach(([variavel, valor]) => {
        if (valor) root.style.setProperty(variavel, valor);
    });
}

function aplicarCores() {
    const root = document.documentElement;
    const cores = CONFIG.cores || {};

    const mapa = {
        "--gold": cores.gold,
        "--gold-hover": cores.goldHover,
        "--price-green": cores.priceGreen,
        "--dark-bg": cores.darkBg,
        "--card-bg": cores.cardBg,
        "--text-light": cores.textLight,
        "--text-muted": cores.textMuted,
        "--whatsapp-green": cores.whatsappGreen,
        "--ifood-red": cores.ifoodRed,
        "--aiqfome-purple": cores.aiqfomePurple
    };

    Object.entries(mapa).forEach(([variavel, valor]) => {
        if (valor) root.style.setProperty(variavel, valor);
    });
}

function aplicarTipografia() {
    const root = document.documentElement;

    if (CONFIG.tipografia?.fontePrincipal) {
        root.style.setProperty("--font-main", CONFIG.tipografia.fontePrincipal);
    }

    if (CONFIG.tipografia?.fonteTitulos) {
        root.style.setProperty("--font-title", CONFIG.tipografia.fonteTitulos);
    }

    const googleFonts = byId("google-fonts-link");
    if (googleFonts && CONFIG.tipografia?.googleFontsUrl) {
        googleFonts.href = CONFIG.tipografia.googleFontsUrl;
    }
}

function aplicarMetaTags() {
    const titulo = CONFIG.seo?.titulo || CONFIG.marca.nome || "";
    const descricao = CONFIG.seo?.descricao || "";
    const imagemSocial = CONFIG.seo?.imagemSocial || CONFIG.marca.logoPrincipal || "";
    const urlCanonica = String(CONFIG.seo?.url || "").trim();

    document.title = titulo;

    const favicon = byId("page-favicon");
    if (favicon && CONFIG.marca.logoFavicon) favicon.href = CONFIG.marca.logoFavicon;

    setMetaContent("meta-description", descricao);
    setMetaContent("meta-keywords", CONFIG.seo?.palavrasChave || "");
    setMetaContent("meta-robots", CONFIG.seo?.robots || "index,follow");
    setMetaContent("theme-color", CONFIG.cores?.darkBg || "");
    setMetaContent("og-title", titulo);
    setMetaContent("og-description", descricao);
    setMetaContent("og-image", imagemSocial);
    setMetaContent("og-type", "website");
    setMetaContent("og-locale", CONFIG.seo?.locale || "pt_BR");
    setMetaContent("twitter-card", "summary_large_image");

    const canonical = byId("canonical-link");
    if (canonical) {
        if (urlConfiguradaValida(urlCanonica)) canonical.href = urlCanonica;
        else canonical.removeAttribute("href");
    }

    if (urlConfiguradaValida(urlCanonica)) setMetaContent("og-url", urlCanonica);
    else setMetaContent("og-url", "");
}

function aplicarMarca() {
    setText("brand-name-header", CONFIG.marca.nome);
    setText("hero-title", CONFIG.hero.titulo || CONFIG.marca.nomeCurto);
    setText("hero-subtitle", CONFIG.hero.subtitulo || CONFIG.marca.slogan);
    setText("footer-brand-name", CONFIG.marca.nomeCurto || CONFIG.marca.nome);
    setText("footer-brand-slogan", CONFIG.marca.slogan);

    const logo = byId("brand-logo");
    if (logo) {
        logo.src = CONFIG.marca.logoPrincipal || "";
        logo.alt = `Logo ${CONFIG.marca.nome || "da empresa"}`;
    }
}

function aplicarTopBar() {
    const topBar = byId("top-bar");
    if (!topBar) return;

    const promocao = CONFIG.promocoes?.topBar || CONFIG.topBar || {};

    if (promocao.ativo === false) {
        topBar.style.display = "none";
        return;
    }

    topBar.style.display = "block";
    topBar.innerText = promocao.texto || "";
}

function aplicarHero() {
    const holder = byId("hero-video-holder");
    if (!holder) return;

    holder.dataset.heroVideoSrc = CONFIG.hero.videoSrc || "";
    holder.dataset.heroVideoType = CONFIG.hero.videoType || "auto";
}

function aplicarLinksFixos() {
    setHref("btn-header-cardapio", CONFIG.links.cardapio);
    setHref("btn-qualifier-cardapio", CONFIG.links.cardapio);
    setHref("modal-btn-ifood", CONFIG.links.ifood);

    setHref("footer-instagram", CONFIG.links.instagram);
    setHref("footer-facebook", CONFIG.links.facebook);
    setHref("footer-whatsapp", gerarLinkWpp(obterMensagemContato("saudacao")));
    setHref("footer-btn-pedido", gerarLinkWpp(obterMensagemContato("pedido")));

    const facebook = byId("footer-facebook");
    if (facebook && (!CONFIG.links.facebook || CONFIG.links.facebook === "#")) {
        facebook.style.display = "none";
    }
}

function aplicarLocalizacao() {
    setText("location-title", CONFIG.localizacao?.titulo);
    setText("location-subtitle", CONFIG.localizacao?.subtitulo);
    setText("location-card-title", CONFIG.localizacao?.tituloCard);

    const enderecoTexto = CONFIG.endereco.textoCompleto || [
        [CONFIG.endereco.rua, CONFIG.endereco.numero].filter(Boolean).join(", "),
        CONFIG.endereco.bairro,
        CONFIG.endereco.cidade,
        CONFIG.endereco.estado
    ].filter(Boolean).join(", ");

    setHTML("location-address", `📍 ${sanitizeText(enderecoTexto)}`);

    const mapa = byId("google-map-iframe");
    if (mapa && CONFIG.endereco.googleMapsEmbed) {
        mapa.src = CONFIG.endereco.googleMapsEmbed;
    }

    setHref("btn-google-route", CONFIG.links.googleMapsRota);
}

function obterDiasAtivosResumidos() {
    const dias = CONFIG.horarios?.diasFuncionamento;
    if (!dias || typeof dias !== "object") return "";

    const nomesDias = idiomaAtual === "en"
        ? [["segunda", "Mon"], ["terca", "Tue"], ["quarta", "Wed"], ["quinta", "Thu"], ["sexta", "Fri"], ["sabado", "Sat"], ["domingo", "Sun"]]
        : idiomaAtual === "es"
            ? [["segunda", "Lun"], ["terca", "Mar"], ["quarta", "Mié"], ["quinta", "Jue"], ["sexta", "Vie"], ["sabado", "Sáb"], ["domingo", "Dom"]]
            : [["segunda", "Seg"], ["terca", "Ter"], ["quarta", "Qua"], ["quinta", "Qui"], ["sexta", "Sex"], ["sabado", "Sáb"], ["domingo", "Dom"]];
    const ordem = nomesDias;
    const ativos = ordem.filter(([chave]) => dias[chave] === true);

    if (!ativos.length) return idiomaAtual === "en" ? "Closed every day" : idiomaAtual === "es" ? "Cerrado todos los días" : "Fechado todos os dias";
    if (ativos.length === 7) return idiomaAtual === "en" ? "Every day" : idiomaAtual === "es" ? "Todos los días" : "Todos os dias";

    const indices = ativos.map(([chave]) => ordem.findIndex(([nome]) => nome === chave));
    const sequencial = indices.every((valor, idx) => idx === 0 || valor === indices[idx - 1] + 1);

    if (sequencial && ativos.length >= 2) {
        return `${ativos[0][1]} a ${ativos[ativos.length - 1][1]}`;
    }

    return ativos.map(([, abreviado]) => abreviado).join(", ");
}

function obterTextoHorarioFooter() {
    const textoPersonalizado = String(CONFIG.horarios?.textoFooter || "").trim();
    if (textoPersonalizado) return textoPersonalizado;

    const dias = obterDiasAtivosResumidos();
    const inicio = CONFIG.horarios?.abertoInicio || "";
    const fim = CONFIG.horarios?.abertoFim || "";

    if (!inicio || !fim) return dias;
    const separator = idiomaAtual === "en" ? ", " : idiomaAtual === "es" ? ", de " : ", das ";
    const connector = idiomaAtual === "en" ? " to " : idiomaAtual === "es" ? " a " : " às ";
    return dias ? `${dias}${separator}${inicio}${connector}${fim}` : `${idiomaAtual === "en" ? "From " : idiomaAtual === "es" ? "De " : "Das "}${inicio}${connector}${fim}`;
}

function aplicarFooter() {
    setText("footer-rights", CONFIG.footer.textoDireitos || "");
    setText("footer-system-text", CONFIG.footer.textoSistema || "");
    setText("footer-line-1", CONFIG.endereco.textoCompleto ? `📍 ${CONFIG.endereco.textoCompleto}` : "");
    setText("footer-line-2", CONFIG.footer.atendimentoLinha2 || "");
    const horarioFooter = obterTextoHorarioFooter();
    setText("footer-line-3", horarioFooter ? `🕒 ${horarioFooter}` : "");
    setText("footer-btn-pedido", CONFIG.footer.botaoPedido || "");

    const navegacao = CONFIG.footer.navegacao || {};
    const experiencias = CONFIG.footer.experiencias || {};
    setText("footer-navigation-title", navegacao.titulo);
    setText("footer-link-pedido", navegacao.pedido);
    setText("footer-link-produtos", navegacao.produtos);
    setText("footer-link-eventos", navegacao.eventos);
    setText("footer-link-reels", navegacao.reels);
    setText("footer-link-localizacao", navegacao.localizacao);
    setText("footer-link-topo", navegacao.topo);
    setText("footer-experiencias-title", experiencias.titulo);
    setText("footer-link-reserva", experiencias.reserva);
    setText("footer-link-aniversario", experiencias.aniversario);
    setText("footer-link-confraternizacao", experiencias.confraternizacao);
}

function aplicarSchemaRestaurant() {
    const schema = byId("schema-restaurant");
    if (!schema) return;

    const data = {
        "@context": "https://schema.org",
        "@type": CONFIG.seo?.tipoNegocio || "Restaurant",
        name: CONFIG.marca.nome,
        image: CONFIG.seo?.imagemSocial || CONFIG.marca.logoPrincipal || "",
        address: {
            "@type": "PostalAddress",
            streetAddress: [CONFIG.endereco.rua, CONFIG.endereco.numero].filter(Boolean).join(", "),
            addressLocality: CONFIG.endereco.cidade || "",
            addressRegion: CONFIG.endereco.estado || "",
            postalCode: CONFIG.endereco.cep || "",
            addressCountry: CONFIG.endereco.pais || "BR"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: CONFIG.endereco.latitude ?? "",
            longitude: CONFIG.endereco.longitude ?? ""
        },
        servesCuisine: CONFIG.seo?.cozinha || CONFIG.marca.segmento || "",
        priceRange: CONFIG.seo?.faixaPreco || ""
    };

    if (CONFIG.contato?.whatsappNumero) {
        data.telephone = `+${String(CONFIG.contato.whatsappNumero).replace(/\D/g, "")}`;
    }

    if (urlConfiguradaValida(CONFIG.seo?.url)) data.url = CONFIG.seo.url;
    if (urlConfiguradaValida(CONFIG.links?.cardapio)) data.hasMenu = CONFIG.links.cardapio;

    const sameAs = ["instagram", "facebook"]
        .filter(chave => !CONFIG.linksProvisorios?.[chave])
        .map(chave => CONFIG.links?.[chave])
        .filter(urlConfiguradaValida);
    if (sameAs.length) data.sameAs = sameAs;

    const mapaDiasSchema = {
        segunda: "Monday",
        terca: "Tuesday",
        quarta: "Wednesday",
        quinta: "Thursday",
        sexta: "Friday",
        sabado: "Saturday",
        domingo: "Sunday"
    };

    const diasAtivos = Object.entries(CONFIG.horarios?.diasFuncionamento || {})
        .filter(([, ativo]) => ativo === true)
        .map(([dia]) => mapaDiasSchema[dia])
        .filter(Boolean);

    if (diasAtivos.length && CONFIG.horarios?.abertoInicio && CONFIG.horarios?.abertoFim) {
        data.openingHoursSpecification = [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: diasAtivos,
            opens: CONFIG.horarios.abertoInicio,
            closes: CONFIG.horarios.abertoFim
        }];
    }

    schema.textContent = JSON.stringify(data, null, 2);
}

function renderizarTudo() {
    renderizarSugestaoChef();
    renderizarDepoimentos();
    renderizarProdutos();
    renderizarReels();
    renderizarEventos();
    renderizarTiposEvento();
    renderizarRoletaVisual();
    aplicarDestaqueSemanal();
    observarProdutosVisualizados();
}

function renderizarSugestaoChef() {
    const secao = byId("suggestion-section");
    if (!secao) return;

    if (CONFIG.sugestaoChef?.ativo === false) {
        secao.style.display = "none";
        return;
    }

    secao.style.display = "block";

    setText("suggestion-section-title", CONFIG.sugestaoChef.tituloSecao);
    setText("suggestion-badge", CONFIG.sugestaoChef.badge);
    setText("suggestion-product-name", CONFIG.sugestaoChef.produto);
    setText("sugestao-texto", CONFIG.sugestaoChef.texto);

    const img = byId("suggestion-img");
    if (img) {
        img.src = CONFIG.sugestaoChef.imagemCard || "";
        img.alt = CONFIG.sugestaoChef.produto || "Sugestão do chef";
    }

    const card = byId("suggestion-card");
    const content = card ? card.querySelector(".suggestion-content") : null;

    if (content) {
        const botoesAntigos = content.querySelector(".suggestion-channel-buttons");
        if (botoesAntigos) botoesAntigos.remove();
    }

    const itemSugestao = {
        ...CONFIG.sugestaoChef,
        nome: CONFIG.sugestaoChef.produto,
        produto: CONFIG.sugestaoChef.produto
    };

    if (card) {
        if (modoBotoesSemModalAtivo()) {
            card.onclick = null;
            card.classList.add("no-modal-mode");

            if (content) {
                content.insertAdjacentHTML("beforeend", montarBotoesCanaisPedido(itemSugestao, "Sugestão do Chef", "sugestao"));
            }
        } else {
            card.classList.remove("no-modal-mode");
            card.onclick = function () {
                abrirModalComercial({
                    origem: "Sugestão do Chef",
                    nome: CONFIG.sugestaoChef.produto,
                    preco: CONFIG.sugestaoChef.preco || "Oferta",
                    imagem: CONFIG.sugestaoChef.imagemModal || CONFIG.sugestaoChef.imagemCard,
                    adicionalNome: CONFIG.sugestaoChef.adicionalNome || "",
                    adicionalPreco: CONFIG.sugestaoChef.adicionalPreco || "",
                    adicionalImagem: CONFIG.sugestaoChef.adicionalImagem || CONFIG.sugestaoChef.imagemCard,
                    linkExterno: CONFIG.sugestaoChef.linkExterno,
                    canais: CONFIG.sugestaoChef.canais
                });
            };
        }
    }
}

function renderizarDepoimentos() {
    const grid = byId("testimonial-grid");
    if (!grid) return;

    const depoimentos = Array.isArray(CONFIG.depoimentos) ? CONFIG.depoimentos : [];
    grid.innerHTML = "";

    depoimentos.forEach(item => {
        const card = document.createElement("div");
        card.className = "testimonial-card reveal";

        card.innerHTML = `
            <div class="testimonial-content">
                <p>"${sanitizeText(item.texto)}"</p>
            </div>
            <div class="testimonial-footer">
                <div class="testimonial-author">
                    <h4>${sanitizeText(item.nome)}</h4>
                    <span>${sanitizeText(item.tipo)}</span>
                </div>
                <div class="testimonial-stars">${sanitizeText(item.estrelas || "★★★★★")}</div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function renderizarProdutos() {
    const grid = byId("product-grid");
    if (!grid) return;

    const produtos = Array.isArray(CONFIG.produtos) ? CONFIG.produtos : [];
    grid.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "product-card reveal";

        const itemProduto = {
            ...produto,
            nome: produto.nome
        };

        if (modoBotoesSemModalAtivo()) {
            card.classList.add("no-modal-mode");
            card.onclick = null;
        } else {
            card.onclick = function () {
                abrirModalComercial({
                    origem: "Produto",
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem,
                    adicionalNome: produto.adicionalNome,
                    adicionalPreco: produto.adicionalPreco,
                    adicionalImagem: produto.adicionalImagem,
                    linkExterno: produto.linkExterno,
                    canais: produto.canais
                });
            };
        }

        const blocoAcao = modoBotoesSemModalAtivo()
            ? montarBotoesCanaisPedido(itemProduto, "Produto", "produto")
            : `<span class="action-link dynamic-action-btn">${sanitizeText(CONFIG.textosEstado.aberto.botaoProduto)}</span>`;

        card.innerHTML = `
            ${produto.badge ? `<div class="badge-bestseller">${sanitizeText(produto.badge)}</div>` : ""}
            <div class="product-img" style="background-image: url('${sanitizeAttr(produto.imagem)}');"></div>
            <div class="product-info">
                <h4>${sanitizeText(produto.nome)}</h4>
                <div class="price-elegant">${sanitizeText(produto.preco)}</div>
                ${blocoAcao}
            </div>
        `;

        grid.appendChild(card);
    });
}

function renderizarReels() {
    const track = byId("reels-track");
    if (!track) return;

    const reels = Array.isArray(CONFIG.reels) ? CONFIG.reels : [];
    track.innerHTML = "";

    reels.forEach(reel => {
        const card = document.createElement("div");
        card.className = "reel-card";

        card.dataset.videoSrc = reel.videoSrc || "";
        card.dataset.videoType = reel.videoType || "auto";
        card.dataset.videoPoster = reel.poster || "";

        const itemReel = {
            ...reel,
            nome: reel.titulo
        };

        if (modoBotoesSemModalAtivo()) {
            card.classList.add("no-modal-mode");
            card.onclick = null;
        } else {
            card.onclick = function () {
                abrirModalComercial({
                    origem: "Reels",
                    nome: reel.titulo,
                    preco: reel.preco,
                    imagem: reel.imagemModal || reel.poster || "",
                    adicionalNome: reel.adicionalNome || "",
                    adicionalPreco: reel.adicionalPreco || "",
                    adicionalImagem: reel.adicionalImagem || reel.imagemModal || reel.poster || "",
                    linkExterno: reel.linkExterno,
                    canais: reel.canais
                });
            };
        }

        const acaoReel = modoBotoesSemModalAtivo()
            ? montarBotoesCanaisPedido(itemReel, "Reels", "reel")
            : `<button class="btn-buy-mini" type="button" onclick="event.stopPropagation(); this.closest('.reel-card').click();">${sanitizeText(CONFIG.botoes?.textos?.reelPedir || "")}</button>`;

        card.innerHTML = `
            <div class="reel-video-frame"${reel.poster ? ` style="background-image: url('${sanitizeAttr(reel.poster)}'); background-size: cover; background-position: center;"` : ""}></div>
            <div class="reel-content">
                <div class="reel-info">
                    <h3>${sanitizeText(reel.titulo)}</h3>
                    <p>${sanitizeText(reel.preco)}</p>
                </div>
                <div class="reel-actions">
                    <button class="btn-like" type="button" onclick="toggleLike(event, this)">🤍</button>
                    ${acaoReel}
                </div>
            </div>
        `;

        track.appendChild(card);
    });

    inicializarVideosReels();
}

function renderizarEventos() {
    const grid = byId("events-grid");
    if (!grid) return;

    const eventos = [
        { tipo: "reserva", data: CONFIG.eventos.reserva },
        { tipo: "aniversario", data: CONFIG.eventos.aniversario },
        { tipo: "confraternizacao", data: CONFIG.eventos.confraternizacao }
    ];

    grid.innerHTML = "";

    eventos.forEach(evento => {
        const item = evento.data || {};
        const card = document.createElement("div");

        card.className = "event-card";
        card.onclick = function () {
            openEventModal(evento.tipo);
        };

        card.innerHTML = `
            <div class="event-img" style="background-image: url('${sanitizeAttr(item.imagem || "")}');"></div>
            <div class="event-info">
                <div>
                    <h3>${sanitizeText(item.cardTitulo || item.titulo || "")}</h3>
                    <p>${sanitizeText(item.cardTexto || "")}</p>
                </div>
                <span class="event-btn">${sanitizeText(item.botao || "")}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

function renderizarTiposEvento() {
    const select = byId("evTipo");
    if (!select) return;

    const tipos = Array.isArray(CONFIG.eventos.tiposConfraternizacao)
        ? CONFIG.eventos.tiposConfraternizacao
        : [];

    select.innerHTML = "";

    tipos.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.innerText = tipo;
        select.appendChild(option);
    });
}

function renderizarRoletaVisual() {
    setText("roleta-title", CONFIG.roleta.titulo);
    setText("roleta-subtitle", CONFIG.roleta.subtitulo);
    setText("btn-girar-roleta", CONFIG.roleta.botaoGirar);

    const roleta = byId("roleta");
    if (!roleta) return;

    const premios = Array.isArray(CONFIG.roleta.premios) ? CONFIG.roleta.premios : [];
    roleta.innerHTML = "";

    premios.forEach(premio => {
        const span = document.createElement("span");
        span.className = "slice-text";
        span.style.setProperty("--rot", `${premio.centro || 0}deg`);
        span.innerText = premio.nome || "";
        roleta.appendChild(span);
    });
}

function reveal() {
    const reveals = $all(".reveal");

    reveals.forEach(item => {
        const windowHeight = window.innerHeight;
        const elementTop = item.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            item.classList.add("active");
        }
    });
}

function converterParaMinutos(horaString) {
    if (typeof horaString !== "string" || !/^\d{2}:\d{2}$/.test(horaString)) return NaN;

    const [horas, minutos] = horaString.split(":").map(Number);
    if (horas > 23 || minutos > 59) return NaN;
    return (horas * 60) + minutos;
}

function formatarDataISO(ano, mes, dia) {
    return [ano, mes, dia].map((valor, indice) => String(valor).padStart(indice === 0 ? 4 : 2, "0")).join("-");
}

function analisarDataISO(data) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return null;

    const [ano, mes, dia] = data.split("-").map(Number);
    const objeto = new Date(Date.UTC(ano, mes - 1, dia));

    if (
        objeto.getUTCFullYear() !== ano ||
        objeto.getUTCMonth() !== mes - 1 ||
        objeto.getUTCDate() !== dia
    ) return null;

    return { data, diaSemanaNumero: objeto.getUTCDay() };
}

function obterDataHoraOperacional(configuracao = CONFIG, agora = new Date()) {
    const horarios = configuracao.horarios || {};
    const timezone = horarios.timezone || "America/Sao_Paulo";
    let dataReal;
    let horaReal;

    try {
        const partes = new Intl.DateTimeFormat("en-CA", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).formatToParts(agora);
        const valores = Object.fromEntries(partes.map(parte => [parte.type, parte.value]));
        dataReal = `${valores.year}-${valores.month}-${valores.day}`;
        horaReal = `${valores.hour === "24" ? "00" : valores.hour}:${valores.minute}`;
    } catch (erro) {
        console.warn("Não foi possível obter a data/hora no timezone configurado:", erro);
        dataReal = agora.toISOString().slice(0, 10);
        horaReal = `${String(agora.getUTCHours()).padStart(2, "0")}:${String(agora.getUTCMinutes()).padStart(2, "0")}`;
    }

    const dataInformada = horarios.dataTeste || "";
    const horaInformada = horarios.horaTeste || "";
    const dataValida = dataInformada ? analisarDataISO(dataInformada) : null;
    const horaValida = horaInformada ? converterParaMinutos(horaInformada) : NaN;
    const data = dataInformada && dataValida ? dataInformada : dataReal;
    const hora = horaInformada && Number.isInteger(horaValida) ? horaInformada : horaReal;
    const minutos = converterParaMinutos(hora);
    const dataAnalisada = analisarDataISO(data) || analisarDataISO(dataReal);
    const nomesDias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

    return {
        data,
        hora,
        minutos: Number.isInteger(minutos) ? minutos : 0,
        diaSemana: nomesDias[dataAnalisada?.diaSemanaNumero ?? 0],
        diaSemanaNumero: dataAnalisada?.diaSemanaNumero ?? 0,
        timezone,
        usandoHoraTeste: Boolean(horaInformada && Number.isInteger(horaValida)),
        usandoDataTeste: Boolean(dataInformada && dataValida)
    };
}

function validarHoraConfigurada(valor) {
    return typeof valor === "string" && /^\d{2}:\d{2}$/.test(valor) && Number.isInteger(converterParaMinutos(valor));
}

function validarConfiguracaoHorarios(configuracao = CONFIG, emitirAvisos = true) {
    const horarios = configuracao.horarios || {};
    const erros = [];
    const avisos = [];
    const camposPeriodo = [
        "preAtendimentoInicio", "preAtendimentoFim",
        "abertoInicio", "abertoFim",
        "fechadoInicio", "fechadoFim"
    ];

    camposPeriodo.forEach(campo => {
        if (!validarHoraConfigurada(horarios[campo])) erros.push(`Horário inválido ou ausente: horarios.${campo}`);
    });

    ["horaTeste"].forEach(campo => {
        if (horarios[campo] && !validarHoraConfigurada(horarios[campo])) erros.push(`Horário de teste inválido: horarios.${campo}`);
    });

    if (horarios.dataTeste && !analisarDataISO(horarios.dataTeste)) erros.push("Data de teste inválida: horarios.dataTeste");

    if (horarios.diasFuncionamento != null) {
        ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"].forEach(dia => {
            if (typeof horarios.diasFuncionamento[dia] !== "boolean") erros.push(`Dia de funcionamento inválido: ${dia}`);
        });
    }

    const excecoes = Array.isArray(horarios.excecoesFuncionamento) ? horarios.excecoesFuncionamento : [];
    excecoes.forEach((excecao, indice) => {
        if (!analisarDataISO(excecao?.data)) erros.push(`Data inválida na exceção ${indice + 1}`);
        const tipo = excecao?.tipo || (excecao?.fechado === true ? "fechado" : "");
        if (!["fechado", "horarioEspecial", "funcionamentoNormal"].includes(tipo)) erros.push(`Tipo de exceção inválido na exceção ${indice + 1}`);
        if (tipo === "horarioEspecial") {
            camposPeriodo.forEach(campo => {
                if (!validarHoraConfigurada(excecao?.horarios?.[campo])) erros.push(`Horário especial inválido na exceção ${indice + 1}: ${campo}`);
            });
        }
    });

    const periodos = camposPeriodo.every(campo => validarHoraConfigurada(horarios[campo]))
        ? [
            [converterParaMinutos(horarios.preAtendimentoInicio), converterParaMinutos(horarios.preAtendimentoFim)],
            [converterParaMinutos(horarios.abertoInicio), converterParaMinutos(horarios.abertoFim)],
            [converterParaMinutos(horarios.fechadoInicio), converterParaMinutos(horarios.fechadoFim)]
        ]
        : [];
    if (periodos.length) {
        const cobertura = Array(1440).fill(0);
        periodos.forEach(([inicio, fim]) => {
            for (let minuto = 0; minuto < 1440; minuto += 1) {
                if (horaEstaNoIntervalo(minuto, inicio, fim)) cobertura[minuto] += 1;
            }
        });
        if (cobertura.some(valor => valor > 1)) avisos.push("Existem períodos de horário sobrepostos.");
        if (cobertura.some(valor => valor === 0)) avisos.push("Existem minutos sem cobertura entre os períodos.");
    }

    if (emitirAvisos) {
        erros.forEach(erro => console.warn(`[Horários] ${erro}`));
        avisos.forEach(aviso => console.warn(`[Horários] ${aviso}`));
    }
    return { valido: erros.length === 0 && avisos.length === 0, erros, avisos };
}

function obterExcecaoFuncionamento(data, configuracao = CONFIG) {
    const excecoes = Array.isArray(configuracao.horarios?.excecoesFuncionamento)
        ? configuracao.horarios.excecoesFuncionamento
        : [];
    return excecoes.find(excecao => excecao?.data === data) || null;
}

function avaliarEstadoPorPeriodos(minutos, horarios) {
    const campos = [
        [3, "preAtendimento", horarios.preAtendimentoInicio, horarios.preAtendimentoFim],
        [1, "aberto", horarios.abertoInicio, horarios.abertoFim],
        [2, "fechado", horarios.fechadoInicio, horarios.fechadoFim]
    ];
    if (campos.some(([, , inicio, fim]) => !validarHoraConfigurada(inicio) || !validarHoraConfigurada(fim))) {
        return { estado: 2, chaveEstado: "fechado", motivo: "configuracao_invalida" };
    }

    const periodo = campos.find(([, , inicio, fim]) => horaEstaNoIntervalo(
        minutos,
        converterParaMinutos(inicio),
        converterParaMinutos(fim)
    ));
    if (!periodo) return { estado: 2, chaveEstado: "fechado", motivo: "configuracao_invalida" };
    return {
        estado: periodo[0],
        chaveEstado: periodo[1] === "preAtendimento" ? "preAtendimento" : periodo[1],
        motivo: `periodo_${periodo[1]}`
    };
}

function obterContextoHorarioOperacional(configuracao = CONFIG, agora = new Date()) {
    const dataHora = obterDataHoraOperacional(configuracao, agora);
    const horarios = configuracao.horarios || {};
    const validacao = validarConfiguracaoHorarios(configuracao, false);
    const excecao = obterExcecaoFuncionamento(dataHora.data, configuracao);
    const tipoExcecao = excecao?.tipo || (excecao?.fechado === true ? "fechado" : "");
    let resultado;

    // Prioridade: data/hora efetivas, exceção da data, dia semanal e período.
    if (!validacao.valido && (!excecao || tipoExcecao !== "horarioEspecial")) {
        resultado = { estado: 2, chaveEstado: "fechado", motivo: "configuracao_invalida" };
    } else if (tipoExcecao === "fechado") {
        resultado = { estado: 2, chaveEstado: "fechado", motivo: "feriado" };
    } else if (tipoExcecao === "horarioEspecial") {
        const especialValido = validarConfiguracaoHorarios({ horarios: excecao.horarios }, false).valido;
        resultado = especialValido
            ? avaliarEstadoPorPeriodos(dataHora.minutos, excecao.horarios)
            : { estado: 2, chaveEstado: "fechado", motivo: "configuracao_invalida" };
        if (resultado.motivo !== "configuracao_invalida") resultado.motivo = resultado.estado === 2 ? "periodo_fechado" : resultado.motivo;
    } else {
        const diaHabilitado = horarios.diasFuncionamento == null
            ? true
            : horarios.diasFuncionamento[dataHora.diaSemana] === true;
        const funcionamentoNormal = tipoExcecao === "funcionamentoNormal";
        if (!diaHabilitado && !funcionamentoNormal) {
            resultado = { estado: 2, chaveEstado: "fechado", motivo: "dia_nao_operacional" };
        } else {
            resultado = avaliarEstadoPorPeriodos(dataHora.minutos, horarios);
            if (resultado.estado === 2) resultado.motivo = "periodo_fechado";
        }
    }

    // Integração remota: modifica a origem do estado apenas no contexto operacional real.
    if (configuracao === CONFIG && resultado.motivo !== "configuracao_invalida") {
        const modoManual = window.SR_OFRELIO_OPERACAO?.modoAtual?.();
        const estadosManuais = {
            aberto: { estado: 1, chaveEstado: "aberto" },
            fechado: { estado: 2, chaveEstado: "fechado" },
            preAtendimento: { estado: 3, chaveEstado: "preAtendimento" }
        };
        if (Object.prototype.hasOwnProperty.call(estadosManuais, modoManual)) {
            resultado = { ...estadosManuais[modoManual], motivo: "controle_remoto" };
        }
    }

    return {
        ...dataHora,
        ...resultado,
        diaHabilitado: horarios.diasFuncionamento == null ? true : horarios.diasFuncionamento[dataHora.diaSemana] === true,
        diaPermitidoEfetivo: tipoExcecao === "funcionamentoNormal"
            ? true
            : (horarios.diasFuncionamento == null ? true : horarios.diasFuncionamento[dataHora.diaSemana] === true),
        excecao,
        mensagemExcecao: excecao?.mensagem || ""
    };
}

function obterHoraSegura() {
    return obterDataHoraOperacional().minutos;
}

function horaEstaNoIntervalo(horaAtual, horaInicio, horaFim) {
    if (horaInicio <= horaFim) {
        return horaAtual >= horaInicio && horaAtual <= horaFim;
    }

    return horaAtual >= horaInicio || horaAtual <= horaFim;
}

function verificarHorarioLoja() {
    const novoContexto = obterContextoHorarioOperacional();
    const assinaturaAnterior = contextoGlobalHorario
        ? `${contextoGlobalHorario.estado}|${contextoGlobalHorario.motivo}|${contextoGlobalHorario.data}|${contextoGlobalHorario.excecao?.data || ""}`
        : "";
    const assinaturaAtual = `${novoContexto.estado}|${novoContexto.motivo}|${novoContexto.data}|${novoContexto.excecao?.data || ""}`;

    if (assinaturaAnterior !== assinaturaAtual) {
        estadoGlobalLoja = novoContexto.estado;
        contextoGlobalHorario = novoContexto;
        sincronizarInterfaceComEstado(novoContexto.estado);
    }

    aplicarDestaqueSemanal();
}

function diagnosticarHorarioLoja() {
    const contexto = obterContextoHorarioOperacional();
    const nomesEstados = { 1: "ABERTO", 2: "FECHADO", 3: "PRÉ-ATENDIMENTO" };
    const diagnostico = {
        dataEfetiva: contexto.data,
        horaEfetiva: contexto.hora,
        timezone: contexto.timezone,
        dia: contexto.diaSemana,
        diaHabilitadoNaSemana: contexto.diaHabilitado ? "sim" : "não",
        diaPermitidoEfetivo: contexto.diaPermitidoEfetivo ? "sim" : "não",
        horaTeste: contexto.usandoHoraTeste ? "ativada" : "desativada",
        dataTeste: contexto.usandoDataTeste ? "ativada" : "desativada",
        excecaoEncontrada: contexto.excecao?.tipo || "nenhuma",
        mensagemExcecao: contexto.mensagemExcecao || "",
        estadoNumerico: contexto.estado,
        estado: nomesEstados[contexto.estado] || "FECHADO",
        motivo: contexto.motivo
    };

    console.group("=== DIAGNÓSTICO DE HORÁRIO ===");
    Object.entries(diagnostico).forEach(([chave, valor]) => console.log(`${chave}: ${valor}`));
    console.groupEnd();
    return diagnostico;
}

function executarTestesSistemaHorarios() {
    const base = JSON.parse(JSON.stringify(CONFIG));
    const resultados = [];

    const registrar = (nome, esperado, contexto) => {
        const passou = contexto.estado === esperado;
        resultados.push({ nome, esperado, obtido: contexto.estado, motivo: contexto.motivo, passou });

        console[passou ? "log" : "error"](
            `${passou ? "✅ PASSOU" : "❌ FALHOU"} ${nome}: esperado ${esperado}, obtido ${contexto.estado}`
        );
    };

    const testar = (nome, esperado, data, hora, ajustes = {}) => {
        const configuracao = JSON.parse(JSON.stringify(base));
        configuracao.horarios.dataTeste = data;
        configuracao.horarios.horaTeste = hora;
        Object.assign(configuracao.horarios, ajustes);

        registrar(nome, esperado, obterContextoHorarioOperacional(configuracao));
    };

    [
        ["09:58", 2], ["09:59", 2], ["10:00", 3], ["10:01", 3],
        ["18:58", 3], ["18:59", 3], ["19:00", 1], ["19:01", 1],
        ["22:58", 1], ["22:59", 1], ["23:00", 2], ["23:01", 2],
        ["23:59", 2], ["00:00", 2], ["00:01", 2]
    ].forEach(([hora, esperado]) => testar(`fronteira ${hora}`, esperado, "2026-09-24", hora));

    const diasParaTeste = [
        { dia: "segunda", data: "2026-09-21" },
        { dia: "terca", data: "2026-09-22" },
        { dia: "quarta", data: "2026-09-23" },
        { dia: "quinta", data: "2026-09-24" },
        { dia: "sexta", data: "2026-09-25" },
        { dia: "sabado", data: "2026-09-26" },
        { dia: "domingo", data: "2026-09-27" }
    ];

    diasParaTeste.forEach(({ dia, data }) => {
        const configuracaoDia = JSON.parse(JSON.stringify(base));
        const diaAberto = configuracaoDia.horarios.diasFuncionamento?.[dia] === true;
        const esperado = diaAberto ? 1 : 2;
        testar(`semana ${dia} às 20:00`, esperado, data, "20:00");
    });

    const quartaFechada = JSON.parse(JSON.stringify(base));
    quartaFechada.horarios.diasFuncionamento.quarta = false;
    testar("quarta configurada como fechada", 2, "2026-09-23", "20:00", {
        diasFuncionamento: quartaFechada.horarios.diasFuncionamento
    });

    testar("feriado fechado", 2, "2026-12-25", "20:00", {
        excecoesFuncionamento: [{
            data: "2026-12-25",
            tipo: "fechado",
            mensagem: "Teste de fechamento."
        }]
    });

    const horariosEspeciais = {
        preAtendimentoInicio: "10:00",
        preAtendimentoFim: "16:59",
        abertoInicio: "17:00",
        abertoFim: "20:59",
        fechadoInicio: "21:00",
        fechadoFim: "09:59"
    };

    [
        ["16:30", 3], ["17:30", 1], ["20:59", 1], ["21:00", 2], ["23:00", 2]
    ].forEach(([hora, esperado]) => testar(`horário especial ${hora}`, esperado, "2026-12-24", hora, {
        excecoesFuncionamento: [{
            data: "2026-12-24",
            tipo: "horarioEspecial",
            horarios: horariosEspeciais
        }]
    }));

    const domingoComExcecao = JSON.parse(JSON.stringify(base));
    domingoComExcecao.horarios.diasFuncionamento.domingo = false;
    domingoComExcecao.horarios.excecoesFuncionamento = [{
        data: "2026-10-11",
        tipo: "funcionamentoNormal"
    }];
    registrar(
        "funcionamento excepcional no domingo",
        1,
        obterContextoHorarioOperacional(
            domingoComExcecao,
            new Date("2026-10-11T20:00:00-03:00")
        )
    );

    const domingoSemExcecao = JSON.parse(JSON.stringify(base));
    domingoSemExcecao.horarios.diasFuncionamento.domingo = false;
    domingoSemExcecao.horarios.excecoesFuncionamento = [];
    registrar(
        "domingo sem exceção",
        2,
        obterContextoHorarioOperacional(
            domingoSemExcecao,
            new Date("2026-10-11T20:00:00-03:00")
        )
    );

    const somenteHora = JSON.parse(JSON.stringify(base));
    somenteHora.horarios.horaTeste = "20:00";
    somenteHora.horarios.dataTeste = "";
    registrar(
        "horaTeste isolada",
        1,
        obterContextoHorarioOperacional(
            somenteHora,
            new Date("2026-09-24T15:00:00-03:00")
        )
    );

    const somenteData = JSON.parse(JSON.stringify(base));
    somenteData.horarios.horaTeste = "";
    somenteData.horarios.dataTeste = "2026-09-27";
    const esperadoDataTeste = somenteData.horarios.diasFuncionamento?.domingo === true ? 1 : 2;
    registrar(
        "dataTeste isolada",
        esperadoDataTeste,
        obterContextoHorarioOperacional(
            somenteData,
            new Date("2026-09-24T20:00:00-03:00")
        )
    );

    testar("horaTeste e dataTeste combinados", 1, "2026-09-24", "20:00");

    const configuracaoMinutos = JSON.parse(JSON.stringify(base));
    configuracaoMinutos.horarios.dataTeste = "2026-09-24";
    let minutosInvalidos = 0;

    for (let minuto = 0; minuto < 1440; minuto += 1) {
        configuracaoMinutos.horarios.horaTeste =
            `${String(Math.floor(minuto / 60)).padStart(2, "0")}:${String(minuto % 60).padStart(2, "0")}`;

        if (![1, 2, 3].includes(obterContextoHorarioOperacional(configuracaoMinutos).estado)) {
            minutosInvalidos += 1;
        }
    }

    const passouMinutos = minutosInvalidos === 0;
    resultados.push({
        nome: "todos os 1440 minutos têm estado",
        esperado: 0,
        obtido: minutosInvalidos,
        motivo: "",
        passou: passouMinutos
    });

    console[passouMinutos ? "log" : "error"](
        `${passouMinutos ? "✅ PASSOU" : "❌ FALHOU"} todos os 1440 minutos têm estado`
    );

    const configuracaoInvalida = JSON.parse(JSON.stringify(base));
    configuracaoInvalida.horarios.abertoInicio = "40:99";

    const resultadoInvalido = obterContextoHorarioOperacional(
        configuracaoInvalida,
        new Date("2026-09-24T20:00:00-03:00")
    );

    const configuracaoFoiRejeitada =
        resultadoInvalido.estado === 2 &&
        resultadoInvalido.motivo === "configuracao_invalida";

    resultados.push({
        nome: "configuração inválida não é corrigida silenciosamente",
        esperado: 2,
        obtido: resultadoInvalido.estado,
        motivo: resultadoInvalido.motivo,
        passou: configuracaoFoiRejeitada
    });

    console[configuracaoFoiRejeitada ? "log" : "error"](
        `${configuracaoFoiRejeitada ? "✅ PASSOU" : "❌ FALHOU"} configuração inválida é rejeitada`
    );

    const falhas = resultados.filter(resultado => !resultado.passou).length;

    console.log(`=== HORÁRIOS: ${resultados.length - falhas}/${resultados.length} passaram ===`);

    return {
        passou: falhas === 0,
        total: resultados.length,
        falhas,
        resultados
    };
}

function obterTextosEstado(estado) {
    if (estado === 1) return CONFIG.textosEstado.aberto;
    if (estado === 3) return CONFIG.textosEstado.preAtendimento;
    return CONFIG.textosEstado.fechado;
}

function configurarBotaoPedidoPorEstado(botao, estado, textoAberto) {
    if (!botao) return;
    botao.innerText = estado === 1 ? textoAberto : obterTextosEstado(estado).botaoHeader;

    if (estado === 1) {
        botao.href = gerarLinkWpp(obterMensagemContato("pedido"));
        botao.onclick = null;
        botao.target = "_blank";
        botao.setAttribute("aria-disabled", "false");
        return;
    }

    botao.href = "#";
    botao.target = "";
    botao.setAttribute("aria-disabled", "false");
    botao.onclick = function (event) {
        event.preventDefault();
        openQualifierModal(estado === 2);
    };
}

function sincronizarInterfaceComEstado(estado) {
    const statusLoja = byId("status-loja");
    const btnHeaderPedir = byId("btn-header-pedir");
    const btnFooterPedir = byId("footer-btn-pedido");
    const stratContainer = byId("strategic-content");
    const botoesProdutos = $all(".dynamic-action-btn");
    const sugestaoTexto = byId("sugestao-texto");

    const textos = obterTextosEstado(estado);

    const cidadeEstado = [CONFIG.endereco.cidade, CONFIG.endereco.estado].filter(Boolean).join(" - ");

    if (statusLoja) {
        const cor = estado === 1
            ? "var(--price-green)"
            : estado === 2
                ? "var(--ifood-red)"
                : "var(--gold)";

        statusLoja.innerHTML = `<span style="color: ${cor};">${sanitizeText(textos.status)}</span> 📍 ${sanitizeText(cidadeEstado)}`;
    }

    configurarBotaoPedidoPorEstado(btnHeaderPedir, estado, textos.botaoHeader);
    configurarBotaoPedidoPorEstado(btnFooterPedir, estado, CONFIG.footer.botaoPedido || textos.botaoHeader);

    botoesProdutos.forEach(btn => {
        btn.innerText = textos.botaoProduto;
    });

    if (sugestaoTexto) {
        sugestaoTexto.innerText = textos.sugestaoTexto;
    }

    if (stratContainer) {
        stratContainer.innerHTML = montarBarraEstrategica(estado, textos);
    }

    if (tipoPopupAtual && byId("promoPopupModal")?.classList.contains("active")) {
        preencherPopupPromocional(tipoPopupAtual);
    }
}

function montarBarraEstrategica(estado, textos) {
    if (estado === 1) {
        const canais = Array.isArray(CONFIG.barraEstrategica?.canais)
            ? CONFIG.barraEstrategica.canais
            : [];
        const botoesCanais = canais.map(tipo => {
            const nomeCanal = obterTextoCanal(tipo);
            const destino = tipo === "whatsapp"
                ? gerarLinkWpp(obterMensagemContato("saudacao"))
                : obterUrlPadraoDoCanal(tipo);
            const icone = CONFIG.iconesCanais?.[tipo] || CONFIG.iconesCanais?.site || "";
            return montarBotaoRedondo(nomeCanal, destino, icone);
        }).join("");

        return `
            <div class="fade-in-content">
                <h2 class="strategic-title">${sanitizeText(textos.tituloBarra)}</h2>
                <p class="strategic-subtitle">${sanitizeText(textos.subtituloBarra)}</p>
                <div class="round-buttons-container">
                    ${botoesCanais}
                </div>
            </div>
        `;
    }

    if (estado === 3) {
        return `
            <div class="fade-in-content">
                <h2 class="strategic-title">${sanitizeText(textos.tituloBarra)}</h2>
                <p class="strategic-subtitle">${sanitizeText(textos.subtituloBarra)} ${sanitizeText(CONFIG.horarios.abertoInicio || "")}</p>
                <div class="strategic-buttons">
                    <a href="#" onclick="openQualifierModal(false); return false;" class="btn-strat btn-agendar">
                        ${sanitizeText(CONFIG.barraEstrategica?.botaoAgendarHoje || "")}
                    </a>
                </div>
            </div>
        `;
    }

    return `
        <div class="fade-in-content">
            <h2 class="strategic-title" style="color: var(--ifood-red);">${sanitizeText(textos.tituloBarra)}</h2>
            <p class="strategic-subtitle">${sanitizeText(textos.subtituloBarra)}</p>
            <div class="strategic-buttons">
                <a href="#" onclick="openQualifierModal(true); return false;" class="btn-strat btn-agendar">
                        ${sanitizeText(CONFIG.barraEstrategica?.botaoAgendarAmanha || "")}
                </a>
            </div>
        </div>
    `;
}

function montarBotaoRedondo(title, href, img) {
    if (!href || href === "#") return "";

    return `
        <a href="${sanitizeAttr(href)}" class="btn-round" target="_blank" rel="noopener noreferrer" title="${sanitizeText(title)}">
            <img src="${sanitizeAttr(img || "")}" alt="${sanitizeText(title)}">
        </a>
    `;
}

function abrirModalComercial(item) {
    const nome = item.nome || "";
    const preco = item.preco || "";
    const imagem = item.imagem || "";
    const adicionalNome = item.adicionalNome || "";
    const adicionalPreco = item.adicionalPreco || "";
    const adicionalImagem = item.adicionalImagem || imagem;
    const origem = item.origem || "Site";
    const linkExterno = item.linkExterno || "";

    if (!modalEstaAtivo("comercial")) {
        const mensagemDireta = montarMensagemPedidoDireto(nome, origem);

        const acao = obterAcaoModalDesativado("comercial", "whatsapp");
        abrirDestinoExterno(acao, mensagemDireta, linkExterno);

        if (CONFIG.automacoes.enviarPedidos) {
            dispararWebhookCondicional("pedido_direto", {
                origem,
                produto: nome,
                preco,
                destino: acao,
                estado_loja: estadoGlobalLoja,
                data_envio: new Date().toISOString()
            });
        }

        return;
    }

    setText("modalPizzaTitle", nome);
    setText("modalPizzaPrice", preco);
    setText("modalUpsellTitle", adicionalNome);
    setText("modalUpsellPrice", adicionalPreco);

    setSrc("modalPizzaImg", imagem);
    setSrc("modalUpsellImg", adicionalImagem);

    const modalPizzaImg = byId("modalPizzaImg");
    const modalUpsellImg = byId("modalUpsellImg");
    if (modalPizzaImg) modalPizzaImg.alt = nome;
    if (modalUpsellImg) modalUpsellImg.alt = adicionalNome;

    const btnWpp = byId("modal-btn-wpp");
    const btnIfood = byId("modal-btn-ifood");
    const btnSemAdicional = byId("modal-btn-sem-adicional");

    const mainTitle = byId("modalMainTitle");
    const subTitle = byId("modalSubTitle");

    let msgComAdicional = "";
    let msgSemAdicional = "";

    if (estadoGlobalLoja === 1) {
        mainTitle.innerText = CONFIG.modais?.textos?.comboTitulo || "";
        subTitle.innerText = CONFIG.modais?.textos?.comboSubtitulo || "";
        btnWpp.innerText = CONFIG.botoes?.textos?.concluirPedido || "";

        if (btnIfood) {
            btnIfood.style.display = CONFIG.links.ifood && CONFIG.links.ifood !== "#" ? "flex" : "none";
            btnIfood.href = CONFIG.links.ifood || "#";
        }

        msgComAdicional = preencherModelo(obterMensagemContato("pedidoComAdicional"), { origem, nome, adicional: adicionalNome });
        msgSemAdicional = preencherModelo(obterMensagemContato("pedidoSemAdicional"), { origem, nome });
    } else if (estadoGlobalLoja === 2) {
        mainTitle.innerText = CONFIG.modais?.textos?.agendarAmanhaTitulo || "";
        subTitle.innerText = CONFIG.modais?.textos?.agendarAmanhaSubtitulo || "";
        btnWpp.innerText = CONFIG.botoes?.textos?.agendarPedido || "";

        if (btnIfood) btnIfood.style.display = "none";

        msgComAdicional = preencherModelo(obterMensagemContato("agendamentoAmanhaComAdicional"), { origem, nome, adicional: adicionalNome });
        msgSemAdicional = preencherModelo(obterMensagemContato("agendamentoAmanhaSemAdicional"), { origem, nome });
    } else {
        mainTitle.innerText = CONFIG.modais?.textos?.agendarHojeTitulo || "";
        subTitle.innerText = CONFIG.modais?.textos?.agendarHojeSubtitulo || "";
        btnWpp.innerText = CONFIG.botoes?.textos?.garantirPedido || "";

        if (btnIfood) btnIfood.style.display = "none";

        msgComAdicional = preencherModelo(obterMensagemContato("agendamentoHojeComAdicional"), { origem, nome, adicional: adicionalNome });
        msgSemAdicional = preencherModelo(obterMensagemContato("agendamentoHojeSemAdicional"), { origem, nome });
    }

    if (btnWpp) btnWpp.href = gerarLinkWpp(msgComAdicional);

    if (btnSemAdicional) {
        btnSemAdicional.onclick = function () {
            abrirLink(gerarLinkWpp(msgSemAdicional));
            closeModal();
        };
    }

    if (CONFIG.automacoes.enviarPedidos) {
        dispararWebhookCondicional("pedido_modal", {
            origem,
            produto: nome,
            preco,
            adicional: adicionalNome,
            adicional_preco: adicionalPreco,
            estado_loja: estadoGlobalLoja,
            data_envio: new Date().toISOString()
        });
    }

    abrirModal("comboModal");
}

function openModal(produtoNome, produtoPreco, produtoImg, upsellNome, upsellPreco, upsellImg) {
    abrirModalComercial({
        origem: "Produto",
        nome: produtoNome,
        preco: produtoPreco,
        imagem: produtoImg,
        adicionalNome: upsellNome,
        adicionalPreco: upsellPreco,
        adicionalImagem: upsellImg
    });
}

function closeModal() {
    fecharModal("comboModal");
}

function openPremiumUpsell(produto, imagem) {
    abrirModalComercial({
        origem: "Sugestão do Chef",
        nome: produto,
        preco: CONFIG.sugestaoChef.preco || "",
        imagem,
        adicionalNome: CONFIG.sugestaoChef.adicionalNome || "",
        adicionalPreco: CONFIG.sugestaoChef.adicionalPreco || "",
        adicionalImagem: CONFIG.sugestaoChef.adicionalImagem || imagem,
        linkExterno: CONFIG.sugestaoChef.linkExterno
    });
}

function closePremiumUpsell() {
    closeModal();
}

function openQualifierModal(isAmanha) {
    if (!modalEstaAtivo("qualificador")) {
        const mensagem = isAmanha
            ? obterMensagemContato("agendamentoAmanha")
            : obterMensagemContato("agendamentoHoje");

        const acao = obterAcaoModalDesativado("qualificador", "whatsapp");
        abrirDestinoExterno(acao, mensagem);
        return;
    }

    const wppBtn = byId("btn-qualifier-sugestao");
    const title = byId("qualifierTitle");
    const subtitle = byId("qualifierSubtitle");

    if (isAmanha) {
        title.innerText = CONFIG.modais?.textos?.agendarAmanhaTitulo || "";
        subtitle.innerText = CONFIG.modais?.textos?.qualificadorAmanhaSubtitulo || "";
        wppBtn.href = gerarLinkWpp(obterMensagemContato("agendamentoAmanha"));
    } else {
        title.innerText = CONFIG.modais?.textos?.agendarHojeTitulo || "";
        subtitle.innerText = CONFIG.modais?.textos?.qualificadorHojeSubtitulo || "";
        wppBtn.href = gerarLinkWpp(obterMensagemContato("agendamentoHoje"));
    }

    abrirModal("qualifierModal");
}

function closeQualifierModal() {
    fecharModal("qualifierModal");
}

function scrollReels(distancia) {
    const track = byId("reels-track");
    if (!track) return;

    track.scrollBy({
        left: distancia,
        behavior: "smooth"
    });
}

function toggleLike(event, btn) {
    event.stopPropagation();
    btn.classList.toggle("liked");
    btn.innerText = btn.classList.contains("liked") ? "❤️" : "🤍";
}

function openReelModal(title, price, desc, imgUrl) {
    abrirModalComercial({
        origem: "Reels",
        nome: title,
        preco: price,
        imagem: imgUrl,
        adicionalNome: "",
        adicionalPreco: "",
        adicionalImagem: imgUrl
    });
}

function closeReelModal() {
    closeModal();
}

function detectarTipoVideo(src, tipoInformado) {
    const origem = (src || "").trim();
    const tipo = (tipoInformado || "").trim().toLowerCase();

    if (tipo && tipo !== "auto") return tipo;

    if (/youtube\.com|youtu\.be/i.test(origem)) return "youtube";
    if (/drive\.google\.com|docs\.google\.com/i.test(origem)) return "google-drive";
    if (/\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(origem)) return "external";

    return "external";
}

function extrairYoutubeId(url) {
    if (!url) return "";

    const texto = url.trim();

    const padroes = [
        /youtube\.com\/watch\?v=([^&]+)/i,
        /youtube\.com\/shorts\/([^?&/]+)/i,
        /youtube\.com\/embed\/([^?&/]+)/i,
        /youtu\.be\/([^?&/]+)/i
    ];

    for (const padrao of padroes) {
        const match = texto.match(padrao);
        if (match && match[1]) return match[1];
    }

    return texto;
}

function gerarUrlYoutubeEmbed(url) {
    const id = extrairYoutubeId(url);
    if (!id) return "";

    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
}

function extrairGoogleDriveId(url) {
    if (!url) return "";

    const texto = url.trim();

    const padroes = [
        /drive\.google\.com\/file\/d\/([^/]+)/i,
        /drive\.google\.com\/open\?id=([^&]+)/i,
        /drive\.google\.com\/uc\?id=([^&]+)/i,
        /id=([^&]+)/i
    ];

    for (const padrao of padroes) {
        const match = texto.match(padrao);
        if (match && match[1]) return match[1];
    }

    return texto;
}

function gerarUrlGoogleDrivePreview(url) {
    const id = extrairGoogleDriveId(url);
    if (!id) return "";

    return `https://drive.google.com/file/d/${id}/preview`;
}

function criarElementoVideo(src, tipo) {
    const origem = (src || "").trim();
    const tipoVideo = detectarTipoVideo(origem, tipo);

    if (!origem) {
        const vazio = document.createElement("div");
        vazio.className = "reel-media-video";
        return vazio;
    }

    if (tipoVideo === "youtube") {
        const iframe = document.createElement("iframe");
        iframe.className = "reel-media-video";
        iframe.src = gerarUrlYoutubeEmbed(origem);
        iframe.setAttribute("title", "Vídeo do produto");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.pointerEvents = "none";
        return iframe;
    }

    if (tipoVideo === "google-drive" || tipoVideo === "drive") {
        const iframe = document.createElement("iframe");
        iframe.className = "reel-media-video";
        iframe.src = gerarUrlGoogleDrivePreview(origem);
        iframe.setAttribute("title", "Vídeo do Google Drive");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.pointerEvents = "none";
        return iframe;
    }

    const video = document.createElement("video");
    video.className = "reel-media-video";
    video.autoplay = false;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";

    const source = document.createElement("source");
    source.src = origem;

    if (/\.(webm)(\?.*)?$/i.test(origem)) {
        source.type = "video/webm";
    } else if (/\.(ogg|ogv)(\?.*)?$/i.test(origem)) {
        source.type = "video/ogg";
    } else {
        source.type = "video/mp4";
    }

    video.appendChild(source);

    video.addEventListener("error", function () {
        if (video.parentNode) video.remove();
    });

    return video;
}

function carregarVideoReel(card) {
    if (!card || card.dataset.videoLoaded === "true") return;

    const src = card.dataset.videoSrc || "";
    const tipo = card.dataset.videoType || "auto";
    if (!src.trim()) return;

    let frame = card.querySelector(".reel-video-frame");

    if (!frame) {
        frame = document.createElement("div");
        frame.className = "reel-video-frame";
        card.insertBefore(frame, card.firstChild);
    }

    const videoElemento = criarElementoVideo(src, tipo);
    frame.appendChild(videoElemento);
    card.dataset.videoLoaded = "true";

    if (videoElemento.tagName === "VIDEO") {
        videoElemento.play().catch(() => {});
    }
}

function inicializarVideosReels() {
    const cards = Array.from($all(".reel-card[data-video-src]"));
    if (!cards.length) return;

    if (observadorVideosReels) observadorVideosReels.disconnect();

    if (!("IntersectionObserver" in window)) {
        cards.forEach(carregarVideoReel);
        return;
    }

    observadorVideosReels = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            const card = entrada.target;

            if (entrada.isIntersecting) {
                carregarVideoReel(card);
                const video = card.querySelector("video.reel-media-video");
                if (video) video.play().catch(() => {});
            } else {
                const video = card.querySelector("video.reel-media-video");
                if (video && !video.paused) video.pause();
            }
        });
    }, { rootMargin: "250px 0px", threshold: 0.05 });

    cards.forEach(card => observadorVideosReels.observe(card));
}

function inicializarVideoCabecalho() {
    const holder = byId("hero-video-holder") || $(".hero-video-holder");
    if (!holder) return;

    if (holder.dataset.videoLoaded === "true") return;

    const src = holder.dataset.heroVideoSrc || CONFIG.hero.videoSrc || "";
    const tipo = holder.dataset.heroVideoType || CONFIG.hero.videoType || "auto";

    if (!src.trim()) return;

    holder.innerHTML = "";

    const tipoDetectado = detectarTipoVideo(src, tipo);

    if (tipoDetectado === "youtube") {
        const iframe = document.createElement("iframe");
        iframe.src = gerarUrlYoutubeEmbed(src);
        iframe.setAttribute("title", "Vídeo do cabeçalho");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.pointerEvents = "none";
        holder.appendChild(iframe);
        holder.dataset.videoLoaded = "true";
        return;
    }

    if (tipoDetectado === "google-drive" || tipoDetectado === "drive") {
        const iframe = document.createElement("iframe");
        iframe.src = gerarUrlGoogleDrivePreview(src);
        iframe.setAttribute("title", "Vídeo do cabeçalho Google Drive");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.style.pointerEvents = "none";
        holder.appendChild(iframe);
        holder.dataset.videoLoaded = "true";
        return;
    }

    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (CONFIG.hero?.poster) video.poster = CONFIG.hero.poster;

    video.addEventListener("error", () => {
        video.remove();
        holder.dataset.videoLoaded = "error";
    });

    const source = document.createElement("source");
    source.src = src;
    source.type = /\.(webm)(\?.*)?$/i.test(src) ? "video/webm" : "video/mp4";

    video.appendChild(source);
    holder.appendChild(video);
    holder.dataset.videoLoaded = "true";
}

function deveMostrarHorarioEvento(tipo) {
    const cfg = CONFIG.eventos?.configuracaoFormulario || {};

    if (tipo === "reserva") return true;
    if (cfg.mostrarHorarioEmTodos === true) return true;

    const evento = CONFIG.eventos?.[tipo] || {};
    return evento.mostrarHorario === true;
}

function horarioObrigatorioEvento(tipo) {
    const cfg = CONFIG.eventos?.configuracaoFormulario || {};
    const evento = CONFIG.eventos?.[tipo] || {};

    if (evento.horarioObrigatorio === true) return true;
    if (evento.horarioObrigatorio === false) return false;

    if (tipo === "reserva") return cfg.horarioObrigatorioReserva !== false;

    return cfg.horarioObrigatorioEmTodos === true;
}

function atualizarLabelHorarioEvento(tipo) {
    const label = document.querySelector('label[for="evHora"]');
    if (!label) return;

    label.innerText = horarioObrigatorioEvento(tipo)
        ? CONFIG.formulario?.horarioLabel || ""
        : CONFIG.formulario?.horarioOpcionalTexto || "";
}

function redirecionarEventoSemModal(tipo) {
    let mensagem = "";

    if (tipo === "reserva") {
        mensagem = obterMensagemContato("reserva");
    } else if (tipo === "aniversario") {
        mensagem = CONFIG.eventos?.mensagens?.aniversario || "";
    } else if (tipo === "confraternizacao") {
        mensagem = CONFIG.eventos?.mensagens?.confraternizacao || "";
    } else {
        mensagem = CONFIG.eventos?.mensagens?.outro || "";
    }

    const acao = obterAcaoModalDesativado("eventos", "whatsapp");
    const destino = CONFIG.eventos.telefoneDestino || CONFIG.contato.whatsappNumero;

    if (acao === "whatsapp") {
        abrirLink(gerarLinkWpp(mensagem, destino));
        return;
    }

    abrirDestinoExterno(acao, mensagem, "", destino);
}

function openEventModal(tipo) {
    if (!modalEstaAtivo("eventos")) {
        redirecionarEventoSemModal(tipo);
        return;
    }

    tipoEventoAtual = tipo;

    const title = byId("evTitle");
    const subtitle = byId("evSubtitle");
    const boxHora = byId("evBoxHora");
    const boxTipo = byId("evBoxTipo");
    const badge = byId("evBadge");

    ["evNome", "evWpp", "evData", "evHora", "evPessoas", "evObs"].forEach(id => {
        const campo = byId(id);
        if (campo) campo.value = "";
    });

    if (badge) {
        badge.style.display = "none";
        badge.innerHTML = "";
    }

    if (boxHora) boxHora.style.display = deveMostrarHorarioEvento(tipo) ? "block" : "none";
    if (boxTipo) boxTipo.style.display = tipo === "confraternizacao" ? "block" : "none";
    atualizarLabelHorarioEvento(tipo);

    const evento = CONFIG.eventos[tipo] || {};

    if (tipo === "reserva") {
        title.innerText = evento.titulo || "";
        subtitle.innerText = evento.subtitulo || "";
    } else if (tipo === "aniversario") {
        const min = evento.minPessoas || "";
        const pct = evento.descontoPct || "";
        title.innerText = evento.titulo || "";
        subtitle.innerText = preencherModelo(evento.subtitulo || "", { min, pct });
    } else if (tipo === "confraternizacao") {
        const min = evento.minPessoas || "";
        const pct = evento.descontoPct || "";
        title.innerText = evento.titulo || "";
        subtitle.innerText = preencherModelo(evento.subtitulo || "", { min, pct });
    }

    abrirModal("eventModal");
}

function closeEventModal() {
    fecharModal("eventModal");
}

function calcularDescontoModal() {
    const pessoas = parseInt(byId("evPessoas")?.value, 10) || 0;
    const badge = byId("evBadge");

    if (!badge) return;

    let aplicarDesconto = false;
    let porcentagem = 0;

    const regraAniversario = CONFIG.eventos.aniversario || {};
    const regraConfraternizacao = CONFIG.eventos.confraternizacao || {};

    if (tipoEventoAtual === "aniversario" && pessoas >= (regraAniversario.minPessoas || 10)) {
        aplicarDesconto = true;
        porcentagem = regraAniversario.descontoPct || 15;
    } else if (tipoEventoAtual === "confraternizacao" && pessoas >= (regraConfraternizacao.minPessoas || 20)) {
        aplicarDesconto = true;
        porcentagem = regraConfraternizacao.descontoPct || 20;
    }

    if (aplicarDesconto) {
        badge.style.display = "block";
        badge.innerHTML = sanitizeText(preencherModelo(CONFIG.eventos?.mensagens?.descontoAtivado, { porcentagem }));
    } else {
        badge.style.display = "none";
        badge.innerHTML = "";
    }
}

function enviarFormularioWhatsApp() {
    const nome = byId("evNome")?.value.trim() || "";
    const wpp = byId("evWpp")?.value.trim() || "";
    const data = byId("evData")?.value || "";
    const hora = byId("evHora")?.value || "";
    const pessoas = byId("evPessoas")?.value || "";
    const obs = byId("evObs")?.value.trim() || CONFIG.formulario?.observacoesPadraoTexto || "";
    const tipoSelect = byId("evTipo")?.value || "";

    if (!nome || !wpp || !data || !pessoas) {
        alert(CONFIG.formulario?.camposObrigatorios || "");
        return;
    }

    if (deveMostrarHorarioEvento(tipoEventoAtual) && horarioObrigatorioEvento(tipoEventoAtual) && !hora) {
        alert(CONFIG.formulario?.horarioObrigatorio || "");
        return;
    }

    let msg = "";
    const badge = byId("evBadge");
    const temDesconto = badge && badge.style.display === "block";
    const detalheDesconto = temDesconto ? badge.innerText : (CONFIG.eventos?.mensagens?.condicoesNormais || "");

    const mensagemEvento = CONFIG.formulario?.mensagensEvento?.[tipoEventoAtual] || "";
    msg = preencherModelo(mensagemEvento, {
        nome,
        wpp,
        data: formatarDataExibicao(data),
        hora: hora || CONFIG.formulario?.horarioPadraoTexto || "",
        pessoas,
        tipo: tipoSelect,
        desconto: detalheDesconto,
        obs
    });

    const dados = {
        origem: "Modal Eventos/Reservas",
        tipo: tipoEventoAtual,
        nome,
        telefone: wpp,
        data_reserva: data,
        horario: hora,
        pessoas,
        observacoes: obs,
        tipo_evento: tipoSelect,
        desconto: detalheDesconto,
        mensagem_whatsapp: msg,
        data_envio: new Date().toISOString()
    };

    if (CONFIG.automacoes.enviarReservas) {
        dispararWebhookCondicional("reserva_evento", dados);
    }

    const destino = CONFIG.eventos.telefoneDestino || CONFIG.contato.whatsappNumero;
    abrirLink(gerarLinkWpp(msg, destino));

    closeEventModal();
}

function abrirRoleta() {
    if (!CONFIG.roleta.ativo) return;
    if (!modalEstaAtivo("roleta")) return;

    const chave = CONFIG.roleta.chaveLocalStorage || "roletaGirada";

    if (!localStorage.getItem(chave)) {
        abrirModal("roletaModal");
    }
}

function fecharRoleta() {
    pararSomRoleta();
    fecharModal("roletaModal");

    const chave = CONFIG.roleta.chaveLocalStorage || "roletaGirada";
    localStorage.setItem(chave, "sim");
}

function pararSomRoleta() {
    if (temporizadorSomRoleta !== null) {
        window.clearTimeout(temporizadorSomRoleta);
        temporizadorSomRoleta = null;
    }

    const contexto = contextoAudioRoleta;
    contextoAudioRoleta = null;
    if (contexto && contexto.state !== "closed") {
        contexto.close().catch(erro => console.warn("[Roleta] Não foi possível encerrar o áudio.", erro));
    }
}

function tocarTiqueRoleta(contexto) {
    const oscilador = contexto.createOscillator();
    const volume = contexto.createGain();
    const filtroRuido = contexto.createBiquadFilter();
    const volumeRuido = contexto.createGain();
    const ruido = contexto.createBufferSource();
    const inicio = contexto.currentTime;
    const duracaoTique = 0.05;
    const bufferRuido = contexto.createBuffer(
        1,
        Math.ceil(contexto.sampleRate * duracaoTique),
        contexto.sampleRate
    );
    const amostrasRuido = bufferRuido.getChannelData(0);

    for (let indice = 0; indice < amostrasRuido.length; indice += 1) {
        amostrasRuido[indice] = Math.random() * 2 - 1;
    }

    ruido.buffer = bufferRuido;
    filtroRuido.type = "bandpass";
    filtroRuido.frequency.setValueAtTime(2100, inicio);
    filtroRuido.frequency.exponentialRampToValueAtTime(850, inicio + duracaoTique);
    filtroRuido.Q.setValueAtTime(1.4, inicio);
    volumeRuido.gain.setValueAtTime(0.0001, inicio);
    volumeRuido.gain.exponentialRampToValueAtTime(0.12, inicio + 0.003);
    volumeRuido.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.04);
    ruido.connect(filtroRuido);
    filtroRuido.connect(volumeRuido);
    volumeRuido.connect(contexto.destination);
    ruido.onended = () => {
        ruido.disconnect();
        filtroRuido.disconnect();
        volumeRuido.disconnect();
    };

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(1100, inicio);
    oscilador.frequency.exponentialRampToValueAtTime(620, inicio + 0.045);
    volume.gain.setValueAtTime(0.0001, inicio);
    volume.gain.exponentialRampToValueAtTime(0.055, inicio + 0.004);
    volume.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.045);
    oscilador.connect(volume);
    volume.connect(contexto.destination);
    oscilador.onended = () => {
        oscilador.disconnect();
        volume.disconnect();
    };
    ruido.start(inicio);
    ruido.stop(inicio + duracaoTique);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracaoTique);
}

function iniciarSomRoleta(duracao) {
    pararSomRoleta();
    const AudioContextRoleta = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextRoleta) {
        console.warn("[Roleta] Áudio indisponível neste navegador.");
        return;
    }

    let contexto;
    try {
        contexto = new AudioContextRoleta();
        contextoAudioRoleta = contexto;
    } catch (erro) {
        console.warn("[Roleta] Não foi possível iniciar o áudio.", erro);
        return;
    }

    const inicio = performance.now();
    contexto.resume().then(() => {
        if (contextoAudioRoleta !== contexto) return;

        const tocarProximoTique = () => {
            if (contextoAudioRoleta !== contexto) return;
            const decorrido = performance.now() - inicio;
            if (decorrido >= duracao) return;

            try {
                tocarTiqueRoleta(contexto);
            } catch (erro) {
                console.warn("[Roleta] Não foi possível reproduzir o efeito sonoro.", erro);
                pararSomRoleta();
                return;
            }

            const progresso = Math.min(1, decorrido / duracao);
            const intervalo = 75 + 470 * progresso * progresso;
            temporizadorSomRoleta = window.setTimeout(tocarProximoTique, Math.min(intervalo, duracao - decorrido));
        };

        tocarProximoTique();
    }).catch(erro => {
        console.warn("[Roleta] O navegador não permitiu iniciar o áudio.", erro);
        if (contextoAudioRoleta === contexto) pararSomRoleta();
    });
}

function iniciarRoleta() {
    if (roletaGirando) return;

    roletaGirando = true;

    const btnGirar = byId("btn-girar-roleta");
    const resultado = byId("roleta-resultado");

    if (btnGirar) {
        btnGirar.style.opacity = "0.5";
        btnGirar.style.cursor = "not-allowed";
        btnGirar.innerText = CONFIG.roleta.textoSorteando || "";
    }

    if (resultado) resultado.style.display = "none";

    const premios = Array.isArray(CONFIG.roleta.premios) ? CONFIG.roleta.premios : [];

    if (!premios.length) {
        roletaGirando = false;

        if (btnGirar) {
            btnGirar.style.opacity = "1";
            btnGirar.style.cursor = "pointer";
            btnGirar.innerText = CONFIG.roleta.botaoGirar || "Tentar a Sorte 🎰";
        }

        return;
    }

    const pesoTotal = premios.reduce((acc, premio) => acc + (premio.peso || 0), 0);
    let random = Math.random() * pesoTotal;
    let premioSorteado = premios[0];

    for (const premio of premios) {
        if (random < premio.peso) {
            premioSorteado = premio;
            break;
        }
        random -= premio.peso;
    }

    let anguloFinal = 1800 + (360 - (premioSorteado.centro || 0));
    const variacao = Math.floor(Math.random() * 30) - 15;
    anguloFinal += variacao;

    const wheel = byId("roleta");
    const movimentoReduzido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const duracaoGiro = movimentoReduzido ? 650 : DURACAO_GIRO_ROLETA_MS;
    iniciarSomRoleta(duracaoGiro);
    if (wheel) wheel.style.transform = `rotate(${anguloFinal}deg)`;

    setTimeout(() => {
        pararSomRoleta();
        mostrarResultadoRoleta(premioSorteado.nome);
    }, duracaoGiro);
}

function mostrarResultadoRoleta(nomePremio) {
    const btnGirar = byId("btn-girar-roleta");
    const resultadoBox = byId("roleta-resultado");

    if (btnGirar) btnGirar.style.display = "none";
    if (resultadoBox) resultadoBox.style.display = "block";

    const codigo = Math.floor(1000 + Math.random() * 9000);
    const prefixo = CONFIG.roleta.prefixoVoucher || "";
    const voucher = `${prefixo}-${codigo}`;

    setText("premio-voucher", voucher);
    setText("premio-titulo", preencherModelo(CONFIG.roleta.textoPremio, { premio: nomePremio }));

    const btnResgatar = byId("btn-resgatar-roleta");
    let msg = "";

    if (estadoGlobalLoja === 1) {
        btnResgatar.innerText = CONFIG.botoes?.textos?.pedirRoletaAberto || "";
        msg = preencherModelo(CONFIG.roleta.mensagemPedido, { premio: nomePremio, voucher });
    } else if (estadoGlobalLoja === 2) {
        btnResgatar.innerText = CONFIG.botoes?.textos?.pedirRoletaFechado || "";
        msg = preencherModelo(CONFIG.roleta.mensagemAgendamentoAmanha, { premio: nomePremio, voucher });
    } else {
        btnResgatar.innerText = CONFIG.botoes?.textos?.pedirRoletaPreAtendimento || "";
        msg = preencherModelo(CONFIG.roleta.mensagemAgendamentoHoje, { premio: nomePremio, voucher });
    }

    btnResgatar.href = gerarLinkWpp(msg);

    if (CONFIG.automacoes.enviarRoleta) {
        dispararWebhookCondicional("roleta", {
            origem: "Roleta de Entrada",
            premio: nomePremio,
            codigo: voucher,
            estado_loja: estadoGlobalLoja,
            data_envio: new Date().toISOString()
        });
    }
}

function dispararWebhookCondicional(evento, dados) {
    const payload = {
        evento,
        site: CONFIG.marca.nome,
        segmento: CONFIG.marca.segmento,
        ...dados
    };

    dispararWebhook(payload);
}

function dispararWebhook(dados) {
    const auto = CONFIG.automacoes || {};

    if (auto.n8nAtivo && auto.urlN8N) {
        fetch(auto.urlN8N, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        }).catch(err => console.log("Erro n8n:", err));
    }

    if (auto.appScriptAtivo && auto.urlAppScript) {
        fetch(auto.urlAppScript, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        }).catch(err => console.log("Erro Sheets:", err));
    }
}

function abrirModal(id) {
    const modal = byId(id);
    if (!modal) return;

    ultimoElementoFocadoAntesDoModal = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        modal.classList.add("active");
        const focoInicial = modal.querySelector(".close-modal, button, a, input, select, textarea");
        if (focoInicial instanceof HTMLElement) focoInicial.focus({ preventScroll: true });
    }, 10);

    document.body.style.overflow = "hidden";
}

function fecharModal(id) {
    const modal = byId(id);
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    setTimeout(() => {
        modal.style.display = "none";
    }, 400);

    document.body.style.overflow = "auto";

    if (ultimoElementoFocadoAntesDoModal?.isConnected) {
        ultimoElementoFocadoAntesDoModal.focus({ preventScroll: true });
    }

    ultimoElementoFocadoAntesDoModal = null;
}

function registrarFechamentoPorCliqueFora() {
    const modais = [
        { id: "comboModal", close: closeModal },
        { id: "qualifierModal", close: closeQualifierModal },
        { id: "eventModal", close: closeEventModal },
        { id: "roletaModal", close: fecharRoleta },
        { id: "promoPopupModal", close: fecharPopupPromocional },
        { id: "siteCartModal", close: fecharCarrinhoSite }
    ];

    window.addEventListener("click", function (event) {
        modais.forEach(item => {
            const modal = byId(item.id);
            if (modal && event.target === modal) item.close();
        });
    });

    window.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        const aberto = [...modais]
            .reverse()
            .find(item => byId(item.id)?.classList.contains("active"));

        if (aberto) aberto.close();
    });
}

const DIAS_SEMANA_VALIDOS = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

function normalizarDestaqueSemanal(configuracao = CONFIG) {
    return deepMerge(DEFAULT_CONFIG.destaqueSemanal, configuracao?.destaqueSemanal || {});
}

function validarConfiguracaoDestaqueSemanal(configuracao = CONFIG, emitirAvisos = true) {
    const destaque = normalizarDestaqueSemanal(configuracao);
    const erros = [];
    const avisos = [];

    if (typeof destaque.ativo !== "boolean") {
        erros.push("destaqueSemanal.ativo deve ser booleano.");
    }

    if (!["automatico", "forcar_exibir", "forcar_ocultar"].includes(destaque.modoExibicao)) {
        erros.push("destaqueSemanal.modoExibicao inválido. Use: automatico, forcar_exibir ou forcar_ocultar.");
    }

    if (!DIAS_SEMANA_VALIDOS.includes(destaque.diaSemana)) {
        erros.push("destaqueSemanal.diaSemana inválido. Use: domingo, segunda, terca, quarta, quinta, sexta ou sabado.");
    }

    if (!Array.isArray(destaque.linhas)) {
        erros.push("destaqueSemanal.linhas deve ser um array.");
    }

    const cta = destaque.cta && typeof destaque.cta === "object" ? destaque.cta : {};
    if (cta.ativo === true) {
        if (!["whatsapp", "cardapio", "link"].includes(cta.tipo)) {
            erros.push("destaqueSemanal.cta.tipo inválido. Use: whatsapp, cardapio ou link.");
        }
        if (cta.tipo === "link" && !(String(cta.url || "").trim())) {
            erros.push("destaqueSemanal.cta.url deve existir quando o tipo for link.");
        }
    }

    if (emitirAvisos) {
        erros.forEach(erro => console.warn(`[Destaque Semanal] ${erro}`));
        avisos.forEach(aviso => console.warn(`[Destaque Semanal] ${aviso}`));
    }

    return { valido: erros.length === 0, erros, avisos };
}

function deveExibirDestaqueSemanal(configuracao = CONFIG) {
    const destaque = normalizarDestaqueSemanal(configuracao);

    if (destaque.ativo === false) return false;
    if (destaque.modoExibicao === "forcar_ocultar") return false;
    if (destaque.modoExibicao === "forcar_exibir") return true;
    if (destaque.modoExibicao !== "automatico") return false;

    const validacao = validarConfiguracaoDestaqueSemanal(configuracao, false);
    if (!validacao.valido || !DIAS_SEMANA_VALIDOS.includes(destaque.diaSemana)) {
        if (typeof console !== "undefined" && console.warn) {
            console.warn("[Destaque Semanal] Configuração inválida; ocultando o destaque em modo automático.");
        }
        return false;
    }

    const contexto = obterContextoHorarioOperacional(configuracao);
    return contexto.diaSemana === destaque.diaSemana;
}

function configurarCtaDestaqueSemanal() {
    const destaque = normalizarDestaqueSemanal(CONFIG);
    const cta = destaque.cta || {};
    const elemento = byId("weekly-highlight-cta");
    if (!elemento) return false;

    if (cta.ativo !== true) {
        elemento.hidden = true;
        elemento.removeAttribute("href");
        elemento.textContent = "";
        return false;
    }

    const tipo = String(cta.tipo || "whatsapp").toLowerCase();
    const texto = String(cta.texto || "Saiba mais").trim() || "Saiba mais";
    const mensagem = String(cta.mensagem || obterMensagemContato("saudacao") || "").trim();
    const destino = resolverUrlCanalPedido(tipo, cta.url || "", mensagem, CONFIG.contato?.whatsappNumero || "");

    if (!destino || destino === "#") {
        console.warn("[Destaque Semanal] CTA ativo sem destino válido; ocultando botão.");
        elemento.hidden = true;
        elemento.removeAttribute("href");
        elemento.textContent = "";
        return false;
    }

    elemento.href = destino;
    elemento.textContent = texto;
    elemento.target = "_blank";
    elemento.rel = "noopener noreferrer";
    elemento.hidden = false;
    return true;
}

function aplicarDestaqueSemanal() {
    const section = byId("weekly-highlight-section");
    if (!section) return false;

    const destaque = normalizarDestaqueSemanal(CONFIG);
    const deveExibir = deveExibirDestaqueSemanal();

    if (!deveExibir) {
        section.hidden = true;
        section.classList.remove("active");
        return false;
    }

    const container = section.querySelector(".weekly-highlight-container");
    const badge = byId("weekly-highlight-badge");
    const titulo = byId("weekly-highlight-title");
    const destaqueHtml = byId("weekly-highlight-emphasis");
    const texto = byId("weekly-highlight-text");
    const linhas = byId("weekly-highlight-lines");
    const media = byId("weekly-highlight-media");
    const imagem = byId("weekly-highlight-image");

    if (badge) {
        const textoBadge = String(destaque.selo || "").trim();
        badge.hidden = !textoBadge;
        badge.textContent = textoBadge;
    }

    if (titulo) {
        const textoTitulo = String(destaque.titulo || "").trim();
        titulo.hidden = !textoTitulo;
        titulo.textContent = textoTitulo;
    }

    if (destaqueHtml) {
        const textoDestaque = String(destaque.destaque || "").trim();
        destaqueHtml.hidden = !textoDestaque;
        destaqueHtml.textContent = textoDestaque;
    }

    if (texto) {
        const textoSecundario = String(destaque.texto || "").trim();
        texto.hidden = !textoSecundario;
        texto.textContent = textoSecundario;
    }

    if (linhas) {
        const itens = Array.isArray(destaque.linhas)
            ? destaque.linhas.filter(item => String(item || "").trim())
            : [];

        linhas.replaceChildren();

        itens.forEach(item => {
            const linha = document.createElement("p");
            linha.className = "weekly-highlight-line";
            linha.textContent = String(item || "");
            linhas.appendChild(linha);
        });

        linhas.hidden = itens.length === 0;
    }

    const imagemUrl = String(destaque.imagem || "").trim();
    const imagemAlt = String(destaque.imagemAlt || destaque.titulo || "Destaque semanal").trim();
    const definirEstadoDaImagem = (temImagem) => {
        if (media) media.hidden = !temImagem;
        if (container) {
            container.classList.toggle("has-media", temImagem);
            container.classList.toggle("is-text-only", !temImagem);
        }
    };

    definirEstadoDaImagem(Boolean(imagemUrl));

    if (imagem) {
        imagem.onerror = null;

        if (!imagemUrl) {
            imagem.removeAttribute("src");
            imagem.alt = "";
            imagem.hidden = true;
        } else {
            imagem.src = imagemUrl;
            imagem.alt = imagemAlt || "Destaque semanal";
            imagem.hidden = false;

            // Se a arte semanal estiver indisponível, o card continua elegante
            // em modo somente texto, sem exibir área vazia ou imagem quebrada.
            imagem.onerror = () => {
                imagem.hidden = true;
                imagem.removeAttribute("src");
                definirEstadoDaImagem(false);
            };
        }
    }

    configurarCtaDestaqueSemanal();

    section.hidden = false;

    // O destaque pode surgir automaticamente na virada do dia.
    // Reaplicamos o sistema de reveal existente para que ele não fique
    // invisível até o próximo scroll.
    requestAnimationFrame(() => reveal());

    return true;
}

function diagnosticarDestaqueSemanal() {
    const destaque = CONFIG.destaqueSemanal || {};
    const contexto = obterContextoHorarioOperacional();
    const resultado = {
        ativo: destaque.ativo,
        modo: destaque.modoExibicao,
        diaConfigurado: destaque.diaSemana,
        diaOperacionalAtual: contexto.diaSemana,
        dataOperacional: contexto.data,
        timezone: contexto.timezone,
        deveExibir: deveExibirDestaqueSemanal(),
        titulo: destaque.titulo || ""
    };

    console.group("=== DESTAQUE SEMANAL ===");
    console.log(`Ativo: ${resultado.ativo}`);
    console.log(`Modo: ${resultado.modo}`);
    console.log(`Dia configurado: ${resultado.diaConfigurado}`);
    console.log(`Dia operacional atual: ${resultado.diaOperacionalAtual}`);
    console.log(`Data operacional: ${resultado.dataOperacional}`);
    console.log(`Timezone: ${resultado.timezone}`);
    console.log(`Deve exibir: ${resultado.deveExibir ? "SIM" : "NAO"}`);
    console.log(`Título: ${resultado.titulo}`);
    console.groupEnd();

    return resultado;
}

function executarTestesDestaqueSemanal() {
    const base = JSON.parse(JSON.stringify(CONFIG));
    const cenarios = [
        { nome: "QUINTA + ATIVO", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta" }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "QUINTA + DESATIVADO", esperado: false, configuracao: { destaqueSemanal: { ativo: false, modoExibicao: "automatico", diaSemana: "quinta" }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "OUTRO DIA + AUTOMÁTICO", esperado: false, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta" }, horarios: { dataTeste: "2026-09-25" } } },
        { nome: "OUTRO DIA + FORÇAR EXIBIÇÃO", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "forcar_exibir", diaSemana: "quinta" }, horarios: { dataTeste: "2026-09-22" } } },
        { nome: "QUINTA + FORÇAR OCULTAÇÃO", esperado: false, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "forcar_ocultar", diaSemana: "quinta" }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "ALTERAÇÃO DO DIA", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "segunda" }, horarios: { dataTeste: "2026-09-21" } } },
        { nome: "ALTERAÇÃO DO NOME", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta", titulo: "Quinta Premium" }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "SEM IMAGEM NÃO OCULTA O DESTAQUE", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta", imagem: "" }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "CTA DESATIVADO NÃO OCULTA O DESTAQUE", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta", cta: { ativo: false, tipo: "whatsapp" } }, horarios: { dataTeste: "2026-09-24" } } },
        { nome: "TIMEZONE", esperado: true, configuracao: { destaqueSemanal: { ativo: true, modoExibicao: "automatico", diaSemana: "quinta" }, horarios: { dataTeste: "", timezone: "America/Sao_Paulo" } } }
    ];

    const resultados = cenarios.map(cenario => {
        const configuracao = deepMerge(base, cenario.configuracao);
        const obtido = deveExibirDestaqueSemanal(configuracao);
        const passou = obtido === cenario.esperado;

        console[passou ? "log" : "error"](
            `${passou ? "✅ PASSOU" : "❌ FALHOU"} ${cenario.nome}: esperado ${cenario.esperado}, obtido ${obtido}`
        );

        return { nome: cenario.nome, esperado: cenario.esperado, obtido, passou };
    });

    const falhas = resultados.filter(item => !item.passou).length;
    console.log(`=== DESTAQUE SEMANAL: ${resultados.length - falhas}/${resultados.length} passaram ===`);

    return { passou: falhas === 0, total: resultados.length, falhas, resultados };
}

function registrarFallbacksDeImagem() {
    document.addEventListener("error", function (event) {
        const elemento = event.target;

        if (!(elemento instanceof HTMLImageElement)) return;
        if (elemento.dataset.fallbackAplicado === "true") return;

        elemento.dataset.fallbackAplicado = "true";
        elemento.classList.add("media-fallback");
        elemento.removeAttribute("src");
    }, true);
}

function observarProdutosVisualizados() {
    if (!popupProductsObserver) {
        if (!("IntersectionObserver" in window)) return;

        popupProductsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || entry.target.dataset.popupViewed === "true") return;
                entry.target.dataset.popupViewed = "true";
                popupProductsObserver.unobserve(entry.target);
                contadorProdutosVisualizados += 1;
                if (contadorProdutosVisualizados >= Number(CONFIG.promocoes?.popups?.produtosVisualizados || 2)) {
                    popupTriggerReached = true;
                }
            });
        }, { threshold: 0.6 });
    }

    document.querySelectorAll("#product-grid .product-card, #reels-track .reel-card").forEach(card => {
        if (card.dataset.popupViewed !== "true") popupProductsObserver.observe(card);
    });
}

function configurarBotaoVoltarAoTopo() {
    const botao = byId("back-to-top");
    if (!botao) return;

    const atualizarVisibilidade = () => {
        const visivel = window.scrollY > 420;
        botao.classList.toggle("is-visible", visivel);
        botao.setAttribute("aria-hidden", String(!visivel));
        botao.tabIndex = visivel ? 0 : -1;
    };

    botao.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", atualizarVisibilidade, { passive: true });
    atualizarVisibilidade();
}

function obterTipoPopupPromocional() {
    const popupConfig = CONFIG.promocoes?.popups;
    const tipos = popupConfig?.tipos || {};
    const candidatos = [];

    if (tipos.rodizio !== false) {
        const destaque = CONFIG.destaqueSemanal || {};
        const diaEvento = DIAS_SEMANA_VALIDOS.indexOf(destaque.diaSemana || "quinta");
        const diaAtual = obterContextoHorarioOperacional().diaSemanaNumero;
        const diasAteEvento = (diaEvento - diaAtual + 7) % 7;
        const antecedencia = Math.max(0, Number(popupConfig.antecedenciaRodizioDias) || 0);

        if (
            destaque.ativo !== false &&
            CONFIG.hero?.promocao &&
            diasAteEvento <= antecedencia &&
            destaque.modoExibicao !== "forcar_ocultar"
        ) {
            candidatos.push("rodizio");
        }
    }

    if (tipos.sugestao !== false && CONFIG.sugestaoChef?.ativo !== false && CONFIG.sugestaoChef?.produto) {
        candidatos.push("sugestao");
    }
    if (tipos.promocao !== false && CONFIG.promocoes?.topBar?.ativo && CONFIG.promocoes.topBar.texto) {
        candidatos.push("promocao");
    }

    if (!candidatos.length) return null;
    if (candidatos.includes("rodizio")) return "rodizio";

    let indice = 0;
    try {
        indice = Number(localStorage.getItem("sr-ofrelio-popup-rotation") || 0);
    } catch (error) {
        console.warn("Não foi possível ler a rotação de pop-ups promocionais.", error);
    }

    const sequencia = candidatos.filter(tipo => tipo !== "rodizio");
    const selecionado = sequencia[indice % sequencia.length];
    try {
        localStorage.setItem("sr-ofrelio-popup-rotation", String((indice + 1) % sequencia.length));
    } catch (error) {
        console.warn("Não foi possível salvar a rotação de pop-ups promocionais.", error);
    }
    return selecionado;
}

function preencherPopupPromocional(tipo) {
    const textos = window.SITE_TRANSLATIONS?.ui?.[idiomaAtual] || {};
    const imagem = byId("promo-popup-image");
    const eyebrow = byId("promo-popup-eyebrow");
    const titulo = byId("promo-popup-title");
    const descricao = byId("promo-popup-description");
    const preco = byId("promo-popup-price");
    const cta = byId("promo-popup-cta");
    const menu = byId("promo-popup-menu");
    if (!imagem || !eyebrow || !titulo || !descricao || !preco || !cta || !menu) return false;

    let nomeProduto = "";
    let mensagemWhatsApp = "";
    let textoBotao = obterEstadoOperacionalAtual() === 1
        ? (textos.popupOrder || "")
        : (textos.popupSchedule || textos.popupOrder || "");
    let tituloPopup = "";
    let textoDescricao = "";
    let rotulo = "";
    let imagemUrl = "";
    let precoTexto = "";

    if (tipo === "sugestao") {
        const sugestao = CONFIG.sugestaoChef;
        nomeProduto = sugestao.produto;
        rotulo = textos.popupSuggested || "";
        tituloPopup = textos.popupSuggestionTitle || "";
        textoDescricao = sugestao.texto || "";
        imagemUrl = sugestao.imagemCard || sugestao.imagemModal || "";
        precoTexto = sugestao.preco || "";
        mensagemWhatsApp = montarMensagemPedidoDireto(nomeProduto, "Sugestão do Chef");
    } else if (tipo === "promocao") {
        rotulo = textos.popupPromotion || "";
        tituloPopup = textos.popupPromotionTitle || "";
        textoDescricao = `${CONFIG.promocoes.topBar.texto} ${textos.popupPromotionDescription || ""}`.trim();
        mensagemWhatsApp = obterMensagemContato(obterEstadoOperacionalAtual() === 1 ? "pedido" : obterEstadoOperacionalAtual() === 2 ? "agendamentoAmanha" : "agendamentoHoje");
    } else if (tipo === "rodizio") {
        rotulo = textos.popupRodizio || "";
        tituloPopup = textos.popupRodizioTitle || "";
        textoDescricao = `${CONFIG.hero.promocao}. ${textos.popupRodizioDescription || ""}`;
        textoBotao = textos.popupReserve || textoBotao;
        mensagemWhatsApp = textos.popupRodizioMessage || obterMensagemContato("reserva");
    } else {
        return false;
    }

    eyebrow.textContent = rotulo;
    titulo.textContent = tituloPopup;
    descricao.textContent = textoDescricao;
    preco.textContent = precoTexto;
    preco.hidden = !precoTexto;
    imagem.onerror = () => {
        imagem.removeAttribute("src");
        imagem.hidden = true;
    };
    imagem.alt = nomeProduto || tituloPopup;
    imagem.hidden = !imagemUrl;
    if (imagemUrl) imagem.src = imagemUrl;
    byId("promoPopupModal")?.querySelector(".promo-popup-content")?.classList.toggle("has-image", Boolean(imagemUrl));
    cta.textContent = textoBotao;
    cta.href = gerarLinkWpp(mensagemWhatsApp);
    menu.href = urlCardapioComIdioma(CONFIG.links.cardapio || "#");
    menu.textContent = textos.popupViewMenu || "";
    tipoPopupAtual = tipo;
    return true;
}

function fecharPopupPromocional() {
    fecharModal("promoPopupModal");
}

function iniciarAgendadorPopupsPromocionais() {
    const configuracao = CONFIG.promocoes?.popups;
    if (!configuracao || configuracao.ativo === false) return;

    const botaoFechar = byId("promo-popup-close");
    botaoFechar?.addEventListener("click", fecharPopupPromocional);

    let exibidoNestaSessao = false;
    let inicioSessao = Date.now();
    try {
        exibidoNestaSessao = sessionStorage.getItem("sr-ofrelio-popup-shown") === "true";
    } catch (error) {
        console.warn("Não foi possível consultar o estado da sessão de pop-ups.", error);
    }
    if (exibidoNestaSessao) return;

    setTimeout(() => { popupTriggerReached = true; }, Math.max(0, Number(configuracao.atrasoMs) || 0));

    let agendadorId = null;
    const tentarExibir = () => {
        if (exibidoNestaSessao) {
            if (agendadorId !== null) window.clearInterval(agendadorId);
            return;
        }
        if (!popupTriggerReached) return;
        if (document.body.classList.contains("opening-screen-active")) return;
        if (document.querySelector(".modal-overlay.active")) return;
        if (Date.now() - inicioSessao < 3000) return;

        let ultimaExibicao = 0;
        try {
            ultimaExibicao = Number(localStorage.getItem("sr-ofrelio-popup-last-shown") || 0);
        } catch (error) {
            console.warn("Não foi possível consultar o intervalo entre pop-ups.", error);
        }
        const intervaloMs = Math.max(0, Number(configuracao.intervaloHoras) || 0) * 60 * 60 * 1000;
        if (Date.now() - ultimaExibicao < intervaloMs) {
            exibidoNestaSessao = true;
            if (agendadorId !== null) window.clearInterval(agendadorId);
            return;
        }

        const tipo = obterTipoPopupPromocional();
        if (!tipo) {
            exibidoNestaSessao = true;
            if (agendadorId !== null) window.clearInterval(agendadorId);
            return;
        }
        if (!preencherPopupPromocional(tipo)) return;

        exibidoNestaSessao = true;
        try {
            sessionStorage.setItem("sr-ofrelio-popup-shown", "true");
            localStorage.setItem("sr-ofrelio-popup-last-shown", String(Date.now()));
        } catch (error) {
            console.warn("Não foi possível salvar a frequência dos pop-ups promocionais.", error);
        }
        abrirModal("promoPopupModal");
        if (agendadorId !== null) window.clearInterval(agendadorId);
    };

    const scrollParaOferta = () => {
        const documento = document.documentElement;
        const maximo = documento.scrollHeight - window.innerHeight;
        if (maximo > 0 && window.scrollY / maximo >= Number(configuracao.percentualRolagem || 0.6)) {
            popupTriggerReached = true;
        }
    };

    window.addEventListener("scroll", scrollParaOferta, { passive: true });
    agendadorId = window.setInterval(tentarExibir, 1200);
    tentarExibir();
}

function dicionarioCarrinhoSite() {
    return window.CARDAPIO_I18N?.ui?.[idiomaAtual] || window.CARDAPIO_I18N?.ui?.pt || {};
}

function textoCarrinhoSite(chave, valores = {}) {
    const dicionario = dicionarioCarrinhoSite();
    let texto = dicionario[chave] || chave;
    Object.entries(valores).forEach(([nome, valor]) => {
        texto = texto.replaceAll(`{${nome}}`, String(valor));
    });
    return texto;
}

function moedaCarrinhoSite(valor) {
    return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

function obterConfiguracaoCardapioSite() {
    return window.SR_OFRELIO_CART?.getMenuConfig?.(idiomaAtual) || window.CARDAPIO_CONFIG || {};
}

function renderizarItensCarrinhoSite(itens) {
    const area = byId("site-cart-items");
    if (!area) return;
    const configuracao = obterConfiguracaoCardapioSite();
    const pizzas = Array.isArray(configuracao.pizzas) ? configuracao.pizzas : [];
    const adicionais = Array.isArray(configuracao.upsells) ? configuracao.upsells : [];

    if (!itens.length) {
        area.innerHTML = `<div class="site-cart-empty">${sanitizeText(textoCarrinhoSite("emptyCart"))}</div>`;
        return;
    }

    area.innerHTML = "";
    itens.forEach((item, index) => {
        const produto = pizzas.find((pizza) => pizza.id === item.pizzaId);
        const nome = produto?.nome || item.nome || "";
        const quantidade = Math.max(1, Number(item.quantidade) || 1);
        const subtotal = window.SR_OFRELIO_CART?.itemSubtotal
            ? window.SR_OFRELIO_CART.itemSubtotal(item)
            : Number(item.subtotal || 0);
        const precoOriginal = Number(item.precoOriginalUnitario || item.precoUnitario || 0);
        const percentual = Math.max(0, Number(item.descontoPercentual) || 0);
        const precoUnitario = Number(item.precoUnitario || 0);
        const temDesconto = percentual > 0 && precoOriginal > Number(item.precoUnitario || 0);
        const extras = (Array.isArray(item.upsells) ? item.upsells : []).map((extra) => {
            const configurado = adicionais.find((itemConfig) => itemConfig.id === extra.id);
            return `${extra.quantidade}x ${configurado?.nome || extra.nome}`;
        }).join(", ");

        const card = document.createElement("article");
        card.className = "site-cart-item";
        card.innerHTML = `
            <div class="site-cart-item-main">
                <strong>${quantidade}x ${sanitizeText(nome)}</strong>
                <small class="site-cart-unit-price">${sanitizeText(textoCarrinhoSite("unitPrice"))} ${moedaCarrinhoSite(precoUnitario)} ${sanitizeText(textoCarrinhoSite("each"))}</small>
                ${extras ? `<span class="site-cart-item-extras">+ ${sanitizeText(extras)}</span>` : ""}
                ${item.observacoes ? `<small>${sanitizeText(textoCarrinhoSite("observationsPrefix"))} ${sanitizeText(item.observacoes)}</small>` : ""}
                ${temDesconto ? `<span class="site-cart-discount">${sanitizeText(textoCarrinhoSite("discount"))}: ${percentual}%</span>` : ""}
                <div class="site-cart-quantity">
                    <button type="button" data-site-qty-down="${index}" aria-label="${sanitizeAttr(textoCarrinhoSite("decreaseQuantity"))}" ${quantidade <= 1 ? "disabled" : ""}>−</button>
                    <span>${quantidade}</span>
                    <button type="button" data-site-qty-up="${index}" aria-label="${sanitizeAttr(textoCarrinhoSite("increaseQuantity"))}">+</button>
                </div>
            </div>
            <div class="site-cart-item-side">
                ${temDesconto ? `<span class="site-cart-price-original">${moedaCarrinhoSite(precoOriginal * quantidade)}</span>` : ""}
                <strong>${moedaCarrinhoSite(subtotal)}</strong>
                <button type="button" data-site-remove="${index}" aria-label="${sanitizeAttr(textoCarrinhoSite("removeItem"))}">${sanitizeText(textoCarrinhoSite("remove"))}</button>
            </div>`;
        card.querySelector("[data-site-qty-down]")?.addEventListener("click", () => alterarQuantidadeCarrinhoSite(index, -1));
        card.querySelector("[data-site-qty-up]")?.addEventListener("click", () => alterarQuantidadeCarrinhoSite(index, 1));
        card.querySelector("[data-site-remove]")?.addEventListener("click", () => removerItemCarrinhoSite(index));
        area.appendChild(card);
    });
}

function renderizarOfertaCarrinhoSite(itens) {
    const area = byId("site-cart-upsell");
    if (!area) return;

    const oferta = window.SR_OFRELIO_CART?.getOffer?.(idiomaAtual);
    const jaAdicionada = oferta && itens.some((item) => item.pizzaId === oferta.produtoId);
    if (!itens.length || !oferta || jaAdicionada) {
        area.hidden = true;
        area.innerHTML = "";
        return;
    }

    const mensagem = oferta.percentualDesconto > 0
        ? textoCarrinhoSite("offerMessageDiscount", { discount: oferta.percentualDesconto })
        : textoCarrinhoSite("offerMessageNoDiscount");
    const precos = oferta.percentualDesconto > 0
        ? `<div class="site-cart-upsell-prices"><span>${sanitizeText(textoCarrinhoSite("offerOriginal"))} ${moedaCarrinhoSite(oferta.precoOriginal)}</span><strong>${sanitizeText(textoCarrinhoSite("offerNow"))} ${moedaCarrinhoSite(oferta.precoPromocional)}</strong></div>`
        : `<div class="site-cart-upsell-prices"><strong>${moedaCarrinhoSite(oferta.precoOriginal)}</strong></div>`;
    const imagem = window.location.pathname.toLowerCase().includes("/cardapio/")
        ? "../pizzaD3.png"
        : "pizzaD3.png";

    area.innerHTML = `
        <img class="site-cart-upsell-image" src="${imagem}" alt="${sanitizeAttr(oferta.nome)}" loading="lazy" decoding="async">
        <div class="site-cart-upsell-copy">
            <strong>${sanitizeText(textoCarrinhoSite("cartOfferTitle"))} · ${sanitizeText(oferta.nome)}</strong>
            <p>${sanitizeText(mensagem)}</p>
            ${precos}
        </div>
        <button type="button" id="site-cart-add-offer">${sanitizeText(textoCarrinhoSite("offerAdd"))}</button>`;
    area.hidden = false;
    byId("site-cart-add-offer")?.addEventListener("click", adicionarOfertaCarrinhoSite);
}

function atualizarCarrinhoSite() {
    const api = window.SR_OFRELIO_CART;
    const botao = byId("site-cart-button");
    if (!api || !botao) return;

    const itens = api.get();
    const quantidade = api.count(itens);
    const total = api.total(itens);
    const carrinhoHabilitado = window.CARDAPIO_CONFIG?.secoes?.carrinho !== false;

    botao.hidden = quantidade === 0 || !carrinhoHabilitado;
    botao.setAttribute("aria-label", textoCarrinhoSite("cartOpen"));
    byId("site-cart-count").textContent = `${quantidade} ${quantidade === 1 ? textoCarrinhoSite("cartItem") : textoCarrinhoSite("cartItems")}`;
    byId("site-cart-total").textContent = moedaCarrinhoSite(total);
    byId("site-cart-kicker").textContent = textoCarrinhoSite("cartKicker");
    byId("site-cart-title").textContent = textoCarrinhoSite("cartTitle");
    byId("site-cart-status").textContent = textoCarrinhoSite("cartStatusFallback");
    byId("site-cart-total-label").textContent = textoCarrinhoSite("totalEstimated");
    byId("site-cart-modal-total").textContent = moedaCarrinhoSite(total);
    const fechar = document.querySelector("#siteCartModal .close-modal");
    if (fechar) fechar.setAttribute("aria-label", textoCarrinhoSite("cartClose"));
    const continuar = document.querySelector(".site-cart-continue");
    if (continuar) continuar.textContent = textoCarrinhoSite("continueShopping");
    const finalizar = document.querySelector(".site-cart-checkout");
    if (finalizar) finalizar.textContent = textoCarrinhoSite("startCheckout");

    renderizarItensCarrinhoSite(itens);
    renderizarOfertaCarrinhoSite(itens);
}

function inicializarCarrinhoSite() {
    if (!window.SR_OFRELIO_CART?.subscribe) return;
    window.SR_OFRELIO_CART.subscribe(() => atualizarCarrinhoSite());
    atualizarCarrinhoSite();
}

function abrirCarrinhoSite() {
    atualizarCarrinhoSite();
    abrirModal("siteCartModal");
}

function fecharCarrinhoSite() {
    fecharModal("siteCartModal");
}

function continuarComprandoSite() {
    fecharCarrinhoSite();
    window.setTimeout(() => {
        byId("cardapio")?.scrollIntoView({
            behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start"
        });
    }, 50);
}

function alterarQuantidadeCarrinhoSite(index, variacao) {
    const itens = window.SR_OFRELIO_CART?.get?.() || [];
    const item = itens[index];
    if (!item) return;
    item.quantidade = Math.max(1, Number(item.quantidade || 1) + Number(variacao || 0));
    item.subtotal = window.SR_OFRELIO_CART.itemSubtotal(item);
    window.SR_OFRELIO_CART.set(itens);
}

function removerItemCarrinhoSite(index) {
    const itens = window.SR_OFRELIO_CART?.get?.() || [];
    if (index < 0 || index >= itens.length) return;
    itens.splice(index, 1);
    window.SR_OFRELIO_CART.set(itens);
}

function adicionarOfertaCarrinhoSite() {
    const resultado = window.SR_OFRELIO_CART?.addOffer?.(idiomaAtual);
    if (resultado?.ok) atualizarCarrinhoSite();
}

function irParaCheckoutCardapio() {
    const link = CONFIG.links?.cardapio || "cardapio/index.html";
    const urlComIdioma = urlCardapioComIdioma(link);
    try {
        const destino = new URL(urlComIdioma, window.location.href);
        destino.searchParams.set("openCart", "1");
        destino.searchParams.set("checkout", "1");
        destino.searchParams.set("lang", idiomaAtual);
        window.location.href = destino.href;
    } catch (erro) {
        console.error("[Carrinho] Não foi possível abrir o checkout do cardápio.", erro);
    }
}

let contextoSomInterface = null;

function tocarSomInterface() {
    const AudioContextInterface = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextInterface) return;

    try {
        contextoSomInterface ||= new AudioContextInterface();
        const contexto = contextoSomInterface;
        contexto.resume().then(() => {
            const agora = contexto.currentTime;
            const ganho = contexto.createGain();
            const filtro = contexto.createBiquadFilter();
            filtro.type = "lowpass";
            filtro.frequency.setValueAtTime(2400, agora);
            ganho.gain.setValueAtTime(0.0001, agora);
            ganho.gain.exponentialRampToValueAtTime(0.055, agora + 0.012);
            ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.12);
            filtro.connect(ganho);
            ganho.connect(contexto.destination);

            const oscilador = contexto.createOscillator();
            oscilador.type = "sine";
            oscilador.frequency.setValueAtTime(660, agora);
            oscilador.frequency.exponentialRampToValueAtTime(990, agora + 0.075);
            oscilador.connect(filtro);
            oscilador.start(agora);
            oscilador.stop(agora + 0.13);
        }).catch(erro => {
            console.warn("[Som da interface] Não foi possível reproduzir o som:", erro);
        });
    } catch (erro) {
        console.warn("[Som da interface] Não foi possível iniciar o áudio:", erro);
    }
}

function configurarSomInterface() {
    document.addEventListener("click", event => {
        const origem = event.target instanceof Element ? event.target : event.target?.parentElement;
        let elemento = origem;

        while (elemento && elemento !== document.documentElement) {
            const controle = elemento.matches(
                "button, a[href], [role='button'], [onclick], input[type='button'], input[type='submit'], input[type='reset'], select, summary, [tabindex]:not([tabindex='-1'])"
            );
            if (controle || window.getComputedStyle(elemento).cursor === "pointer") {
                if (!elemento.disabled && elemento.getAttribute("aria-disabled") !== "true") {
                    tocarSomInterface();
                }
                return;
            }
            elemento = elemento.parentElement;
        }
    });
}

function iniciarSite() {
    configurarSomInterface();
    CONFIG = montarConfiguracaoIdioma(idiomaAtual);
    const menu = byId("mobile-menu");
    const toggle = byId("mobile-menu-toggle");
    if (menu && !menu.hidden) {
        menu.hidden = true;
        toggle?.setAttribute("aria-expanded", "false");
    }
    document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : idiomaAtual;
    aplicarIdiomaInterface();
    configurarMenuMobile();
    configurarBotaoVoltarAoTopo();
    registrarFallbacksDeImagem();
    const telaAberturaAtiva = configurarTelaAbertura();
    aplicarConfiguracoesGlobais();
    renderizarTudo();
    if (!telaAberturaAtiva) inicializarVideoCabecalho();
    verificarHorarioLoja();
    reveal();
    inicializarCarrinhoSite();
    registrarFechamentoPorCliqueFora();

    window.addEventListener("scroll", reveal, { passive: true });

    setInterval(verificarHorarioLoja, 60000);
    iniciarAgendadorPopupsPromocionais();

    if (
        CONFIG.roleta.ativo &&
        modalEstaAtivo("roleta") &&
        CONFIG.roleta.abrirAutomaticamente
    ) {
        setTimeout(abrirRoleta, CONFIG.roleta.tempoParaAbrirMs || 3000);
    }
}

function configurarMenuMobile() {
    const botao = byId("mobile-menu-toggle");
    const menu = byId("mobile-menu");
    if (!botao || !menu) return;

    botao.addEventListener("click", () => {
        const aberto = botao.getAttribute("aria-expanded") === "true";
        botao.setAttribute("aria-expanded", String(!aberto));
        botao.setAttribute("aria-label", obterRotuloIdioma()[aberto ? "openMenu" : "closeMenu"]);
        menu.hidden = aberto;
    });
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.hidden = true;
            botao.setAttribute("aria-expanded", "false");
            botao.setAttribute("aria-label", obterRotuloIdioma().openMenu || "Open menu");
        });
    });
}

document.addEventListener("DOMContentLoaded", iniciarSite);

window.openModal = openModal;
window.closeModal = closeModal;
window.abrirModalComercial = abrirModalComercial;
window.openPremiumUpsell = openPremiumUpsell;
window.closePremiumUpsell = closePremiumUpsell;
window.openQualifierModal = openQualifierModal;
window.closeQualifierModal = closeQualifierModal;
window.openReelModal = openReelModal;
window.closeReelModal = closeReelModal;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.calcularDescontoModal = calcularDescontoModal;
window.enviarFormularioWhatsApp = enviarFormularioWhatsApp;
window.scrollReels = scrollReels;
window.toggleLike = toggleLike;
window.abrirRoleta = abrirRoleta;
window.fecharRoleta = fecharRoleta;
window.iniciarRoleta = iniciarRoleta;
window.abrirCanalPedido = abrirCanalPedido;
window.obterDataHoraOperacional = obterDataHoraOperacional;
window.obterContextoHorarioOperacional = obterContextoHorarioOperacional;
window.obterEstadoLojaCalculado = obterEstadoLojaCalculado;
window.validarConfiguracaoHorarios = validarConfiguracaoHorarios;
window.validarConfiguracaoDestaqueSemanal = validarConfiguracaoDestaqueSemanal;
window.deveExibirDestaqueSemanal = deveExibirDestaqueSemanal;
window.aplicarDestaqueSemanal = aplicarDestaqueSemanal;
window.configurarCtaDestaqueSemanal = configurarCtaDestaqueSemanal;
window.diagnosticarHorarioLoja = diagnosticarHorarioLoja;
window.diagnosticarDestaqueSemanal = diagnosticarDestaqueSemanal;
window.executarTestesSistemaHorarios = executarTestesSistemaHorarios;
window.executarTestesDestaqueSemanal = executarTestesDestaqueSemanal;
window.forcarAtualizacaoHorarioLoja = function () {
    estadoGlobalLoja = -1;
    contextoGlobalHorario = null;
    verificarHorarioLoja();
    return diagnosticarHorarioLoja();
};
