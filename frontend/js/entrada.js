
// Dados do usuário
const token = sessionStorage.getItem("token");
const usuarioId = sessionStorage.getItem("usuarioId");
const usuarioNome = sessionStorage.getItem("usuarioNome");
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");

// Verifica o login
if (!token) {
  window.location.href = "login.html";
}

// Entrada é exclusiva do administrador
if (usuarioPerfil !== "admin") {
  window.location.href = "estoque.html";
}

// Elementos do menu
const menuUsuarios = document.getElementById("menuUsuarios");
const botaoSair = document.getElementById("botaoSair");

// Identificação do usuário
const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

// Elementos da entrada
const formEntrada = document.getElementById("formEntrada");
const produtoEntrada = document.getElementById("produtoEntrada");
const quantidadeEntrada = document.getElementById("quantidadeEntrada");
const observacaoEntrada = document.getElementById("observacaoEntrada");
const mensagemEntrada = document.getElementById("mensagemEntrada");

// Elementos do modal
const modalNovoProduto = document.getElementById("modalNovoProduto");
const conteudoModal = document.getElementById("conteudoModal");
const botaoNovoProduto = document.getElementById("botaoNovoProduto");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const botaoCancelarNovo = document.getElementById("botaoCancelarNovo");

// Formulário do produto
const formNovoProduto = document.getElementById("formNovoProduto");
const nomeProduto = document.getElementById("nomeProduto");
const codigoProduto = document.getElementById("codigoProduto");
const descricaoProduto = document.getElementById("descricaoProduto");
const localizacaoProduto = document.getElementById("localizacaoProduto");
const unidadeMedidaProduto = document.getElementById("unidadeMedidaProduto");
const estoqueMinimoProduto = document.getElementById("estoqueMinimoProduto");
const botaoGerarCodigo = document.getElementById("botaoGerarCodigo");
const mensagemNovoProduto = document.getElementById("mensagemNovoProduto");

// Elementos do histórico
const listaUltimasEntradas = document.getElementById("listaUltimasEntradas");
const mensagemHistorico = document.getElementById("mensagemHistorico");
const areaPaginacaoEntradas = document.getElementById("areaPaginacaoEntradas");
const informacaoPaginacaoEntradas = document.getElementById("informacaoPaginacaoEntradas");
const botoesPaginacaoEntradas = document.getElementById("botoesPaginacaoEntradas");

// Guarda os produtos
let produtosCarregados = [];

// Guarda as entradas recuperadas do backend
let entradasCarregadas = [];

// Paginação do histórico
const ENTRADAS_POR_PAGINA = 3;
let paginaAtualEntradas = 1;

// Evita interpretar textos recebidos como HTML
function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mostra o usuário logado
nomeUsuario.textContent = usuarioNome || "Usuário";
perfilUsuario.textContent =
  usuarioPerfil === "admin" ? "Administrador" : "Usuário";

// Mostra menu de usuários para administrador
if (usuarioPerfil === "admin") {
  menuUsuarios.classList.remove("hidden");
}

// Busca os produtos
async function carregarProdutos() {
  try {
    const resposta = await fetch(`${API_URL}/produtos/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!resposta.ok) {
      mensagemEntrada.textContent =
        "Não foi possível carregar os produtos.";

      mensagemEntrada.className =
        "text-sm mt-4 text-red-600";
      return;
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Lista de produtos inválida.");
    }

    produtosCarregados = dados;

    // Organiza em ordem alfabética
    produtosCarregados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(
        String(b.nome || ""),
        "pt-BR",
        { sensitivity: "base" }
      );
    });

    produtoEntrada.innerHTML =
      '<option value="">Selecione um produto</option>';

    produtosCarregados.forEach(function (produto) {
      const opcao = document.createElement("option");

      opcao.value = produto.id;
      opcao.textContent =
        `${produto.nome} - ${produto.codigo || "Sem código"}`;

      produtoEntrada.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    mensagemEntrada.textContent =
      "Não foi possível conectar ao servidor.";

    mensagemEntrada.className =
      "text-sm mt-4 text-red-600";
  }
}

// Abre modal de novo produto
function abrirModal() {
  formNovoProduto.reset();
  mensagemNovoProduto.textContent = "";
  modalNovoProduto.classList.remove("hidden");
  nomeProduto.focus();
}

// Fecha modal de novo produto
function fecharModal() {
  modalNovoProduto.classList.add("hidden");
  formNovoProduto.reset();
  mensagemNovoProduto.textContent = "";
}

// Botão novo produto
botaoNovoProduto.addEventListener("click", abrirModal);

// Fecha pelo X
botaoFecharModal.addEventListener("click", fecharModal);

// Fecha pelo Cancelar
botaoCancelarNovo.addEventListener("click", fecharModal);

// Fecha clicando fora
modalNovoProduto.addEventListener("click", function (event) {
  if (event.target === modalNovoProduto) {
    fecharModal();
  }
});

// Fecha com ESC
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    !modalNovoProduto.classList.contains("hidden")
  ) {
    fecharModal();
  }
});

// Gera código automático
function gerarCodigoProduto() {
  const agora = new Date();

  const ano = String(agora.getFullYear()).slice(-2);
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let identificador = "";

  for (let i = 0; i < 4; i++) {
    const posicao = Math.floor(Math.random() * caracteres.length);
    identificador += caracteres[posicao];
  }

  return `P${ano}${mes}${dia}.${identificador}`;
}

// Botão gerar código
botaoGerarCodigo.addEventListener("click", function () {
  codigoProduto.value = gerarCodigoProduto();
});

// Cadastra produto
formNovoProduto.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = nomeProduto.value.trim();
  const codigo = codigoProduto.value.trim().toUpperCase();
  const descricao = descricaoProduto.value.trim();
  const localizacao = localizacaoProduto.value.trim();
  const unidadeMedida = unidadeMedidaProduto.value;
  const estoqueMinimo = estoqueMinimoProduto.value;

  // Valida campos
  if (
    !nome ||
    !codigo ||
    !localizacao ||
    !unidadeMedida ||
    estoqueMinimo === ""
  ) {
    mensagemNovoProduto.textContent =
      "Preencha os campos obrigatórios.";

    mensagemNovoProduto.className =
      "text-sm mb-5 text-red-600";
    return;
  }

  // Impede estoque mínimo negativo ou fracionado
  if (
    !Number.isSafeInteger(Number(estoqueMinimo)) ||
    Number(estoqueMinimo) < 0
  ) {
    mensagemNovoProduto.textContent =
      "O estoque mínimo deve ser um número inteiro e não negativo.";

    mensagemNovoProduto.className =
      "text-sm mb-5 text-red-600";
    return;
  }

  // Verifica código repetido
  const codigoExiste = produtosCarregados.some(function (produto) {
    return String(produto.codigo || "").toUpperCase() === codigo;
  });

  if (codigoExiste) {
    mensagemNovoProduto.textContent =
      "Já existe um produto com esse código.";

    mensagemNovoProduto.className =
      "text-sm mb-5 text-red-600";
    return;
  }

  mensagemNovoProduto.textContent = "Cadastrando produto...";
  mensagemNovoProduto.className = "text-sm mb-5 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/produtos/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nome,
        codigo: codigo,
        descricao: descricao,
        localizacao: localizacao,
        quantidade: 0,
        unidadeMedida: unidadeMedida,
        estoqueMinimo: Number(estoqueMinimo),
      }),
    });

    if (resposta.status === 403) {
      mensagemNovoProduto.textContent =
        "Apenas administradores podem cadastrar produtos.";

      mensagemNovoProduto.className =
        "text-sm mb-5 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemNovoProduto.textContent =
        "Não foi possível cadastrar o produto.";

      mensagemNovoProduto.className =
        "text-sm mb-5 text-red-600";
      return;
    }

    const produtoCriado = await resposta.json();

    // Atualiza a lista
    await carregarProdutos();

    // Seleciona o produto criado
    produtoEntrada.value = produtoCriado.id;

    fecharModal();

    mensagemEntrada.textContent =
      "Produto cadastrado. Agora informe a quantidade recebida.";

    mensagemEntrada.className =
      "text-sm mt-4 text-green-600";
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    mensagemNovoProduto.textContent =
      "Não foi possível conectar ao servidor.";

    mensagemNovoProduto.className =
      "text-sm mb-5 text-red-600";
  }
});

// Registra entrada
formEntrada.addEventListener("submit", async function (event) {
  event.preventDefault();

  const produtoId = produtoEntrada.value;
  const quantidade = quantidadeEntrada.value;
  const observacao = observacaoEntrada.value.trim();

  if (!produtoId || !quantidade) {
    mensagemEntrada.textContent =
      "Selecione o produto e informe a quantidade.";

    mensagemEntrada.className =
      "text-sm mt-4 text-red-600";
    return;
  }

  if (
    !Number.isSafeInteger(Number(quantidade)) ||
    Number(quantidade) <= 0
  ) {
    mensagemEntrada.textContent =
      "A quantidade deve ser um número inteiro maior que zero.";

    mensagemEntrada.className =
      "text-sm mt-4 text-red-600";
    return;
  }

  mensagemEntrada.textContent = "Registrando entrada...";
  mensagemEntrada.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/movimentacoes/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        produtoId: Number(produtoId),
        usuarioId: Number(usuarioId),
        tipo: "ENTRADA",
        quantidade: Number(quantidade),
        observacao: observacao,
      }),
    });

    if (resposta.status === 403) {
      mensagemEntrada.textContent =
        "Apenas administradores podem registrar entradas.";

      mensagemEntrada.className =
        "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemEntrada.textContent =
        "Não foi possível registrar a entrada.";

      mensagemEntrada.className =
        "text-sm mt-4 text-red-600";
      return;
    }

    formEntrada.reset();

    await carregarProdutos();

    mensagemEntrada.textContent =
      "Entrada registrada com sucesso!";

    mensagemEntrada.className =
      "text-sm mt-4 text-green-600";

    // Atualiza o histórico sem precisar sair da página
    await carregarUltimasEntradas(true);
  } catch (erro) {
    console.error("Erro ao registrar entrada:", erro);

    mensagemEntrada.textContent =
      "Não foi possível conectar ao servidor.";

    mensagemEntrada.className =
      "text-sm mt-4 text-red-600";
  }
});

// ---------------------------------------------------
// HISTÓRICO DAS ÚLTIMAS ENTRADAS
// ---------------------------------------------------

// Encontra a data em formatos comuns de movimentação
function obterDataEntrada(entrada) {
  return (
    entrada.dataHora ??
    entrada.dataMovimentacao ??
    entrada.data ??
    entrada.criadoEm ??
    entrada.dataCriacao ??
    entrada.createdAt ??
    null
  );
}

// Converte uma data para apresentação
function formatarDataEntrada(valor) {
  if (!valor) {
    return "-";
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return String(valor);
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Obtém a identificação do produto
function obterNomeProdutoEntrada(entrada) {
  const nomeDireto =
    entrada.produtoNome ?? entrada.nomeProduto;

  if (nomeDireto) {
    return String(nomeDireto);
  }

  if (entrada.produto?.nome) {
    return String(entrada.produto.nome);
  }

  const id =
    entrada.produtoId ?? entrada.produto?.id;

  const produtoLocal = produtosCarregados.find(
    (produto) => String(produto.id) === String(id)
  );

  return produtoLocal?.nome ?? `Produto #${id ?? "-"}`;
}

// Obtém o responsável pela entrada
function obterResponsavelEntrada(entrada) {
  return (
    entrada.usuarioNome ??
    entrada.nomeUsuario ??
    entrada.usuario?.nome ??
    "Não informado"
  );
}

// Busca o histórico completo no backend
async function carregarUltimasEntradas(voltarPrimeiraPagina = false) {
  mensagemHistorico.classList.remove("hidden");
  mensagemHistorico.textContent =
    "Carregando últimas entradas...";

  try {
    const resposta = await fetch(
      `${API_URL}/movimentacoes/listar`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!resposta.ok) {
      throw new Error(
        `Erro ao consultar histórico (${resposta.status}).`
      );
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error(
        "O servidor não retornou uma lista de movimentações."
      );
    }

    // Mantém apenas as movimentações de entrada
    entradasCarregadas = dados.filter(function (movimentacao) {
      return String(movimentacao.tipo ?? "").toUpperCase() ===
        "ENTRADA";
    });

    // Ordena as entradas mais recentes primeiro
    entradasCarregadas.sort(function (a, b) {
      const dataA = new Date(obterDataEntrada(a) ?? 0).getTime();
      const dataB = new Date(obterDataEntrada(b) ?? 0).getTime();

      const tempoA = Number.isFinite(dataA) ? dataA : 0;
      const tempoB = Number.isFinite(dataB) ? dataB : 0;

      if (tempoA !== tempoB) {
        return tempoB - tempoA;
      }

      return Number(b.id ?? 0) - Number(a.id ?? 0);
    });

    if (voltarPrimeiraPagina) {
      paginaAtualEntradas = 1;
    }

    mostrarUltimasEntradas();
  } catch (erro) {
    console.error("Erro ao carregar últimas entradas:", erro);

    listaUltimasEntradas.innerHTML = "";
    areaPaginacaoEntradas.classList.add("hidden");

    mensagemHistorico.classList.remove("hidden");
    mensagemHistorico.textContent =
      "Não foi possível carregar o histórico de entradas.";
    mensagemHistorico.className =
      "text-sm text-red-600 text-center py-5";
  }
}

// Mostra três entradas por página
function mostrarUltimasEntradas() {
  listaUltimasEntradas.innerHTML = "";

  if (entradasCarregadas.length === 0) {
    mensagemHistorico.classList.remove("hidden");
    mensagemHistorico.textContent =
      "Nenhuma entrada registrada.";

    mensagemHistorico.className =
      "text-sm text-slate-500 text-center py-5";

    areaPaginacaoEntradas.classList.add("hidden");
    return;
  }

  mensagemHistorico.classList.add("hidden");

  const totalPaginas = Math.ceil(
    entradasCarregadas.length / ENTRADAS_POR_PAGINA
  );

  paginaAtualEntradas = Math.min(
    Math.max(1, paginaAtualEntradas),
    totalPaginas
  );

  const inicio =
    (paginaAtualEntradas - 1) * ENTRADAS_POR_PAGINA;

  const entradasDaPagina = entradasCarregadas.slice(
    inicio,
    inicio + ENTRADAS_POR_PAGINA
  );

  entradasDaPagina.forEach(function (entrada) {
    const produto = obterNomeProdutoEntrada(entrada);
    const quantidade = entrada.quantidade ?? 0;
    const data = formatarDataEntrada(
      obterDataEntrada(entrada)
    );
    const responsavel = obterResponsavelEntrada(entrada);
    const observacao = String(entrada.observacao ?? "").trim();

    const card = document.createElement("div");

    card.className =
      "border border-slate-200 rounded-xl p-4 " +
      "bg-white shadow-sm";

    card.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-3">

        <div class="min-w-0 flex-1">
          <p class="font-semibold text-slate-800">
            ${escaparHTML(produto)}
          </p>

          <p class="text-sm text-slate-500 mt-1">
            ${escaparHTML(data)}
          </p>
        </div>

        <span class="rounded-lg bg-green-100 text-green-700 px-3 py-2 font-bold whitespace-nowrap">
          +${escaparHTML(quantidade)}
        </span>

      </div>

      <p class="text-sm text-slate-600 mt-3">
        Registrado por: ${escaparHTML(responsavel)}
      </p>

      ${
        observacao
          ? `
            <p class="text-sm text-slate-600 mt-1">
              Observação: ${escaparHTML(observacao)}
            </p>
          `
          : ""
      }
    `;

    listaUltimasEntradas.appendChild(card);
  });

  mostrarPaginacaoEntradas(totalPaginas);
}

// Monta os botões de paginação
function mostrarPaginacaoEntradas(totalPaginas) {
  botoesPaginacaoEntradas.innerHTML = "";

  if (totalPaginas <= 1) {
    areaPaginacaoEntradas.classList.add("hidden");
    return;
  }

  areaPaginacaoEntradas.classList.remove("hidden");

  informacaoPaginacaoEntradas.textContent =
    `Página ${paginaAtualEntradas} de ${totalPaginas}`;

  criarBotaoPaginacaoEntrada(
    "‹",
    paginaAtualEntradas - 1,
    paginaAtualEntradas === 1,
    false,
    "Página anterior"
  );

  // Até cinco números de páginas próximos da atual
  let inicio = Math.max(1, paginaAtualEntradas - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let pagina = inicio; pagina <= fim; pagina++) {
    criarBotaoPaginacaoEntrada(
      String(pagina),
      pagina,
      false,
      pagina === paginaAtualEntradas,
      `Página ${pagina}`
    );
  }

  criarBotaoPaginacaoEntrada(
    "›",
    paginaAtualEntradas + 1,
    paginaAtualEntradas === totalPaginas,
    false,
    "Próxima página"
  );
}

// Cria um botão de paginação
function criarBotaoPaginacaoEntrada(
  texto,
  pagina,
  desabilitado,
  ativo,
  descricao
) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;

  botao.setAttribute("aria-label", descricao);

  botao.className =
    "min-w-10 h-10 px-3 rounded-lg border " +
    "text-sm font-semibold transition";

  if (ativo) {
    botao.className +=
      " bg-green-600 border-green-600 text-white";
    botao.setAttribute("aria-current", "page");
  } else {
    botao.className +=
      " bg-white border-slate-200 text-slate-600 hover:bg-green-50";
  }

  if (desabilitado) {
    botao.className += " opacity-40 cursor-not-allowed";
  }

  botao.addEventListener("click", function () {
    mudarPaginaEntradas(pagina);
  });

  botoesPaginacaoEntradas.appendChild(botao);
}

// Altera a página exibida
function mudarPaginaEntradas(novaPagina) {
  const totalPaginas = Math.ceil(
    entradasCarregadas.length / ENTRADAS_POR_PAGINA
  );

  if (
    novaPagina < 1 ||
    novaPagina > totalPaginas ||
    novaPagina === paginaAtualEntradas
  ) {
    return;
  }

  paginaAtualEntradas = novaPagina;
  mostrarUltimasEntradas();
}

// Logout
botaoSair.addEventListener("click", function (event) {
  event.preventDefault();

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");

  window.location.href = "login.html?logout=1";
});

// Carregamento inicial
async function iniciarTelaEntradas() {
  await carregarProdutos();
  await carregarUltimasEntradas();
}

iniciarTelaEntradas();
