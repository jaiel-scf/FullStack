// =====================================================
// SIA - Gerenciamento de usuários
// =====================================================

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

// -----------------------------------------------------
// Elementos da página
// -----------------------------------------------------

// Identificação no topo
const nomeUsuarioLogado = document.getElementById("nomeUsuarioLogado");

const perfilUsuarioLogado = document.getElementById("perfilUsuarioLogado");

nomeUsuarioLogado.textContent = usuarioNome || "Usuário";
perfilUsuarioLogado.textContent = "Administrador";

// Botão sair
const botaoSair = document.getElementById("botaoSair");

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

// -----------------------------------------------------
// Elementos e configurações da paginação
// -----------------------------------------------------

const areaPaginacaoUsuarios = document.getElementById("areaPaginacaoUsuarios");

const informacaoPaginacaoUsuarios = document.getElementById("informacaoPaginacaoUsuarios");

const botoesPaginacaoUsuarios = document.getElementById("botoesPaginacaoUsuarios");

// Quantidade de usuários exibidos por página
const USUARIOS_POR_PAGINA = 3;

// Página selecionada
let paginaAtualUsuarios = 1;

// Lista completa dos usuários ativos
let usuariosAtivos = [];

// Evita interpretar os dados dos usuários como HTML
function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// -----------------------------------------------------
// Busca os usuários no backend
// -----------------------------------------------------

async function carregarUsuarios(voltarPrimeiraPagina = false) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Sessão expirada
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

    // Mostra somente usuários ativos
    usuariosAtivos = usuarios.filter(function (usuario) {
      return usuario.ativo;
    });

    // Organiza pelo nome, em ordem alfabética
    usuariosAtivos.sort(function (a, b) {
      return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR", { sensitivity: "base" });
    });

    // Após cadastrar, volta para a primeira página.
    // Após excluir, preserva a página quando possível.
    if (voltarPrimeiraPagina) {
      paginaAtualUsuarios = 1;
    }

    mostrarUsuarios();
  } catch (erro) {
    console.error("Erro ao carregar usuários:", erro);

    usuariosAtivos = [];

    tabelaUsuarios.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="px-6 py-6 text-center text-red-600"
        >
          Não foi possível carregar os usuários.
        </td>
      </tr>
    `;

    areaPaginacaoUsuarios.classList.add("hidden");
  }
}

// -----------------------------------------------------
// Exibe somente três usuários por página
// -----------------------------------------------------

function mostrarUsuarios() {
  tabelaUsuarios.innerHTML = "";

  // Nenhum usuário ativo
  if (usuariosAtivos.length === 0) {
    tabelaUsuarios.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="px-6 py-8 text-center text-slate-500"
        >
          Nenhum usuário ativo encontrado.
        </td>
      </tr>
    `;

    areaPaginacaoUsuarios.classList.add("hidden");
    return;
  }

  // Calcula quantas páginas existem
  const totalPaginas = Math.ceil(usuariosAtivos.length / USUARIOS_POR_PAGINA);

  // Ajusta a página após uma exclusão
  if (paginaAtualUsuarios > totalPaginas) {
    paginaAtualUsuarios = totalPaginas;
  }

  if (paginaAtualUsuarios < 1) {
    paginaAtualUsuarios = 1;
  }

  // Calcula quais usuários serão mostrados
  const indiceInicial = (paginaAtualUsuarios - 1) * USUARIOS_POR_PAGINA;

  const indiceFinal = indiceInicial + USUARIOS_POR_PAGINA;

  const usuariosDaPagina = usuariosAtivos.slice(indiceInicial, indiceFinal);

  // Monta a tabela
  usuariosDaPagina.forEach(function (usuario) {
    const linha = document.createElement("tr");

    linha.className = "hover:bg-violet-50 transition";

    const perfilFormatado = usuario.perfil === "admin" ? "Administrador" : "Usuário";

    // O administrador não pode excluir a si mesmo
    const usuarioAtual = String(usuario.id) === String(usuarioId);

    const conteudoAcao = usuarioAtual
      ? `
          <span class="text-sm text-slate-400">
            Usuário atual
          </span>
        `
      : `
          <button
            type="button"
            class="botaoExcluirUsuario text-red-600 hover:text-red-800 font-medium"
            data-id="${escaparHTML(usuario.id)}"
          >
            Excluir
          </button>
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
        <span
          class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold"
        >
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          Ativo
        </span>
      </td>

      <td class="px-6 py-4">
        ${conteudoAcao}
      </td>
    `;

    tabelaUsuarios.appendChild(linha);
  });

  // Atualiza os botões de paginação
  mostrarPaginacaoUsuarios(totalPaginas);
}

// -----------------------------------------------------
// Exibe a paginação abaixo da tabela
// -----------------------------------------------------

function mostrarPaginacaoUsuarios(totalPaginas) {
  botoesPaginacaoUsuarios.innerHTML = "";

  // Com apenas uma página, não precisa mostrar botões
  if (totalPaginas <= 1) {
    areaPaginacaoUsuarios.classList.add("hidden");
    return;
  }

  areaPaginacaoUsuarios.classList.remove("hidden");

  const primeiroUsuario = (paginaAtualUsuarios - 1) * USUARIOS_POR_PAGINA + 1;

  const ultimoUsuario = Math.min(paginaAtualUsuarios * USUARIOS_POR_PAGINA, usuariosAtivos.length);

  informacaoPaginacaoUsuarios.textContent =
    `Mostrando ${primeiroUsuario} a ${ultimoUsuario} ` +
    `de ${usuariosAtivos.length} usuários ` +
    `• Página ${paginaAtualUsuarios} de ${totalPaginas}`;

  // Página anterior
  criarBotaoPaginacaoUsuario("‹", paginaAtualUsuarios - 1, paginaAtualUsuarios === 1, false, "Página anterior");

  // Mantém até cinco números de página visíveis
  let inicio = Math.max(1, paginaAtualUsuarios - 2);
  let fim = Math.min(totalPaginas, inicio + 4);

  inicio = Math.max(1, fim - 4);

  for (let pagina = inicio; pagina <= fim; pagina++) {
    criarBotaoPaginacaoUsuario(String(pagina), pagina, false, pagina === paginaAtualUsuarios, `Página ${pagina}`);
  }

  // Próxima página
  criarBotaoPaginacaoUsuario(
    "›",
    paginaAtualUsuarios + 1,
    paginaAtualUsuarios === totalPaginas,
    false,
    "Próxima página",
  );
}

// -----------------------------------------------------
// Cria um botão individual da paginação
// -----------------------------------------------------

function criarBotaoPaginacaoUsuario(texto, numeroPagina, desabilitado, ativo, descricao) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.textContent = texto;
  botao.disabled = desabilitado;

  botao.setAttribute("aria-label", descricao);

  botao.className = "min-w-10 h-10 px-3 rounded-lg border " + "font-semibold text-sm transition";

  if (ativo) {
    botao.className += " bg-violet-600 border-violet-600 text-white";
    botao.setAttribute("aria-current", "page");
  } else {
    botao.className += " bg-white border-slate-200 text-slate-600 hover:bg-violet-50";
  }

  if (desabilitado) {
    botao.className += " opacity-40 cursor-not-allowed";
  }

  botao.addEventListener("click", function () {
    mudarPaginaUsuarios(numeroPagina);
  });

  botoesPaginacaoUsuarios.appendChild(botao);
}

// -----------------------------------------------------
// Altera a página da lista
// -----------------------------------------------------

function mudarPaginaUsuarios(novaPagina) {
  const totalPaginas = Math.ceil(usuariosAtivos.length / USUARIOS_POR_PAGINA);

  if (novaPagina < 1 || novaPagina > totalPaginas || novaPagina === paginaAtualUsuarios) {
    return;
  }

  paginaAtualUsuarios = novaPagina;

  mostrarUsuarios();
}

// -----------------------------------------------------
// Cadastro de usuários
// -----------------------------------------------------

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
      mensagemUsuario.textContent = "Apenas administradores podem cadastrar usuários.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";
      return;
    }

    if (resposta.status === 409) {
      mensagemUsuario.textContent = "Já existe um usuário ativo com esse e-mail.";

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

    // Limpa o formulário
    formUsuario.reset();

    // Recarrega a tabela e volta para a primeira página
    await carregarUsuarios(true);
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);

    mensagemUsuario.textContent = "Não foi possível conectar ao servidor.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";
  }
});

// -----------------------------------------------------
// Exclusão de usuários
// -----------------------------------------------------

// Abre o modal ao clicar no botão Excluir
tabelaUsuarios.addEventListener("click", function (event) {
  const botao = event.target.closest(".botaoExcluirUsuario");

  if (!botao) {
    return;
  }

  // Protege também contra tentativa de excluir a si mesmo
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

// Cancela a exclusão
cancelarExclusao.addEventListener("click", fecharModalExclusao);

// Fecha clicando fora
modalExcluir.addEventListener("click", function (event) {
  if (event.target === modalExcluir) {
    fecharModalExclusao();
  }
});

// Fecha com ESC
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
      mensagemUsuario.textContent = "Você não tem permissão para excluir este usuário.";

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

    // Recarrega os usuários, preservando a página
    // quando ela ainda existir.
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

carregarUsuarios();
