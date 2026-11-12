(function () {
    "use strict";

    const API_URL = "https://horariossites.apvaprovados.workers.dev/v1/operacao";
    const MODOS_VALIDOS = new Set(["automatico", "aberto", "fechado", "preAtendimento"]);

    const estado = {
        ultimoModoManual: null,
        statusConexao: "indefinido",
        ultimaResposta: null,
        ultimaAtualizacao: null,
        consultaEmAndamento: false,
        observadores: []
    };

    function normalizarModo(modo) {
        const valor = String(modo ?? "").trim().toLowerCase();
        if (!valor) return null;

        const mapa = {
            automatico: "automatico",
            aberto: "aberto",
            fechado: "fechado",
            preatendimento: "preAtendimento",
            "pre-atendimento": "preAtendimento",
            pre_atendimento: "preAtendimento"
        };

        return mapa[valor] ?? null;
    }

    function validarResposta(payload) {
        if (!payload || typeof payload !== "object") {
            throw new Error("Resposta vazia da API de operação.");
        }

        if (payload.schemaVersion !== 1) {
            throw new Error("schemaVersion inválido.");
        }

        if (!MODOS_VALIDOS.has(payload.modo)) {
            throw new Error(`Modo desconhecido recebido: ${payload.modo}`);
        }

        if (typeof payload.atualizadoEm !== "string" || !payload.atualizadoEm.trim()) {
            throw new Error("atualizadoEm inválido.");
        }

        if (typeof payload.revisao !== "string" || !payload.revisao.trim()) {
            throw new Error("revisao inválida.");
        }

        return payload;
    }

    function atualizarCardapioSeDisponivel() {
        if (typeof window.atualizarEstadoLoja === "function") {
            try {
                window.atualizarEstadoLoja();
            } catch (erro) {
                console.warn("Não foi possível atualizar o estado do cardápio com o modo remoto.", erro);
            }
        }
    }

    function notificarObservadores(evento) {
        estado.observadores.forEach((callback) => {
            try {
                callback(evento);
            } catch (erro) {
                console.warn("Erro ao notificar observador de operação.", erro);
            }
        });
    }

    async function consultarApiOperacao() {
        if (estado.consultaEmAndamento) return estado.ultimaResposta;

        estado.consultaEmAndamento = true;
        estado.statusConexao = "consultando";

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 7000);

        try {
            const resposta = await fetch(API_URL, {
                method: "GET",
                cache: "no-store",
                credentials: "omit",
                signal: controller.signal,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!resposta.ok) {
                throw new Error(`HTTP ${resposta.status}`);
            }

            const payload = await resposta.json();
            const respostaValidada = validarResposta(payload);
            const modoNormalizado = normalizarModo(respostaValidada.modo);
            const modoManualAnterior = estado.ultimoModoManual;
            estado.ultimoModoManual = modoNormalizado === "automatico" ? null : modoNormalizado;
            estado.ultimaResposta = respostaValidada;
            estado.ultimaAtualizacao = new Date().toISOString();
            estado.statusConexao = "ok";

            if (modoManualAnterior !== estado.ultimoModoManual) {
                notificarObservadores({
                    modo: estado.ultimoModoManual,
                    anterior: modoManualAnterior,
                    payload: respostaValidada,
                    atualizadoEm: respostaValidada.atualizadoEm,
                    revisao: respostaValidada.revisao
                });
                atualizarCardapioSeDisponivel();
            } else {
                atualizarCardapioSeDisponivel();
            }

            return respostaValidada;
        } catch (erro) {
            estado.statusConexao = "erro";
            const mensagem = erro && erro.name === "AbortError" ? "Timeout na consulta da operação." : "Falha ao consultar o estado operacional da loja.";
            console.warn(mensagem, erro);
            return estado.ultimaResposta || null;
        } finally {
            clearTimeout(timeoutId);
            estado.consultaEmAndamento = false;
        }
    }

    function iniciarMonitoramento() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                consultarApiOperacao();
            }, { once: true });
        } else {
            consultarApiOperacao();
        }

        window.addEventListener("pageshow", () => {
            consultarApiOperacao();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                consultarApiOperacao();
            }
        });

        window.setInterval(() => {
            consultarApiOperacao();
        }, 10000);
    }

    const operacaoApi = {
        modoAtual() {
            return estado.ultimoModoManual;
        },
        estadoConexao() {
            return estado.statusConexao;
        },
        atualizar() {
            return consultarApiOperacao();
        },
        registrarObservador(callback) {
            if (typeof callback === "function") {
                estado.observadores.push(callback);
            }
            return () => {
                estado.observadores = estado.observadores.filter((item) => item !== callback);
            };
        }
    };

    window.SR_OFRELIO_OPERACAO = Object.assign(window.SR_OFRELIO_OPERACAO || {}, operacaoApi);
    iniciarMonitoramento();
})();
