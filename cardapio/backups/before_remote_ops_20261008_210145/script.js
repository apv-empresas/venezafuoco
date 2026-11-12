"use strict";

/* ========================================================================== 
   CONFIGURAÇÃO E ESTADO
   Mantém os nomes públicos do projeto original e adiciona funcionalidades.
   ========================================================================== */
const CARDAPIO_CONFIG = window.CARDAPIO_CONFIG || {};
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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const byId = (id) => document.getElementById(id);

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
        "--aiqfome-purple": TEMA.aiqfomePurple,
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
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem || "Olá! Vim pelo cardápio da Sr. Ofrélio.")}`;
}

function aplicarConfiguracoesDoSite() {
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

    setTexto("[data-texto-boas-vindas]", DADOS_SITE.textoBoasVindas || "Seja bem-vindo");
    setTexto("[data-subtitulo-boas-vindas]", DADOS_SITE.subtituloBoasVindas || "");
    setTexto("[data-titulo-cardapio]", DADOS_SITE.tituloCardapio || "Cardápio");
    setTexto("[data-subtitulo-cardapio]", DADOS_SITE.subtituloCardapio || "");
    setTexto("[data-botao-voltar-site]", BOTOES.voltarSite || "← Voltar para o site");
    setTexto("[data-botao-voltar-categorias]", BOTOES.voltarCategorias || "← Voltar para categorias");
    setTexto("[data-botao-adicionar]", BOTOES.adicionarCarrinho || "Adicionar ao pedido");
    setTexto("[data-botao-finalizar]", BOTOES.finalizarPedido || "Finalizar pelo WhatsApp");
    setTexto("[data-total-note]", CHECKOUT.observacaoTotal || "");

    $$('[data-footer-slogan]').forEach((item) => item.textContent = DADOS_SITE.slogan || "");
    $$('[data-footer-endereco]').forEach((item) => item.textContent = ENDERECO.texto ? `📍 ${ENDERECO.texto}` : "");
    $$('[data-footer-whatsapp]').forEach((item) => item.textContent = CONTATO.whatsappExibicao ? `📱 WhatsApp: ${CONTATO.whatsappExibicao}` : "");
    $$('[data-footer-horario]').forEach((item) => item.textContent = montarTextoHorarioFooter());
    $$('[data-footer-direitos]').forEach((item) => item.innerHTML = `&copy; ${new Date().getFullYear()} ${textoSeguro(DADOS_SITE.nome || "")}. Todos os direitos reservados.`);

    setAtributo("[data-instagram-link]", "href", LINKS.instagram);
    setAtributo("[data-site-principal]", "href", LINKS.sitePrincipal);
    setAtributo("[data-footer-endereco-link]", "href", LINKS.googleMaps || ENDERECO.googleMaps);
    setAtributo("[data-footer-whatsapp-link]", "href", gerarLinkWhatsApp("Olá! Vim pelo cardápio e gostaria de falar com a Sr. Ofrélio."));
    setAtributo("[data-whatsapp-principal]", "href", gerarLinkWhatsApp("Olá! Vim pelo cardápio da Sr. Ofrélio e gostaria de fazer um pedido."));

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

function obterContextoHorarioOperacional(agora = new Date()) {
    const dataHora = obterDataHoraOperacional(agora);
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
        if (titulo) titulo.textContent = contextoHorarioAtual.mensagemExcecao || textos.status || "Status da loja";
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
    const nomes = { domingo: "Dom", segunda: "Seg", terca: "Ter", quarta: "Qua", quinta: "Qui", sexta: "Sex", sabado: "Sáb" };
    const ativos = Object.entries(dias).filter(([, ativo]) => ativo).map(([dia]) => nomes[dia]);
    if (!ativos.length) return HORARIOS.textoFooter || "Consulte nossos horários";
    return `🕒 ${ativos.join(", ")} · ${HORARIOS.abertoInicio || ""} às ${HORARIOS.abertoFim || ""}`;
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
        button.setAttribute("aria-label", `Abrir ${cat}`);
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
    return [pizza.tamanho, pizza.pedacos ? `${pizza.pedacos} pedaços` : "", pizza.serve ? `Serve ${pizza.serve}` : ""].filter(Boolean);
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
                    <div class="delivery-card-buttons" aria-label="Aplicativos alternativos">
                        <a class="delivery-channel-btn ifood" href="${textoSeguro(CONFIG.ifoodUrl || LINKS.ifood || "#")}" target="_blank" rel="noopener">iFood</a>
                        <a class="delivery-channel-btn aiqfome" href="${textoSeguro(CONFIG.aiqfomeUrl || LINKS.aiqfome || "#")}" target="_blank" rel="noopener">aiqfome</a>
                    </div>
                </div>`;
            row.querySelector(".btn-pedir").addEventListener("click", () => abrirModal(pizza.id));
            menu.appendChild(row);
        });
    });
}

function abrirCanalPedido(canal, event) {
    if (event) event.stopPropagation();
    const url = canal === "ifood" ? (CONFIG.ifoodUrl || LINKS.ifood) : (CONFIG.aiqfomeUrl || LINKS.aiqfome);
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
    byId("endereco").value = byId("checkoutEndereco")?.value || "";
    byId("observacoes").value = "";

    const upsellsArea = byId("upsellsArea");
    upsellsArea.innerHTML = "";
    const upsellsDaPizza = upsellsGlobais.filter(item => (pizzaSelecionada.upsells || []).includes(item.id));
    upsellsDaPizza.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "upsell-option-card";
        wrapper.innerHTML = `<div><strong>${textoSeguro(item.nome)}</strong><span>+ ${moeda(item.preco)}</span></div><input aria-label="Quantidade de ${textoSeguro(item.nome)}" type="number" id="upsell-${textoSeguro(item.id)}" min="0" value="0">`;
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
    byId("totalPedido").textContent = `Total deste item: ${moeda(calcularTotal())}`;
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
    try { localStorage.setItem(CHECKOUT.chaveLocalStorage || "cardapio-carrinho", JSON.stringify(carrinho)); } catch (_) {}
}

function carregarCarrinho() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHECKOUT.chaveLocalStorage || "cardapio-carrinho") || "[]");
        carrinho = Array.isArray(salvo) ? salvo : [];
    } catch (_) { carrinho = []; }
    atualizarResumoCarrinho();
}

function adicionarSelecionadoAoCarrinho() {
    const item = itemAtualDoModal();
    if (!item) return;
    carrinho.push(item);
    if (byId("endereco")?.value.trim() && byId("checkoutEndereco")) byId("checkoutEndereco").value = byId("endereco").value.trim();
    salvarCarrinho();
    atualizarResumoCarrinho();
    fecharModal();
    abrirCarrinho();
}

function totalCarrinho() {
    return carrinho.reduce((soma, item) => soma + Number(item.subtotal || 0), 0);
}

function quantidadeItensCarrinho() {
    return carrinho.reduce((soma, item) => soma + Number(item.quantidade || 0), 0);
}

function atualizarResumoCarrinho() {
    const btn = byId("cart-floating-button");
    if (!btn) return;
    const qtd = quantidadeItensCarrinho();
    btn.hidden = qtd === 0 || SECOES.carrinho === false;
    byId("cart-floating-text").textContent = `${qtd} ${qtd === 1 ? "item" : "itens"}`;
    byId("cart-floating-total").textContent = moeda(totalCarrinho());
    if (byId("cartModal")?.classList.contains("active")) renderizarCarrinho();
}

function renderizarCarrinho() {
    const area = byId("cartItems");
    area.innerHTML = "";
    carrinho.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        const adicionais = (item.upsells || []).map(up => `${up.quantidade}x ${up.nome}`).join(", ");
        div.innerHTML = `
          <div class="cart-item-main">
            <strong>${item.quantidade}x ${textoSeguro(item.nome)}</strong>
            ${adicionais ? `<span>+ ${textoSeguro(adicionais)}</span>` : ""}
            ${item.observacoes ? `<small>Obs.: ${textoSeguro(item.observacoes)}</small>` : ""}
          </div>
          <div class="cart-item-side"><strong>${moeda(item.subtotal)}</strong><button type="button" aria-label="Remover item" data-remove-index="${index}">Remover</button></div>`;
        div.querySelector("button").addEventListener("click", () => removerItemCarrinho(index));
        area.appendChild(div);
    });
    if (!carrinho.length) area.innerHTML = `<div class="empty-cart">Seu pedido está vazio.</div>`;
    byId("cartTotal").textContent = moeda(totalCarrinho());
}

function removerItemCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarResumoCarrinho();
    renderizarCarrinho();
}

function esvaziarCarrinho() {
    if (carrinho.length && !window.confirm("Deseja realmente esvaziar o pedido?")) return;
    carrinho = [];
    salvarCarrinho();
    atualizarResumoCarrinho();
    renderizarCarrinho();
}

function preencherOpcoesCheckout() {
    const atendimento = byId("checkoutAtendimento");
    const pagamento = byId("checkoutPagamento");
    atendimento.innerHTML = (CHECKOUT.tiposAtendimento || []).map(item => `<option value="${textoSeguro(item.id)}">${textoSeguro(item.nome)}</option>`).join("");
    pagamento.innerHTML = `<option value="">Selecione...</option>` + (CHECKOUT.pagamentos || []).map(item => `<option value="${textoSeguro(item)}">${textoSeguro(item)}</option>`).join("");
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

function abrirCarrinho() {
    ultimoElementoFocadoAntesDoModal = document.activeElement;
    renderizarCarrinho();
    atualizarEstadoLoja();
    const modal = byId("cartModal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => byId("checkoutNome")?.focus(), 30);
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
    if (!carrinho.length) return "Adicione pelo menos um item ao pedido.";
    if (CHECKOUT.exigirNome && !dados.nome) return "Informe seu nome.";
    if (CHECKOUT.exigirFormaAtendimento && !dados.atendimento) return "Escolha entrega ou retirada.";
    if (CHECKOUT.exigirEnderecoNaEntrega && dados.atendimento === "entrega" && !dados.endereco) return "Informe o endereço de entrega.";
    if (CHECKOUT.exigirPagamento && !dados.pagamento) return "Escolha a forma de pagamento.";
    return "";
}

function nomeTipoAtendimento(id) {
    return (CHECKOUT.tiposAtendimento || []).find(item => item.id === id)?.nome || id || "Não informado";
}

function montarMensagemWhatsApp(dados) {
    const contexto = obterContextoHorarioOperacional();
    contextoHorarioAtual = contexto;
    const estado = chaveEstadoAtual();
    const estadoLabel = CARDAPIO_CONFIG.textosEstado?.[estado]?.status || estado;
    const linhas = [];
    linhas.push(`🍕 *NOVO PEDIDO — ${DADOS_SITE.nome || "Sr. Ofrélio"}*`);
    linhas.push("");
    linhas.push(`🟢 *Situação do atendimento:* ${estadoLabel}`);
    linhas.push(`🕒 *Enviado em:* ${contexto.data} às ${contexto.hora}`);
    if (contexto.mensagemExcecao) linhas.push(`ℹ️ *Aviso:* ${contexto.mensagemExcecao}`);
    linhas.push("");
    linhas.push("👤 *CLIENTE*");
    linhas.push(`Nome: ${dados.nome || "Não informado"}`);
    linhas.push(`Forma: ${nomeTipoAtendimento(dados.atendimento)}`);
    if (dados.atendimento === "entrega") linhas.push(`Endereço: ${dados.endereco || "Não informado"}`);
    else if (dados.atendimento === "retirada") linhas.push(`Retirada: ${ENDERECO.texto || "No balcão"}`);
    linhas.push(`Pagamento: ${dados.pagamento || "Não informado"}`);
    if (dados.pagamento === "Dinheiro") linhas.push(`Troco para: ${dados.troco || "Não informado"}`);
    linhas.push("");
    linhas.push("🧾 *ITENS DO PEDIDO*");

    carrinho.forEach((item, index) => {
        linhas.push(`\n${index + 1}. *${item.quantidade}x ${item.nome}*`);
        linhas.push(`   Valor base: ${moeda(item.precoUnitario)} cada`);
        if (item.upsells?.length) {
            linhas.push("   Adicionais:");
            item.upsells.forEach(up => linhas.push(`   • ${up.quantidade}x ${up.nome} (+ ${moeda(up.preco)} cada)`));
        } else {
            linhas.push("   Adicionais: nenhum");
        }
        if (item.observacoes) linhas.push(`   Observação: ${item.observacoes}`);
        linhas.push(`   Subtotal: ${moeda(item.subtotal)}`);
    });

    linhas.push("");
    linhas.push(`💰 *TOTAL ESTIMADO: ${moeda(totalCarrinho())}*`);
    if (CHECKOUT.observacaoTotal) linhas.push(`_${CHECKOUT.observacaoTotal}_`);
    if (dados.observacoes) {
        linhas.push("");
        linhas.push(`📝 *Observações gerais:* ${dados.observacoes}`);
    }
    linhas.push("");
    linhas.push(estado === "aberto" ? "✅ Pedido enviado para confirmação." : "📅 Pedido enviado como agendamento, sujeito à confirmação do atendimento.");
    return linhas.join("\n");
}

async function finalizarCarrinhoNoWhatsApp() {
    const dados = dadosCheckout();
    const erro = validarCheckout(dados);
    if (erro) { alert(erro); return; }
    const pedido = {
        data: new Date().toISOString(),
        contextoHorario: obterContextoHorarioOperacional(),
        cliente: dados,
        itens: carrinho,
        total: totalCarrinho(),
        origem: "cardapio-premium"
    };
    registrarEvento({ tipo: "pedido_whatsapp", ...pedido });
    window.open(gerarLinkWhatsApp(montarMensagemWhatsApp(dados)), "_blank", "noopener,noreferrer");
}

/* Mantém a função pública original. Agora o fluxo direto transforma o item atual em pedido completo. */
async function finalizarPedido() {
    const item = itemAtualDoModal();
    if (!item) return;
    carrinho.push(item);
    if (byId("endereco")?.value.trim() && byId("checkoutEndereco")) byId("checkoutEndereco").value = byId("endereco").value.trim();
    salvarCarrinho();
    atualizarResumoCarrinho();
    fecharModal();
    abrirCarrinho();
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
            if (!urlConfiguradaValida(url)) { event.preventDefault(); alert("O link do iFood ainda precisa ser configurado no config.js."); }
            else registrarEvento({ tipo: "clique_canal_externo", canal: "ifood", origem: "cardapio-premium" });
        });
    });
    $$('[data-canal="aiqfome"]').forEach(link => {
        const url = CONFIG.aiqfomeUrl || LINKS.aiqfome;
        link.href = url || "#";
        link.addEventListener("click", (event) => {
            if (!urlConfiguradaValida(url)) { event.preventDefault(); alert("O link do aiqfome ainda precisa ser configurado no config.js."); }
            else registrarEvento({ tipo: "clique_canal_externo", canal: "aiqfome", origem: "cardapio-premium" });
        });
    });
}

/* ========================================================================== 
   ACESSIBILIDADE E INICIALIZAÇÃO
   ========================================================================== */
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

function inicializarCardapio() {
    aplicarConfiguracoesDoSite();
    configurarLinksDelivery();
    gerarNavegacaoBemVindo();
    preencherOpcoesCheckout();
    carregarCarrinho();
    atualizarEstadoLoja();
    configurarModaisAcessiveis();
    setInterval(atualizarEstadoLoja, 60000);
}

inicializarCardapio();
