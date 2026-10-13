// =====================================================
// SIA - Requisições
// =====================================================

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

nomeUsuario.textContent = usuarioNome || "Usuário";

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
const modalDetalhesRequisicao = document.getElementById("modalDetalhesRequisicao");
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
const areaPaginacaoRequisicoes = document.getElementById("areaPaginacaoRequisicoes");
const informacaoPaginacaoRequisicoes = document.getElementById("informacaoPaginacaoRequisicoes");
const botoesPaginacaoRequisicoes = document.getElementById("botoesPaginacaoRequisicoes");

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

// -----------------------------------------------------
// Funções auxiliares
// -----------------------------------------------------

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

// -----------------------------------------------------
// Carrega os materiais
// -----------------------------------------------------

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
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", { sensitivity: "base" });
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

// -----------------------------------------------------
// Carrega usuários para identificar quem criou
// -----------------------------------------------------

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

// -----------------------------------------------------
// Carrega requisições
// -----------------------------------------------------

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
      throw new Error("Não foi possível carregar as requisições.");
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

    mensagemLista.textContent = "Não foi possível carregar as requisições.";
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

// -----------------------------------------------------
// Paginação e apresentação da tabela
// -----------------------------------------------------

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

  const totalPaginas = Math.ceil(requisicoesFiltradas.length / REQUISICOES_POR_PAGINA);

  // Ajusta a página se algum registro deixou de existir
  paginaAtual = Math.min(Math.max(1, paginaAtual), totalPaginas);

  const inicio = (paginaAtual - 1) * REQUISICOES_POR_PAGINA;

  const requisicoesDaPagina = requisicoesFiltradas.slice(inicio, inicio + REQUISICOES_POR_PAGINA);

  requisicoesDaPagina.forEach(function (requisicao) {
    const linha = document.createElement("tr");

    linha.className = "border-t border-slate-200 cursor-pointer " + "hover:bg-orange-50 focus:bg-orange-50 transition";

    // Possibilita abrir a linha pelo teclado
    linha.tabIndex = 0;
    linha.setAttribute("role", "button");
    linha.setAttribute("aria-label", `Ver detalhes da requisição ${requisicao.codigo || requisicao.id}`);

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

  const ultimoRegistro = Math.min(paginaAtual * REQUISICOES_POR_PAGINA, requisicoesFiltradas.length);

  informacaoPaginacaoRequisicoes.textContent =
    `Mostrando ${primeiroRegistro} a ${ultimoRegistro} ` +
    `de ${requisicoesFiltradas.length} requisições ` +
    `• Página ${paginaAtual} de ${totalPaginas}`;

  criarBotaoPagina("‹", paginaAtual - 1, paginaAtual === 1, false, "Página anterior");

  // Exibe até cinco números de páginas
  let inicio = Math.max(1, paginaAtual - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let numero = inicio; numero <= fim; numero++) {
    criarBotaoPagina(String(numero), numero, false, numero === paginaAtual, `Página ${numero}`);
  }

  criarBotaoPagina("›", paginaAtual + 1, paginaAtual === totalPaginas, false, "Próxima página");
}

function criarBotaoPagina(texto, numeroPagina, desabilitado, ativo, descricao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;
  botao.setAttribute("aria-label", descricao);

  botao.className = "min-w-10 h-10 px-3 rounded-lg border " + "font-semibold text-sm transition";

  if (ativo) {
    botao.className += " bg-orange-500 border-orange-500 text-white";
    botao.setAttribute("aria-current", "page");
  } else {
    botao.className += " bg-white border-slate-200 text-slate-600 hover:bg-orange-50";
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
  const totalPaginas = Math.ceil(requisicoesFiltradas.length / REQUISICOES_POR_PAGINA);

  if (novaPagina < 1 || novaPagina > totalPaginas || novaPagina === paginaAtual) {
    return;
  }

  paginaAtual = novaPagina;
  mostrarRequisicoes();
}

// -----------------------------------------------------
// Modal de nova requisição
// -----------------------------------------------------

function abrirModalNovaRequisicao() {
  mensagemRequisicao.textContent = "";
  mensagemRequisicao.className = "text-sm mb-4";

  modalNovaRequisicao.classList.remove("hidden");
  campoMaterial.focus();
}

function fecharModalNovaRequisicao() {
  modalNovaRequisicao.classList.add("hidden");

  formRequisicao.reset();
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

// -----------------------------------------------------
// Envia uma nova requisição
// -----------------------------------------------------

formRequisicao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const produtoId = campoMaterial.value;
  const quantidade = Number(campoQuantidade.value);
  const observacao = campoObservacao.value.trim();

  if (!produtoId || !Number.isSafeInteger(quantidade) || quantidade <= 0) {
    mensagemRequisicao.textContent = "Selecione o material e informe uma quantidade inteira válida.";

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
        produtoId: Number(produtoId),
        quantidade: quantidade,
        observacao: observacao,
      }),
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (!resposta.ok) {
      mensagemRequisicao.textContent = "Não foi possível realizar a requisição.";

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

// -----------------------------------------------------
// Modal de detalhes da requisição
// -----------------------------------------------------

function abrirDetalhesRequisicao(requisicao) {
  requisicaoSelecionada = requisicao;

  mensagemStatus.textContent = "";
  mensagemStatus.className = "text-sm mt-4";

  const nomeProduto = buscarNomeProduto(requisicao.produtoId);
  const nomeDoUsuario = buscarNomeUsuario(requisicao.usuarioId);

  conteudoDetalhes.innerHTML = `
    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Código
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(requisicao.codigo || "-")}
      </p>
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Criado por
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(nomeDoUsuario)}
      </p>
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Produto
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(nomeProduto)}
      </p>
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Quantidade
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(requisicao.quantidade ?? 0)}
      </p>
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Status
      </p>
      ${criarStatusHtml(requisicao.status)}
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Data de criação
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(formatarData(requisicao.dataMovimentacao))}
      </p>
    </div>

    <div>
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Data atualizada
      </p>
      <p class="font-medium text-slate-800">
        ${escaparHTML(formatarData(requisicao.dataAtualizada))}
      </p>
    </div>

    <div class="md:col-span-2">
      <p class="text-sm font-semibold text-slate-500 mb-1">
        Observação
      </p>
      <p class="font-medium text-slate-800 whitespace-pre-wrap break-words">
        ${escaparHTML(requisicao.observacao || "Sem observação")}
      </p>
    </div>
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

  if (!modalDetalhesRequisicao.classList.contains("hidden")) {
    fecharDetalhesRequisicao();
    return;
  }

  if (!modalNovaRequisicao.classList.contains("hidden")) {
    fecharModalNovaRequisicao();
  }
});

// -----------------------------------------------------
// Filtros
// -----------------------------------------------------

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

    if (dataCriacao && pegarSomenteData(requisicao.dataMovimentacao) !== dataCriacao) {
      return false;
    }

    if (status && requisicao.status !== status) {
      return false;
    }

    if (dataAtualizada && pegarSomenteData(requisicao.dataAtualizada) !== dataAtualizada) {
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

// -----------------------------------------------------
// Alteração de status
// -----------------------------------------------------

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
  if (usuarioPerfil !== "admin" || !requisicaoSelecionada || atualizandoStatus) {
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
    const resposta = await fetch(`${API_URL}/movimentacoes/requisicoes/${requisicaoId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: novoStatus,
      }),
    });

    if (tratarSessaoExpirada(resposta)) {
      return;
    }

    if (resposta.status === 403) {
      mensagemStatus.textContent = "Você não tem permissão para alterar o status.";

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

// -----------------------------------------------------
// Apresentação do status
// -----------------------------------------------------

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

// -----------------------------------------------------
// Formatação de data
// -----------------------------------------------------

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

// -----------------------------------------------------
// Logout
// -----------------------------------------------------

botaoSair.addEventListener("click", function (event) {
  event.preventDefault();

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");

  window.location.href = "login.html?logout=1";
});

// -----------------------------------------------------
// Carregamento inicial
// -----------------------------------------------------

async function iniciarTela() {
  await carregarMateriais();
  await carregarUsuarios();
  await carregarRequisicoes();
}

iniciarTela();
