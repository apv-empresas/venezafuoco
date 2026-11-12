/**
 * Sr. Ofrélio — recepção dos estados publicados no Cloudflare Worker.
 * Este arquivo é PÚBLICO. Não coloque nele senhas, WRITE_TOKEN ou IDs de planilha.
 * Contrato: window.SR_OFRELIO_OPERACAO.modoAtual() -> null|aberto|fechado|preAtendimento
 */
(function () {
  'use strict';

  const URL_API = 'https://horariossites.apvaprovados.workers.dev/v1/operacao';
  const INTERVALO_MS = 10000;
  const TIMEOUT_MS = 7000;
  const MODOS = new Set(['automatico', 'preAtendimento', 'aberto', 'fechado']);
  let recebido = null;
  let ultimaLeitura = null;
  let emAndamento = false;
  let avisoDado = false;

  function modoAtual() {
    return recebido && recebido.modo !== 'automatico' ? recebido.modo : null;
  }
  function estadoConexao() {
    return {
      modo: recebido?.modo || null,
      atualizadoEm: recebido?.atualizadoEm || null,
      revisao: recebido?.revisao || null,
      ultimaLeitura,
      conectado: !!recebido
    };
  }
  function notificarMudanca() {
    if (document.readyState === 'loading') return;
    if (typeof window.forcarAtualizacaoHorarioLoja === 'function') {
      window.forcarAtualizacaoHorarioLoja();
    } else if (typeof window.verificarHorarioLoja === 'function') {
      window.verificarHorarioLoja();
    }
  }
  async function atualizar() {
    if (emAndamento) return false;
    emAndamento = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const resposta = await fetch(URL_API, {
        method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit',
        signal: controller.signal
      });
      if (!resposta.ok) throw Error('HTTP ' + resposta.status);
      const dados = await resposta.json();
      if (!dados || dados.schemaVersion !== 1 || !MODOS.has(dados.modo) ||
          typeof dados.atualizadoEm !== 'string' ||
          typeof dados.revisao !== 'string') {
        throw Error('Resposta de estado inválida');
      }
      const houveMudanca = !recebido || recebido.modo !== dados.modo;
      recebido = {modo: dados.modo, atualizadoEm: dados.atualizadoEm, revisao: dados.revisao};
      ultimaLeitura = new Date().toISOString();
      avisoDado = false;
      if (houveMudanca) notificarMudanca();
      return true;
    } catch (erro) {
      // Primeira falha: mantém horários automáticos. Falhas posteriores: último estado válido.
      if (!avisoDado) {
        console.warn('[Sr. Ofrélio] Estado remoto temporariamente indisponível:', erro.message);
        avisoDado = true;
      }
      return false;
    } finally {
      clearTimeout(timeout);
      emAndamento = false;
    }
  }

  window.SR_OFRELIO_OPERACAO = Object.freeze({modoAtual, estadoConexao, atualizar});
  atualizar();
  setInterval(atualizar, INTERVALO_MS);
  window.addEventListener('pageshow', atualizar);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) atualizar();
  });
})();
