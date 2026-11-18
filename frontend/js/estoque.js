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

const totalProdutosCadastrados = document.getElementById(
  "totalProdutosCadastrados",
);
const valorTotalEstoque = document.getElementById("valorTotalEstoque");
const observacaoValorEstoque = document.getElementById(
  "observacaoValorEstoque",
);
const produtosSemCusto = document.getElementById("produtosSemCusto");
const resumoFinanceiroEstoque = document.getElementById(
  "resumoFinanceiroEstoque",
);

const menuEntrada = document.getElementById("menuEntrada");
const menuUsuarios = document.getElementById("menuUsuarios");

const cabecalhoAcoes = document.getElementById("cabecalhoAcoes");
const botaoSair = document.getElementById("botaoSair");

const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

// Menu do usuário
const areaMenuUsuario = document.getElementById("areaMenuUsuario");
const botaoMenuUsuario = document.getElementById("botaoMenuUsuario");
const menuConfiguracoesUsuario = document.getElementById(
  "menuConfiguracoesUsuario",
);
const setaMenuUsuario = document.getElementById("setaMenuUsuario");

const botaoMeuPerfil = document.getElementById("botaoMeuPerfil");
const botaoAlterarSenha = document.getElementById("botaoAlterarSenha");
const botaoPreferencias = document.getElementById("botaoPreferencias");
const botaoSairMenu = document.getElementById("botaoSairMenu");

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

// Elementos da paginação
const areaPaginacao = document.getElementById("areaPaginacao");
const informacaoPaginacao = document.getElementById("informacaoPaginacao");
const botoesPaginacao = document.getElementById("botoesPaginacao");

// Modal de edição
const modalEditarProduto = document.getElementById("modalEditarProduto");
const formEditarProduto = document.getElementById("formEditarProduto");
const botaoFecharModal = document.getElementById("botaoFecharModal");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");
const botaoGerarCodigoEdicao = document.getElementById(
  "botaoGerarCodigoEdicao",
);
const mensagemEditar = document.getElementById("mensagemEditar");

// Campos de edição
const editarNome = document.getElementById("editarNome");
const editarCodigo = document.getElementById("editarCodigo");
const editarDescricao = document.getElementById("editarDescricao");
const editarLocalizacao = document.getElementById("editarLocalizacao");
const editarUnidadeMedida = document.getElementById("editarUnidadeMedida");
const editarEstoqueMinimo = document.getElementById("editarEstoqueMinimo");

// Elementos da imagem
const editarImagem = document.getElementById("editarImagem");
const imagemPreview = document.getElementById("imagemPreview");
const imagemSemPreview = document.getElementById("imagemSemPreview");
const botaoSelecionarImagem = document.getElementById("botaoSelecionarImagem");
const botaoRemoverImagem = document.getElementById("botaoRemoverImagem");

// Modal de visualização da imagem
const modalVisualizarImagem = document.getElementById("modalVisualizarImagem");
const imagemAmpliada = document.getElementById("imagemAmpliada");
const tituloImagemProduto = document.getElementById("tituloImagemProduto");
const botaoFecharImagem = document.getElementById("botaoFecharImagem");

// Controle das imagens
let imagemSelecionada = null;
let removerImagemSelecionada = false;
let urlPreviewTemporaria = null;

const imagensCache = new Map();

// Modal de exclusão
const modalConfirmarExclusao = document.getElementById(
  "modalConfirmarExclusao",
);
const nomeProdutoExcluir = document.getElementById("nomeProdutoExcluir");
const mensagemExcluir = document.getElementById("mensagemExcluir");
const botaoFecharExclusao = document.getElementById("botaoFecharExclusao");
const botaoCancelarExclusao = document.getElementById("botaoCancelarExclusao");
const botaoConfirmarExclusao = document.getElementById(
  "botaoConfirmarExclusao",
);

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
  perfilTipoUsuario.value = "Administrador";
} else {
  perfilUsuario.textContent = "Usuário";
  perfilTipoUsuario.value = "Usuário";
}

// Configura a tela conforme o perfil
if (usuarioPerfil === "admin") {
  menuUsuarios.classList.remove("hidden");
  cabecalhoAcoes.classList.remove("hidden");
  resumoFinanceiroEstoque.classList.remove("hidden");
} else {
  menuEntrada.classList.add("hidden");
  menuUsuarios.classList.add("hidden");
  resumoFinanceiroEstoque.classList.add("hidden");
}

// Abre ou fecha o menu do usuário
function abrirMenuUsuario() {
  menuConfiguracoesUsuario.classList.remove("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "true");
  setaMenuUsuario.classList.add("rotate-180");
}

function fecharMenuUsuario() {
  menuConfiguracoesUsuario.classList.add("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "false");
  setaMenuUsuario.classList.remove("rotate-180");
}

function alternarMenuUsuario() {
  const menuAberto = !menuConfiguracoesUsuario.classList.contains("hidden");

  if (menuAberto) {
    fecharMenuUsuario();
  } else {
    abrirMenuUsuario();
  }
}

botaoMenuUsuario.addEventListener("click", alternarMenuUsuario);

// Fecha o menu ao clicar fora dele
document.addEventListener("click", function (event) {
  if (!areaMenuUsuario.contains(event.target)) {
    fecharMenuUsuario();
  }
});

// Fecha o menu ao abrir uma opção
botaoMeuPerfil.addEventListener("click", function () {
  fecharMenuUsuario();
  abrirModalPerfil();
});

botaoAlterarSenha.addEventListener("click", function () {
  fecharMenuUsuario();
  abrirModalSenha();
});

botaoPreferencias.addEventListener("click", function () {
  fecharMenuUsuario();
});

// Abre o modal Meu Perfil e consulta os dados atualizados
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

// Fecha o modal Meu Perfil
function fecharModalPerfil() {
  modalMeuPerfil.classList.add("hidden");
  mensagemMeuPerfil.textContent = "";
  formMeuPerfil.reset();

  perfilTipoUsuario.value =
    usuarioPerfil === "admin" ? "Administrador" : "Usuário";
}

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

  mensagemMeuPerfil.textContent = "Salvando alterações...";
  mensagemMeuPerfil.className = "text-sm mb-5 text-slate-500";
  botaoSalvarPerfil.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        email,
      }),
    });

    if (resposta.status === 401) {
      sairDoSistema();
      return;
    }

    if (!resposta.ok) {
      let mensagem = "Não foi possível atualizar o perfil.";

      try {
        const dados = await resposta.json();
        mensagem = dados.mensagem || dados.message || mensagem;
      } catch (erro) {}

      mensagemMeuPerfil.textContent = mensagem;
      mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
      return;
    }

    sessionStorage.setItem("usuarioNome", nome);

    nomeUsuario.textContent = nome;

    mensagemMeuPerfil.textContent = "Perfil atualizado com sucesso!";
    mensagemMeuPerfil.className = "text-sm mb-5 text-green-600";

    setTimeout(function () {
      fecharModalPerfil();
    }, 1000);
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);

    mensagemMeuPerfil.textContent = "Não foi possível conectar ao servidor.";
    mensagemMeuPerfil.className = "text-sm mb-5 text-red-600";
  } finally {
    botaoSalvarPerfil.disabled = false;
  }
});

// Abre o modal Alterar Senha
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

// Fecha o modal Alterar Senha
function fecharModalSenha() {
  modalAlterarSenha.classList.add("hidden");
  formAlterarSenha.reset();
  mensagemAlterarSenha.textContent = "";
}

botaoFecharSenha.addEventListener("click", fecharModalSenha);
botaoCancelarSenha.addEventListener("click", fecharModalSenha);

modalAlterarSenha.addEventListener("click", function (event) {
  if (event.target === modalAlterarSenha) {
    fecharModalSenha();
  }
});

// Mostrar ou ocultar os campos de senha
document.querySelectorAll("[data-toggle-senha]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const campo = document.getElementById(botao.dataset.toggleSenha);

    if (!campo) {
      return;
    }

    const senhaOculta = campo.type === "password";

    campo.type = senhaOculta ? "text" : "password";

    botao.innerHTML = senhaOculta
      ? '<img src="assets/icons/eye.svg" alt="Ocultar senha" class="w-5 h-5">'
      : '<img src="assets/icons/eye-off.svg" alt="Mostrar senha" class="w-5 h-5">';
  });
});

// Altera a senha do usuário
formAlterarSenha.addEventListener("submit", async function (event) {
  event.preventDefault();

  const senhaAtualValor = senhaAtual.value;
  const novaSenhaValor = novaSenha.value;
  const confirmarNovaSenhaValor = confirmarNovaSenha.value;

  if (!senhaAtualValor || !novaSenhaValor || !confirmarNovaSenhaValor) {
    mensagemAlterarSenha.textContent = "Preencha todos os campos.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (novaSenhaValor.length < 6) {
    mensagemAlterarSenha.textContent =
      "A nova senha deve possuir pelo menos 6 caracteres.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (novaSenhaValor !== confirmarNovaSenhaValor) {
    mensagemAlterarSenha.textContent = "As senhas não coincidem.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (senhaAtualValor === novaSenhaValor) {
    mensagemAlterarSenha.textContent =
      "A nova senha deve ser diferente da senha atual.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
    return;
  }

  mensagemAlterarSenha.textContent = "Alterando senha...";
  mensagemAlterarSenha.className = "text-sm mb-5 text-slate-500";
  botaoSalvarSenha.disabled = true;

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
      let mensagem = "Não foi possível alterar a senha.";

      try {
        const dados = await resposta.json();
        mensagem = dados.mensagem || dados.message || mensagem;
      } catch (erro) {
        // Mantém a mensagem padrão quando a resposta não possui JSON.
      }

      mensagemAlterarSenha.textContent = mensagem;
      mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
      return;
    }

    mensagemAlterarSenha.textContent = "Senha alterada com sucesso!";
    mensagemAlterarSenha.className = "text-sm mb-5 text-green-600";

    setTimeout(function () {
      fecharModalSenha();
    }, 1000);
  } catch (erro) {
    console.error("Erro ao alterar senha:", erro);

    mensagemAlterarSenha.textContent = "Não foi possível conectar ao servidor.";
    mensagemAlterarSenha.className = "text-sm mb-5 text-red-600";
  } finally {
    botaoSalvarSenha.disabled = false;
  }
});

// Encerra a sessão do usuário
function sairDoSistema(event) {
  if (event) {
    event.preventDefault();
  }

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");

  window.location.href = "login.html?logout=1";
}

// Remove uma imagem da memória do navegador.
function limparCacheImagem(id) {
  const url = imagensCache.get(id);

  if (url) {
    URL.revokeObjectURL(url);
  }

  imagensCache.delete(id);
}

// Busca a imagem do produto no backend.
async function obterImagemProduto(id) {
  if (imagensCache.has(id)) {
    return imagensCache.get(id);
  }

  try {
    const resposta = await fetch(`${API_URL}/produtos/${id}/imagem`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return null;
    }

    if (!resposta.ok) {
      imagensCache.set(id, null);
      return null;
    }

    const arquivo = await resposta.blob();
    const url = URL.createObjectURL(arquivo);

    imagensCache.set(id, url);

    return url;
  } catch (erro) {
    console.error("Erro ao carregar imagem:", erro);
    return null;
  }
}

// Exibe a imagem na tabela.
async function carregarImagemNaTabela(produto, imagem, placeholder) {
  if (!produto.imagemCaminho) {
    return;
  }

  const url = await obterImagemProduto(produto.id);

  if (!url || !imagem.isConnected) {
    return;
  }

  imagem.src = url;
  imagem.classList.remove("hidden");
  placeholder.classList.add("hidden");
}

// Abre a imagem ampliada do produto.
async function abrirImagemProduto(id) {
  const produto = produtosCarregados.find(function (item) {
    return Number(item.id) === Number(id);
  });

  if (!produto || !produto.imagemCaminho) {
    return;
  }

  const url = await obterImagemProduto(id);

  if (!url) {
    alert("Não foi possível carregar a imagem do produto.");
    return;
  }

  tituloImagemProduto.textContent = produto.nome || "Imagem do produto";

  imagemAmpliada.src = url;
  imagemAmpliada.alt = produto.nome || "Imagem do produto";

  modalVisualizarImagem.classList.remove("hidden");
}

// Fecha o modal de visualização da imagem.
function fecharModalImagem() {
  modalVisualizarImagem.classList.add("hidden");
  imagemAmpliada.removeAttribute("src");
}

// Mostra ou esconde a pré-visualização.
function mostrarPreview(url) {
  if (url) {
    imagemPreview.src = url;
    imagemPreview.classList.remove("hidden");
    imagemSemPreview.classList.add("hidden");
  } else {
    imagemPreview.removeAttribute("src");
    imagemPreview.classList.add("hidden");
    imagemSemPreview.classList.remove("hidden");
  }
}

// Carrega a imagem atual do produto no modal.
async function atualizarPreviewProduto(produto) {
  if (!produto.imagemCaminho || removerImagemSelecionada) {
    mostrarPreview(null);
    return;
  }

  const url = await obterImagemProduto(produto.id);

  if (produtoEmEdicao && produtoEmEdicao.id === produto.id) {
    mostrarPreview(url);
  }
}

// Limpa a seleção de uma nova imagem.
function limparSelecaoImagem() {
  editarImagem.value = "";
  imagemSelecionada = null;
  removerImagemSelecionada = false;

  if (urlPreviewTemporaria) {
    URL.revokeObjectURL(urlPreviewTemporaria);
    urlPreviewTemporaria = null;
  }
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
      mensagemEstoque.textContent =
        "O servidor retornou uma lista de produtos inválida.";
      return;
    }

    produtosCarregados = dados;

    atualizarResumoFinanceiro();

    // Organiza os produtos em ordem alfabética
    produtosCarregados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", {
        sensitivity: "base",
      });
    });

    // Mantém a pesquisa após editar ou excluir produtos
    aplicarPesquisa(false);
  } catch (erro) {
    console.error("Erro ao carregar estoque:", erro);

    mensagemEstoque.classList.remove("hidden");
    mensagemEstoque.textContent = "Não foi possível conectar ao servidor.";
  }
}

// Formata valores monetários no padrão brasileiro.
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Retorna o custo médio quando ele foi informado corretamente.
function obterCustoMedio(produto) {
  if (
    produto.custoMedio === null ||
    produto.custoMedio === undefined ||
    produto.custoMedio === ""
  ) {
    return null;
  }

  const custo = Number(produto.custoMedio);

  return Number.isFinite(custo) && custo >= 0 ? custo : null;
}

// Atualiza os indicadores usando a lista completa, sem considerar busca ou paginação.
function atualizarResumoFinanceiro() {
  const quantidadeProdutos = produtosCarregados.length;
  let valorTotal = 0;
  let quantidadeSemCusto = 0;

  produtosCarregados.forEach(function (produto) {
    const custoMedio = obterCustoMedio(produto);

    if (custoMedio === null) {
      quantidadeSemCusto++;
      return;
    }

    const quantidade = Number(produto.quantidade ?? 0);
    valorTotal += quantidade * custoMedio;
  });

  totalProdutosCadastrados.textContent = quantidadeProdutos;
  valorTotalEstoque.textContent = formatarMoeda(valorTotal);
  produtosSemCusto.textContent = quantidadeSemCusto;

  observacaoValorEstoque.textContent =
    quantidadeSemCusto > 0
      ? `Valor calculado para os produtos com custo informado. ${quantidadeSemCusto} produto(s) não incluído(s).`
      : "Soma do custo médio multiplicado pela quantidade em estoque.";
}

// Aplica a pesquisa à lista completa
function aplicarPesquisa(voltarPrimeiraPagina = true) {
  const busca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");

  produtosFiltrados = produtosCarregados.filter(function (produto) {
    const nome = String(produto.nome || "").toLocaleLowerCase("pt-BR");
    const codigo = String(produto.codigo || "").toLocaleLowerCase("pt-BR");

    return nome.includes(busca) || codigo.includes(busca);
  });

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

  const totalPaginas = Math.ceil(
    produtosFiltrados.length / PRODUTOS_POR_PAGINA,
  );

  if (paginaAtual > totalPaginas) {
    paginaAtual = totalPaginas;
  }

  if (paginaAtual < 1) {
    paginaAtual = 1;
  }

  const indiceInicial = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const indiceFinal = indiceInicial + PRODUTOS_POR_PAGINA;

  const produtosDaPagina = produtosFiltrados.slice(indiceInicial, indiceFinal);

  produtosDaPagina.forEach(function (produto) {
    const linha = document.createElement("tr");

    linha.className = "hover:bg-slate-100 transition";

    const status = calcularStatusEstoque(produto);

    let colunaAcoes = "";

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
        <div class="flex items-center gap-3">

          <button
            type="button"
            class="botaoVisualizarImagem w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition hover:border-blue-400 hover:ring-2 hover:ring-blue-100 disabled:cursor-default disabled:hover:border-slate-200 disabled:hover:ring-0"
            data-id="${escaparHTML(produto.id)}"
            ${!produto.imagemCaminho ? "disabled" : ""}
            aria-label="Visualizar imagem de ${escaparHTML(produto.nome || "produto")}"
            title="${produto.imagemCaminho ? "Clique para ampliar a imagem" : "Produto sem imagem"}"
          >

            <img
              id="imagem-produto-${escaparHTML(produto.id)}"
              alt="${escaparHTML(produto.nome || "Produto")}"
              class="hidden w-full h-full object-contain"
            >

            <span
              id="sem-imagem-${escaparHTML(produto.id)}"
              class="text-[10px] text-slate-400 text-center"
            >
              Sem imagem
            </span>

          </button>

          <div>
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
          </div>

        </div>
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

      <td class="px-6 py-5 text-right text-slate-700 font-medium whitespace-nowrap">
        ${obterCustoMedio(produto) === null ? "Não informado" : formatarMoeda(obterCustoMedio(produto))}
      </td>

      <td class="px-6 py-5 text-right text-slate-700 font-semibold whitespace-nowrap">
        ${
          obterCustoMedio(produto) === null
            ? "Não informado"
            : formatarMoeda(
                Number(produto.quantidade ?? 0) * obterCustoMedio(produto),
              )
        }
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

    const imagem = document.getElementById(`imagem-produto-${produto.id}`);
    const placeholder = document.getElementById(`sem-imagem-${produto.id}`);

    carregarImagemNaTabela(produto, imagem, placeholder);
  });

  if (usuarioPerfil === "admin") {
    configurarBotoesEditar();
    configurarBotoesExcluir();
  }

  mostrarPaginacao(totalPaginas);
}

// Desenha os botões de paginação
function mostrarPaginacao(totalPaginas) {
  botoesPaginacao.innerHTML = "";

  if (totalPaginas <= 1) {
    areaPaginacao.classList.add("hidden");
    return;
  }

  areaPaginacao.classList.remove("hidden");

  const primeiroProduto = (paginaAtual - 1) * PRODUTOS_POR_PAGINA + 1;

  const ultimoProduto = Math.min(
    paginaAtual * PRODUTOS_POR_PAGINA,
    produtosFiltrados.length,
  );

  informacaoPaginacao.textContent =
    `Mostrando ${primeiroProduto} a ${ultimoProduto} ` +
    `de ${produtosFiltrados.length} produtos ` +
    `• Página ${paginaAtual} de ${totalPaginas}`;

  criarBotaoPagina(
    "‹",
    paginaAtual - 1,
    paginaAtual === 1,
    false,
    "Página anterior",
  );

  const numeros = gerarNumerosPaginas(totalPaginas);

  numeros.forEach(function (numero) {
    if (typeof numero === "string") {
      const pontos = document.createElement("span");

      pontos.textContent = "...";
      pontos.className = "px-2 text-slate-400";

      botoesPaginacao.appendChild(pontos);
      return;
    }

    criarBotaoPagina(
      String(numero),
      numero,
      false,
      numero === paginaAtual,
      `Página ${numero}`,
    );
  });

  criarBotaoPagina(
    "›",
    paginaAtual + 1,
    paginaAtual === totalPaginas,
    false,
    "Próxima página",
  );
}

// Cria um botão individual da paginação
function criarBotaoPagina(
  texto,
  numeroPagina,
  desabilitado = false,
  ativo = false,
  descricao = "",
) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;
  botao.setAttribute("aria-label", descricao || texto);

  botao.className =
    "min-w-10 h-10 px-3 rounded-lg border " +
    "font-semibold text-sm transition " +
    "flex items-center justify-center";

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
  const totalPaginas = Math.ceil(
    produtosFiltrados.length / PRODUTOS_POR_PAGINA,
  );

  if (
    novaPagina < 1 ||
    novaPagina > totalPaginas ||
    novaPagina === paginaAtual
  ) {
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

  if (quantidade <= estoqueMinimo) {
    return {
      texto: "Crítico",
      classe: "bg-red-100 text-red-700",
      bolinha: "bg-red-500",
    };
  }

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

  limparSelecaoImagem();
  mostrarPreview(null);

  modalEditarProduto.classList.remove("hidden");

  atualizarPreviewProduto(produto);
}

// Fecha o modal de edição
function fecharModalEdicao() {
  modalEditarProduto.classList.add("hidden");

  produtoEmEdicao = null;
  mensagemEditar.textContent = "";

  limparSelecaoImagem();
  mostrarPreview(null);
}

// Seleciona imagem do computador
botaoSelecionarImagem.addEventListener("click", function () {
  editarImagem.click();
});

// Pré-visualiza a imagem selecionada
editarImagem.addEventListener("change", function () {
  const arquivo = editarImagem.files[0];

  if (!arquivo) {
    return;
  }

  if (!["image/jpeg", "image/png"].includes(arquivo.type)) {
    alert("Selecione uma imagem JPG ou PNG.");
    editarImagem.value = "";
    return;
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5 MB.");
    editarImagem.value = "";
    return;
  }

  if (urlPreviewTemporaria) {
    URL.revokeObjectURL(urlPreviewTemporaria);
  }

  imagemSelecionada = arquivo;
  removerImagemSelecionada = false;

  urlPreviewTemporaria = URL.createObjectURL(arquivo);

  mostrarPreview(urlPreviewTemporaria);
});

// Marca a imagem atual para remoção
botaoRemoverImagem.addEventListener("click", function () {
  if (!produtoEmEdicao) {
    return;
  }

  if (urlPreviewTemporaria) {
    URL.revokeObjectURL(urlPreviewTemporaria);
    urlPreviewTemporaria = null;
  }

  editarImagem.value = "";
  imagemSelecionada = null;

  removerImagemSelecionada = Boolean(produtoEmEdicao.imagemCaminho);

  mostrarPreview(null);
});

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

  if (
    !nome ||
    !codigo ||
    !localizacao ||
    !unidadeMedida ||
    estoqueMinimo === ""
  ) {
    mensagemEditar.textContent = "Preencha os campos obrigatórios.";
    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  if (
    !Number.isSafeInteger(Number(estoqueMinimo)) ||
    Number(estoqueMinimo) < 0
  ) {
    mensagemEditar.textContent =
      "Digite um estoque mínimo inteiro e não negativo.";

    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  const codigoExiste = produtosCarregados.some(function (produto) {
    return (
      produto.id !== produtoEmEdicao.id &&
      String(produto.codigo || "").toUpperCase() === codigo
    );
  });

  if (codigoExiste) {
    mensagemEditar.textContent = "Já existe outro produto com esse código.";
    mensagemEditar.className = "text-sm mb-5 text-red-600";
    return;
  }

  mensagemEditar.textContent = "Salvando alterações...";
  mensagemEditar.className = "text-sm mb-5 text-slate-500";

  try {
    const idProduto = produtoEmEdicao.id;

    const resposta = await fetch(`${API_URL}/produtos/${idProduto}`, {
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
      mensagemEditar.textContent =
        "Apenas administradores podem editar produtos.";

      mensagemEditar.className = "text-sm mb-5 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemEditar.textContent = "Não foi possível editar o produto.";
      mensagemEditar.className = "text-sm mb-5 text-red-600";
      return;
    }

    // Envia a nova imagem selecionada.
    if (imagemSelecionada) {
      mensagemEditar.textContent = "Enviando imagem...";
      mensagemEditar.className = "text-sm mb-5 text-slate-500";

      const formularioImagem = new FormData();
      formularioImagem.append("arquivo", imagemSelecionada);

      const respostaImagem = await fetch(
        `${API_URL}/produtos/${idProduto}/imagem`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formularioImagem,
        },
      );

      if (respostaImagem.status === 401) {
        sessionStorage.clear();
        window.location.href = "login.html";
        return;
      }

      if (respostaImagem.status === 403) {
        mensagemEditar.textContent =
          "Apenas administradores podem enviar imagens.";

        mensagemEditar.className = "text-sm mb-5 text-red-600";
        return;
      }

      if (!respostaImagem.ok) {
        mensagemEditar.textContent =
          "Os dados foram salvos, mas não foi possível enviar a imagem.";

        mensagemEditar.className = "text-sm mb-5 text-red-600";
        return;
      }

      limparCacheImagem(idProduto);
    }

    // Remove a imagem atual, se solicitado.
    else if (removerImagemSelecionada) {
      const respostaImagem = await fetch(
        `${API_URL}/produtos/${idProduto}/imagem`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (respostaImagem.status === 401) {
        sessionStorage.clear();
        window.location.href = "login.html";
        return;
      }

      if (respostaImagem.status === 403) {
        mensagemEditar.textContent =
          "Apenas administradores podem remover imagens.";

        mensagemEditar.className = "text-sm mb-5 text-red-600";
        return;
      }

      if (!respostaImagem.ok) {
        mensagemEditar.textContent =
          "Os dados foram salvos, mas não foi possível remover a imagem.";

        mensagemEditar.className = "text-sm mb-5 text-red-600";
        return;
      }

      limparCacheImagem(idProduto);
    }

    fecharModalEdicao();

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
    const resposta = await fetch(
      `${API_URL}/produtos/${produtoParaExcluir.id}/inativar`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (resposta.status === 401) {
      mensagemExcluir.textContent = "Sessão expirada. Faça login novamente.";
      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (resposta.status === 403) {
      mensagemExcluir.textContent =
        "Apenas administradores podem excluir produtos.";

      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemExcluir.textContent = "Não foi possível excluir o produto.";
      mensagemExcluir.className = "text-sm mt-4 text-red-600";
      return;
    }

    fecharConfirmacaoExclusao();

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

// Visualização ampliada da imagem.
// O evento delegado funciona mesmo quando a tabela é atualizada.
tabelaEstoque.addEventListener("click", function (event) {
  const botao = event.target.closest(".botaoVisualizarImagem");

  if (!botao || botao.disabled) {
    return;
  }

  abrirImagemProduto(botao.dataset.id);
});

// Fecha o modal de visualização
botaoFecharImagem.addEventListener("click", fecharModalImagem);

modalVisualizarImagem.addEventListener("click", function (event) {
  if (event.target === modalVisualizarImagem) {
    fecharModalImagem();
  }
});

// Fecha o modal de edição
botaoFecharModal.addEventListener("click", fecharModalEdicao);

botaoCancelarEdicao.addEventListener("click", fecharModalEdicao);

// Fecha a edição ao clicar fora do card.
modalEditarProduto.addEventListener("click", function (event) {
  if (event.target === modalEditarProduto) {
    fecharModalEdicao();
  }
});

// Fecha o modal de exclusão
botaoFecharExclusao.addEventListener("click", fecharConfirmacaoExclusao);

botaoCancelarExclusao.addEventListener("click", fecharConfirmacaoExclusao);

// Fecha o modal de exclusão ao clicar fora do card
modalConfirmarExclusao.addEventListener("click", function (event) {
  if (event.target === modalConfirmarExclusao) {
    fecharConfirmacaoExclusao();
  }
});

// Tecla ESC fecha os modais e o menu do usuário
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  fecharMenuUsuario();

  if (!modalMeuPerfil.classList.contains("hidden")) {
    fecharModalPerfil();
  }

  if (!modalAlterarSenha.classList.contains("hidden")) {
    fecharModalSenha();
  }

  if (!modalVisualizarImagem.classList.contains("hidden")) {
    fecharModalImagem();
  }

  if (!modalEditarProduto.classList.contains("hidden")) {
    fecharModalEdicao();
  }

  if (!modalConfirmarExclusao.classList.contains("hidden")) {
    fecharConfirmacaoExclusao();
  }
});

// Libera as URLs temporárias ao sair da página.
window.addEventListener("beforeunload", function () {
  imagensCache.forEach(function (url) {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });

  if (urlPreviewTemporaria) {
    URL.revokeObjectURL(urlPreviewTemporaria);
  }
});

// Logout pelos dois botões
botaoSair.addEventListener("click", sairDoSistema);
botaoSairMenu.addEventListener("click", sairDoSistema);

// Carrega o estoque ao abrir a página
carregarEstoque();
