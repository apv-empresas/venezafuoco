(function () {
  "use strict";

  const STORAGE_KEY = "sr-ofrelio-cardapio-v2";
  const EVENT_NAME = "sr-ofrelio:cart-change";

  function obterChaveArmazenamento() {
    const config = window.CARDAPIO_CONFIG_BASE || window.CARDAPIO_CONFIG || {};
    return config.checkout?.chaveLocalStorage || STORAGE_KEY;
  }

  function arredondar(valor) {
    return Math.round((Number(valor || 0) + Number.EPSILON) * 100) / 100;
  }

  function ler() {
    try {
      const valor = JSON.parse(window.localStorage.getItem(obterChaveArmazenamento()) || "[]");
      return Array.isArray(valor) ? valor : [];
    } catch (erro) {
      console.warn("[Carrinho compartilhado] Não foi possível ler o carrinho.", erro);
      return [];
    }
  }

  function calcularSubtotalItem(item) {
    if (!item || typeof item !== "object") return 0;
    const quantidade = Math.max(1, Number(item.quantidade) || 1);
    const precoUnitario = Math.max(0, Number(item.precoUnitario) || 0);
    const totalAdicionais = (Array.isArray(item.upsells) ? item.upsells : [])
      .reduce((total, adicional) => {
        const qtd = Math.max(0, Number(adicional.quantidade) || 0);
        const preco = Math.max(0, Number(adicional.preco) || 0);
        return total + qtd * preco;
      }, 0);
    return arredondar(precoUnitario * quantidade + totalAdicionais);
  }

  function normalizarItens(itens) {
    return (Array.isArray(itens) ? itens : []).map((item) => ({
      ...item,
      quantidade: Math.max(1, Number(item?.quantidade) || 1),
      upsells: Array.isArray(item?.upsells) ? item.upsells : [],
      subtotal: calcularSubtotalItem(item)
    }));
  }

  function notificar(itens) {
    const detalhe = { items: normalizarItens(itens) };
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: detalhe }));
    } catch (_) {}
  }

  function salvar(itens) {
    const normalizados = normalizarItens(itens);
    try {
      window.localStorage.setItem(obterChaveArmazenamento(), JSON.stringify(normalizados));
    } catch (erro) {
      console.warn("[Carrinho compartilhado] Não foi possível salvar o carrinho.", erro);
    }
    notificar(normalizados);
    return normalizados;
  }

  function obterConfigCardapio(idioma) {
    const base = window.CARDAPIO_CONFIG_BASE || window.CARDAPIO_CONFIG || {};
    if (window.CARDAPIO_I18N && typeof window.CARDAPIO_I18N.applyConfig === "function") {
      return window.CARDAPIO_I18N.applyConfig(base, idioma || "pt");
    }
    try { return JSON.parse(JSON.stringify(base)); } catch (_) { return base; }
  }

  function obterOferta(idioma) {
    const config = obterConfigCardapio(idioma);
    const ofertaConfig = config.upsellCarrinho || {};
    if (ofertaConfig.ativo !== true) return null;

    const produto = (Array.isArray(config.pizzas) ? config.pizzas : [])
      .find((item) => item.id === ofertaConfig.produtoId && item.ativo !== false);
    if (!produto) return null;

    const precoOriginal = Math.max(0, Number(produto.preco) || 0);
    const percentual = Math.min(100, Math.max(0, Number(ofertaConfig.percentualDesconto) || 0));
    const precoPromocional = arredondar(precoOriginal * (1 - percentual / 100));

    return {
      produtoId: produto.id,
      nome: produto.nome,
      descricao: produto.descricao || "",
      imagem: produto.imagem || "",
      precoOriginal,
      percentualDesconto: percentual,
      precoPromocional,
      ativo: true
    };
  }

  function adicionarOferta(idioma) {
    const oferta = obterOferta(idioma);
    if (!oferta) return { ok: false, reason: "inactive" };

    const itens = ler();
    if (itens.some((item) => item.pizzaId === oferta.produtoId)) {
      return { ok: false, reason: "already-added" };
    }

    const item = {
      uid: `${oferta.produtoId}-cart-upsell-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      pizzaId: oferta.produtoId,
      nome: oferta.nome,
      precoUnitario: oferta.precoPromocional,
      precoOriginalUnitario: oferta.precoOriginal,
      descontoPercentual: oferta.percentualDesconto,
      origemUpsellCarrinho: true,
      quantidade: 1,
      upsells: [],
      observacoes: "",
      subtotal: oferta.precoPromocional
    };

    itens.push(item);
    salvar(itens);
    return { ok: true, item };
  }

  function assinar(callback) {
    if (typeof callback !== "function") return function () {};

    const aoAlterar = (event) => {
      callback(normalizarItens(event?.detail?.items || ler()));
    };
    const aoAlterarStorage = (event) => {
      if (event.key === obterChaveArmazenamento() || event.key === null) callback(ler());
    };

    window.addEventListener(EVENT_NAME, aoAlterar);
    window.addEventListener("storage", aoAlterarStorage);

    return function cancelar() {
      window.removeEventListener(EVENT_NAME, aoAlterar);
      window.removeEventListener("storage", aoAlterarStorage);
    };
  }

  window.SR_OFRELIO_CART = {
    get key() { return obterChaveArmazenamento(); },
    get: ler,
    set: salvar,
    subscribe: assinar,
    getMenuConfig: obterConfigCardapio,
    getOffer: obterOferta,
    addOffer: adicionarOferta,
    itemSubtotal: calcularSubtotalItem,
    total: (itens) => normalizarItens(itens).reduce((total, item) => total + item.subtotal, 0),
    count: (itens) => normalizarItens(itens).reduce((total, item) => total + item.quantidade, 0)
  };
})();
