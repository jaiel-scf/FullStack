// Dados do usuário logado
const token = sessionStorage.getItem("token");
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");
const usuarioId = sessionStorage.getItem("usuarioId");
const usuarioNome = sessionStorage.getItem("usuarioNome");

// Verifica o acesso
if (!token) {
  window.location.href = "login.html";
} else if (usuarioPerfil !== "admin") {
  window.location.href = "estoque.html";
}

// Identificação no topo
const nomeUsuarioLogado = document.getElementById("nomeUsuarioLogado");
const perfilUsuarioLogado = document.getElementById("perfilUsuarioLogado");

nomeUsuarioLogado.textContent = usuarioNome || "Usuário";
perfilUsuarioLogado.textContent = "Administrador";

// Botão sair
const botaoSair = document.getElementById("botaoSair");

// Menu do usuário
const areaMenuUsuario = document.getElementById("areaMenuUsuario");
const botaoMenuUsuario = document.getElementById("botaoMenuUsuario");
const menuConfiguracoesUsuario = document.getElementById(
  "menuConfiguracoesUsuario",
);
// Modal Meu Perfil
const modalMeuPerfil = document.getElementById("modalMeuPerfil");
const formMeuPerfil = document.getElementById("formMeuPerfil");
const nomePerfil = document.getElementById("nomePerfil");
const emailPerfil = document.getElementById("emailPerfil");
const perfilTipoUsuario = document.getElementById("perfilTipoUsuario");
const mensagemMeuPerfil = document.getElementById("mensagemMeuPerfil");

const botaoFecharPerfil = document.getElementById("botaoFecharPerfil");
const botaoCancelarPerfil = document.getElementById("botaoCancelarPerfil");

// Modal Alterar Senha
const modalAlterarSenha = document.getElementById("modalAlterarSenha");
const formAlterarSenha = document.getElementById("formAlterarSenha");
const senhaAtual = document.getElementById("senhaAtual");
const novaSenha = document.getElementById("novaSenha");
const confirmarNovaSenha = document.getElementById("confirmarNovaSenha");
const mensagemAlterarSenha = document.getElementById("mensagemAlterarSenha");

const botaoFecharSenha = document.getElementById("botaoFecharSenha");
const botaoCancelarSenha = document.getElementById("botaoCancelarSenha");
const setaMenuUsuario = document.getElementById("setaMenuUsuario");

const botaoMeuPerfil = document.getElementById("botaoMeuPerfil");
const botaoAlterarSenha = document.getElementById("botaoAlterarSenha");
const botaoPreferencias = document.getElementById("botaoPreferencias");
const botaoSairMenu = document.getElementById("botaoSairMenu");

// Tabela
const tabelaUsuarios = document.getElementById("tabelaUsuarios");

// Formulário
const formUsuario = document.getElementById("formUsuario");

const campoNomeUsuario = document.getElementById("nomeUsuario");
const campoEmailUsuario = document.getElementById("emailUsuario");
const campoSenhaUsuario = document.getElementById("senhaUsuario");
const campoPerfilUsuario = document.getElementById("perfilUsuario");

const mensagemUsuario = document.getElementById("mensagemUsuario");

// Confirmação de exclusão
const modalExcluir = document.getElementById("modalExcluir");
const cancelarExclusao = document.getElementById("cancelarExclusao");
const confirmarExclusao = document.getElementById("confirmarExclusao");

let usuarioParaExcluir = null;

const areaPaginacaoUsuarios = document.getElementById("areaPaginacaoUsuarios");
const informacaoPaginacaoUsuarios = document.getElementById(
  "informacaoPaginacaoUsuarios",
);
const botoesPaginacaoUsuarios = document.getElementById(
  "botoesPaginacaoUsuarios",
);

// Quantidade de usuários exibidos por página
const USUARIOS_POR_PAGINA = 3;

// Página selecionada
let paginaAtualUsuarios = 1;

// Lista completa dos usuários cadastrados
let usuariosCadastrados = [];

// Evita interpretar os dados dos usuários como HTML
function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Abre o menu do usuário
function abrirMenuUsuario() {
  menuConfiguracoesUsuario.classList.remove("hidden");
  setaMenuUsuario.classList.add("rotate-180");
}

// Fecha o menu do usuário
function fecharMenuUsuario() {
  menuConfiguracoesUsuario.classList.add("hidden");
  setaMenuUsuario.classList.remove("rotate-180");
}

// Alterna o menu
function alternarMenuUsuario() {
  if (menuConfiguracoesUsuario.classList.contains("hidden")) {
    abrirMenuUsuario();
  } else {
    fecharMenuUsuario();
  }
}

// Clique no botão do usuário
botaoMenuUsuario.addEventListener("click", function (event) {
  event.stopPropagation();
  alternarMenuUsuario();
});

// Fecha ao clicar fora do menu
document.addEventListener("click", function (event) {
  if (!areaMenuUsuario.contains(event.target)) {
    fecharMenuUsuario();
  }
});
// Abre o modal Meu Perfil
function abrirModalMeuPerfil() {
  fecharMenuUsuario();

  mensagemMeuPerfil.textContent = "";
  formMeuPerfil.reset();

  modalMeuPerfil.classList.remove("hidden");
}

// Fecha o modal Meu Perfil
function fecharModalMeuPerfil() {
  modalMeuPerfil.classList.add("hidden");
}
// Carrega os dados do perfil
async function carregarMeuPerfil() {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      if (resposta.status === 401) {
        sairDoSistema(new Event("submit"));
        return;
      }

      throw new Error("Não foi possível carregar os dados do perfil.");
    }

    const dados = await resposta.json();
    const usuario = dados.usuario || dados;

    nomePerfil.value = usuario.nome || "";
    emailPerfil.value = usuario.email || "";
    perfilTipoUsuario.value = "Administrador";
  } catch (erro) {
    mensagemMeuPerfil.textContent = erro.message;
    mensagemMeuPerfil.className = "text-sm mt-4 text-red-600";
  }
}
// Salva as alterações do perfil
formMeuPerfil.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = nomePerfil.value.trim();
  if (!nome) {
    mensagemMeuPerfil.textContent = "Informe seu nome.";
    mensagemMeuPerfil.className = "text-sm mt-4 text-red-600";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/usuarios/meu-perfil`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "Não foi possível atualizar o perfil.");
    }

    sessionStorage.setItem("usuarioNome", nome);
    nomeUsuarioLogado.textContent = nome;

    mensagemMeuPerfil.textContent = "Perfil atualizado com sucesso!";
    mensagemMeuPerfil.className = "text-sm mt-4 text-green-600";
  } catch (erro) {
    mensagemMeuPerfil.textContent = erro.message;
    mensagemMeuPerfil.className = "text-sm mt-4 text-red-600";
  }
});

// Abre o modal Alterar Senha
function abrirModalAlterarSenha() {
  fecharMenuUsuario();

  mensagemAlterarSenha.textContent = "";
  formAlterarSenha.reset();

  modalAlterarSenha.classList.remove("hidden");
}

// Fecha o modal Alterar Senha
function fecharModalAlterarSenha() {
  modalAlterarSenha.classList.add("hidden");
}

// Eventos dos botões do menu
botaoMeuPerfil.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  console.log("Botão Meu Perfil clicado");

  fecharMenuUsuario();
  abrirModalMeuPerfil();
  carregarMeuPerfil();
});
botaoAlterarSenha.addEventListener("click", abrirModalAlterarSenha);

// Eventos de fechamento dos modais
botaoFecharPerfil.addEventListener("click", fecharModalMeuPerfil);
botaoCancelarPerfil.addEventListener("click", fecharModalMeuPerfil);

botaoFecharSenha.addEventListener("click", fecharModalAlterarSenha);
botaoCancelarSenha.addEventListener("click", fecharModalAlterarSenha);

async function carregarUsuarios(voltarPrimeiraPagina = false) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/listar`, {
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
      throw new Error("Não foi possível carregar os usuários.");
    }

    const usuarios = await resposta.json();

    if (!Array.isArray(usuarios)) {
      throw new Error("Lista de usuários inválida.");
    }

    usuariosCadastrados = usuarios;

    usuariosCadastrados.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", {
        sensitivity: "base",
      });
    });

    if (voltarPrimeiraPagina) {
      paginaAtualUsuarios = 1;
    }

    mostrarUsuarios();
  } catch (erro) {
    console.error("Erro ao carregar usuários:", erro);

    usuariosCadastrados = [];

    tabelaUsuarios.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-6 text-center text-red-600">
          Não foi possível carregar os usuários.
        </td>
      </tr>
    `;

    areaPaginacaoUsuarios.classList.add("hidden");
  }
}

function mostrarUsuarios() {
  tabelaUsuarios.innerHTML = "";

  if (usuariosCadastrados.length === 0) {
    tabelaUsuarios.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-8 text-center text-slate-500">
          Nenhum usuário cadastrado encontrado.
        </td>
      </tr>
    `;

    areaPaginacaoUsuarios.classList.add("hidden");
    return;
  }

  const totalPaginas = Math.ceil(usuariosCadastrados.length / USUARIOS_POR_PAGINA);

  if (paginaAtualUsuarios > totalPaginas) {
    paginaAtualUsuarios = totalPaginas;
  }

  if (paginaAtualUsuarios < 1) {
    paginaAtualUsuarios = 1;
  }

  const indiceInicial = (paginaAtualUsuarios - 1) * USUARIOS_POR_PAGINA;

  const indiceFinal = indiceInicial + USUARIOS_POR_PAGINA;

  const usuariosDaPagina = usuariosCadastrados.slice(indiceInicial, indiceFinal);

  usuariosDaPagina.forEach(function (usuario) {
    const linha = document.createElement("tr");

    linha.className = "hover:bg-blue-50 transition";

    const perfilFormatado =
      usuario.perfil === "admin" ? "Administrador" : "Usuário";

    const usuarioAtual = String(usuario.id) === String(usuarioId);

    const conteudoAcao = usuarioAtual
      ? `
          <span class="text-sm text-slate-400">
            Usuário atual
          </span>
        `
      : `
          <button type="button" class="botaoEditarUsuario text-blue-600 hover:text-blue-800 font-medium mr-3"
            data-id="${escaparHTML(usuario.id)}">Editar</button>
          ${usuario.ativo ? `<button
            type="button"
            class="botaoExcluirUsuario text-red-600 hover:text-red-800 font-medium"
            data-id="${escaparHTML(usuario.id)}"
          >
            Excluir
          </button>` : ""}
        `;

    linha.innerHTML = `
      <td class="px-6 py-4 font-medium text-slate-800">
        ${escaparHTML(usuario.nome || "-")}
      </td>

      <td class="px-6 py-4 text-slate-600">
        ${escaparHTML(usuario.email || "-")}
      </td>

      <td class="px-6 py-4 text-slate-600">
        ${perfilFormatado}
      </td>

      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-2 ${usuario.ativo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"} px-3 py-1.5 rounded-full text-sm font-semibold">
          <span class="w-2 h-2 rounded-full ${usuario.ativo ? "bg-green-500" : "bg-slate-400"}"></span>
          ${usuario.ativo ? "Ativo" : "Inativo"}
        </span>
      </td>

      <td class="px-6 py-4">
        ${conteudoAcao}
      </td>
    `;

    tabelaUsuarios.appendChild(linha);
  });

  mostrarPaginacaoUsuarios(totalPaginas);
}

function mostrarPaginacaoUsuarios(totalPaginas) {
  botoesPaginacaoUsuarios.innerHTML = "";

  if (totalPaginas <= 1) {
    areaPaginacaoUsuarios.classList.add("hidden");
    return;
  }

  areaPaginacaoUsuarios.classList.remove("hidden");

  const primeiroUsuario = (paginaAtualUsuarios - 1) * USUARIOS_POR_PAGINA + 1;

  const ultimoUsuario = Math.min(
    paginaAtualUsuarios * USUARIOS_POR_PAGINA,
    usuariosCadastrados.length,
  );

  informacaoPaginacaoUsuarios.textContent =
    `Mostrando ${primeiroUsuario} a ${ultimoUsuario} ` +
    `de ${usuariosCadastrados.length} usuários ` +
    `• Página ${paginaAtualUsuarios} de ${totalPaginas}`;

  criarBotaoPaginacaoUsuario(
    "‹",
    paginaAtualUsuarios - 1,
    paginaAtualUsuarios === 1,
    false,
    "Página anterior",
  );

  let inicio = Math.max(1, paginaAtualUsuarios - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let pagina = inicio; pagina <= fim; pagina++) {
    criarBotaoPaginacaoUsuario(
      String(pagina),
      pagina,
      false,
      pagina === paginaAtualUsuarios,
      `Página ${pagina}`,
    );
  }

  criarBotaoPaginacaoUsuario(
    "›",
    paginaAtualUsuarios + 1,
    paginaAtualUsuarios === totalPaginas,
    false,
    "Próxima página",
  );
}

function criarBotaoPaginacaoUsuario(
  texto,
  numeroPagina,
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
    mudarPaginaUsuarios(numeroPagina);
  });

  botoesPaginacaoUsuarios.appendChild(botao);
}

function mudarPaginaUsuarios(novaPagina) {
  const totalPaginas = Math.ceil(usuariosCadastrados.length / USUARIOS_POR_PAGINA);

  if (
    novaPagina < 1 ||
    novaPagina > totalPaginas ||
    novaPagina === paginaAtualUsuarios
  ) {
    return;
  }

  paginaAtualUsuarios = novaPagina;

  mostrarUsuarios();
}

formUsuario.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = campoNomeUsuario.value.trim();
  const email = campoEmailUsuario.value.trim().toLowerCase();
  const senha = campoSenhaUsuario.value;
  const perfil = campoPerfilUsuario.value;

  if (!nome || !email || !senha || !perfil) {
    mensagemUsuario.textContent = "Preencha todos os campos.";
    mensagemUsuario.className = "text-sm mt-4 text-red-600";
    return;
  }

  mensagemUsuario.textContent = "Cadastrando usuário...";
  mensagemUsuario.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch(`${API_URL}/usuarios/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
        perfil: perfil,
      }),
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (resposta.status === 403) {
      mensagemUsuario.textContent =
        "Apenas administradores podem cadastrar usuários.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (resposta.status === 409) {
      mensagemUsuario.textContent =
        "Já existe um usuário ativo com esse e-mail.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      const erroBackend = await resposta.text();

      console.log("Status:", resposta.status);
      console.log("Erro do backend:", erroBackend);

      mensagemUsuario.textContent = `Erro ${resposta.status} ao cadastrar o usuário.`;

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    mensagemUsuario.textContent = "Usuário cadastrado com sucesso!";

    mensagemUsuario.className = "text-sm mt-4 text-green-600";

    formUsuario.reset();

    await carregarUsuarios(true);
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);

    mensagemUsuario.textContent = "Não foi possível conectar ao servidor.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";
  }
});

// Abre o modal ao clicar no botão Excluir
tabelaUsuarios.addEventListener("click", function (event) {
  const botao = event.target.closest(".botaoExcluirUsuario");

  if (!botao) {
    return;
  }

  if (String(botao.dataset.id) === String(usuarioId)) {
    return;
  }

  usuarioParaExcluir = botao.dataset.id;

  modalExcluir.classList.remove("hidden");
});

// Fecha a confirmação
function fecharModalExclusao() {
  usuarioParaExcluir = null;
  modalExcluir.classList.add("hidden");
}

cancelarExclusao.addEventListener("click", fecharModalExclusao);

modalExcluir.addEventListener("click", function (event) {
  if (event.target === modalExcluir) {
    fecharModalExclusao();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modalExcluir.classList.contains("hidden")) {
    fecharModalExclusao();
  }
});

// Confirma a exclusão
confirmarExclusao.addEventListener("click", async function () {
  if (!usuarioParaExcluir) {
    return;
  }

  const idExcluir = usuarioParaExcluir;

  if (String(idExcluir) === String(usuarioId)) {
    fecharModalExclusao();
    return;
  }

  confirmarExclusao.disabled = true;
  confirmarExclusao.textContent = "Excluindo...";

  try {
    const resposta = await fetch(`${API_URL}/usuarios/${idExcluir}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (resposta.status === 403) {
      mensagemUsuario.textContent =
        "Você não tem permissão para excluir este usuário.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (!resposta.ok) {
      mensagemUsuario.textContent = "Não foi possível excluir o usuário.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    mensagemUsuario.textContent = "Usuário excluído com sucesso!";

    mensagemUsuario.className = "text-sm mt-4 text-green-600";

    fecharModalExclusao();

    await carregarUsuarios(false);
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);

    mensagemUsuario.textContent = "Não foi possível conectar ao servidor.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";
  } finally {
    confirmarExclusao.disabled = false;
    confirmarExclusao.textContent = "Excluir usuário";
  }
});

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


 // Edição administrativa
const modalEditarUsuario = document.getElementById("modalEditarUsuario");
const formEditarUsuario = document.getElementById("formEditarUsuario");
const mensagemEditarUsuario = document.getElementById("mensagemEditarUsuario");
const salvarEditarUsuario = document.getElementById("salvarEditarUsuario");
let usuarioParaEditar = null;
let botaoEdicaoAnterior = null;

function fecharModalEdicaoUsuario() {
  if (salvarEditarUsuario.disabled) return;
  modalEditarUsuario.classList.add("hidden");
  usuarioParaEditar = null;
  botaoEdicaoAnterior?.focus();
}

tabelaUsuarios.addEventListener("click", function (event) {
  const botao = event.target.closest(".botaoEditarUsuario");
  if (!botao || String(botao.dataset.id) === String(usuarioId)) return;
  const usuario = usuariosCadastrados.find(u => String(u.id) === botao.dataset.id);
  if (!usuario) return;
  usuarioParaEditar = usuario.id;
  botaoEdicaoAnterior = botao;
  document.getElementById("editarNomeUsuario").value = usuario.nome || "";
  document.getElementById("editarEmailUsuario").value = usuario.email || "";
  document.getElementById("editarPerfilUsuario").value = usuario.perfil;
  document.getElementById("editarSituacaoUsuario").value = String(Boolean(usuario.ativo));
  mensagemEditarUsuario.textContent = "";
  modalEditarUsuario.classList.remove("hidden");
  document.getElementById("editarNomeUsuario").focus();
});

document.getElementById("fecharEditarUsuario").addEventListener("click", fecharModalEdicaoUsuario);
document.getElementById("cancelarEditarUsuario").addEventListener("click", fecharModalEdicaoUsuario);
modalEditarUsuario.addEventListener("click", event => {
  if (event.target === modalEditarUsuario) fecharModalEdicaoUsuario();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalEditarUsuario.classList.contains("hidden")) fecharModalEdicaoUsuario();
});

formEditarUsuario.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (usuarioParaEditar === null || salvarEditarUsuario.disabled) return;
  const nome = document.getElementById("editarNomeUsuario").value.trim();
  const email = document.getElementById("editarEmailUsuario").value.trim().toLowerCase();
  const perfil = document.getElementById("editarPerfilUsuario").value;
  const ativo = document.getElementById("editarSituacaoUsuario").value === "true";
  mensagemEditarUsuario.className = "text-sm text-red-600";
  if (!nome || !email || !["admin", "usuario"].includes(perfil)) {
    mensagemEditarUsuario.textContent = "Informe dados válidos.";
    return;
  }
  salvarEditarUsuario.disabled = true;
  salvarEditarUsuario.textContent = "Salvando...";
  let sucesso = false;
  try {
    const resposta = await fetch(`${API_URL}/usuarios/${encodeURIComponent(usuarioParaEditar)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome, email, perfil, ativo }),
    });
    if (resposta.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }
    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      const mensagens = {
        400: "Dados inválidos.",
        403: "Você não tem permissão para esta alteração.",
        404: "Usuário não encontrado.",
        409: "E-mail já utilizado ou alteração incompatível com as regras de administração.",
      };
      throw new Error(dados.mensagem || mensagens[resposta.status] || "Não foi possível editar o usuário.");
    }
    sucesso = true;
    mensagemUsuario.textContent = "Usuário atualizado com sucesso!";
    mensagemUsuario.className = "text-sm mt-4 text-green-600";
  } catch (erro) {
    mensagemEditarUsuario.textContent = erro.message;
  } finally {
    salvarEditarUsuario.disabled = false;
    salvarEditarUsuario.textContent = "Salvar alterações";
  }
  if (sucesso) {
    fecharModalEdicaoUsuario();
    await carregarUsuarios(false);
  }
});


// CARREGAMENTO INICIAL DA TELA
carregarUsuarios(true);
