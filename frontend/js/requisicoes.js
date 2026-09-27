// recupera o token/acesso salvo depois do login.
const token = sessionStorage.getItem("token");

// Recupera o perfil do usuário logado
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");

// Item Usuários do menu
const menuUsuarios = document.getElementById("menuUsuarios");

// Mostra Usuários somente para administrador
if (usuarioPerfil === "admin" && menuUsuarios) {
  menuUsuarios.classList.remove("hidden");
}

// tabela onde os produtos serão inseridos.
const campoMaterial = document.getElementById("material");

// se não existi o token, volta para o login.
if (!token) {
  window.location.href = "login.html";
}

// busca os produtos no backend e atualizando quando for retirado do estoque.
async function carregarMateriais() {
  try {
    const resposta = await fetch("https://fullstack-production-d62d.up.railway.app/produtos/listar", {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os materiais.");
    }

    const produtos = await resposta.json();

    // Limpa a lista antes de carregar novamente
    campoMaterial.innerHTML = `<option value="">
        Selecione um material
    </option>`;

    produtos.forEach(function (produto) {
      const opcao = document.createElement("option");

      opcao.value = produto.id;

      opcao.textContent = `${produto.nome} - Disponível: ${produto.quantidade}`;

      campoMaterial.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar materiais:", erro);
  }
}

carregarMateriais();

// Dados do usuário logado
const usuarioId = sessionStorage.getItem("usuarioId");

// Elementos do formulário
const formRequisicao = document.getElementById("formRequisicao");
const campoQuantidade = document.getElementById("quantidade");
const campoObservacao = document.getElementById("observacao");
const mensagemRequisicao = document.getElementById("mensagemRequisicao");

// Envia a requisição para o backend
formRequisicao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const produtoId = campoMaterial.value;
  const quantidade = campoQuantidade.value;
  const observacao = campoObservacao.value.trim();

  // Verifica se material e quantidade foram preenchidos
  if (!produtoId || !quantidade) {
    mensagemRequisicao.textContent =
      "Selecione um material e informe a quantidade.";

    mensagemRequisicao.className = "text-sm mt-4 text-red-600";

    return;
  }

  mensagemRequisicao.textContent = "Enviando requisição...";
  mensagemRequisicao.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch(
      "https://fullstack-production-d62d.up.railway.app/movimentacoes/registrar",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          produtoId: Number(produtoId),
          usuarioId: Number(usuarioId),
          tipo: "SAIDA",
          quantidade: Number(quantidade),
          observacao: observacao,
        }),
      },
    );

    if (!resposta.ok) {
      mensagemRequisicao.textContent =
        "Não foi possível realizar a requisição. Verifique a quantidade disponível.";

      mensagemRequisicao.className = "text-sm mt-4 text-red-600";

      return;
    }

    mensagemRequisicao.textContent = "Requisição realizada com sucesso!";

    mensagemRequisicao.className = "text-sm mt-4 text-green-600";

    formRequisicao.reset();

    // Atualiza as quantidades disponíveis
    await carregarMateriais();

  } catch (erro) {
    mensagemRequisicao.textContent = "Não foi possível conectar ao servidor.";

    mensagemRequisicao.className = "text-sm mt-4 text-red-600";
  }
});
