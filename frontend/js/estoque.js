// recupera o token/acesso salvo depois do login.
const token = sessionStorage.getItem("token");

// Recupera o perfil do usuário logado
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");

// Item Usuários do menu
const menuUsuarios = document.getElementById("menuUsuarios");

// Mostra o menu Usuários somente para administrador
if (usuarioPerfil === "admin" && menuUsuarios) {
  menuUsuarios.classList.remove("hidden");
}

// tabela onde os produtos existentes serão exibidos
const corpoTabela = document.getElementById("tabelaProdutos");

// se não existi o token/acesso, volta para o logi
if (!token) {
  window.location.href = "login.html";
}

// Busca os produtos no backend
async function carregarProdutos() {
  try {
    const resposta = await fetch("https://fullstack-production-d62d.up.railway.app/produtos/listar", {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }

    const produtos = await resposta.json();

    corpoTabela.innerHTML = "";

    produtos.forEach(function (produto) {
      const linha = document.createElement("tr");

      linha.className = "hover:bg-slate-100 transition";

      linha.innerHTML = `
                <td class="px-6 py-4 text-slate-600">
                    ${produto.codigo}
                </td>

                <td class="px-6 py-4 font-medium text-slate-800">
                    ${produto.nome}
                </td>

                <td class="px-6 py-4 text-slate-600">
                    ${produto.quantidade}
                </td>

                <td class="px-6 py-4 text-slate-600">
                    ${produto.localizacao ?? "-"}
                </td>
            `;

      corpoTabela.appendChild(linha);
    });
  } catch (erro) {
    corpoTabela.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-6 text-center text-red-600">
                    Não foi possível carregar o estoque.
                </td>
            </tr>
        `;

    console.error("Erro ao carregar estoque:", erro);
  }
}

carregarProdutos();
