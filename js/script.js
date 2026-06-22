// =========================
// CONSTANTES DE API
// =========================

const API_GEOCODING =
    "https://geocoding-api.open-meteo.com/v1/search";

const API_CLIMA =
    "https://api.open-meteo.com/v1/forecast";

const MAX_HISTORICO = 6;

// =========================
// MAPEAMENTO WMO
// =========================

const CLIMA_WMO = {
    0:  { label: "Céu limpo",             icone: "☀️" },
    1:  { label: "Poucas nuvens",         icone: "🌤️" },
    2:  { label: "Parcialmente nublado",  icone: "⛅" },
    3:  { label: "Nublado",               icone: "☁️" },
    45: { label: "Neblina",               icone: "🌫️" },
    48: { label: "Neblina intensa",       icone: "🌫️" },
    51: { label: "Chuvisco leve",         icone: "🌦️" },
    53: { label: "Chuvisco moderado",     icone: "🌦️" },
    55: { label: "Chuvisco forte",        icone: "🌧️" },
    61: { label: "Chuva leve",            icone: "🌧️" },
    63: { label: "Chuva moderada",        icone: "🌧️" },
    65: { label: "Chuva forte",           icone: "🌧️" },
    71: { label: "Neve leve",             icone: "🌨️" },
    73: { label: "Neve moderada",         icone: "❄️" },
    75: { label: "Neve forte",            icone: "❄️" },
    80: { label: "Pancadas de chuva",     icone: "🌩️" },
    81: { label: "Pancadas moderadas",    icone: "🌩️" },
    82: { label: "Pancadas fortes",       icone: "⛈️" },
    95: { label: "Tempestade",            icone: "⛈️" },
};

function infoClima(codigo) {
    return CLIMA_WMO[codigo] ?? {
        label: "Condição não identificada",
        icone: "🌡️"
    };
}

// =========================
// ELEMENTOS
// =========================

const cidadeInput      = document.getElementById("cidade");
const buscarBtn        = document.getElementById("buscarBtn");
const localizacaoBtn   = document.getElementById("localizacaoBtn");
const limparBtn        = document.getElementById("limparBtn");
const resultado        = document.getElementById("resultado");
const previsaoSemanal  = document.getElementById("previsaoSemanal");
const dadosExtras      = document.getElementById("dadosExtras");
const historicoWrapper = document.getElementById("historicoWrapper");
const historicoLista   = document.getElementById("historicoLista");

// =========================
// UTILITÁRIOS
// =========================

function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

function nomeDiaSemana(dataISO) {
    const data  = new Date(dataISO + "T12:00:00");
    const hoje  = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    if (data.toDateString() === hoje.toDateString())  return "Hoje";
    if (data.toDateString() === amanha.toDateString()) return "Amanhã";

    return data.toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "")
        .replace(/^\w/, c => c.toUpperCase());
}

// =========================
// TEMA DINÂMICO
// =========================

function aplicarTema(label) {
    document.body.classList.remove(
        "tema-sol", "tema-chuva", "tema-tempestade", "tema-neve"
    );

    const l = label.toLowerCase();

    if (l.includes("limpo") || l.includes("poucas"))          document.body.classList.add("tema-sol");
    else if (l.includes("tempestade") || l.includes("pancada")) document.body.classList.add("tema-tempestade");
    else if (l.includes("chuva") || l.includes("chuvisco"))    document.body.classList.add("tema-chuva");
    else if (l.includes("neve"))                               document.body.classList.add("tema-neve");
}

// =========================
// MENSAGEM CONTEXTUAL
// =========================

function gerarMensagem(label) {
    const l = label.toLowerCase();

    if (l.includes("limpo"))     return "Ótimo dia para aproveitar o ar livre.";
    if (l.includes("chuva") || l.includes("chuvisco") || l.includes("pancada"))
                                  return "Leve um guarda-chuva se precisar sair.";
    if (l.includes("neblina"))   return "Atenção redobrada ao caminhar e dirigir.";
    if (l.includes("tempestade")) return "Se possível, permaneça em local seguro.";
    if (l.includes("neve"))      return "Agasalhe-se bem antes de sair.";
    return "Tenha um excelente dia.";
}

// =========================
// LOADING / ERRO
// =========================

function mostrarLoading() {
    buscarBtn.disabled     = true;
    localizacaoBtn.disabled = true;

    previsaoSemanal.hidden = true;
    dadosExtras.hidden     = true;

    resultado.innerHTML = `
        <div class="loading-wrapper" role="status">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p class="loading-texto">Buscando clima…</p>
        </div>
    `;
}

function esconderLoading() {
    buscarBtn.disabled      = false;
    localizacaoBtn.disabled = false;
}

function mostrarErro(texto, icone = "⚠️") {
    previsaoSemanal.hidden = true;
    dadosExtras.hidden     = true;

    resultado.innerHTML = `
        <div class="erro-wrapper" role="alert">
            <span class="erro-icone" aria-hidden="true">${icone}</span>
            <p class="erro">${texto}</p>
        </div>
    `;
}

// =========================
// UI — CLIMA ATUAL
// =========================

function exibirClima(nomeCidade, pais, dados) {
    const { temperature_2m, weather_code, windspeed_10m, relativehumidity_2m, apparent_temperature } = dados.current;
    const { label, icone } = infoClima(weather_code);

    aplicarTema(label);

    const paisStr = pais ? ` <span class="pais">${pais}</span>` : "";

    resultado.innerHTML = `
        <div class="clima-atual">
            <h2 class="cidade">${nomeCidade}</h2>
            ${paisStr}

            <div class="temperatura-wrapper">
                <span class="clima-icone" aria-hidden="true">${icone}</span>
                <p class="temperatura" aria-label="${temperature_2m} graus Celsius">
                    ${temperature_2m}<sup>°C</sup>
                </p>
            </div>

            <p class="clima-descricao">${label}</p>
            <p class="mensagem">${gerarMensagem(label)}</p>
        </div>
    `;

    // Dados extras
    exibirDadosExtras(
        apparent_temperature,
        relativehumidity_2m,
        windspeed_10m
    );
}

// =========================
// UI — DADOS EXTRAS
// =========================

function exibirDadosExtras(sensacao, umidade, vento) {
    dadosExtras.hidden = false;
    dadosExtras.innerHTML = `
        <p class="dados-extras-titulo">Condições atuais</p>
        <div class="dados-extras-grid">
            <div class="dado-item">
                <span class="dado-icone" aria-hidden="true">🌡️</span>
                <span class="dado-valor">${sensacao ?? "—"}°</span>
                <span class="dado-label">Sensação</span>
            </div>
            <div class="dado-item">
                <span class="dado-icone" aria-hidden="true">💧</span>
                <span class="dado-valor">${umidade ?? "—"}%</span>
                <span class="dado-label">Umidade</span>
            </div>
            <div class="dado-item">
                <span class="dado-icone" aria-hidden="true">💨</span>
                <span class="dado-valor">${vento ?? "—"}</span>
                <span class="dado-label">km/h</span>
            </div>
        </div>
    `;
}

// =========================
// UI — PREVISÃO SEMANAL
// =========================

function exibirPrevisaoSemanal(dados) {
    const { time, temperature_2m_max, temperature_2m_min, weather_code } = dados.daily;

    const itens = time.slice(0, 7).map((data, i) => {
        const { label, icone } = infoClima(weather_code[i]);
        return `
            <li class="previsao-dia">
                <span class="previsao-dia-nome">${nomeDiaSemana(data)}</span>
                <span class="previsao-dia-icone" aria-hidden="true">${icone}</span>
                <span class="previsao-dia-descricao">${label}</span>
                <span class="previsao-dia-max" aria-label="Máxima ${temperature_2m_max[i]} graus">
                    ${temperature_2m_max[i]}°
                </span>
                <span class="previsao-dia-min" aria-label="Mínima ${temperature_2m_min[i]} graus">
                    ${temperature_2m_min[i]}°
                </span>
            </li>
        `;
    }).join("");

    previsaoSemanal.hidden = false;
    previsaoSemanal.innerHTML = `
        <p class="previsao-titulo">Próximos 7 dias</p>
        <ul class="previsao-lista" role="list">${itens}</ul>
    `;
}

// =========================
// HISTÓRICO
// =========================

function lerHistorico() {
    try {
        return JSON.parse(localStorage.getItem("historico_cidades") ?? "[]");
    } catch {
        return [];
    }
}

function salvarHistorico(lista) {
    try {
        localStorage.setItem("historico_cidades", JSON.stringify(lista));
    } catch {
        // localStorage indisponível — ignora silenciosamente
    }
}

function adicionarAoHistorico(cidade) {
    let lista = lerHistorico().filter(c => c.toLowerCase() !== cidade.toLowerCase());
    lista.unshift(cidade);
    lista = lista.slice(0, MAX_HISTORICO);
    salvarHistorico(lista);
    renderizarHistorico();
}

function removerDoHistorico(cidade) {
    const lista = lerHistorico().filter(c => c.toLowerCase() !== cidade.toLowerCase());
    salvarHistorico(lista);
    renderizarHistorico();
}

function renderizarHistorico() {
    const lista = lerHistorico();

    if (lista.length === 0) {
        historicoWrapper.hidden = true;
        return;
    }

    historicoWrapper.hidden = false;
    historicoLista.innerHTML = lista.map(cidade => `
        <li class="historico-item">
            <button
                class="historico-btn-cidade"
                aria-label="Buscar ${cidade}"
                data-cidade="${cidade}">
                ${cidade}
            </button>
            <button
                class="historico-btn-remover"
                aria-label="Remover ${cidade} do histórico"
                data-remover="${cidade}">
                ✕
            </button>
        </li>
    `).join("");
}

// =========================
// API — BUSCAR CLIMA
// =========================

async function buscarClima(latitude, longitude, nomeCidade, pais = "") {
    try {
        mostrarLoading();

        const params = new URLSearchParams({
            latitude,
            longitude,
            current: [
                "temperature_2m",
                "weather_code",
                "windspeed_10m",
                "relativehumidity_2m",
                "apparent_temperature"
            ].join(","),
            daily: [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min"
            ].join(","),
            timezone: "auto",
            forecast_days: 7
        });

        const resposta = await fetch(`${API_CLIMA}?${params}`);

        if (!resposta.ok) throw new Error("api");

        const dados = await resposta.json();

        exibirClima(nomeCidade, pais, dados);
        exibirPrevisaoSemanal(dados);

    } catch (erro) {
        console.error("[buscarClima]", erro);
        mostrarErro("Não foi possível obter a previsão. Tente novamente.");
    } finally {
        esconderLoading();
    }
}

// =========================
// API — GEOCODIFICAÇÃO
// =========================

async function buscarCidade(nomeForcado = null) {
    const cidade = nomeForcado ?? cidadeInput.value.trim();

    if (!cidade) {
        mostrarErro("Digite o nome de uma cidade.", "📍");
        return;
    }

    if (cidade.length < 2) {
        mostrarErro("Insira uma cidade válida.", "📍");
        return;
    }

    try {
        mostrarLoading();

        const params = new URLSearchParams({
            name: cidade,
            count: 1,
            language: "pt",
            format: "json"
        });

        const resposta = await fetch(`${API_GEOCODING}?${params}`);

        if (!resposta.ok) throw new Error("api");

        const dados = await resposta.json();

        if (!dados.results?.length) throw new Error("cidade");

        const local = dados.results[0];

        adicionarAoHistorico(local.name);

        await buscarClima(
            local.latitude,
            local.longitude,
            local.name,
            local.country ?? ""
        );

    } catch (erro) {
        console.error("[buscarCidade]", erro);

        if (erro.message === "cidade") {
            mostrarErro("Cidade não encontrada. Verifique o nome e tente novamente.", "🔍");
        } else {
            mostrarErro("Não foi possível conectar ao serviço. Tente novamente mais tarde.", "📡");
        }

        esconderLoading();
    }
}

// =========================
// GEOLOCALIZAÇÃO
// =========================

function usarLocalizacaoAtual() {
    if (!navigator.geolocation) {
        mostrarErro("Seu navegador não suporta geolocalização.", "🚫");
        return;
    }

    mostrarLoading();

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            await buscarClima(
                coords.latitude,
                coords.longitude,
                "Sua localização"
            );
        },
        (erro) => {
            esconderLoading();

            if (erro.code === erro.PERMISSION_DENIED) {
                mostrarErro(
                    "Localização não compartilhada. Digite o nome da cidade acima.",
                    "📍"
                );
                return;
            }

            mostrarErro("Não foi possível acessar sua localização.", "📍");
        }
    );
}

// =========================
// CONTROLE DO BTN LIMPAR
// =========================

function atualizarBtnLimpar() {
    limparBtn.hidden = cidadeInput.value.length === 0;
}

// =========================
// EVENTOS
// =========================

buscarBtn.addEventListener("click", () => buscarCidade());

localizacaoBtn.addEventListener("click", usarLocalizacaoAtual);

cidadeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarCidade();
});

cidadeInput.addEventListener("input", debounce(() => {
    atualizarBtnLimpar();
}, 100));

limparBtn.addEventListener("click", () => {
    cidadeInput.value = "";
    cidadeInput.focus();
    atualizarBtnLimpar();
});

// Delegação de eventos para histórico
historicoLista.addEventListener("click", (e) => {
    const btnCidade  = e.target.closest("[data-cidade]");
    const btnRemover = e.target.closest("[data-remover]");

    if (btnCidade) {
        const nome = btnCidade.dataset.cidade;
        cidadeInput.value = nome;
        buscarCidade(nome);
    }

    if (btnRemover) {
        removerDoHistorico(btnRemover.dataset.remover);
    }
});

// =========================
// INICIALIZAÇÃO
// =========================

renderizarHistorico();
atualizarBtnLimpar();