// Dados do usuário
const token = sessionStorage.getItem("token");
const usuarioNome = sessionStorage.getItem("usuarioNome");
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");

// Verifica o login
if (!token) {
  window.location.href = "login.html";
}

// Elementos da tela
const tabelaEstoque = document.getElementById("tabelaEstoque");
const mensagemEstoque = document.getElementById("mensagemEstoque");
const campoBusca = document.getElementById("campoBusca");

const menuEntrada = document.getElementById("menuEntrada");
const menuUsuarios = document.getElementById("menuUsuarios");

const cabecalhoAcoes = document.getElementById("cabecalhoAcoes");
const botaoSair = document.getElementById("botaoSair");

const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

// Elementos da paginação
const areaPaginacao = document.getElementById("areaPaginacao");
const informacaoPaginacao = document.getElementById("informacaoPaginacao");
const botoesPaginacao = document.getElementById("botoesPaginacao");

// Modal de edição
const modalEditarProduto = document.getElementById("modalEditarProduto");
const formEditarProduto = document.getElementById("formEditarProduto");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");
const botaoGerarCodigoEdicao = document.getElementById("botaoGerarCodigoEdicao");
const mensagemEditar = document.getElementById("mensagemEditar");

// Campos de edição
const editarNome = document.getElementById("editarNome");
const editarCodigo = document.getElementById("editarCodigo");
const editarDescricao = document.getElementById("editarDescricao");
const editarLocalizacao = document.getElementById("editarLocalizacao");
const editarUnidadeMedida = document.getElementById("editarUnidadeMedida");
const editarEstoqueMinimo = document.getElementById("editarEstoqueMinimo");

// Modal de exclusão
const modalConfirmarExclusao = document.getElementById("modalConfirmarExclusao");
const nomeProdutoExcluir = document.getElementById("nomeProdutoExcluir");
const mensagemExcluir = document.getElementById("mensagemExcluir");
const botaoFecharExclusao = document.getElementById("botaoFecharExclusao");
const botaoCancelarExclusao = document.getElementById("botaoCancelarExclusao");
const botaoConfirmarExclusao = document.getElementById("botaoConfirmarExclusao");

// Guarda os produtos
let produtosCarregados = [];
let produtoEmEdicao = null;
let produtoParaExcluir = null;

// Controle da paginação
const PRODUTOS_POR_PAGINA = 5;

let paginaAtual = 1;
let produtosFiltrados = [];

// Evita que textos recebidos do backend
// sejam interpretados como código HTML.
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

if (usuarioPerfil === "admin") {
  perfilUsuario.textContent = "Administrador";
} else {
  perfilUsuario.textContent = "Usuário";
}

// Configura o menu conforme o perfil
if (usuarioPerfil === "admin") {
  menuUsuarios.classList.remove("hidden");
  cabecalhoAcoes.classList.remove("hidden");
} else {
  menuEntrada.classList.add("hidden");
  menuUsuarios.classList.add("hidden");
}

// Busca os produtos no backend
async function carregarEstoque() {
  mensagemEstoque.classList.remove("hidden");
  mensagemEstoque.textContent = "Carregando estoque...";

  tabelaEstoque.innerHTML = "";
  areaPaginacao.classList.add("hidden");

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
      mensagemEstoque.textContent = "Não foi possível carregar o estoque.";
      return;
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      mensagemEstoque.textContent = "O servidor retornou uma lista de produtos inválida.";
      return;
    }

    produtosCarregados = dados;

    // Organiza os produtos em ordem alfabética
    produtosCarregados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", { sensitivity: "base" });
    });

    // Mantém a pesquisa após editar ou excluir produtos
    aplicarPesquisa(false);
  } catch (erro) {
    console.error("Erro ao carregar estoque:", erro);

    mensagemEstoque.classList.remove("hidden");
    mensagemEstoque.textContent = "Não foi possível conectar ao servidor.";
  }
}

// Aplica a pesquisa à lista completa
function aplicarPesquisa(voltarPrimeiraPagina = true) {
  const busca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");

  produtosFiltrados = produtosCarregados.filter(function (produto) {
    const nome = String(produto.nome || "").toLocaleLowerCase("pt-BR");

    const codigo = String(produto.codigo || "").toLocaleLowerCase("pt-BR");

    return nome.includes(busca) || codigo.includes(busca);
  });

  // Ao digitar uma nova pesquisa, volta para a página 1
  if (voltarPrimeiraPagina) {
    paginaAtual = 1;
  }

  mostrarProdutos();
}

// Exibe somente os cinco produtos da página atual
function mostrarProdutos() {
  tabelaEstoque.innerHTML = "";

  if (produtosFiltrados.length === 0) {
    mensagemEstoque.classList.remove("hidden");
    mensagemEstoque.textContent = "Nenhum produto encontrado.";

    areaPaginacao.classList.add("hidden");
    return;
  }

  mensagemEstoque.classList.add("hidden");

  // Calcula o total de páginas
  const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);

  // Corrige a página quando produtos são excluídos
  if (paginaAtual > totalPaginas) {
    paginaAtual = totalPaginas;
  }

  if (paginaAtual < 1) {
    paginaAtual = 1;
  }

  const indiceInicial = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;

  const indiceFinal = indiceInicial + PRODUTOS_POR_PAGINA;

  const produtosDaPagina = produtosFiltrados.slice(indiceInicial, indiceFinal);

  // Monta somente as linhas da página escolhida
  produtosDaPagina.forEach(function (produto) {
    const linha = document.createElement("tr");

    linha.className = "hover:bg-slate-100 transition";

    const status = calcularStatusEstoque(produto);

    let colunaAcoes = "";

    // Somente administrador vê editar e excluir
    if (usuarioPerfil === "admin") {
      colunaAcoes = `
        <td class="px-6 py-5">
          <div class="flex items-center justify-center gap-2">

            <button
              type="button"
              class="botaoEditar border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              data-id="${escaparHTML(produto.id)}"
            >
              Editar
            </button>

            <button
              type="button"
              class="botaoExcluir border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
              data-id="${escaparHTML(produto.id)}"
            >
              Excluir
            </button>

          </div>
        </td>
      `;
    }

    linha.innerHTML = `
      <td class="px-6 py-5">

        <div class="font-semibold text-slate-800">
          ${escaparHTML(produto.nome || "-")}
        </div>

        ${
          produto.localizacao
            ? `
              <div class="text-sm text-slate-500 mt-1">
                ${escaparHTML(produto.localizacao)}
              </div>
            `
            : ""
        }

      </td>

      <td class="px-6 py-5 text-slate-600 font-medium">
        ${escaparHTML(produto.codigo || "-")}
      </td>

      <td class="px-6 py-5 text-center">
        <span class="text-lg font-semibold text-slate-800">
          ${escaparHTML(produto.quantidade ?? 0)}
        </span>
      </td>

      <td class="px-6 py-5 text-slate-600">
        ${escaparHTML(formatarUnidade(produto.unidadeMedida))}
      </td>

      <td class="px-6 py-5">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.classe}">
          <span class="w-2 h-2 rounded-full ${status.bolinha}"></span>
          ${status.texto}
        </span>
      </td>

      ${colunaAcoes}
    `;

    tabelaEstoque.appendChild(linha);
  });

  // Reativa os botões da página renderizada
  if (usuarioPerfil === "admin") {
    configurarBotoesEditar();
    configurarBotoesExcluir();
  }

  // Atualiza os controles de navegação
  mostrarPaginacao(totalPaginas);
}

// Desenha os botões de paginação
function mostrarPaginacao(totalPaginas) {
  botoesPaginacao.innerHTML = "";

  // Mostra a paginação apenas quando existe
  // mais de uma página de resultados.
  if (totalPaginas <= 1) {
    areaPaginacao.classList.add("hidden");
    return;
  }

  areaPaginacao.classList.remove("hidden");

  const primeiroProduto = (paginaAtual - 1) * PRODUTOS_POR_PAGINA + 1;

  const ultimoProduto = Math.min(paginaAtual * PRODUTOS_POR_PAGINA, produtosFiltrados.length);

  informacaoPaginacao.textContent =
    `Mostrando ${primeiroProduto} a ${ultimoProduto} ` +
    `de ${produtosFiltrados.length} produtos ` +
    `• Página ${paginaAtual} de ${totalPaginas}`;

  // Botão de página anterior
  criarBotaoPagina("‹", paginaAtual - 1, paginaAtual === 1, false, "Página anterior");

  // Gera os números da paginação
  const numeros = gerarNumerosPaginas(totalPaginas);

  numeros.forEach(function (numero) {
    if (typeof numero === "string") {
      const pontos = document.createElement("span");

      pontos.textContent = "...";
      pontos.className = "px-2 text-slate-400";

      botoesPaginacao.appendChild(pontos);
      return;
    }

    criarBotaoPagina(String(numero), numero, false, numero === paginaAtual, `Página ${numero}`);
  });

  // Botão de próxima página
  criarBotaoPagina("›", paginaAtual + 1, paginaAtual === totalPaginas, false, "Próxima página");
}

// Cria um botão individual da paginação
function criarBotaoPagina(texto, numeroPagina, desabilitado = false, ativo = false, descricao = "") {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;
  botao.setAttribute("aria-label", descricao || texto);

  botao.className =
    "min-w-10 h-10 px-3 rounded-lg border " + "font-semibold text-sm transition " + "flex items-center justify-center";

  if (ativo) {
    botao.className += " bg-blue-600 border-blue-600 text-white";
    botao.setAttribute("aria-current", "page");
  } else {
    botao.className += " bg-white border-slate-200 text-slate-600 hover:bg-blue-50";
  }

  if (desabilitado) {
    botao.className += " opacity-40 cursor-not-allowed";
  }

  botao.addEventListener("click", function () {
    mudarPagina(numeroPagina);
  });

  botoesPaginacao.appendChild(botao);
}

// Calcula os números exibidos na paginação
function gerarNumerosPaginas(totalPaginas) {
  if (totalPaginas <= 5) {
    return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  }

  const inicio = Math.max(2, Math.min(paginaAtual - 1, totalPaginas - 3));

  const fim = Math.min(totalPaginas - 1, inicio + 2);

  const paginas = [1];

  if (inicio > 2) {
    paginas.push("inicio-pontos");
  }

  for (let pagina = inicio; pagina <= fim; pagina++) {
    paginas.push(pagina);
  }

  if (fim < totalPaginas - 1) {
    paginas.push("fim-pontos");
  }

  paginas.push(totalPaginas);

  return paginas;
}

// Muda de página sem consultar novamente o backend
function mudarPagina(novaPagina) {
  const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);

  if (novaPagina < 1 || novaPagina > totalPaginas || novaPagina === paginaAtual) {
    return;
  }

  paginaAtual = novaPagina;

  mostrarProdutos();
}

// Calcula a situação de cada produto
function calcularStatusEstoque(produto) {
  const quantidade = Number(produto.quantidade ?? 0);
  const estoqueMinimo = Number(produto.estoqueMinimo ?? 0);

  if (estoqueMinimo <= 0) {
    if (quantidade <= 0) {
      return {
        texto: "Crítico",
        classe: "bg-red-100 text-red-700",
        bolinha: "bg-red-500",
      };
    }

    return {
      texto: "Normal",
      classe: "bg-green-100 text-green-700",
      bolinha: "bg-green-500",
    };
  }

  // Crítico quando chega ao mínimo
  if (quantidade <= estoqueMinimo) {
    return {
      texto: "Crítico",
      classe: "bg-red-100 text-red-700",
      bolinha: "bg-red-500",
    };
  }

  // Baixo até 150% do mínimo
  if (quantidade <= estoqueMinimo * 1.5) {
    return {
      texto: "Baixo",
      classe: "bg-yellow-100 text-yellow-800",
      bolinha: "bg-yellow-500",
    };
  }

  return {
    texto: "Normal",
    classe: "bg-green-100 text-green-700",
    bolinha: "bg-green-500",
  };
}

// Formata a unidade de medida
function formatarUnidade(unidade) {
  if (!unidade) {
    return "-";
  }

  const unidades = {
    UNIDADE: "Unidade",
    CAIXA: "Caixa",
    PACOTE: "Pacote",
    METRO: "Metro",
    LITRO: "Litro",
    QUILO: "Quilo",
  };

  return unidades[unidade] || unidade;
}

// Gera um novo código SKU
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

// Botão para gerar código durante a edição
botaoGerarCodigoEdicao.addEventListener("click", function () {
  editarCodigo.value = gerarCodigoProduto();
});

// Configura os botões Editar da página atual
function configurarBotoesEditar() {
  const botoes = document.querySelectorAll(".botaoEditar");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = Number(botao.dataset.id);
      abrirEdicao(id);
    });
  });
}

// Abre o modal de edição
function abrirEdicao(id) {
  if (usuarioPerfil !== "admin") {
    return;
  }

  const produto = produtosCarregados.find(function (item) {
    return item.id === id;
  });

  if (!produto) {
    return;
  }

  produtoEmEdicao = produto;

  editarNome.value = produto.nome || "";
  editarCodigo.value = produto.codigo || "";
  editarDescricao.value = produto.descricao || "";
  editarLocalizacao.value = produto.localizacao || "";
  editarUnidadeMedida.value = produto.unidadeMedida || "UNIDADE";

  editarEstoqueMinimo.value = produto.estoqueMinimo ?? 0;

  mensagemEditar.textContent = "";

  modalEditarProduto.classList.remove("hidden");
}

// Fecha o modal de edição
function fecharModalEdicao() {
  modalEditarProduto.classList.add("hidden");

  produtoEmEdicao = null;
  mensagemEditar.textContent = "";
}

// Salva alterações de um produto
formEditarProduto.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (usuarioPerfil !== "admin" || !produtoEmEdicao) {
    return;
  }

  const nome = editarNome.value.trim();
  const codigo = editarCodigo.value.trim().toUpperCase();
  const descricao = editarDescricao.value.trim();
  const localizacao = editarLocalizacao.value.trim();
  const unidadeMedida = editarUnidadeMedida.value;
  const estoqueMinimo = editarEstoqueMinimo.value;

  if (!nome || !codigo || !localizacao || !unidadeMedida || estoqueMinimo === "") {
    mensagemEditar.textContent = "Preencha os campos obrigatórios.";

    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (!Number.isSafeInteger(Number(estoqueMinimo)) || Number(estoqueMinimo) < 0) {
    mensagemEditar.textContent = "Digite um estoque mínimo inteiro e não negativo.";

    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  // Verifica códigos repetidos
  const codigoExiste = produtosCarregados.some(function (produto) {
    return produto.id !== produtoEmEdicao.id && String(produto.codigo || "").toUpperCase() === codigo;
  });

  if (codigoExiste) {
    mensagemEditar.textContent = "Já existe outro produto com esse código.";

    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  mensagemEditar.textContent = "Salvando alterações...";

  mensagemEditar.className = "text-sm mb-5 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/produtos/${produtoEmEdicao.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        codigo,
        descricao,
        localizacao,
        unidadeMedida,
        estoqueMinimo: Number(estoqueMinimo),
      }),
    });

    if (resposta.status === 401) {
      mensagemEditar.textContent = "Sessão expirada. Faça login novamente.";

      mensagemEditar.className = "text-sm mb-5 text-red-600";
      return;
    }

    if (resposta.status === 403) {
      mensagemEditar.textContent = "Apenas administradores podem editar produtos.";

      mensagemEditar.className = "text-sm mb-5 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemEditar.textContent = "Não foi possível editar o produto.";

      mensagemEditar.className = "text-sm mb-5 text-red-600";
      return;
    }

    fecharModalEdicao();

    // Atualiza os produtos, preservando a pesquisa
    // e a página atual quando possível.
    await carregarEstoque();
  } catch (erro) {
    console.error("Erro ao editar produto:", erro);

    mensagemEditar.textContent = "Não foi possível conectar ao servidor.";

    mensagemEditar.className = "text-sm mb-5 text-red-600";
  }
});

// Configura os botões Excluir da página atual
function configurarBotoesExcluir() {
  const botoes = document.querySelectorAll(".botaoExcluir");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = Number(botao.dataset.id);
      abrirConfirmacaoExclusao(id);
    });
  });
}

// Abre confirmação de exclusão
function abrirConfirmacaoExclusao(id) {
  if (usuarioPerfil !== "admin") {
    return;
  }

  const produto = produtosCarregados.find(function (item) {
    return item.id === id;
  });

  if (!produto) {
    return;
  }

  produtoParaExcluir = produto;

  nomeProdutoExcluir.textContent = `"${produto.nome}"`;
  mensagemExcluir.textContent = "";

  modalConfirmarExclusao.classList.remove("hidden");
}

// Fecha confirmação de exclusão
function fecharConfirmacaoExclusao() {
  modalConfirmarExclusao.classList.add("hidden");

  produtoParaExcluir = null;
  mensagemExcluir.textContent = "";
}

// Confirma a exclusão do produto
botaoConfirmarExclusao.addEventListener("click", async function () {
  if (usuarioPerfil !== "admin" || !produtoParaExcluir) {
    return;
  }

  mensagemExcluir.textContent = "Excluindo produto...";
  mensagemExcluir.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/produtos/${produtoParaExcluir.id}/inativar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      mensagemExcluir.textContent = "Sessão expirada. Faça login novamente.";

      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (resposta.status === 403) {
      mensagemExcluir.textContent = "Apenas administradores podem excluir produtos.";

      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemExcluir.textContent = "Não foi possível excluir o produto.";

      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    fecharConfirmacaoExclusao();

    // Recarrega a tabela e ajusta a paginação
    await carregarEstoque();
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    mensagemExcluir.textContent = "Não foi possível conectar ao servidor.";

    mensagemExcluir.className = "text-sm mt-4 text-red-600";
  }
});

// Pesquisa por nome ou SKU
campoBusca.addEventListener("input", function () {
  aplicarPesquisa(true);
});

// Fecha o modal de edição
botaoFecharModal.addEventListener("click", fecharModalEdicao);

botaoCancelarEdicao.addEventListener("click", fecharModalEdicao);

// Fecha o modal de exclusão
botaoFecharExclusao.addEventListener("click", fecharConfirmacaoExclusao);

botaoCancelarExclusao.addEventListener("click", fecharConfirmacaoExclusao);

// Fecha a exclusão ao clicar fora do card
modalConfirmarExclusao.addEventListener("click", function (event) {
  if (event.target === modalConfirmarExclusao) {
    fecharConfirmacaoExclusao();
  }
});

// Tecla ESC fecha a exclusão
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (!modalConfirmarExclusao.classList.contains("hidden")) {
    fecharConfirmacaoExclusao();
  }
});

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

// Carrega o estoque ao abrir a página
carregarEstoque();
