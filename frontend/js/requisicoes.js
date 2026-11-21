// Dados do usuário
const token = sessionStorage.getItem("token");
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");
const usuarioId = sessionStorage.getItem("usuarioId");
const usuarioNome = sessionStorage.getItem("usuarioNome");

// Verifica o login
if (!token) {
  window.location.href = "login.html";
}

// Menu lateral
const menuUsuarios = document.getElementById("menuUsuarios");
const menuEntrada = document.getElementById("menuEntrada");
const botaoSair = document.getElementById("botaoSair");

// Identificação do usuário
const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

// Botões do menu do usuário
const botaoMeuPerfil = document.getElementById("botaoMeuPerfil");
const botaoAlterarSenha = document.getElementById("botaoAlterarSenha");

// Modal Meu Perfil
const modalMeuPerfil = document.getElementById("modalMeuPerfil");
const formMeuPerfil = document.getElementById("formMeuPerfil");
const nomePerfil = document.getElementById("nomePerfil");
const emailPerfil = document.getElementById("emailPerfil");
const perfilTipoUsuario = document.getElementById("perfilTipoUsuario");
const mensagemMeuPerfil = document.getElementById("mensagemMeuPerfil");
const botaoFecharPerfil = document.getElementById("botaoFecharPerfil");
const botaoCancelarPerfil = document.getElementById("botaoCancelarPerfil");
const botaoSalvarPerfil = document.getElementById("botaoSalvarPerfil");

// Modal Alterar Senha
const modalAlterarSenha = document.getElementById("modalAlterarSenha");
const formAlterarSenha = document.getElementById("formAlterarSenha");
const senhaAtual = document.getElementById("senhaAtual");
const novaSenha = document.getElementById("novaSenha");
const confirmarNovaSenha = document.getElementById("confirmarNovaSenha");
const mensagemAlterarSenha = document.getElementById("mensagemAlterarSenha");
const botaoFecharSenha = document.getElementById("botaoFecharSenha");
const botaoCancelarSenha = document.getElementById("botaoCancelarSenha");
const botaoSalvarSenha = document.getElementById("botaoSalvarSenha");

// Menu do usuário
const areaMenuUsuario = document.getElementById("areaMenuUsuario");
const botaoMenuUsuario = document.getElementById("botaoMenuUsuario");
const menuConfiguracoesUsuario = document.getElementById(
  "menuConfiguracoesUsuario",
);
const setaMenuUsuario = document.getElementById("setaMenuUsuario");
const botaoSairMenu = document.getElementById("botaoSairMenu");

nomeUsuario.textContent = usuarioNome || "Usuário";

// Abre o menu do usuário
function abrirMenuUsuario() {
  menuConfiguracoesUsuario.classList.remove("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "true");
  setaMenuUsuario.classList.add("rotate-180");
}

// Fecha o menu do usuário
function fecharMenuUsuario() {
  menuConfiguracoesUsuario.classList.add("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "false");
  setaMenuUsuario.classList.remove("rotate-180");
}

// Alterna o menu
function alternarMenuUsuario() {
  const menuAberto = !menuConfiguracoesUsuario.classList.contains("hidden");

  if (menuAberto) {
    fecharMenuUsuario();
  } else {
    abrirMenuUsuario();
  }
}

botaoMenuUsuario.addEventListener("click", alternarMenuUsuario);

// Fecha ao clicar fora do menu
document.addEventListener("click", function (event) {
  if (!areaMenuUsuario.contains(event.target)) {
    fecharMenuUsuario();
  }
});

if (usuarioPerfil === "admin") {
  perfilUsuario.textContent = "Administrador";
  menuUsuarios.classList.remove("hidden");
} else {
  perfilUsuario.textContent = "Usuário";

  // Usuário comum só acessa Estoque e Requisições
  menuEntrada.classList.add("hidden");
  menuUsuarios.classList.add("hidden");
}

// Elementos da tabela
const tabelaRequisicoes = document.getElementById("tabelaRequisicoes");
const mensagemLista = document.getElementById("mensagemLista");
const botaoNovaRequisicao = document.getElementById("botaoNovaRequisicao");

// Modal de nova requisição
const modalNovaRequisicao = document.getElementById("modalNovaRequisicao");
const botaoCancelarNova = document.getElementById("botaoCancelarNova");
const botaoFecharModal = document.getElementById("botaoFecharModal");

// Modal de detalhes
const modalDetalhesRequisicao = document.getElementById(
  "modalDetalhesRequisicao",
);
const botaoFecharDetalhes = document.getElementById("botaoFecharDetalhes");
const conteudoDetalhes = document.getElementById("conteudoDetalhes");
const acoesAdmin = document.getElementById("acoesAdmin");
const mensagemStatus = document.getElementById("mensagemStatus");

// Formulário
const formRequisicao = document.getElementById("formRequisicao");
const campoMaterial = document.getElementById("material");
const campoQuantidade = document.getElementById("quantidade");
const campoObservacao = document.getElementById("observacao");
const mensagemRequisicao = document.getElementById("mensagemRequisicao");
const botaoEnviarRequisicao = document.getElementById("botaoEnviarRequisicao");
const botaoAdicionarItem = document.getElementById("botaoAdicionarItem");
const listaItensRequisicao = document.getElementById("listaItensRequisicao");
const contadorItens = document.getElementById("contadorItens");
let itensNovaRequisicao = [];

function itensDaRequisicao(requisicao) {
  return Array.isArray(requisicao.itens) && requisicao.itens.length
    ? requisicao.itens
    : [{ produtoId: requisicao.produtoId, quantidade: requisicao.quantidade }];
}

function atualizarMateriaisDisponiveis() {
  const selecionados = new Set(itensNovaRequisicao.map((item) => String(item.produtoId)));
  for (const opcao of campoMaterial.options) {
    if (!opcao.value) continue;
    const incluido = selecionados.has(opcao.value);
    opcao.hidden = incluido;
    opcao.disabled = incluido;
  }
  if (selecionados.has(campoMaterial.value)) campoMaterial.value = "";
}

function renderizarItensFormulario() {
  atualizarMateriaisDisponiveis();
  listaItensRequisicao.replaceChildren();
  contadorItens.textContent = String(itensNovaRequisicao.length);
  itensNovaRequisicao.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "flex items-center justify-between gap-3 border border-slate-200 rounded-xl p-3";
    const nome = document.createElement("span");
    nome.className = "text-sm text-slate-700";
    nome.textContent = `${buscarNomeProduto(item.produtoId)} — Quantidade: ${item.quantidade}`;
    const editar = document.createElement("button");
    editar.type = "button";
    editar.textContent = "Editar";
    editar.className = "text-blue-600 font-semibold";
    editar.onclick = () => {
      itensNovaRequisicao = itensNovaRequisicao.filter((atual) => atual.produtoId !== item.produtoId);
      renderizarItensFormulario();
      campoMaterial.value = String(item.produtoId);
      campoQuantidade.value = String(item.quantidade);
    };
    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover";
    remover.className = "text-red-600 font-semibold";
    remover.onclick = () => {
      itensNovaRequisicao = itensNovaRequisicao.filter((atual) => atual.produtoId !== item.produtoId);
      renderizarItensFormulario();
    };
    linha.append(nome, editar, remover);
    listaItensRequisicao.appendChild(linha);
  });
}

botaoAdicionarItem.addEventListener("click", () => {
  const produtoId = Number(campoMaterial.value);
  const quantidade = Number(campoQuantidade.value);
  if (!produtoId || !Number.isSafeInteger(quantidade) || quantidade <= 0) {
    mensagemRequisicao.textContent = "Selecione o material e informe uma quantidade inteira válida.";
    mensagemRequisicao.className = "text-sm mb-4 text-red-600";
    return;
  }
  if (itensNovaRequisicao.some((item) => item.produtoId === produtoId)) {
    mensagemRequisicao.textContent = "Material já adicionado. Edite o item existente.";
    mensagemRequisicao.className = "text-sm mb-4 text-red-600";
    return;
  }
  itensNovaRequisicao.push({ produtoId, quantidade });
  campoMaterial.value = "";
  campoQuantidade.value = "";
  mensagemRequisicao.textContent = "";
  renderizarItensFormulario();
});


// Filtros
const filtroCodigo = document.getElementById("filtroCodigo");
const filtroUsuario = document.getElementById("filtroUsuario");
const filtroDataCriacao = document.getElementById("filtroDataCriacao");
const filtroStatus = document.getElementById("filtroStatus");
const filtroDataAtualizada = document.getElementById("filtroDataAtualizada");
const botaoLimparFiltros = document.getElementById("botaoLimparFiltros");

// Botões de status
const botaoAutorizar = document.getElementById("botaoAutorizar");
const botaoReprovar = document.getElementById("botaoReprovar");
const botaoFinalizar = document.getElementById("botaoFinalizar");

// Elementos da paginação
const areaPaginacaoRequisicoes = document.getElementById(
  "areaPaginacaoRequisicoes",
);
const informacaoPaginacaoRequisicoes = document.getElementById(
  "informacaoPaginacaoRequisicoes",
);
const botoesPaginacaoRequisicoes = document.getElementById(
  "botoesPaginacaoRequisicoes",
);

// Dados armazenados
let produtosCarregados = [];
let usuariosCarregados = [];
let requisicoesCarregadas = [];
let requisicoesFiltradas = [];

// Requisição aberta no modal
let requisicaoSelecionada = null;

// Paginação
const REQUISICOES_POR_PAGINA = 5;
let paginaAtual = 1;

// Impede ações repetidas durante uma atualização
let atualizandoStatus = false;

function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tratarSessaoExpirada(resposta) {
  if (resposta.status === 401) {
    sessionStorage.clear();
    window.location.href = "login.html";
    return true;
  }

  return false;
}

async function carregarMateriais() {
  try {
    const resposta = await fetch(`${API_URL}/produtos/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os materiais.");
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Lista de materiais inválida.");
    }

    produtosCarregados = dados;

    produtosCarregados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", {
        sensitivity: "base",
      });
    });

    campoMaterial.innerHTML = '<option value="">Selecione um material</option>';

    produtosCarregados.forEach(function (produto) {
      const opcao = document.createElement("option");

      opcao.value = produto.id;
      opcao.textContent = `${produto.nome} - Disponível: ${produto.quantidade ?? 0}`;

      campoMaterial.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar materiais:", erro);
  }
}

async function carregarUsuarios() {
  if (usuarioPerfil !== "admin") {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/usuarios/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os usuários.");
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Lista de usuários inválida.");
    }

    usuariosCarregados = dados;
  } catch (erro) {
    console.error("Erro ao carregar usuários:", erro);
  }
}

async function carregarRequisicoes(voltarPrimeiraPagina = false) {
  mensagemLista.textContent = "Carregando requisições...";

  try {
    const resposta = await fetch(`${API_URL}/movimentacoes/requisicoes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => "");
      throw new Error(`Não foi possível carregar as requisições (HTTP ${resposta.status})${detalhe ? ": " + detalhe.slice(0, 180) : ""}.`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Lista de requisições inválida.");
    }

    requisicoesCarregadas = dados;

    // Mais recentes primeiro
    requisicoesCarregadas.sort(function (a, b) {
      const dataA = new Date(a.dataMovimentacao || 0).getTime();
      const dataB = new Date(b.dataMovimentacao || 0).getTime();

      const tempoA = Number.isFinite(dataA) ? dataA : 0;
      const tempoB = Number.isFinite(dataB) ? dataB : 0;

      if (tempoA !== tempoB) {
        return tempoB - tempoA;
      }

      return Number(b.id || 0) - Number(a.id || 0);
    });

    aplicarFiltros(voltarPrimeiraPagina);
  } catch (erro) {
    console.error("Erro ao carregar requisições:", erro);

    tabelaRequisicoes.innerHTML = "";
    areaPaginacaoRequisicoes.classList.add("hidden");

    mensagemLista.textContent = erro.message || "Não foi possível carregar as requisições.";
    mensagemLista.className = "p-5 text-red-600";
  }
}

// Nome do produto
function buscarNomeProduto(produtoId) {
  const produto = produtosCarregados.find(function (item) {
    return Number(item.id) === Number(produtoId);
  });

  return produto ? produto.nome : "Produto não encontrado";
}

// Nome do usuário
function buscarNomeUsuario(id) {
  if (String(id) === String(usuarioId) && usuarioNome) {
    return usuarioNome;
  }

  const usuario = usuariosCarregados.find(function (item) {
    return String(item.id) === String(id);
  });

  if (usuario) {
    return usuario.nome;
  }

  return `Usuário ${id ?? "-"}`;
}

function mostrarRequisicoes() {
  tabelaRequisicoes.innerHTML = "";
  mensagemLista.textContent = "";
  mensagemLista.className = "p-5 text-slate-500";

  if (requisicoesFiltradas.length === 0) {
    mensagemLista.textContent = "Nenhuma requisição encontrada.";
    areaPaginacaoRequisicoes.classList.add("hidden");
    return;
  }

  // A mensagem fica oculta quando há registros
  mensagemLista.classList.add("hidden");

  const totalPaginas = Math.ceil(
    requisicoesFiltradas.length / REQUISICOES_POR_PAGINA,
  );

  // Ajusta a página se algum registro deixou de existir
  paginaAtual = Math.min(Math.max(1, paginaAtual), totalPaginas);

  const inicio = (paginaAtual - 1) * REQUISICOES_POR_PAGINA;

  const requisicoesDaPagina = requisicoesFiltradas.slice(
    inicio,
    inicio + REQUISICOES_POR_PAGINA,
  );

  requisicoesDaPagina.forEach(function (requisicao) {
    const linha = document.createElement("tr");

    linha.className =
      "border-t border-slate-200 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition";

    // Possibilita abrir a linha pelo teclado
    linha.tabIndex = 0;
    linha.setAttribute("role", "button");
    linha.setAttribute(
      "aria-label",
      `Ver detalhes da requisição ${requisicao.codigo || requisicao.id}`,
    );

    const nomeDoUsuario = buscarNomeUsuario(requisicao.usuarioId);

    linha.innerHTML = `
      <td class="p-4 font-medium text-slate-800">
        ${escaparHTML(requisicao.codigo || "-")}
      </td>

      <td class="p-4 text-slate-700">
        ${escaparHTML(nomeDoUsuario)}
      </td>

      <td class="p-4 text-slate-700">
        ${escaparHTML(formatarData(requisicao.dataMovimentacao))}
      </td>

      <td class="p-4">
        ${criarStatusHtml(requisicao.status)}
      </td>

      <td class="p-4 text-slate-700">
        ${escaparHTML(formatarData(requisicao.dataAtualizada))}
      </td>
    `;

    // Abre os detalhes clicando diretamente na linha
    linha.addEventListener("click", function () {
      abrirDetalhesRequisicao(requisicao);
    });

    // Enter e Espaço também abrem os detalhes
    linha.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrirDetalhesRequisicao(requisicao);
      }
    });

    tabelaRequisicoes.appendChild(linha);
  });

  mostrarPaginacaoRequisicoes(totalPaginas);
}

function mostrarPaginacaoRequisicoes(totalPaginas) {
  botoesPaginacaoRequisicoes.innerHTML = "";

  // Não mostra paginação com apenas uma página
  if (totalPaginas <= 1) {
    areaPaginacaoRequisicoes.classList.add("hidden");
    return;
  }

  areaPaginacaoRequisicoes.classList.remove("hidden");

  const primeiroRegistro = (paginaAtual - 1) * REQUISICOES_POR_PAGINA + 1;

  const ultimoRegistro = Math.min(
    paginaAtual * REQUISICOES_POR_PAGINA,
    requisicoesFiltradas.length,
  );

  informacaoPaginacaoRequisicoes.textContent =
    `Mostrando ${primeiroRegistro} a ${ultimoRegistro} ` +
    `de ${requisicoesFiltradas.length} requisições ` +
    `• Página ${paginaAtual} de ${totalPaginas}`;

  criarBotaoPagina(
    "‹",
    paginaAtual - 1,
    paginaAtual === 1,
    false,
    "Página anterior",
  );

  // Exibe até cinco números de páginas
  let inicio = Math.max(1, paginaAtual - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let numero = inicio; numero <= fim; numero++) {
    criarBotaoPagina(
      String(numero),
      numero,
      false,
      numero === paginaAtual,
      `Página ${numero}`,
    );
  }

  criarBotaoPagina(
    "›",
    paginaAtual + 1,
    paginaAtual === totalPaginas,
    false,
    "Próxima página",
  );
}

function criarBotaoPagina(texto, numeroPagina, desabilitado, ativo, descricao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;
  botao.setAttribute("aria-label", descricao);

  botao.className =
    "min-w-10 h-10 px-3 rounded-lg border font-semibold text-sm transition";

  if (ativo) {
    botao.className += " bg-blue-600 border-blue-600 text-white";
    botao.setAttribute("aria-current", "page");
  } else {
    botao.className +=
      " bg-white border-slate-200 text-slate-600 hover:bg-blue-50";
  }

  if (desabilitado) {
    botao.className += " opacity-40 cursor-not-allowed";
  }

  botao.addEventListener("click", function () {
    mudarPagina(numeroPagina);
  });

  botoesPaginacaoRequisicoes.appendChild(botao);
}

function mudarPagina(novaPagina) {
  const totalPaginas = Math.ceil(
    requisicoesFiltradas.length / REQUISICOES_POR_PAGINA,
  );

  if (
    novaPagina < 1 ||
    novaPagina > totalPaginas ||
    novaPagina === paginaAtual
  ) {
    return;
  }

  paginaAtual = novaPagina;
  mostrarRequisicoes();
}

function abrirModalNovaRequisicao() {
  mensagemRequisicao.textContent = "";
  mensagemRequisicao.className = "text-sm mb-4";

  modalNovaRequisicao.classList.remove("hidden");
  campoMaterial.focus();
}

function fecharModalNovaRequisicao() {
  modalNovaRequisicao.classList.add("hidden");

  formRequisicao.reset();
  itensNovaRequisicao = [];
  renderizarItensFormulario();
  mensagemRequisicao.textContent = "";
}

botaoNovaRequisicao.addEventListener("click", abrirModalNovaRequisicao);

botaoCancelarNova.addEventListener("click", fecharModalNovaRequisicao);

botaoFecharModal.addEventListener("click", fecharModalNovaRequisicao);

modalNovaRequisicao.addEventListener("click", function (event) {
  if (event.target === modalNovaRequisicao) {
    fecharModalNovaRequisicao();
  }
});

formRequisicao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const observacao = campoObservacao.value.trim();
  if (itensNovaRequisicao.length === 0) {
    mensagemRequisicao.textContent = "Adicione pelo menos um material à requisição.";
    mensagemRequisicao.className = "text-sm mb-4 text-red-600";
    return;
  }

  mensagemRequisicao.textContent = "Enviando requisição...";
  mensagemRequisicao.className = "text-sm mb-4 text-slate-500";

  botaoEnviarRequisicao.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/movimentacoes/requisicoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itens: itensNovaRequisicao,
        observacao: observacao,
      }),
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => "");
      mensagemRequisicao.textContent =
        `Não foi possível realizar a requisição (HTTP ${resposta.status})${detalhe ? ": " + detalhe.slice(0, 180) : ""}.`;

      mensagemRequisicao.className = "text-sm mb-4 text-red-600";
      return;
    }

    await carregarMateriais();

    // A nova requisição ficará na página mais recente,
    // desde que corresponda aos filtros atuais.
    await carregarRequisicoes(true);

    fecharModalNovaRequisicao();
  } catch (erro) {
    console.error("Erro ao enviar requisição:", erro);

    mensagemRequisicao.textContent = "Não foi possível conectar ao servidor.";

    mensagemRequisicao.className = "text-sm mb-4 text-red-600";
  } finally {
    botaoEnviarRequisicao.disabled = false;
  }
});

function abrirDetalhesRequisicao(requisicao) {
  requisicaoSelecionada = requisicao;

  mensagemStatus.textContent = "";
  mensagemStatus.className = "text-sm mt-4";

  const itens = itensDaRequisicao(requisicao);
  const nomeDoUsuario = buscarNomeUsuario(requisicao.usuarioId);
  const linhasMateriais = itens.map((item, indice) => `
    <div class="flex items-center justify-between gap-4 px-4 py-3 ${indice % 2 ? "bg-slate-50" : "bg-white"}">
      <div class="flex items-center gap-3 min-w-0">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">${indice + 1}</span>
        <span class="text-sm font-medium text-slate-800 break-words">${escaparHTML(buscarNomeProduto(item.produtoId))}</span>
      </div>
      <span class="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">${escaparHTML(String(item.quantidade))}</span>
    </div>
  `).join("");

  conteudoDetalhes.innerHTML = `
    <div class="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Código da requisição</p>
        <p class="mt-1 text-lg font-bold text-slate-900 break-all">${escaparHTML(requisicao.codigo || "-")}</p>
      </div>
      <div class="flex flex-col items-start sm:items-end gap-1">
        <span class="text-xs font-semibold text-slate-500">Situação atual</span>
        ${criarStatusHtml(requisicao.status)}
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Solicitante</p>
      <p class="mt-2 font-semibold text-slate-800 break-words">${escaparHTML(nomeDoUsuario)}</p>
    </div>
    <div class="rounded-xl border border-slate-200 p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Datas</p>
      <p class="mt-2 text-sm text-slate-700"><span class="text-slate-500">Criada:</span> ${escaparHTML(formatarData(requisicao.dataMovimentacao))}</p>
      <p class="mt-1 text-sm text-slate-700"><span class="text-slate-500">Atualizada:</span> ${escaparHTML(formatarData(requisicao.dataAtualizada))}</p>
    </div>

    <section class="md:col-span-2 overflow-hidden rounded-xl border border-slate-200">
      <div class="flex items-center justify-between gap-3 bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h4 class="font-bold text-slate-800">Materiais solicitados</h4>
        <span class="text-xs font-semibold text-slate-500">${itens.length} ${itens.length === 1 ? "material" : "materiais"}</span>
      </div>
      <div class="divide-y divide-slate-100">${linhasMateriais}</div>
    </section>

    <section class="md:col-span-2 rounded-xl border border-slate-200 p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Observação</p>
      <p class="mt-2 text-sm text-slate-700 whitespace-pre-wrap break-words">${escaparHTML(requisicao.observacao || "Sem observação")}</p>
    </section>
  `;

  // Somente administradores podem alterar status
  if (usuarioPerfil === "admin") {
    acoesAdmin.classList.remove("hidden");
    atualizarBotoesStatus();
  } else {
    acoesAdmin.classList.add("hidden");
  }

  modalDetalhesRequisicao.classList.remove("hidden");
  botaoFecharDetalhes.focus();
}

function fecharDetalhesRequisicao() {
  if (atualizandoStatus) {
    return;
  }

  modalDetalhesRequisicao.classList.add("hidden");
  requisicaoSelecionada = null;

  mensagemStatus.textContent = "";
}

botaoFecharDetalhes.addEventListener("click", fecharDetalhesRequisicao);

modalDetalhesRequisicao.addEventListener("click", function (event) {
  if (event.target === modalDetalhesRequisicao) {
    fecharDetalhesRequisicao();
  }
});

// Fecha o modal aberto com Esc
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }
  if (!modalAlterarSenha.classList.contains("hidden")) {
    fecharModalSenha();
    return;
  }

  if (!modalMeuPerfil.classList.contains("hidden")) {
    fecharModalPerfil();
    return;
  }
  if (!modalMeuPerfil.classList.contains("hidden")) {
    fecharModalPerfil();
    return;
  }

  fecharMenuUsuario();

  if (!modalDetalhesRequisicao.classList.contains("hidden")) {
    fecharDetalhesRequisicao();
    return;
  }

  if (!modalNovaRequisicao.classList.contains("hidden")) {
    fecharModalNovaRequisicao();
  }
});

function aplicarFiltros(voltarPrimeiraPagina = true) {
  const codigo = filtroCodigo.value.trim().toLowerCase();
  const usuario = filtroUsuario.value.trim().toLowerCase();
  const dataCriacao = filtroDataCriacao.value;
  const status = filtroStatus.value;
  const dataAtualizada = filtroDataAtualizada.value;

  // Pesquisa em todas as requisições, não somente
  // nos registros da página atual.
  requisicoesFiltradas = requisicoesCarregadas.filter(function (requisicao) {
    const nomeDoUsuario = buscarNomeUsuario(requisicao.usuarioId).toLowerCase();

    if (
      codigo &&
      !String(requisicao.codigo || "")
        .toLowerCase()
        .includes(codigo)
    ) {
      return false;
    }

    if (usuario && !nomeDoUsuario.includes(usuario)) {
      return false;
    }

    if (
      dataCriacao &&
      pegarSomenteData(requisicao.dataMovimentacao) !== dataCriacao
    ) {
      return false;
    }

    if (status && requisicao.status !== status) {
      return false;
    }

    if (
      dataAtualizada &&
      pegarSomenteData(requisicao.dataAtualizada) !== dataAtualizada
    ) {
      return false;
    }

    return true;
  });

  // Ao mudar qualquer filtro, retorna à primeira página
  if (voltarPrimeiraPagina) {
    paginaAtual = 1;
  }

  mostrarRequisicoes();
}

// Eventos dos cinco filtros
filtroCodigo.addEventListener("input", function () {
  aplicarFiltros(true);
});

filtroUsuario.addEventListener("input", function () {
  aplicarFiltros(true);
});

filtroDataCriacao.addEventListener("change", function () {
  aplicarFiltros(true);
});

filtroStatus.addEventListener("change", function () {
  aplicarFiltros(true);
});

filtroDataAtualizada.addEventListener("change", function () {
  aplicarFiltros(true);
});

// Limpa os filtros
botaoLimparFiltros.addEventListener("click", function () {
  filtroCodigo.value = "";
  filtroUsuario.value = "";
  filtroDataCriacao.value = "";
  filtroStatus.value = "";
  filtroDataAtualizada.value = "";

  aplicarFiltros(true);
});

function atualizarBotoesStatus() {
  botaoAutorizar.classList.add("hidden");
  botaoReprovar.classList.add("hidden");
  botaoFinalizar.classList.add("hidden");

  if (!requisicaoSelecionada) {
    return;
  }

  const status = requisicaoSelecionada.status;

  // Aguardando: pode autorizar ou reprovar
  if (status === "AGUARDANDO") {
    botaoAutorizar.classList.remove("hidden");
    botaoReprovar.classList.remove("hidden");
  }

  // Autorizado: pode finalizar
  if (status === "AUTORIZADO") {
    botaoFinalizar.classList.remove("hidden");
  }
}

async function alterarStatus(novoStatus) {
  if (
    usuarioPerfil !== "admin" ||
    !requisicaoSelecionada ||
    atualizandoStatus
  ) {
    return;
  }

  const requisicaoId = requisicaoSelecionada.id;

  atualizandoStatus = true;

  mensagemStatus.textContent = "Atualizando status...";
  mensagemStatus.className = "text-sm mt-4 text-slate-500";

  botaoAutorizar.disabled = true;
  botaoReprovar.disabled = true;
  botaoFinalizar.disabled = true;

  try {
    const resposta = await fetch(
      `${API_URL}/movimentacoes/requisicoes/${requisicaoId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      },
    );

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (resposta.status === 403) {
      mensagemStatus.textContent =
        "Você não tem permissão para alterar o status.";

      mensagemStatus.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemStatus.textContent = "Não foi possível alterar o status.";

      mensagemStatus.className = "text-sm mt-4 text-red-600";
      return;
    }

    // Fecha o modal após a atualização
    modalDetalhesRequisicao.classList.add("hidden");
    requisicaoSelecionada = null;
    mensagemStatus.textContent = "";

    // Atualiza os materiais e a tabela
    await carregarMateriais();
    await carregarRequisicoes(false);
  } catch (erro) {
    console.error("Erro ao alterar status:", erro);

    mensagemStatus.textContent = "Não foi possível conectar ao servidor.";

    mensagemStatus.className = "text-sm mt-4 text-red-600";
  } finally {
    atualizandoStatus = false;

    botaoAutorizar.disabled = false;
    botaoReprovar.disabled = false;
    botaoFinalizar.disabled = false;
  }
}

// Ações dos botões
botaoAutorizar.addEventListener("click", function () {
  alterarStatus("AUTORIZADO");
});

botaoReprovar.addEventListener("click", function () {
  alterarStatus("REPROVADO");
});

botaoFinalizar.addEventListener("click", function () {
  alterarStatus("FINALIZADO");
});

function criarStatusHtml(status) {
  const statusAtual = status || "AGUARDANDO";

  let classe = "bg-slate-200 text-slate-700";
  let texto = statusAtual;

  if (statusAtual === "AGUARDANDO") {
    classe = "bg-yellow-100 text-yellow-800";
    texto = "Aguardando";
  }

  if (statusAtual === "AUTORIZADO") {
    classe = "bg-green-100 text-green-800";
    texto = "Autorizado";
  }

  if (statusAtual === "REPROVADO") {
    classe = "bg-red-100 text-red-800";
    texto = "Reprovado";
  }

  if (statusAtual === "FINALIZADO") {
    classe = "bg-blue-100 text-blue-800";
    texto = "Finalizado";
  }

  return `
    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${classe}">
      ${escaparHTML(texto)}
    </span>
  `;
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "-";
  }

  return valor.toLocaleString("pt-BR");
}

function pegarSomenteData(data) {
  if (!data) {
    return "";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "";
  }

  const ano = valor.getFullYear();
  const mes = String(valor.getMonth() + 1).padStart(2, "0");
  const dia = String(valor.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// Sai do sistema
function sairDoSistema(event) {
  event.preventDefault();

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");

  window.location.href = "login.html?logout=1";
}

botaoSair.addEventListener("click", sairDoSistema);
botaoSairMenu.addEventListener("click", sairDoSistema);

// Abre o modal Meu Perfil
botaoMeuPerfil.addEventListener("click", function () {
  fecharMenuUsuario();
  abrirModalPerfil();
});

// Fecha o modal Meu Perfil
function fecharModalPerfil() {
  modalMeuPerfil.classList.add("hidden");
  mensagemMeuPerfil.textContent = "";
  formMeuPerfil.reset();

  perfilTipoUsuario.value =
    usuarioPerfil === "admin" ? "Administrador" : "Usuário";
}

// Carrega os dados do perfil
async function abrirModalPerfil() {
  modalMeuPerfil.classList.remove("hidden");
  mensagemMeuPerfil.textContent = "Carregando informações...";
  mensagemMeuPerfil.className = "text-sm mb-5 text-slate-500";
  botaoSalvarPerfil.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      sairDoSistema();
      return;
    }

    if (!resposta.ok) {
      mensagemMeuPerfil.textContent =
        "Não foi possível carregar os dados do perfil.";
      mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
      return;
    }

    const dados = await resposta.json();
    const usuario = dados.usuario || dados;

    nomePerfil.value = usuario.nome || "";
    emailPerfil.value = usuario.email || "";

    const perfil = usuario.perfil || usuario.tipoUsuario || usuario.role;
    perfilTipoUsuario.value = perfil === "admin" ? "Administrador" : "Usuário";

    mensagemMeuPerfil.textContent = "";
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
    mensagemMeuPerfil.textContent = "Não foi possível conectar ao servidor.";
    mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
  } finally {
    botaoSalvarPerfil.disabled = false;
  }
}

// Eventos de fechamento do modal
botaoFecharPerfil.addEventListener("click", fecharModalPerfil);
botaoCancelarPerfil.addEventListener("click", fecharModalPerfil);

modalMeuPerfil.addEventListener("click", function (event) {
  if (event.target === modalMeuPerfil) {
    fecharModalPerfil();
  }
});

// Salva as alterações do perfil
formMeuPerfil.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = nomePerfil.value.trim();
  const email = emailPerfil.value.trim();

  if (!nome || !email) {
    mensagemMeuPerfil.textContent = "Preencha todos os campos.";
    mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
    return;
  }

  botaoSalvarPerfil.disabled = true;
  mensagemMeuPerfil.textContent = "Salvando alterações...";
  mensagemMeuPerfil.className = "text-sm mb-5 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, email }),
    });

    if (resposta.status === 401) {
      sairDoSistema();
      return;
    }

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));

      mensagemMeuPerfil.textContent =
        dados.mensagem ||
        dados.message ||
        "Não foi possível atualizar o perfil.";

      mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
      return;
    }

    sessionStorage.setItem("usuarioNome", nome);
    nomeUsuario.textContent = nome;

    mensagemMeuPerfil.textContent = "Perfil atualizado com sucesso!";
    mensagemMeuPerfil.className = "text-sm mb-5 text-green-600";

    setTimeout(fecharModalPerfil, 1000);
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    mensagemMeuPerfil.textContent = "Não foi possível conectar ao servidor.";
    mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
  } finally {
    botaoSalvarPerfil.disabled = false;
  }
});

// Abre o modal Alterar Senha
botaoAlterarSenha.addEventListener("click", function () {
  fecharMenuUsuario();
  abrirModalSenha();
});

// Prepara o modal
function abrirModalSenha() {
  formAlterarSenha.reset();

  document.querySelectorAll("[data-toggle-senha]").forEach(function (botao) {
    const campo = document.getElementById(botao.dataset.toggleSenha);

    if (campo) {
      campo.type = "password";
    }

    botao.innerHTML =
      '<img src="assets/icons/eye-off.svg" alt="Mostrar senha" class="w-5 h-5">';
  });

  mensagemAlterarSenha.textContent = "";
  modalAlterarSenha.classList.remove("hidden");
}

// Fecha o modal
function fecharModalSenha() {
  modalAlterarSenha.classList.add("hidden");
  formAlterarSenha.reset();
  mensagemAlterarSenha.textContent = "";
}

// Eventos de fechamento
botaoFecharSenha.addEventListener("click", fecharModalSenha);
botaoCancelarSenha.addEventListener("click", fecharModalSenha);

modalAlterarSenha.addEventListener("click", function (event) {
  if (event.target === modalAlterarSenha) {
    fecharModalSenha();
  }
});

// Mostrar e ocultar senhas
document.querySelectorAll("[data-toggle-senha]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const campo = document.getElementById(botao.dataset.toggleSenha);

    if (!campo) return;

    const senhaOculta = campo.type === "password";

    campo.type = senhaOculta ? "text" : "password";

    botao.innerHTML = senhaOculta
      ? '<img src="assets/icons/eye.svg" alt="Ocultar senha" class="w-5 h-5">'
      : '<img src="assets/icons/eye-off.svg" alt="Mostrar senha" class="w-5 h-5">';
  });
});

formAlterarSenha.addEventListener("submit", async function (event) {
  event.preventDefault();

  const senhaAtualValor = senhaAtual.value;
  const novaSenhaValor = novaSenha.value;
  const confirmarSenhaValor = confirmarNovaSenha.value;

  // Valida os campos
  if (!senhaAtualValor || !novaSenhaValor || !confirmarSenhaValor) {
    mensagemAlterarSenha.textContent = "Preencha todos os campos.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (novaSenhaValor.length < 6) {
    mensagemAlterarSenha.textContent =
      "A nova senha deve ter pelo menos 6 caracteres.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (novaSenhaValor !== confirmarSenhaValor) {
    mensagemAlterarSenha.textContent =
      "A confirmação da senha não corresponde.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (senhaAtualValor === novaSenhaValor) {
    mensagemAlterarSenha.textContent =
      "A nova senha deve ser diferente da senha atual.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  botaoSalvarSenha.disabled = true;
  mensagemAlterarSenha.textContent = "Alterando senha...";
  mensagemAlterarSenha.className = "text-sm mb-5 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/usuarios/me/senha`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senhaAtual: senhaAtualValor,
        novaSenha: novaSenhaValor,
      }),
    });

    if (resposta.status === 401) {
      mensagemAlterarSenha.textContent =
        "Sessão expirada ou senha atual incorreta.";
      mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
      return;
    }

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));

      mensagemAlterarSenha.textContent =
        dados.mensagem || dados.message || "Não foi possível alterar a senha.";

      mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
      return;
    }

    mensagemAlterarSenha.textContent = "Senha alterada com sucesso!";
    mensagemAlterarSenha.className = "text-sm mb-5 text-green-600";

    setTimeout(fecharModalSenha, 1000);
  } catch (erro) {
    console.error("Erro ao alterar senha:", erro);

    mensagemAlterarSenha.textContent = "Não foi possível conectar ao servidor.";

    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
  } finally {
    botaoSalvarSenha.disabled = false;
  }
});

// CARREGAMENTO INICIAL DA TELA
async function inicializarTelaRequisicoes() {
  await Promise.all([carregarMateriais(), carregarUsuarios()]);

  await carregarRequisicoes(true);
}

inicializarTelaRequisicoes();
