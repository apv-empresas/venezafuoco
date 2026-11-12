"use strict";

/* ========================================================================== 
   CONFIGURAÇÃO E ESTADO
   Mantém os nomes públicos do projeto original e adiciona funcionalidades.
   ========================================================================== */
const IDIOMA_CARDAPIO = window.CARDAPIO_I18N?.getLanguage?.() || "pt";
const CARDAPIO_CONFIG_BASE = window.CARDAPIO_CONFIG || {};
window.CARDAPIO_CONFIG_BASE = CARDAPIO_CONFIG_BASE;
const CARDAPIO_CONFIG = window.CARDAPIO_I18N?.applyConfig
    ? window.CARDAPIO_I18N.applyConfig(CARDAPIO_CONFIG_BASE, IDIOMA_CARDAPIO)
    : CARDAPIO_CONFIG_BASE;
document.documentElement.lang = IDIOMA_CARDAPIO === "pt" ? "pt-BR" : IDIOMA_CARDAPIO;
const CONFIG = CARDAPIO_CONFIG.integracoes || {};
const DADOS_SITE = CARDAPIO_CONFIG.site || {};
const SEO = CARDAPIO_CONFIG.seo || {};
const TEMA = CARDAPIO_CONFIG.tema || {};
const BOTOES = CARDAPIO_CONFIG.botoes || {};
const LINKS = CARDAPIO_CONFIG.links || {};
const CONTATO = CARDAPIO_CONFIG.contato || {};
const ENDERECO = CARDAPIO_CONFIG.endereco || {};
const HORARIOS = CARDAPIO_CONFIG.horarios || {};
const CHECKOUT = CARDAPIO_CONFIG.checkout || {};
const SECOES = CARDAPIO_CONFIG.secoes || {};
const upsellsGlobais = Array.isArray(CARDAPIO_CONFIG.upsells) ? CARDAPIO_CONFIG.upsells : [];
const pizzas = Array.isArray(CARDAPIO_CONFIG.pizzas) ? CARDAPIO_CONFIG.pizzas : [];

let pizzaSelecionada = null;
let carrinho = [];
let ultimoElementoFocadoAntesDoModal = null;
let contextoHorarioAtual = null;
let temporizadorConfirmacaoCarrinho = null;
let contextoSomInterface = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const byId = (id) => document.getElementById(id);

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

function tMenu(chave, valores = {}) {
    const dicionario = window.CARDAPIO_I18N?.ui?.[IDIOMA_CARDAPIO] || window.CARDAPIO_I18N?.ui?.pt || {};
    let texto = dicionario[chave] || chave;
    Object.entries(valores).forEach(([nome, valor]) => {
        texto = texto.replaceAll(`{${nome}}`, String(valor));
    });
    return texto;
}

function aplicarTraducoesEstaticas() {
    $$("[data-i18n]").forEach((elemento) => {
        const texto = tMenu(elemento.dataset.i18n);
        if (texto && texto !== elemento.dataset.i18n) elemento.textContent = texto;
    });
    $$("[data-i18n-placeholder]").forEach((elemento) => {
        elemento.placeholder = tMenu(elemento.dataset.i18nPlaceholder);
    });
    $$("[data-i18n-aria]").forEach((elemento) => {
        elemento.setAttribute("aria-label", tMenu(elemento.dataset.i18nAria));
    });
    $$("[data-i18n-title]").forEach((elemento) => {
        elemento.title = tMenu(elemento.dataset.i18nTitle);
    });
}

function moeda(valor) {
    return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

function textoSeguro(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setTexto(seletor, valor) {
    $$(seletor).forEach((elemento) => {
        if (elemento && valor !== undefined && valor !== null) elemento.textContent = String(valor);
    });
}

function setHTML(seletor, valor) {
    $$(seletor).forEach((elemento) => {
        if (elemento && valor !== undefined && valor !== null) elemento.innerHTML = String(valor);
    });
}

function setAtributo(seletor, atributo, valor) {
    $$(seletor).forEach((elemento) => {
        if (!elemento) return;
        if (valor) elemento.setAttribute(atributo, valor);
        else elemento.removeAttribute(atributo);
    });
}

function urlConfiguradaValida(url) {
    const valor = String(url || "").trim();
    if (!valor || valor === "#" || valor.includes("example.com") || valor.includes("SEU-")) return false;
    try {
        const parsed = new URL(valor, window.location.href);
        return ["http:", "https:"].includes(parsed.protocol);
    } catch (_) {
        return false;
    }
}

function aplicarTema() {
    const root = document.documentElement;
    const mapa = {
        "--gold": TEMA.gold,
        "--gold-hover": TEMA.goldHover,
        "--price-green": TEMA.priceGreen,
        "--dark-bg": TEMA.darkBg,
        "--card-bg": TEMA.cardBg,
        "--text-light": TEMA.textLight,
        "--text-muted": TEMA.textMuted,
        "--whatsapp-green": TEMA.whatsappGreen,
        "--ifood-red": TEMA.ifoodRed,
        "--dochef-purple": TEMA.dochefPurple,
        "--font-main": TEMA.fontePrincipal,
        "--font-title": TEMA.fonteTitulos
    };
    Object.entries(mapa).forEach(([chave, valor]) => {
        if (valor) root.style.setProperty(chave, valor);
    });
    if (TEMA.googleFontsUrl) setAtributo("#google-fonts-link", "href", TEMA.googleFontsUrl);
}

function gerarLinkWhatsApp(mensagem) {
    const numero = String(CONFIG.whatsapp || CONTATO.whatsapp || "").replace(/\D/g, "");
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem || "Olá! Vim pelo cardápio da VENEZA FUOCO.")}`;
}

function aplicarConfiguracoesDoSite() {
    aplicarTraducoesEstaticas();
    aplicarTema();

    if (DADOS_SITE.tituloPagina) document.title = DADOS_SITE.tituloPagina;
    setAtributo('link[rel="icon"]', "href", DADOS_SITE.favicon || DADOS_SITE.logo);
    setAtributo("#meta-description", "content", SEO.descricao || "");
    setAtributo("#meta-robots", "content", SEO.robots || "index,follow");
    setAtributo("#meta-theme-color", "content", SEO.themeColor || TEMA.darkBg || "#183321");

    $$('[data-logo-principal]').forEach((logo) => {
        if (DADOS_SITE.logo) logo.src = DADOS_SITE.logo;
        if (DADOS_SITE.nome) logo.alt = DADOS_SITE.nome;
    });

    setTexto("[data-texto-boas-vindas]", DADOS_SITE.textoBoasVindas || tMenu("welcome"));
    setTexto("[data-subtitulo-boas-vindas]", DADOS_SITE.subtituloBoasVindas || "");
    setTexto("[data-titulo-cardapio]", DADOS_SITE.tituloCardapio || tMenu("menu"));
    setTexto("[data-subtitulo-cardapio]", DADOS_SITE.subtituloCardapio || "");
    setTexto("[data-botao-voltar-site]", BOTOES.voltarSite || tMenu("backToSite"));
    setTexto("[data-botao-voltar-categorias]", BOTOES.voltarCategorias || tMenu("backToCategories"));
    setTexto("[data-botao-adicionar]", BOTOES.adicionarCarrinho || tMenu("addToOrder"));
    setTexto("[data-botao-finalizar]", BOTOES.finalizarPedido || tMenu("finishWhatsApp"));
    setTexto("[data-total-note]", CHECKOUT.observacaoTotal || "");

    $$('[data-footer-slogan]').forEach((item) => item.textContent = DADOS_SITE.slogan || "");
    $$('[data-footer-endereco]').forEach((item) => item.textContent = ENDERECO.texto ? `📍 ${ENDERECO.texto}` : "");
    $$('[data-footer-whatsapp]').forEach((item) => item.textContent = CONTATO.whatsappExibicao ? `📱 WhatsApp: ${CONTATO.whatsappExibicao}` : "");
    $$('[data-footer-horario]').forEach((item) => item.textContent = montarTextoHorarioFooter());
    $$('[data-footer-direitos]').forEach((item) => item.innerHTML = `&copy; ${new Date().getFullYear()} ${textoSeguro(DADOS_SITE.nome || "")}. ${textoSeguro(tMenu("rightsReserved"))}`);

    setAtributo("[data-instagram-link]", "href", LINKS.instagram);

    let urlSitePrincipal = LINKS.sitePrincipal || "../index.html";
    try {
        const destinoSite = new URL(urlSitePrincipal, window.location.href);
        destinoSite.searchParams.set("lang", IDIOMA_CARDAPIO);
        urlSitePrincipal = destinoSite.href;
    } catch (_) {}
    setAtributo("[data-site-principal]", "href", urlSitePrincipal);

    setAtributo("[data-footer-endereco-link]", "href", LINKS.googleMaps || ENDERECO.googleMaps);
    setAtributo("[data-footer-whatsapp-link]", "href", gerarLinkWhatsApp(tMenu("whatsappContactMessage")));
    setAtributo("[data-whatsapp-principal]", "href", gerarLinkWhatsApp(tMenu("whatsappMenuOrderMessage")));

    if (SECOES.rodape === false) $$('[data-footer]').forEach((el) => el.hidden = true);
    if (SECOES.canaisPedido === false) $$('[data-canais-alternativos]').forEach((el) => el.hidden = true);
}

/* ========================================================================== 
   HORÁRIOS — mesma lógica estrutural do site principal
   1 = aberto | 2 = fechado | 3 = pré-atendimento
   ========================================================================== */
function converterParaMinutos(horaString) {
    if (typeof horaString !== "string" || !/^\d{2}:\d{2}$/.test(horaString)) return NaN;
    const [horas, minutos] = horaString.split(":").map(Number);
    if (horas > 23 || minutos > 59) return NaN;
    return (horas * 60) + minutos;
}

function analisarDataISO(data) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return null;
    const [ano, mes, dia] = data.split("-").map(Number);
    const objeto = new Date(Date.UTC(ano, mes - 1, dia));
    if (objeto.getUTCFullYear() !== ano || objeto.getUTCMonth() !== mes - 1 || objeto.getUTCDate() !== dia) return null;
    return { data, diaSemanaNumero: objeto.getUTCDay() };
}

function horaEstaNoIntervalo(horaAtual, horaInicio, horaFim) {
    if (horaInicio <= horaFim) return horaAtual >= horaInicio && horaAtual <= horaFim;
    return horaAtual >= horaInicio || horaAtual <= horaFim;
}

function validarHoraConfigurada(valor) {
    return typeof valor === "string" && /^\d{2}:\d{2}$/.test(valor) && Number.isInteger(converterParaMinutos(valor));
}

function obterDataHoraOperacional(agora = new Date()) {
    const timezone = HORARIOS.timezone || "America/Sao_Paulo";
    let dataReal;
    let horaReal;
    try {
        const partes = new Intl.DateTimeFormat("en-CA", {
            timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", hour12: false
        }).formatToParts(agora);
        const valores = Object.fromEntries(partes.map(parte => [parte.type, parte.value]));
        dataReal = `${valores.year}-${valores.month}-${valores.day}`;
        horaReal = `${valores.hour === "24" ? "00" : valores.hour}:${valores.minute}`;
    } catch (erro) {
        console.warn("Não foi possível obter a data/hora no timezone configurado:", erro);
        dataReal = agora.toISOString().slice(0, 10);
        horaReal = `${String(agora.getUTCHours()).padStart(2, "0")}:${String(agora.getUTCMinutes()).padStart(2, "0")}`;
    }

    const dataInformada = HORARIOS.dataTeste || "";
    const horaInformada = HORARIOS.horaTeste || "";
    const dataValida = dataInformada ? analisarDataISO(dataInformada) : null;
    const horaValida = horaInformada ? converterParaMinutos(horaInformada) : NaN;
    const data = dataInformada && dataValida ? dataInformada : dataReal;
    const hora = horaInformada && Number.isInteger(horaValida) ? horaInformada : horaReal;
    const minutos = converterParaMinutos(hora);
    const dataAnalisada = analisarDataISO(data) || analisarDataISO(dataReal);
    const nomesDias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    return { data, hora, minutos: Number.isInteger(minutos) ? minutos : 0, diaSemana: nomesDias[dataAnalisada?.diaSemanaNumero ?? 0], timezone };
}

function obterExcecaoFuncionamento(data) {
    const excecoes = Array.isArray(HORARIOS.excecoesFuncionamento) ? HORARIOS.excecoesFuncionamento : [];
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
    const periodo = campos.find(([, , inicio, fim]) => horaEstaNoIntervalo(minutos, converterParaMinutos(inicio), converterParaMinutos(fim)));
    if (!periodo) return { estado: 2, chaveEstado: "fechado", motivo: "configuracao_invalida" };
    return { estado: periodo[0], chaveEstado: periodo[1], motivo: `periodo_${periodo[1]}` };
}

function normalizarModoOperacaoRemoto(modo) {
    const valor = String(modo ?? "").trim().toLowerCase();
    if (!valor) return null;
    const mapa = {
        automatico: null,
        aberto: "aberto",
        fechado: "fechado",
        preatendimento: "preAtendimento",
        pre_atendimento: "preAtendimento",
        preatendimento: "preAtendimento"
    };
    return mapa[valor] ?? null;
}

function obterEstadoOperacionalRemoto() {
    if (!window.SR_OFRELIO_OPERACAO || typeof window.SR_OFRELIO_OPERACAO.modoAtual !== "function") return null;
    const modo = window.SR_OFRELIO_OPERACAO.modoAtual();
    return normalizarModoOperacaoRemoto(modo);
}

function construirContextoModoRemoto(dataHora, modo) {
    const mapa = {
        aberto: { estado: 1, chaveEstado: "aberto", label: tMenu("remoteStatusOpen") },
        fechado: { estado: 2, chaveEstado: "fechado", label: tMenu("remoteStatusClosed") },
        preAtendimento: { estado: 3, chaveEstado: "preAtendimento", label: tMenu("remoteStatusPreorder") }
    };
    const config = mapa[modo];
    if (!config) return { ...dataHora, estado: 2, chaveEstado: "fechado", motivo: "operacao_remota_indefinida", mensagemExcecao: tMenu("remoteStatusSyncing") };
    return {
        ...dataHora,
        estado: config.estado,
        chaveEstado: config.chaveEstado,
        motivo: `operacao_remota_${config.chaveEstado}`,
        mensagemExcecao: `${config.label}. ${tMenu("remoteStatusAdjusted")}`
    };
}

function obterContextoHorarioOperacional(agora = new Date()) {
    const dataHora = obterDataHoraOperacional(agora);
    const modoRemoto = obterEstadoOperacionalRemoto();
    if (modoRemoto && modoRemoto !== "automatico") {
        return construirContextoModoRemoto(dataHora, modoRemoto);
    }

    const excecao = obterExcecaoFuncionamento(dataHora.data);
    const tipoExcecao = excecao?.tipo || (excecao?.fechado === true ? "fechado" : "");
    let resultado;

    if (tipoExcecao === "fechado") {
        resultado = { estado: 2, chaveEstado: "fechado", motivo: "feriado" };
    } else if (tipoExcecao === "horarioEspecial") {
        resultado = avaliarEstadoPorPeriodos(dataHora.minutos, excecao.horarios || {});
    } else {
        const diaHabilitado = HORARIOS.diasFuncionamento == null ? true : HORARIOS.diasFuncionamento[dataHora.diaSemana] === true;
        const funcionamentoNormal = tipoExcecao === "funcionamentoNormal";
        if (!diaHabilitado && !funcionamentoNormal) resultado = { estado: 2, chaveEstado: "fechado", motivo: "dia_nao_operacional" };
        else resultado = avaliarEstadoPorPeriodos(dataHora.minutos, HORARIOS);
    }

    return { ...dataHora, ...resultado, excecao, mensagemExcecao: excecao?.mensagem || "" };
}

function chaveEstadoAtual() {
    if (!contextoHorarioAtual) contextoHorarioAtual = obterContextoHorarioOperacional();
    if (contextoHorarioAtual?.chaveEstado) return contextoHorarioAtual.chaveEstado;
    return contextoHorarioAtual.estado === 1 ? "aberto" : contextoHorarioAtual.estado === 3 ? "preAtendimento" : "fechado";
}

function textoEstadoAtual() {
    return CARDAPIO_CONFIG.textosEstado?.[chaveEstadoAtual()] || {};
}

function atualizarEstadoLoja() {
    contextoHorarioAtual = obterContextoHorarioOperacional();
    const textos = textoEstadoAtual();
    $$('[data-status-card]').forEach((card) => {
        card.dataset.estado = chaveEstadoAtual();
        const titulo = card.querySelector('[data-status-titulo]');
        const explicacao = card.querySelector('[data-status-explicacao]');
        if (titulo) titulo.textContent = contextoHorarioAtual.mensagemExcecao || textos.status || tMenu("statusStore");
        if (explicacao) explicacao.textContent = textos.explicacao || "";
    });
    const btn = byId("cartWhatsappButton");
    if (btn) btn.textContent = textos.acao || BOTOES.finalizarPedido || "Finalizar pelo WhatsApp";
    setTexto("[data-botao-finalizar]", textos.acao || BOTOES.finalizarPedido || "Finalizar pelo WhatsApp");
    const statusCarrinho = byId("cartStatusText");
    if (statusCarrinho) statusCarrinho.textContent = `${textos.status || ""}. ${textos.explicacao || ""}`.trim();
}

function montarTextoHorarioFooter() {
    const dias = HORARIOS.diasFuncionamento || {};
    const nomes = {
        domingo: tMenu("sundayShort"),
        segunda: tMenu("mondayShort"),
        terca: tMenu("tuesdayShort"),
        quarta: tMenu("wednesdayShort"),
        quinta: tMenu("thursdayShort"),
        sexta: tMenu("fridayShort"),
        sabado: tMenu("saturdayShort")
    };
    const ativos = Object.entries(dias).filter(([, ativo]) => ativo).map(([dia]) => nomes[dia]);
    if (!ativos.length) return HORARIOS.textoFooter || tMenu("consultHours");
    return `🕒 ${ativos.join(", ")} · ${HORARIOS.abertoInicio || ""} ${IDIOMA_CARDAPIO === "en" ? "to" : IDIOMA_CARDAPIO === "es" ? "a" : "às"} ${HORARIOS.abertoFim || ""}`;
}

/* ========================================================================== 
   NAVEGAÇÃO E RENDERIZAÇÃO — preserva a dinâmica original
   ========================================================================== */
function categoriasAtivas() {
    const definidas = Array.isArray(CARDAPIO_CONFIG.categorias) ? CARDAPIO_CONFIG.categorias : [];
    const mapa = new Map(definidas.map(c => [c.nome, c]));
    return [...new Set(pizzas.filter(p => p.ativo !== false).map(p => p.categoria || "Outras Ofrélio"))]
        .filter(nome => !mapa.has(nome) || mapa.get(nome).ativo !== false);
}

function gerarNavegacaoBemVindo() {
    const areaCategorias = byId("welcome-categories");
    if (!areaCategorias) return;
    areaCategorias.innerHTML = "";

    categoriasAtivas().forEach(cat => {
        const primeiraPizza = pizzas.find(p => p.ativo !== false && (p.categoria || "Outras Ofrélio") === cat);
        const imagemCat = primeiraPizza ? primeiraPizza.imagem : "";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-navigation-card";
        button.setAttribute("aria-label", tMenu("categoryOpen", { category: cat }));
        button.innerHTML = `<img src="${textoSeguro(imagemCat)}" alt="${textoSeguro(cat)}" loading="lazy"><h3>${textoSeguro(cat)}</h3>`;
        button.addEventListener("click", () => abrirCategoria(cat));
        areaCategorias.appendChild(button);
    });
}

function abrirCategoria(catSelecionada) {
    renderizarMenu(catSelecionada);
    const welcome = byId("welcome-screen");
    const cardapioArea = byId("cardapio-main-area");
    welcome.classList.add("oculto-transicao");
    cardapioArea.classList.remove("escondido");
    setTimeout(() => {
        cardapioArea.classList.add("visivel");
        document.body.style.overflowY = "auto";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    setTimeout(() => welcome.classList.add("escondido"), 400);
}

function voltarParaInicio() {
    const welcome = byId("welcome-screen");
    const cardapioArea = byId("cardapio-main-area");
    cardapioArea.classList.remove("visivel");
    welcome.classList.remove("escondido");
    setTimeout(() => {
        welcome.classList.remove("oculto-transicao");
        document.body.style.overflowY = "auto";
    }, 50);
    setTimeout(() => {
        cardapioArea.classList.add("escondido");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
}

function metaPizza(pizza) {
    return [
        pizza.tamanho,
        pizza.pedacos ? `${pizza.pedacos} ${tMenu("pieces")}` : "",
        pizza.serve ? `${tMenu("serves")} ${pizza.serve}` : ""
    ].filter(Boolean);
}

function renderizarMenu(categoriaFiltro) {
    const menu = byId("menu");
    if (!menu) return;
    menu.innerHTML = "";
    const categorias = categoriaFiltro ? [categoriaFiltro] : categoriasAtivas();

    categorias.forEach(cat => {
        const titulo = document.createElement("h2");
        titulo.className = "categoria-titulo";
        titulo.textContent = cat;
        menu.appendChild(titulo);

        pizzas.filter(p => p.ativo !== false && (p.categoria || "Outras Ofrélio") === cat).forEach(pizza => {
            const row = document.createElement("article");
            row.className = "pizza-row";
            row.innerHTML = `
                <div class="pizza-img-box"><img src="${textoSeguro(pizza.imagem)}" alt="${textoSeguro(pizza.nome)}" loading="lazy"></div>
                <div class="pizza-title">
                    ${pizza.selo ? `<span class="product-badge">${textoSeguro(pizza.selo)}</span>` : ""}
                    <h2>${textoSeguro(pizza.nome)}</h2>
                    <p>${textoSeguro(pizza.descricao)}</p>
                    <div class="product-meta">${metaPizza(pizza).map(item => `<span>${textoSeguro(item)}</span>`).join("")}</div>
                    <div class="pizza-price">${moeda(pizza.preco)}</div>
                </div>
                <div class="pizza-actions">
                    <button class="btn-pedir" type="button" data-pizza-id="${textoSeguro(pizza.id)}">🍕 ${textoSeguro(BOTOES.prepararPizza || "Montar pedido")}</button>
                    <div class="delivery-card-buttons" aria-label="${textoSeguro(tMenu("alternativeApps"))}">
                        <a class="delivery-channel-btn ifood" href="${textoSeguro(CONFIG.ifoodUrl || LINKS.ifood || "#")}" target="_blank" rel="noopener">iFood</a>
                        <a class="delivery-channel-btn dochef" href="${textoSeguro(CONFIG.dochefUrl || LINKS.dochef || "#")}" target="_blank" rel="noopener">Dochef</a>
                    </div>
                </div>`;
            row.querySelector(".btn-pedir").addEventListener("click", () => abrirModal(pizza.id));
            menu.appendChild(row);
        });
    });
}

function abrirCanalPedido(canal, event) {
    if (event) event.stopPropagation();
    const url = canal === "ifood" ? (CONFIG.ifoodUrl || LINKS.ifood) : (CONFIG.dochefUrl || LINKS.dochef);
    if (!urlConfiguradaValida(url)) return;
    registrarEvento({ tipo: "clique_canal_externo", canal, produto: pizzaSelecionada?.nome || "", origem: "cardapio-premium" });
    window.open(url, "_blank", "noopener,noreferrer");
}

/* ========================================================================== 
   MODAL DO PRODUTO — fluxo original preservado e evoluído
   ========================================================================== */
function abrirModal(id) {
    pizzaSelecionada = pizzas.find(p => p.id === id && p.ativo !== false);
    if (!pizzaSelecionada) return;
    ultimoElementoFocadoAntesDoModal = document.activeElement;

    byId("modalImagem").src = pizzaSelecionada.imagem;
    byId("modalImagem").alt = pizzaSelecionada.nome;
    byId("modalTitulo").textContent = pizzaSelecionada.nome;
    byId("modalDescricao").textContent = pizzaSelecionada.descricao;
    byId("modalPreco").textContent = moeda(pizzaSelecionada.preco);
    byId("modalSelo").textContent = pizzaSelecionada.selo || "";
    byId("modalSelo").hidden = !pizzaSelecionada.selo;
    byId("modalMeta").innerHTML = metaPizza(pizzaSelecionada).map(item => `<span>${textoSeguro(item)}</span>`).join("");
    byId("quantidade").value = 1;
    byId("observacoes").value = "";

    const upsellsArea = byId("upsellsArea");
    upsellsArea.innerHTML = "";
    const upsellsDaPizza = upsellsGlobais.filter(item => (pizzaSelecionada.upsells || []).includes(item.id));
    upsellsDaPizza.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "upsell-option-card";
        wrapper.innerHTML = `<div><strong>${textoSeguro(item.nome)}</strong><span>+ ${moeda(item.preco)}</span></div><input aria-label="${textoSeguro(tMenu("quantityOf"))} ${textoSeguro(item.nome)}" type="number" id="upsell-${textoSeguro(item.id)}" min="0" value="0">`;
        wrapper.querySelector("input").addEventListener("input", atualizarTotal);
        upsellsArea.appendChild(wrapper);
    });
    const box = $('[data-upsell-box]');
    if (box) box.hidden = SECOES.upsells === false || upsellsDaPizza.length === 0;

    atualizarTotal();
    const modal = byId("modal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => byId("quantidade")?.focus(), 30);
}

function fecharModal() {
    const modal = byId("modal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    if (byId("welcome-screen").classList.contains("escondido")) document.body.style.overflowY = "auto";
    else document.body.style.overflow = "";
    ultimoElementoFocadoAntesDoModal?.focus?.();
}

function pegarUpsellsSelecionados() {
    if (!pizzaSelecionada) return [];
    const upsellsDaPizza = upsellsGlobais.filter(item => (pizzaSelecionada.upsells || []).includes(item.id));
    return upsellsDaPizza.reduce((lista, item) => {
        const inputQtd = byId(`upsell-${item.id}`);
        const qtd = Number(inputQtd?.value) || 0;
        if (qtd > 0) lista.push({ ...item, quantidade: qtd });
        return lista;
    }, []);
}

function calcularTotal() {
    if (!pizzaSelecionada) return 0;
    const quantidade = Math.max(1, Number(byId("quantidade")?.value) || 1);
    const totalPizza = pizzaSelecionada.preco * quantidade;
    const totalUpsells = pegarUpsellsSelecionados().reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    return totalPizza + totalUpsells;
}

function atualizarTotal() {
    if (!pizzaSelecionada) return;
    byId("totalPedido").textContent = `${tMenu("itemTotal")} ${moeda(calcularTotal())}`;
}

function itemAtualDoModal() {
    if (!pizzaSelecionada) return null;
    return {
        uid: `${pizzaSelecionada.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        pizzaId: pizzaSelecionada.id,
        nome: pizzaSelecionada.nome,
        precoUnitario: pizzaSelecionada.preco,
        quantidade: Math.max(1, Number(byId("quantidade")?.value) || 1),
        upsells: pegarUpsellsSelecionados(),
        observacoes: byId("observacoes")?.value.trim() || "",
        subtotal: calcularTotal()
    };
}

/* ========================================================================== 
   CARRINHO MULTIPRODUTO
   ========================================================================== */
function salvarCarrinho() {
    if (window.SR_OFRELIO_CART?.set) {
        carrinho = window.SR_OFRELIO_CART.set(carrinho);
        return;
    }
    try {
        localStorage.setItem(CHECKOUT.chaveLocalStorage || "sr-ofrelio-cardapio-v2", JSON.stringify(carrinho));
    } catch (_) {}
}

function carregarCarrinho() {
    try {
        const salvo = window.SR_OFRELIO_CART?.get
            ? window.SR_OFRELIO_CART.get()
            : JSON.parse(localStorage.getItem(CHECKOUT.chaveLocalStorage || "sr-ofrelio-cardapio-v2") || "[]");
        carrinho = Array.isArray(salvo) ? salvo : [];
    } catch (_) {
        carrinho = [];
    }
    atualizarResumoCarrinho();
}

function adicionarSelecionadoAoCarrinho() {
    const item = itemAtualDoModal();
    if (!item) return;
    carrinho.push(item);
    salvarCarrinho();
    atualizarResumoCarrinho();
    fecharModal();
    mostrarConfirmacaoAdicaoCarrinho(item.nome);
}

function mostrarConfirmacaoAdicaoCarrinho(nomeProduto) {
    const aviso = byId("cart-add-toast");
    if (!aviso) return;

    aviso.textContent = tMenu("addedToCart", { product: nomeProduto });
    aviso.classList.add("is-visible");
    if (temporizadorConfirmacaoCarrinho !== null) window.clearTimeout(temporizadorConfirmacaoCarrinho);
    temporizadorConfirmacaoCarrinho = window.setTimeout(() => {
        aviso.classList.remove("is-visible");
        temporizadorConfirmacaoCarrinho = null;
    }, 2600);
}

function totalCarrinho() {
    if (window.SR_OFRELIO_CART?.total) return window.SR_OFRELIO_CART.total(carrinho);
    return carrinho.reduce((soma, item) => soma + Number(item.subtotal || 0), 0);
}

function quantidadeItensCarrinho() {
    if (window.SR_OFRELIO_CART?.count) return window.SR_OFRELIO_CART.count(carrinho);
    return carrinho.reduce((soma, item) => soma + Number(item.quantidade || 0), 0);
}

function atualizarResumoCarrinho() {
    const btn = byId("cart-floating-button");
    if (!btn) return;
    const qtd = quantidadeItensCarrinho();
    btn.hidden = qtd === 0 || SECOES.carrinho === false;
    byId("cart-floating-text").textContent = `${qtd} ${qtd === 1 ? tMenu("cartItem") : tMenu("cartItems")}`;
    byId("cart-floating-total").textContent = moeda(totalCarrinho());
    if (byId("cartModal")?.classList.contains("active")) renderizarCarrinho();
}

function renderizarCarrinho() {
    const area = byId("cartItems");
    if (!area) return;
    area.innerHTML = "";

    carrinho.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        const produtoConfigurado = pizzas.find((pizza) => pizza.id === item.pizzaId);
        const nomeProduto = produtoConfigurado?.nome || item.nome || "";
        const adicionais = (item.upsells || []).map((up) => {
            const adicionalConfigurado = upsellsGlobais.find((extra) => extra.id === up.id);
            return `${up.quantidade}x ${adicionalConfigurado?.nome || up.nome}`;
        }).join(", ");
        const quantidade = Math.max(1, Number(item.quantidade) || 1);
        const subtotal = window.SR_OFRELIO_CART?.itemSubtotal
            ? window.SR_OFRELIO_CART.itemSubtotal(item)
            : Number(item.subtotal || 0);
        const percentual = Math.max(0, Number(item.descontoPercentual) || 0);
        const precoOriginal = Number(item.precoOriginalUnitario || item.precoUnitario || 0);
        const precoUnitario = Number(item.precoUnitario || 0);
        const temDesconto = percentual > 0 && precoOriginal > Number(item.precoUnitario || 0);

        div.innerHTML = `
          <div class="cart-item-main">
            <strong>${quantidade}x ${textoSeguro(nomeProduto)}</strong>
            <small class="cart-item-unit-price">${textoSeguro(tMenu("unitPrice"))} ${moeda(precoUnitario)} ${textoSeguro(tMenu("each"))}</small>
            ${adicionais ? `<span>+ ${textoSeguro(adicionais)}</span>` : ""}
            ${item.observacoes ? `<small>${textoSeguro(tMenu("observationsPrefix"))} ${textoSeguro(item.observacoes)}</small>` : ""}
            ${temDesconto ? `<small class="cart-item-discount">${textoSeguro(tMenu("discount"))}: ${percentual}%</small>` : ""}
          </div>
          <div class="cart-item-side">
            <div class="cart-item-prices">
              ${temDesconto ? `<span class="cart-item-price-original">${moeda(precoOriginal * quantidade)}</span>` : ""}
              <strong>${moeda(subtotal)}</strong>
            </div>
            <div class="cart-item-controls">
              <button type="button" data-qty-down="${index}" aria-label="${textoSeguro(tMenu("decreaseQuantity"))}" ${quantidade <= 1 ? "disabled" : ""}>−</button>
              <span>${quantidade}</span>
              <button type="button" data-qty-up="${index}" aria-label="${textoSeguro(tMenu("increaseQuantity"))}">+</button>
            </div>
            <button type="button" aria-label="${textoSeguro(tMenu("removeItem"))}" data-remove-index="${index}">${textoSeguro(tMenu("remove"))}</button>
          </div>`;

        div.querySelector("[data-qty-down]")?.addEventListener("click", () => alterarQuantidadeItemCarrinho(index, -1));
        div.querySelector("[data-qty-up]")?.addEventListener("click", () => alterarQuantidadeItemCarrinho(index, 1));
        div.querySelector("[data-remove-index]")?.addEventListener("click", () => removerItemCarrinho(index));
        area.appendChild(div);
    });

    if (!carrinho.length) area.innerHTML = `<div class="empty-cart">${textoSeguro(tMenu("emptyCart"))}</div>`;
    byId("cartTotal").textContent = moeda(totalCarrinho());
    const iniciarCheckout = byId("cart-start-checkout");
    if (iniciarCheckout) iniciarCheckout.disabled = carrinho.length === 0;
    renderizarOfertaCarrinho();
}

function renderizarOfertaCarrinho() {
    const area = byId("cart-upsell-container");
    if (!area) return;

    const oferta = window.SR_OFRELIO_CART?.getOffer?.(IDIOMA_CARDAPIO);
    const jaEstaNoPedido = oferta && carrinho.some((item) => item.pizzaId === oferta.produtoId);
    if (!carrinho.length || !oferta || jaEstaNoPedido) {
        area.hidden = true;
        area.innerHTML = "";
        return;
    }

    const mensagem = oferta.percentualDesconto > 0
        ? tMenu("offerMessageDiscount", { discount: oferta.percentualDesconto })
        : tMenu("offerMessageNoDiscount");
    const badge = oferta.percentualDesconto > 0
        ? `<span class="cart-upsell-badge">${textoSeguro(tMenu("offerDiscountBadge", { discount: oferta.percentualDesconto }))}</span>`
        : "";
    const precos = oferta.percentualDesconto > 0
        ? `<div class="cart-upsell-prices"><del>${moeda(oferta.precoOriginal)}</del><strong>${moeda(oferta.precoPromocional)}</strong></div>`
        : `<div class="cart-upsell-prices"><strong>${moeda(oferta.precoOriginal)}</strong></div>`;

    area.innerHTML = `
      <img class="cart-upsell-image" src="../pizzaD3.png" alt="${textoSeguro(oferta.nome)}" loading="lazy" decoding="async">
      <div class="cart-upsell-copy">
        ${badge}
        <strong>${textoSeguro(tMenu("cartOfferTitle"))} · ${textoSeguro(oferta.nome)}</strong>
        <p>${textoSeguro(mensagem)}</p>
        ${precos}
      </div>
      <button type="button" id="cart-add-sweet-pizza">${textoSeguro(tMenu("offerAdd"))}</button>`;
    area.hidden = false;
    byId("cart-add-sweet-pizza")?.addEventListener("click", adicionarOfertaCarrinho);
}

function adicionarOfertaCarrinho() {
    const resultado = window.SR_OFRELIO_CART?.addOffer?.(IDIOMA_CARDAPIO);
    if (!resultado?.ok) {
        if (resultado?.reason === "already-added") alert(tMenu("offerAlreadyInCart"));
        return;
    }
    carrinho = window.SR_OFRELIO_CART.get();
    atualizarResumoCarrinho();
    renderizarCarrinho();
}

function alterarQuantidadeItemCarrinho(index, variacao) {
    const item = carrinho[index];
    if (!item) return;
    const quantidadeAtual = Math.max(1, Number(item.quantidade) || 1);
    item.quantidade = Math.max(1, quantidadeAtual + Number(variacao || 0));
    item.subtotal = window.SR_OFRELIO_CART?.itemSubtotal
        ? window.SR_OFRELIO_CART.itemSubtotal(item)
        : Number(item.precoUnitario || 0) * item.quantidade;
    salvarCarrinho();
    atualizarResumoCarrinho();
}

function removerItemCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarResumoCarrinho();
    renderizarCarrinho();
}

function esvaziarCarrinho() {
    if (carrinho.length && !window.confirm(tMenu("confirmClear"))) return;
    carrinho = [];
    salvarCarrinho();
    atualizarResumoCarrinho();
    renderizarCarrinho();
}

function preencherOpcoesCheckout() {
    const atendimento = byId("checkoutAtendimento");
    const pagamento = byId("checkoutPagamento");
    atendimento.innerHTML = (CHECKOUT.tiposAtendimento || [])
        .map(item => `<option value="${textoSeguro(item.id)}">${textoSeguro(item.nome)}</option>`)
        .join("");

    const rotulosPagamento = {
        "PIX": tMenu("paymentPix"),
        "Dinheiro": tMenu("paymentCash"),
        "Cartão na entrega/retirada": tMenu("paymentCard")
    };
    pagamento.innerHTML = `<option value="">${textoSeguro(tMenu("selectPayment"))}</option>` +
        (CHECKOUT.pagamentos || []).map(item =>
            `<option value="${textoSeguro(item)}">${textoSeguro(rotulosPagamento[item] || item)}</option>`
        ).join("");
    atualizarCamposCheckout();
}

function atualizarCamposCheckout() {
    const tipo = byId("checkoutAtendimento")?.value;
    const pagamento = byId("checkoutPagamento")?.value;
    const campoEndereco = $(".checkout-address-field");
    const campoTroco = $(".checkout-change-field");
    if (campoEndereco) campoEndereco.hidden = tipo === "retirada";
    if (campoTroco) campoTroco.hidden = !(CHECKOUT.pedirTrocoQuandoDinheiro && pagamento === "Dinheiro");
}

function definirEtapaCheckoutCarrinho(ativa) {
    const etapa = byId("cart-checkout-stage");
    const acoes = byId("cart-preview-actions");
    if (etapa) etapa.hidden = !ativa;
    if (acoes) acoes.hidden = ativa;
    if (ativa) window.setTimeout(() => byId("checkoutNome")?.focus(), 30);
}

function iniciarCheckoutCarrinho() {
    if (!carrinho.length) {
        alert(tMenu("checkoutEmpty"));
        return;
    }
    definirEtapaCheckoutCarrinho(true);
}

function voltarResumoCarrinho() {
    definirEtapaCheckoutCarrinho(false);
    byId("cart-start-checkout")?.focus();
}

function abrirCarrinho(opcoes = {}) {
    ultimoElementoFocadoAntesDoModal = document.activeElement;
    if (window.SR_OFRELIO_CART?.get) carrinho = window.SR_OFRELIO_CART.get();
    definirEtapaCheckoutCarrinho(opcoes.checkout === true);
    renderizarCarrinho();
    atualizarEstadoLoja();
    const modal = byId("cartModal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (opcoes.checkout !== true) window.setTimeout(() => byId("cart-start-checkout")?.focus(), 30);
}

function fecharCarrinho() {
    const modal = byId("cartModal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    ultimoElementoFocadoAntesDoModal?.focus?.();
}

function dadosCheckout() {
    return {
        nome: byId("checkoutNome")?.value.trim() || "",
        atendimento: byId("checkoutAtendimento")?.value || "",
        endereco: byId("checkoutEndereco")?.value.trim() || "",
        pagamento: byId("checkoutPagamento")?.value || "",
        troco: byId("checkoutTroco")?.value.trim() || "",
        observacoes: byId("checkoutObservacoes")?.value.trim() || ""
    };
}

function validarCheckout(dados) {
    if (!carrinho.length) return tMenu("checkoutEmpty");
    if (CHECKOUT.exigirNome && !dados.nome) return tMenu("checkoutEnterName");
    if (CHECKOUT.exigirFormaAtendimento && !dados.atendimento) return tMenu("checkoutChooseService");
    if (CHECKOUT.exigirEnderecoNaEntrega && dados.atendimento === "entrega" && !dados.endereco) return tMenu("checkoutEnterAddress");
    if (CHECKOUT.exigirPagamento && !dados.pagamento) return tMenu("checkoutChoosePayment");
    return "";
}

function nomeTipoAtendimento(id) {
    return (CHECKOUT.tiposAtendimento || []).find(item => item.id === id)?.nome || id || tMenu("notInformed");
}

function montarMensagemWhatsApp(dados) {
    const contexto = obterContextoHorarioOperacional();
    contextoHorarioAtual = contexto;
    const estado = chaveEstadoAtual();
    const estadoLabel = CARDAPIO_CONFIG.textosEstado?.[estado]?.status || estado;
    const linhas = [];
    linhas.push(`🍕 *${tMenu("whatsappOrderTitle")} — ${DADOS_SITE.nome || "VENEZA FUOCO"}*`);
    linhas.push("");
    linhas.push(`🟢 *${tMenu("serviceStatus")}* ${estadoLabel}`);
    linhas.push(`🕒 *${tMenu("sentAt")}* ${contexto.data} ${IDIOMA_CARDAPIO === "en" ? "at" : IDIOMA_CARDAPIO === "es" ? "a las" : "às"} ${contexto.hora}`);
    if (contexto.mensagemExcecao) linhas.push(`ℹ️ *${tMenu("notice")}* ${contexto.mensagemExcecao}`);
    linhas.push("");
    linhas.push(`👤 *${tMenu("customer")}*`);
    linhas.push(`${tMenu("name")} ${dados.nome || tMenu("notInformed")}`);
    linhas.push(`${tMenu("serviceType")} ${nomeTipoAtendimento(dados.atendimento)}`);
    if (dados.atendimento === "entrega") linhas.push(`${tMenu("address")} ${dados.endereco || tMenu("notInformed")}`);
    else if (dados.atendimento === "retirada") linhas.push(`${tMenu("pickup")} ${ENDERECO.texto || (IDIOMA_CARDAPIO === "en" ? "At the counter" : IDIOMA_CARDAPIO === "es" ? "En el mostrador" : "No balcão")}`);
    linhas.push(`${tMenu("payment")} ${dados.pagamento === "Dinheiro" ? tMenu("paymentCash") : dados.pagamento === "Cartão na entrega/retirada" ? tMenu("paymentCard") : dados.pagamento || tMenu("notInformed")}`);
    if (dados.pagamento === "Dinheiro") linhas.push(`${tMenu("changeFor")} ${dados.troco || tMenu("notInformed")}`);
    linhas.push("");
    linhas.push(`🧾 *${tMenu("orderItems")}*`);

    carrinho.forEach((item, index) => {
        const produtoConfigurado = pizzas.find((pizza) => pizza.id === item.pizzaId);
        const nomeProduto = produtoConfigurado?.nome || item.nome;
        const quantidade = Math.max(1, Number(item.quantidade) || 1);
        const precoOriginal = Number(item.precoOriginalUnitario || item.precoUnitario || 0);
        const precoUnitario = Number(item.precoUnitario || 0);
        const percentual = Math.max(0, Number(item.descontoPercentual) || 0);
        const subtotal = window.SR_OFRELIO_CART?.itemSubtotal
            ? window.SR_OFRELIO_CART.itemSubtotal(item)
            : Number(item.subtotal || 0);

        linhas.push(`\n${index + 1}. *${quantidade}x ${nomeProduto}*`);
        if (percentual > 0 && precoOriginal > precoUnitario) {
            linhas.push(`   ${tMenu("originalPrice")} ${moeda(precoOriginal)} ${tMenu("each")}`);
            linhas.push(`   ${tMenu("discount")}: ${percentual}%`);
            linhas.push(`   ${tMenu("unitPromotionalPrice")} ${moeda(precoUnitario)} ${tMenu("each")}`);
        } else {
            linhas.push(`   ${tMenu("baseValue")} ${moeda(precoUnitario)} ${tMenu("each")}`);
        }

        if (item.upsells?.length) {
            linhas.push(`   ${tMenu("extras")}`);
            item.upsells.forEach(up => {
                const adicionalConfigurado = upsellsGlobais.find((extra) => extra.id === up.id);
                linhas.push(`   • ${up.quantidade}x ${adicionalConfigurado?.nome || up.nome} (+ ${moeda(up.preco)} ${tMenu("each")})`);
            });
        } else {
            linhas.push(`   ${tMenu("noAdditions")}`);
        }
        if (item.observacoes) linhas.push(`   ${tMenu("itemNote")} ${item.observacoes}`);
        linhas.push(`   ${tMenu("subtotal")} ${moeda(subtotal)}`);
    });

    linhas.push("");
    linhas.push(`💰 *${tMenu("estimatedOrderTotal")} ${moeda(totalCarrinho())}*`);
    if (CHECKOUT.observacaoTotal) linhas.push(`_${CHECKOUT.observacaoTotal}_`);
    if (dados.observacoes) {
        linhas.push("");
        linhas.push(`📝 *${tMenu("generalNotes")}* ${dados.observacoes}`);
    }
    linhas.push("");
    linhas.push(estado === "aberto" ? `✅ ${tMenu("orderSent")}` : `📅 ${tMenu("orderScheduled")}`);
    return linhas.join("\n");
}

async function finalizarCarrinhoNoWhatsApp() {
    if (window.SR_OFRELIO_CART?.get) carrinho = window.SR_OFRELIO_CART.get();
    const dados = dadosCheckout();
    const erro = validarCheckout(dados);
    if (erro) { alert(erro); return; }

    const popupAbertura = window.open("about:blank", "_blank", "noopener,noreferrer");
    const pedido = {
        data: new Date().toISOString(),
        contextoHorario: obterContextoHorarioOperacional(),
        cliente: dados,
        itens: carrinho,
        total: totalCarrinho(),
        origem: "cardapio-premium",
        idioma: IDIOMA_CARDAPIO
    };

    if (window.SR_OFRELIO_OPERACAO && typeof window.SR_OFRELIO_OPERACAO.atualizar === "function") {
        try {
            await window.SR_OFRELIO_OPERACAO.atualizar();
            pedido.contextoHorario = obterContextoHorarioOperacional();
            if (typeof window.atualizarEstadoLoja === "function") window.atualizarEstadoLoja();
        } catch (error) {
            console.warn("Não foi possível confirmar o estado remoto antes do envio do WhatsApp.", error);
        }
    }

    const mensagemFinal = montarMensagemWhatsApp(dados);
    const linkFinal = gerarLinkWhatsApp(mensagemFinal);

    registrarEvento({ tipo: "pedido_whatsapp", ...pedido, mensagem: mensagemFinal, contextoHorario: pedido.contextoHorario });

    if (popupAbertura) {
        popupAbertura.location.href = linkFinal;
        return;
    }

    window.open(linkFinal, "_blank", "noopener,noreferrer");
}

/* Mantém a função pública original. Agora o fluxo direto transforma o item atual em pedido completo. */
async function finalizarPedido() {
    const item = itemAtualDoModal();
    if (!item) return;
    carrinho.push(item);
    salvarCarrinho();
    atualizarResumoCarrinho();
    fecharModal();
    abrirCarrinho({ checkout: true });
}

/* ========================================================================== 
   INTEGRAÇÕES — preservadas, agora controladas por flags do CONFIG
   ========================================================================== */
function registrarEvento(payload) {
    enviarParaN8N(payload);
    enviarParaAppsScript(payload);
}

async function enviarParaN8N(pedido) {
    if (!CONFIG.n8nAtivo || !urlConfiguradaValida(CONFIG.n8nWebhook)) return;
    try {
        await fetch(CONFIG.n8nWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pedido) });
    } catch (error) { console.error("Erro N8N:", error); }
}

async function enviarParaAppsScript(pedido) {
    if (!CONFIG.googleAppsScriptAtivo || !urlConfiguradaValida(CONFIG.googleAppsScript)) return;
    try {
        await fetch(CONFIG.googleAppsScript, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pedido) });
    } catch (error) { console.error("Erro AppsScript:", error); }
}

function configurarLinksDelivery() {
    $$('[data-canal="ifood"]').forEach(link => {
        const url = CONFIG.ifoodUrl || LINKS.ifood;
        link.href = url || "#";
        link.addEventListener("click", (event) => {
            if (!urlConfiguradaValida(url)) {
                event.preventDefault();
                alert(tMenu("ifoodNotConfigured"));
            } else {
                registrarEvento({ tipo: "clique_canal_externo", canal: "ifood", origem: "cardapio-premium" });
            }
        });
    });
    $$('[data-canal="dochef"]').forEach(link => {
        const url = CONFIG.dochefUrl || LINKS.dochef;
        link.href = url || "#";
        link.addEventListener("click", (event) => {
            if (!urlConfiguradaValida(url)) {
                event.preventDefault();
                alert(tMenu("dochefNotConfigured"));
            } else {
                registrarEvento({ tipo: "clique_canal_externo", canal: "dochef", origem: "cardapio-premium" });
            }
        });
    });
}

function configurarModaisAcessiveis() {
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (byId("cartModal")?.classList.contains("active")) fecharCarrinho();
        else if (byId("modal")?.classList.contains("active")) fecharModal();
    });
    ["modal", "cartModal"].forEach(id => {
        byId(id)?.addEventListener("click", (event) => {
            if (event.target.id === id) id === "modal" ? fecharModal() : fecharCarrinho();
        });
    });
}

function configurarSincronizacaoCarrinho() {
    if (!window.SR_OFRELIO_CART?.subscribe) return;
    window.SR_OFRELIO_CART.subscribe((itens) => {
        carrinho = Array.isArray(itens) ? itens : [];
        atualizarResumoCarrinho();
        if (byId("cartModal")?.classList.contains("active")) renderizarCarrinho();
    });
}

function inicializarCardapio() {
    configurarSomInterface();
    aplicarConfiguracoesDoSite();
    configurarLinksDelivery();
    gerarNavegacaoBemVindo();
    preencherOpcoesCheckout();
    carregarCarrinho();
    configurarSincronizacaoCarrinho();
    atualizarEstadoLoja();
    configurarModaisAcessiveis();
    setInterval(atualizarEstadoLoja, 60000);

    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get("openCart") === "1" && carrinho.length) {
        window.setTimeout(() => abrirCarrinho({ checkout: parametros.get("checkout") === "1" }), 80);
    }
}

inicializarCardapio();
