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

// Elementos do modal Meu perfil
const botaoMeuPerfil = document.getElementById("botaoMeuPerfil");
const modalMeuPerfil = document.getElementById("modalMeuPerfil");
const formMeuPerfil = document.getElementById("formMeuPerfil");
const nomePerfil = document.getElementById("nomePerfil");
const emailPerfil = document.getElementById("emailPerfil");
const perfilTipoUsuario = document.getElementById("perfilTipoUsuario");
const mensagemMeuPerfil = document.getElementById("mensagemMeuPerfil");
const botaoFecharPerfil = document.getElementById("botaoFecharPerfil");
const botaoCancelarPerfil = document.getElementById("botaoCancelarPerfil");
const botaoSalvarPerfil = document.getElementById("botaoSalvarPerfil");

const areaMenuUsuario = document.getElementById("areaMenuUsuario");
const botaoMenuUsuario = document.getElementById("botaoMenuUsuario");
const menuConfiguracoesUsuario = document.getElementById(
  "menuConfiguracoesUsuario",
);
const botaoSairMenu = document.getElementById("botaoSairMenu");

// Elementos do modal Alterar senha
const botaoAlterarSenha = document.getElementById("botaoAlterarSenha");
const modalAlterarSenha = document.getElementById("modalAlterarSenha");
const formAlterarSenha = document.getElementById("formAlterarSenha");
const senhaAtual = document.getElementById("senhaAtual");
const novaSenha = document.getElementById("novaSenha");
const confirmarNovaSenha = document.getElementById("confirmarNovaSenha");
const mensagemAlterarSenha = document.getElementById("mensagemAlterarSenha");
const botaoFecharSenha = document.getElementById("botaoFecharSenha");
const botaoCancelarSenha = document.getElementById("botaoCancelarSenha");
const botaoSalvarSenha = document.getElementById("botaoSalvarSenha");

// Identificação do usuário
const nomeUsuario = document.getElementById("nomeUsuario");
const perfilUsuario = document.getElementById("perfilUsuario");

// Elementos da entrada
const formEntrada = document.getElementById("formEntrada");
const produtoEntrada = document.getElementById("produtoEntrada");
const quantidadeEntrada = document.getElementById("quantidadeEntrada");
const valorUnitarioEntrada = document.getElementById("valorUnitarioEntrada");
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

// Elementos da imagem
const imagemProduto = document.getElementById("imagemProduto");
const previewImagemProduto = document.getElementById("previewImagemProduto");
const mensagemPreviewImagem = document.getElementById("mensagemPreviewImagem");
const botaoSelecionarImagem = document.getElementById("botaoSelecionarImagem");
const botaoRemoverImagem = document.getElementById("botaoRemoverImagem");
const botaoCadastrarProduto = document.getElementById("botaoCadastrarProduto");

// Elementos do histórico
const listaUltimasEntradas = document.getElementById("listaUltimasEntradas");
const mensagemHistorico = document.getElementById("mensagemHistorico");
const areaPaginacaoEntradas = document.getElementById("areaPaginacaoEntradas");
const informacaoPaginacaoEntradas = document.getElementById(
  "informacaoPaginacaoEntradas",
);
const botoesPaginacaoEntradas = document.getElementById(
  "botoesPaginacaoEntradas",
);

// Verifica os elementos obrigarorios
const elementosObrigatorios = [
  menuUsuarios,
  botaoSair,
  nomeUsuario,
  perfilUsuario,
  formEntrada,
  produtoEntrada,
  quantidadeEntrada,
  valorUnitarioEntrada,
  observacaoEntrada,
  mensagemEntrada,
  modalNovoProduto,
  conteudoModal,
  botaoNovoProduto,
  botaoFecharModal,
  botaoCancelarNovo,
  formNovoProduto,
  nomeProduto,
  codigoProduto,
  descricaoProduto,
  localizacaoProduto,
  unidadeMedidaProduto,
  estoqueMinimoProduto,
  botaoGerarCodigo,
  mensagemNovoProduto,
  imagemProduto,
  previewImagemProduto,
  mensagemPreviewImagem,
  botaoSelecionarImagem,
  botaoRemoverImagem,
  botaoCadastrarProduto,
  listaUltimasEntradas,
  mensagemHistorico,
  areaPaginacaoEntradas,
  informacaoPaginacaoEntradas,
  botoesPaginacaoEntradas,
  areaMenuUsuario,
  botaoMenuUsuario,
  menuConfiguracoesUsuario,
  botaoSairMenu,
  botaoMeuPerfil,
  modalMeuPerfil,
  formMeuPerfil,
  nomePerfil,
  emailPerfil,
  perfilTipoUsuario,
  mensagemMeuPerfil,
  botaoFecharPerfil,
  botaoCancelarPerfil,
  botaoSalvarPerfil,
  botaoAlterarSenha,
  modalAlterarSenha,
  formAlterarSenha,
  senhaAtual,
  novaSenha,
  confirmarNovaSenha,
  mensagemAlterarSenha,
  botaoFecharSenha,
  botaoCancelarSenha,
  botaoSalvarSenha,
];

if (elementosObrigatorios.some((elemento) => !elemento)) {
  console.error("Erro: existem elementos necessários ausentes no HTML.");
  throw new Error("Não foi possível inicializar a tela de entrada.");
}

// Guarda os produtos
let produtosCarregados = [];

// Guarda as entradas recuperadas do backend
let entradasCarregadas = [];

// Paginação do histórico
const ENTRADAS_POR_PAGINA = 3;
let paginaAtualEntradas = 1;

// Configuração da imagem
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

const TIPOS_IMAGEM_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
];

let arquivoImagemSelecionado = null;
let urlPreviewImagem = null;

// Evita interpretar textos recebidos como HTML
function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Formata valores monetários
function formatarMoedaEntrada(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "-";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

// Exibe mensagens no cadastro
function mostrarMensagemProduto(texto, tipo = "erro") {
  mensagemNovoProduto.textContent = texto;

  const classes = {
    erro: "text-sm mb-5 text-red-600",
    sucesso: "text-sm mb-5 text-green-600",
    aviso: "text-sm mb-5 text-amber-600",
    carregando: "text-sm mb-5 text-slate-500",
  };

  mensagemNovoProduto.className = classes[tipo] || classes.erro;
}

// Exibe mensagens na entrada
function mostrarMensagemEntrada(texto, tipo = "erro") {
  mensagemEntrada.textContent = texto;

  const classes = {
    erro: "text-sm mt-4 text-red-600",
    sucesso: "text-sm mt-4 text-green-600",
    aviso: "text-sm mt-4 text-amber-600",
    carregando: "text-sm mt-4 text-slate-500",
  };

  mensagemEntrada.className = classes[tipo] || classes.erro;
}

// Mostra o usuário logado
nomeUsuario.textContent = usuarioNome || "Usuário";
perfilUsuario.textContent = "Administrador";

// Mostra menu de usuários para administrador
menuUsuarios.classList.remove("hidden");

// MENU DE CONFIGURAÇÕES DO USUÁRIO

// ALTERAR SENHA

// Exibe mensagens da alteração de senha
function mostrarMensagemSenha(texto, tipo = "erro") {
  const classes = {
    erro: "text-sm mb-5 text-red-600",
    sucesso: "text-sm mb-5 text-green-600",
    carregando: "text-sm mb-5 text-slate-500",
  };

  mensagemAlterarSenha.textContent = texto;
  mensagemAlterarSenha.className = classes[tipo] || classes.erro;
}

// Abre o modal
function abrirModalSenha() {
  menuConfiguracoesUsuario.classList.add("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "false");

  formAlterarSenha.reset();
  mensagemAlterarSenha.textContent = "";

  modalAlterarSenha.classList.remove("hidden");
  senhaAtual.focus();
}

// Fecha o modal
function fecharModalSenha() {
  modalAlterarSenha.classList.add("hidden");
  formAlterarSenha.reset();
  mensagemAlterarSenha.textContent = "";
}

// Abre pelo menu
botaoAlterarSenha.addEventListener("click", abrirModalSenha);

// Fecha pelo X
botaoFecharSenha.addEventListener("click", fecharModalSenha);

// Fecha pelo Cancelar
botaoCancelarSenha.addEventListener("click", fecharModalSenha);

// Fecha clicando fora
modalAlterarSenha.addEventListener("click", function (event) {
  if (event.target === modalAlterarSenha) {
    fecharModalSenha();
  }
});

// Envia a alteração de senha
formAlterarSenha.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (botaoSalvarSenha.disabled) {
    return;
  }

  const senhaAtualValor = senhaAtual.value;
  const novaSenhaValor = novaSenha.value;
  const confirmarSenhaValor = confirmarNovaSenha.value;

  if (!senhaAtualValor || !novaSenhaValor || !confirmarSenhaValor) {
    mostrarMensagemSenha("Preencha todos os campos.");
    return;
  }

  if (novaSenhaValor.length < 6) {
    mostrarMensagemSenha("A nova senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (novaSenhaValor !== confirmarSenhaValor) {
    mostrarMensagemSenha("A confirmação da nova senha não corresponde.");
    return;
  }

  if (senhaAtualValor === novaSenhaValor) {
    mostrarMensagemSenha("A nova senha deve ser diferente da atual.");
    return;
  }

  botaoSalvarSenha.disabled = true;

  mostrarMensagemSenha("Alterando senha...", "carregando");

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
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!resposta.ok) {
      const dadosErro = await resposta.json().catch(() => null);

      throw new Error(
        dadosErro?.detail ||
          dadosErro?.message ||
          "Não foi possível alterar sua senha.",
      );
    }

    formAlterarSenha.reset();

    mostrarMensagemSenha("Senha alterada com sucesso!", "sucesso");
  } catch (erro) {
    console.error("Erro ao alterar senha:", erro);

    mostrarMensagemSenha(
      erro.message || "Não foi possível conectar ao servidor.",
    );
  } finally {
    botaoSalvarSenha.disabled = false;
  }
});

// MEU PERFIL

// Exibe mensagens do perfil
function mostrarMensagemPerfil(texto, tipo = "erro") {
  const classes = {
    erro: "text-sm mb-5 text-red-600",
    sucesso: "text-sm mb-5 text-green-600",
    carregando: "text-sm mb-5 text-slate-500",
  };

  mensagemMeuPerfil.textContent = texto;
  mensagemMeuPerfil.className = classes[tipo] || classes.erro;
}

// Abre o modal e consulta os dados atuais
async function abrirMeuPerfil() {
  menuConfiguracoesUsuario.classList.add("hidden");
  botaoMenuUsuario.setAttribute("aria-expanded", "false");

  modalMeuPerfil.classList.remove("hidden");

  formMeuPerfil.reset();
  mensagemMeuPerfil.textContent = "";

  nomePerfil.focus();

  mostrarMensagemPerfil("Carregando seus dados...", "carregando");

  botaoSalvarPerfil.disabled = true;

  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, {
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
      throw new Error("Não foi possível consultar seu perfil.");
    }

    const usuario = await resposta.json();

    nomePerfil.value = usuario.nome || "";
    emailPerfil.value = usuario.email || "";
    perfilTipoUsuario.value =
      usuario.perfil === "admin" ? "Administrador" : "Usuário";

    mensagemMeuPerfil.textContent = "";
  } catch (erro) {
    console.error("Erro ao consultar perfil:", erro);

    mostrarMensagemPerfil(
      erro.message || "Não foi possível conectar ao servidor.",
    );
  } finally {
    botaoSalvarPerfil.disabled = false;
  }
}

// Fecha o modal
function fecharMeuPerfil() {
  modalMeuPerfil.classList.add("hidden");
  formMeuPerfil.reset();
  mensagemMeuPerfil.textContent = "";
}

// Abre pelo menu
botaoMeuPerfil.addEventListener("click", abrirMeuPerfil);

// Fecha pelo X
botaoFecharPerfil.addEventListener("click", fecharMeuPerfil);

// Fecha pelo botão cancelar
botaoCancelarPerfil.addEventListener("click", fecharMeuPerfil);

// Fecha clicando fora
modalMeuPerfil.addEventListener("click", function (event) {
  if (event.target === modalMeuPerfil) {
    fecharMeuPerfil();
  }
});

// Salva as alterações
formMeuPerfil.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (botaoSalvarPerfil.disabled) {
    return;
  }

  const nome = nomePerfil.value.trim();
  if (!nome) {
    mostrarMensagemPerfil("Informe seu nome.");
    return;
  }

  botaoSalvarPerfil.disabled = true;

  mostrarMensagemPerfil("Salvando alterações...", "carregando");

  try {
    const resposta = await fetch(`${API_URL}/usuarios/meu-perfil`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nome,
      }),
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!resposta.ok) {
      const dadosErro = await resposta.json().catch(() => null);

      throw new Error(
        dadosErro?.detail ||
          dadosErro?.message ||
          "Não foi possível atualizar seu perfil.",
      );
    }

    const usuarioAtualizado = await resposta.json();

    // Atualiza os dados da sessão
    sessionStorage.setItem("usuarioNome", usuarioAtualizado.nome);

    // Atualiza o cabeçalho da tela
    nomeUsuario.textContent = usuarioAtualizado.nome;

    // Atualiza os campos com os dados confirmados pelo servidor
    nomePerfil.value = usuarioAtualizado.nome;
    emailPerfil.value = usuarioAtualizado.email;

    mostrarMensagemPerfil("Perfil atualizado com sucesso!", "sucesso");
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);

    mostrarMensagemPerfil(
      erro.message || "Não foi possível conectar ao servidor.",
    );
  } finally {
    botaoSalvarPerfil.disabled = false;
  }
});

// Abre ou fecha o menu
botaoMenuUsuario.addEventListener("click", function () {
  const menuAberto = !menuConfiguracoesUsuario.classList.contains("hidden");

  menuConfiguracoesUsuario.classList.toggle("hidden");

  botaoMenuUsuario.setAttribute("aria-expanded", String(!menuAberto));
});

// Fecha ao clicar fora
document.addEventListener("click", function (event) {
  if (!areaMenuUsuario.contains(event.target)) {
    menuConfiguracoesUsuario.classList.add("hidden");
    botaoMenuUsuario.setAttribute("aria-expanded", "false");
  }
});

// PRODUTOS
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
      return false;
    }

    if (!resposta.ok) {
      mostrarMensagemEntrada("Não foi possível carregar os produtos.");
      return false;
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Lista de produtos inválida.");
    }

    produtosCarregados = dados;

    produtosCarregados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", {
        sensitivity: "base",
      });
    });

    produtoEntrada.innerHTML = '<option value="">Selecione um produto</option>';

    produtosCarregados.forEach(function (produto) {
      const opcao = document.createElement("option");

      opcao.value = produto.id;
      opcao.textContent = `${produto.nome} - ${produto.codigo || "Sem código"}`;

      produtoEntrada.appendChild(opcao);
    });

    return true;
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    mostrarMensagemEntrada("Não foi possível conectar ao servidor.");
    return false;
  }
}

// MODAL DE CADASTRO
// Limpa a imagem selecionada
function limparImagemSelecionada() {
  arquivoImagemSelecionado = null;
  imagemProduto.value = "";

  if (urlPreviewImagem) {
    URL.revokeObjectURL(urlPreviewImagem);
    urlPreviewImagem = null;
  }

  previewImagemProduto.src = "";
  previewImagemProduto.classList.add("hidden");

  mensagemPreviewImagem.classList.remove("hidden");
  botaoRemoverImagem.classList.add("hidden");
}

// Reseta o formulário
function resetarFormularioProduto() {
  formNovoProduto.reset();
  mensagemNovoProduto.textContent = "";
  mensagemNovoProduto.className = "text-sm mb-5";

  limparImagemSelecionada();
}

// Abre modal de novo produto
function abrirModal() {
  resetarFormularioProduto();

  modalNovoProduto.classList.remove("hidden");
  nomeProduto.focus();
}

// Fecha modal de novo produto
function fecharModal() {
  modalNovoProduto.classList.add("hidden");
  resetarFormularioProduto();
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

// Fecha os menus e modais com ESC
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (!modalMeuPerfil.classList.contains("hidden")) {
    fecharMeuPerfil();
  }

  if (!modalNovoProduto.classList.contains("hidden")) {
    fecharModal();
  }

  if (!menuConfiguracoesUsuario.classList.contains("hidden")) {
    menuConfiguracoesUsuario.classList.add("hidden");
    botaoMenuUsuario.setAttribute("aria-expanded", "false");
  }
});

// Abre seletor de imagem
botaoSelecionarImagem.addEventListener("click", function () {
  imagemProduto.click();
});

// Seleciona e valida a imagem
imagemProduto.addEventListener("change", function () {
  const arquivo = imagemProduto.files[0];

  if (!arquivo) {
    limparImagemSelecionada();
    return;
  }

  if (!TIPOS_IMAGEM_PERMITIDOS.includes(arquivo.type)) {
    limparImagemSelecionada();

    mostrarMensagemProduto(
      "Formato inválido. Selecione uma imagem JPG, PNG, GIF ou BMP.",
    );

    return;
  }

  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
    limparImagemSelecionada();

    mostrarMensagemProduto("A imagem deve ter no máximo 5 MB.");

    return;
  }

  if (urlPreviewImagem) {
    URL.revokeObjectURL(urlPreviewImagem);
  }

  arquivoImagemSelecionado = arquivo;
  urlPreviewImagem = URL.createObjectURL(arquivo);

  previewImagemProduto.src = urlPreviewImagem;
  previewImagemProduto.classList.remove("hidden");

  mensagemPreviewImagem.classList.add("hidden");
  botaoRemoverImagem.classList.remove("hidden");

  mensagemNovoProduto.textContent = "";
});

// Remove imagem selecionada
botaoRemoverImagem.addEventListener("click", function () {
  limparImagemSelecionada();
  mensagemNovoProduto.textContent = "";
});

// Envia a imagem do produto
async function enviarImagemProduto(produtoId, arquivo) {
  const formulario = new FormData();

  formulario.append("arquivo", arquivo);

  const resposta = await fetch(`${API_URL}/produtos/${produtoId}/imagem`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formulario,
  });

  if (resposta.status === 401) {
    sessionStorage.clear();
    window.location.href = "login.html";
    throw new Error("Sessão expirada.");
  }

  if (!resposta.ok) {
    const erro = await resposta.text();

    console.error("ERRO AO ENVIAR IMAGEM:", resposta.status, erro);

    throw new Error(`Erro ${resposta.status}: ${erro}`);
  }
}

// GERAÇÃO DO CÓDIGO
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

// Padroniza o nome enquanto o usuário digita.
nomeProduto.addEventListener("input", () => {
  nomeProduto.value = nomeProduto.value.toLocaleUpperCase("pt-BR");
});

// CADASTRO DE PRODUTO
formNovoProduto.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (botaoCadastrarProduto.disabled) {
    return;
  }

  const nome = nomeProduto.value.trim().toLocaleUpperCase("pt-BR");
  const codigo = codigoProduto.value.trim().toUpperCase();
  const descricao = descricaoProduto.value.trim();
  const localizacao = localizacaoProduto.value.trim();
  const unidadeMedida = unidadeMedidaProduto.value;
  const estoqueMinimo = estoqueMinimoProduto.value;

  if (
    !nome ||
    !codigo ||
    !localizacao ||
    !unidadeMedida ||
    estoqueMinimo === ""
  ) {
    mostrarMensagemProduto("Preencha os campos obrigatórios.");
    return;
  }

  if (
    !Number.isSafeInteger(Number(estoqueMinimo)) ||
    Number(estoqueMinimo) < 0
  ) {
    mostrarMensagemProduto(
      "O estoque mínimo deve ser um número inteiro e não negativo.",
    );
    return;
  }

  const codigoExiste = produtosCarregados.some(function (produto) {
    return String(produto.codigo || "").toUpperCase() === codigo;
  });

  if (codigoExiste) {
    mostrarMensagemProduto("Já existe um produto com esse código.");
    return;
  }

  const imagemSelecionada = arquivoImagemSelecionado;

  botaoCadastrarProduto.disabled = true;
  botaoCadastrarProduto.classList.add("opacity-60", "cursor-not-allowed");

  mostrarMensagemProduto("Cadastrando produto...", "carregando");

  try {
    // Primeiro cadastra o produto
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

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (resposta.status === 403) {
      mostrarMensagemProduto(
        "Apenas administradores podem cadastrar produtos.",
      );
      return;
    }

    if (!resposta.ok) {
      mostrarMensagemProduto("Não foi possível cadastrar o produto.");
      return;
    }

    const produtoCriado = await resposta.json();

    if (!produtoCriado || !produtoCriado.id) {
      throw new Error(
        "O produto foi cadastrado, mas o servidor não retornou sua identificação.",
      );
    }

    // Atualiza a lista de produtos
    const produtosAtualizados = await carregarProdutos();

    if (!produtosAtualizados) {
      fecharModal();

      mostrarMensagemEntrada(
        "Produto cadastrado. Não foi possível atualizar a lista de produtos.",
        "aviso",
      );

      return;
    }

    produtoEntrada.value = produtoCriado.id;

    // Envia a imagem somente depois do cadastro
    if (imagemSelecionada) {
      mostrarMensagemProduto("Enviando imagem...", "carregando");

      try {
        await enviarImagemProduto(produtoCriado.id, imagemSelecionada);

        fecharModal();

        mostrarMensagemEntrada(
          "Produto cadastrado com imagem. Agora informe a quantidade recebida.",
          "sucesso",
        );
      } catch (erroImagem) {
        console.error("Erro ao enviar imagem:", erroImagem);

        if (erroImagem.message === "Sessão expirada.") {
          return;
        }

        fecharModal();

        mostrarMensagemEntrada(
          "Produto cadastrado, mas a imagem não foi enviada. Você poderá adicioná-la posteriormente no Estoque.",
          "aviso",
        );
      }

      return;
    }

    fecharModal();

    mostrarMensagemEntrada(
      "Produto cadastrado. Agora informe a quantidade recebida.",
      "sucesso",
    );
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    mostrarMensagemProduto(
      erro.message || "Não foi possível conectar ao servidor.",
    );
  } finally {
    botaoCadastrarProduto.disabled = false;

    botaoCadastrarProduto.classList.remove("opacity-60", "cursor-not-allowed");
  }
});

// REGISTRO DE ENTRADA

formEntrada.addEventListener("submit", async function (event) {
  event.preventDefault();

  const produtoId = produtoEntrada.value;
  const quantidade = quantidadeEntrada.value;
  const valorUnitario = Number(valorUnitarioEntrada.value);
  const observacao = observacaoEntrada.value.trim();

  if (!produtoId || !quantidade || valorUnitarioEntrada.value === "") {
    mostrarMensagemEntrada(
      "Selecione o produto e informe a quantidade e o custo unitário.",
    );
    return;
  }

  if (!Number.isSafeInteger(Number(quantidade)) || Number(quantidade) <= 0) {
    mostrarMensagemEntrada(
      "A quantidade deve ser um número inteiro maior que zero.",
    );
    return;
  }

  if (!Number.isFinite(valorUnitario) || valorUnitario <= 0) {
    mostrarMensagemEntrada("Informe um custo unitário maior que zero.");
    return;
  }

  const botaoRegistrar = formEntrada.querySelector('button[type="submit"]');

  botaoRegistrar.disabled = true;
  botaoRegistrar.classList.add("opacity-60", "cursor-not-allowed");

  mostrarMensagemEntrada("Registrando entrada...", "carregando");

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
        valorUnitario: valorUnitario,
        observacao: observacao,
      }),
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (resposta.status === 403) {
      mostrarMensagemEntrada(
        "Apenas administradores podem registrar entradas.",
      );
      return;
    }

    if (!resposta.ok) {
      mostrarMensagemEntrada("Não foi possível registrar a entrada.");
      return;
    }

    formEntrada.reset();

    await carregarProdutos();

    mostrarMensagemEntrada("Entrada registrada com sucesso!", "sucesso");

    await carregarUltimasEntradas(true);
  } catch (erro) {
    console.error("Erro ao registrar entrada:", erro);

    mostrarMensagemEntrada("Não foi possível conectar ao servidor.");
  } finally {
    botaoRegistrar.disabled = false;

    botaoRegistrar.classList.remove("opacity-60", "cursor-not-allowed");
  }
});

// HISTÓRICO DAS ÚLTIMAS ENTRADAS
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
  const nomeDireto = entrada.produtoNome ?? entrada.nomeProduto;

  if (nomeDireto) {
    return String(nomeDireto);
  }

  if (entrada.produto?.nome) {
    return String(entrada.produto.nome);
  }

  const id = entrada.produtoId ?? entrada.produto?.id;

  const produtoLocal = produtosCarregados.find(
    (produto) => String(produto.id) === String(id),
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
  mensagemHistorico.textContent = "Carregando últimas entradas...";

  try {
    const resposta = await fetch(`${API_URL}/movimentacoes/listar`, {
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
      throw new Error(`Erro ao consultar histórico (${resposta.status}).`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("O servidor não retornou uma lista de movimentações.");
    }

    entradasCarregadas = dados.filter(function (movimentacao) {
      return String(movimentacao.tipo ?? "").toUpperCase() === "ENTRADA";
    });

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

    mensagemHistorico.className = "text-sm text-red-600 text-center py-5";
  }
}

// Mostra três entradas por página
function mostrarUltimasEntradas() {
  listaUltimasEntradas.innerHTML = "";

  if (entradasCarregadas.length === 0) {
    mensagemHistorico.classList.remove("hidden");

    mensagemHistorico.textContent = "Nenhuma entrada registrada.";

    mensagemHistorico.className = "text-sm text-slate-500 text-center py-5";

    areaPaginacaoEntradas.classList.add("hidden");
    return;
  }

  mensagemHistorico.classList.add("hidden");

  const totalPaginas = Math.ceil(
    entradasCarregadas.length / ENTRADAS_POR_PAGINA,
  );

  paginaAtualEntradas = Math.min(
    Math.max(1, paginaAtualEntradas),
    totalPaginas,
  );

  const inicio = (paginaAtualEntradas - 1) * ENTRADAS_POR_PAGINA;

  const entradasDaPagina = entradasCarregadas.slice(
    inicio,
    inicio + ENTRADAS_POR_PAGINA,
  );

  entradasDaPagina.forEach(function (entrada) {
    const produto = obterNomeProdutoEntrada(entrada);
    const quantidade = Number(entrada.quantidade ?? 0);
    const data = formatarDataEntrada(obterDataEntrada(entrada));
    const responsavel = obterResponsavelEntrada(entrada);
    const observacao = String(entrada.observacao ?? "").trim();

    const valorUnitario = Number(entrada.valorUnitario);

    const custoValido = Number.isFinite(valorUnitario) && valorUnitario > 0;

    const custoTotal = custoValido ? valorUnitario * quantidade : null;

    const card = document.createElement("div");

    card.className =
      "border border-slate-200 rounded-xl p-4 bg-white shadow-sm";

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

        <span class="rounded-lg bg-green-100 text-green-700
          px-3 py-2 font-bold whitespace-nowrap">
          +${escaparHTML(quantidade)}
        </span>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">

        <div class="bg-slate-50 rounded-lg p-3">
          <p class="text-xs text-slate-500">
            Custo unitário
          </p>

          <p class="font-semibold text-slate-800 mt-1">
            ${
              custoValido
                ? formatarMoedaEntrada(valorUnitario)
                : "Não informado"
            }
          </p>
        </div>

        <div class="bg-green-50 rounded-lg p-3">
          <p class="text-xs text-slate-500">
            Custo total da entrada
          </p>

          <p class="font-semibold text-green-700 mt-1">
            ${
              custoTotal !== null
                ? formatarMoedaEntrada(custoTotal)
                : "Não informado"
            }
          </p>
        </div>

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

  informacaoPaginacaoEntradas.textContent = `Página ${paginaAtualEntradas} de ${totalPaginas}`;

  criarBotaoPaginacaoEntrada(
    "‹",
    paginaAtualEntradas - 1,
    paginaAtualEntradas === 1,
    false,
    "Página anterior",
  );

  let inicio = Math.max(1, paginaAtualEntradas - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let pagina = inicio; pagina <= fim; pagina++) {
    criarBotaoPaginacaoEntrada(
      String(pagina),
      pagina,
      false,
      pagina === paginaAtualEntradas,
      `Página ${pagina}`,
    );
  }

  criarBotaoPaginacaoEntrada(
    "›",
    paginaAtualEntradas + 1,
    paginaAtualEntradas === totalPaginas,
    false,
    "Próxima página",
  );
}

// Cria um botão de paginação
function criarBotaoPaginacaoEntrada(
  texto,
  pagina,
  desabilitado,
  ativo,
  descricao,
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
    mudarPaginaEntradas(pagina);
  });

  botoesPaginacaoEntradas.appendChild(botao);
}

// Altera a página exibida
function mudarPaginaEntradas(novaPagina) {
  const totalPaginas = Math.ceil(
    entradasCarregadas.length / ENTRADAS_POR_PAGINA,
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

// LOGOUT

function sairDoSistema(event) {
  event.preventDefault();

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");

  window.location.href = "login.html?logout=1";
}

// Logout pela barra lateral
botaoSair.addEventListener("click", sairDoSistema);

// Logout pelo menu do usuário
botaoSairMenu.addEventListener("click", sairDoSistema);

// FECHAR MODAL DE ALTERAÇÃO DE SENHA COM ESC
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    if (!modalAlterarSenha.classList.contains("hidden")) {
      fecharModalSenha();
    }
  }
});

// MOSTRAR OU OCULTAR SENHAS
const iconeOlho = `
    <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
`;

const iconeOlhoFechado = `
    <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="m3 3 18 18"/>
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
        <path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-4 4.7"/>
        <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3.4-.6"/>
    </svg>
`;

document.querySelectorAll("[data-toggle-senha]").forEach((botao) => {
  const campo = document.getElementById(botao.dataset.toggleSenha);

  if (!campo) return;

  // Exibe o ícone de olho inicialmente
  botao.innerHTML = iconeOlho;

  botao.addEventListener("click", () => {
    const mostrarSenha = campo.type === "password";

    campo.type = mostrarSenha ? "text" : "password";

    botao.innerHTML = mostrarSenha ? iconeOlhoFechado : iconeOlho;

    botao.setAttribute(
      "aria-label",
      mostrarSenha ? "Ocultar senha" : "Mostrar senha",
    );
  });
});
// CARREGAMENTO INICIAL DA TELA
carregarProdutos();
carregarUltimasEntradas(true);
