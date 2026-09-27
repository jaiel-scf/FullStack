// Recupera os dados do usuário que fez login
const token = sessionStorage.getItem("token");
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");
const usuarioId = sessionStorage.getItem("usuarioId");

// Tabela onde os usuários serão exibidos
const tabelaUsuarios = document.getElementById("tabelaUsuarios");

// Verifica se o usuário pode acessar esta página
if (!token) {
  window.location.href = "login.html";
} else if (usuarioPerfil !== "admin") {
  window.location.href = "estoque.html";
}

// Busca os usuários cadastrados no backend
async function carregarUsuarios() {
  try {
    const resposta = await fetch(
      "https://fullstack-production-d62d.up.railway.app/usuarios/listar",
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os usuários.");
    }

    const usuarios = await resposta.json();

    // Mostra somente os usuários ativos
    const usuariosAtivos = usuarios.filter(function (usuario) {
      return usuario.ativo;
    });

    tabelaUsuarios.innerHTML = "";

    usuariosAtivos.forEach(function (usuario) {
      const linha = document.createElement("tr");

      linha.className = "hover:bg-slate-100 transition";

      linha.innerHTML = `
                <td class="px-6 py-4 font-medium text-slate-800">
                    ${usuario.nome}
                </td>

                <td class="px-6 py-4 text-slate-600">
                    ${usuario.email}
                </td>

                <td class="px-6 py-4 text-slate-600">
                    ${usuario.perfil}
                </td>

                <td class="px-6 py-4 text-slate-600">
                    ${usuario.ativo ? "Ativo" : "Inativo"}
                </td>

                <td class="px-6 py-4">
                    ${
                      String(usuario.id) === String(usuarioId)
                        ? `<span class="text-sm text-slate-400">Usuário atual</span>`
                        : `
                                <button
                                    type="button"
                                    class="botaoExcluirUsuario text-red-600 hover:text-red-800 font-medium"
                                    data-id="${usuario.id}"
                                >
                                    Excluir
                                </button>
                            `
                    }
                </td>
            `;

      tabelaUsuarios.appendChild(linha);
    });
  } catch (erro) {
    tabelaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-6 text-center text-red-600">
                    Não foi possível carregar os usuários.
                </td>
            </tr>
        `;

    console.error("Erro ao carregar usuários:", erro);
  }
}

// Carrega os usuários quando a página abre
carregarUsuarios();

// Elementos do formulário para cadastro de usuário
const formUsuario = document.getElementById("formUsuario");
const campoNomeUsuario = document.getElementById("nomeUsuario");
const campoEmailUsuario = document.getElementById("emailUsuario");
const campoSenhaUsuario = document.getElementById("senhaUsuario");
const campoPerfilUsuario = document.getElementById("perfilUsuario");
const mensagemUsuario = document.getElementById("mensagemUsuario");

// Cadastra um novo usuário
formUsuario.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = campoNomeUsuario.value.trim();
  const email = campoEmailUsuario.value.trim();
  const senha = campoSenhaUsuario.value;
  const perfil = campoPerfilUsuario.value;

  // Verifica os campos obrigatórios
  if (!nome || !email || !senha || !perfil) {
    mensagemUsuario.textContent = "Preencha todos os campos.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";

    return;
  }

  mensagemUsuario.textContent = "Cadastrando usuário...";

  mensagemUsuario.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch(
      "https://fullstack-production-d62d.up.railway.app/usuarios/registrar",
      {
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
      },
    );

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

    // Atualiza a tabela
    await carregarUsuarios();
  } catch (erro) {
    mensagemUsuario.textContent = "Não foi possível conectar ao servidor.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";
  }
});

// Elementos da confirmação de exclusão
const modalExcluir = document.getElementById("modalExcluir");
const cancelarExclusao = document.getElementById("cancelarExclusao");
const confirmarExclusao = document.getElementById("confirmarExclusao");

let usuarioParaExcluir = null;

// Abre a confirmação de exclusão
tabelaUsuarios.addEventListener("click", function (event) {
  if (!event.target.classList.contains("botaoExcluirUsuario")) {
    return;
  }

  usuarioParaExcluir = event.target.dataset.id;

  modalExcluir.classList.remove("hidden");
});

// Cancela a exclusão
cancelarExclusao.addEventListener("click", function () {
  usuarioParaExcluir = null;

  modalExcluir.classList.add("hidden");
});

// Confirma e exclui o usuário
confirmarExclusao.addEventListener("click", async function () {
  if (!usuarioParaExcluir) {
    return;
  }

  try {
    const resposta = await fetch(
      `https://fullstack-production-d62d.up.railway.app/usuarios/${usuarioParaExcluir}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!resposta.ok) {
      mensagemUsuario.textContent = "Não foi possível excluir o usuário.";

      mensagemUsuario.className = "text-sm mt-4 text-red-600";

      return;
    }

    mensagemUsuario.textContent = "Usuário excluído com sucesso!";

    mensagemUsuario.className = "text-sm mt-4 text-green-600";

    usuarioParaExcluir = null;

    modalExcluir.classList.add("hidden");

    await carregarUsuarios();
  } catch (erro) {
    mensagemUsuario.textContent = "Não foi possível conectar ao servidor.";

    mensagemUsuario.className = "text-sm mt-4 text-red-600";
  }
});
