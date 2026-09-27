// Recupera o token/acesso salvo depois do login
const token = sessionStorage.getItem("token");

// Recupera o ID do usuário que fez login
const usuarioId = sessionStorage.getItem("usuarioId");

// Recupera o perfil do usuário logado
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");

// Item Usuários do menu
const menuUsuarios = document.getElementById("menuUsuarios");

// Mostra Usuários somente para administrador
if (usuarioPerfil === "admin" && menuUsuarios) {
  menuUsuarios.classList.remove("hidden");
}

// Elementos da tela de entrada
const campoProdutoEntrada = document.getElementById("produtoEntrada");
const formEntrada = document.getElementById("formEntrada");
const tituloNovaEntrada = document.getElementById("tituloNovaEntrada");
const quantidadeEntrada = document.getElementById("quantidadeEntrada");
const observacaoEntrada = document.getElementById("observacaoEntrada");
const mensagemEntrada = document.getElementById("mensagemEntrada");

// Elementos usados para abrir e fechar o cadastro de novo produto
const botaoNovoProduto = document.getElementById("botaoNovoProduto");
const cadastroNovoProduto = document.getElementById("cadastroNovoProduto");
const cancelarNovoProduto = document.getElementById("cancelarNovoProduto");

// Elementos do cadastro de novo produto
const formNovoProduto = document.getElementById("formNovoProduto");
const campoNomeProduto = document.getElementById("nomeProduto");
const campoCodigoProduto = document.getElementById("codigoProduto");
const campoDescricaoProduto = document.getElementById("descricaoProduto");
const campoLocalizacaoProduto = document.getElementById("localizacaoProduto");
const mensagemNovoProduto = document.getElementById("mensagemNovoProduto");

// Se não existir token, volta para o login
if (!token) {
  window.location.href = "login.html";
}

// Busca os produtos existentes no backend
async function carregarProdutosEntrada() {
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

    // Limpa os produtos anteriores antes de carregar novamente
    campoProdutoEntrada.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;

    produtos.forEach(function (produto) {
      const opcao = document.createElement("option");

      opcao.value = produto.id;

      opcao.textContent = `${produto.nome} - Estoque atual: ${produto.quantidade}`;

      campoProdutoEntrada.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

// Carrega os produtos quando a página abre
carregarProdutosEntrada();

// Mostra o cadastro de novo produto
botaoNovoProduto.addEventListener("click", function () {
  // Esconde a área de entrada
  formEntrada.classList.add("hidden");
  tituloNovaEntrada.classList.add("hidden");

  // Mostra o cadastro
  cadastroNovoProduto.classList.remove("hidden");
  cadastroNovoProduto.style.display = "block";
});

// Cancela o cadastro e volta para a entrada
cancelarNovoProduto.addEventListener("click", function () {
  // Esconde o cadastro
  cadastroNovoProduto.classList.add("hidden");
  cadastroNovoProduto.style.display = "none";

  // Mostra novamente a entrada
  formEntrada.classList.remove("hidden");
  tituloNovaEntrada.classList.remove("hidden");

  // Limpa possíveis mensagens
  mensagemNovoProduto.textContent = "";
});

// Cadastra um novo produto
formNovoProduto.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = campoNomeProduto.value.trim();
  const codigo = campoCodigoProduto.value.trim();
  const descricao = campoDescricaoProduto.value.trim();
  const localizacao = campoLocalizacaoProduto.value.trim();

  // Verifica os campos obrigatórios
  if (!nome || !codigo || !localizacao) {
    mensagemNovoProduto.textContent = "Preencha nome, código e localização.";

    mensagemNovoProduto.className = "text-sm mt-4 text-red-600";

    return;
  }

  mensagemNovoProduto.textContent = "Cadastrando produto...";
  mensagemNovoProduto.className = "text-sm mt-4 text-slate-500";

  try {
    const resposta = await fetch("https://fullstack-production-d62d.up.railway.app/produtos/registrar", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        nome: nome,
        codigo: codigo,
        descricao: descricao,
        quantidade: 0,
        localizacao: localizacao,
      }),
    });

    if (!resposta.ok) {
      mensagemNovoProduto.textContent = "Não foi possível cadastrar o produto.";

      mensagemNovoProduto.className = "text-sm mt-4 text-red-600";

      return;
    }

    const produto = await resposta.json();

    // Atualiza a lista de produtos
    await carregarProdutosEntrada();

    // Seleciona automaticamente o produto recém-cadastrado
    campoProdutoEntrada.value = produto.id;

    // Limpa o formulário
    formNovoProduto.reset();

    // Esconde o cadastro
    cadastroNovoProduto.classList.add("hidden");
    cadastroNovoProduto.style.display = "none";

    // Mostra novamente a entrada
    formEntrada.classList.remove("hidden");
    tituloNovaEntrada.classList.remove("hidden");

    mensagemEntrada.textContent =
      "Produto cadastrado. Agora informe a quantidade recebida.";

    mensagemEntrada.className = "text-sm mt-4 text-green-600";
  } catch (erro) {
    mensagemNovoProduto.textContent = "Não foi possível conectar ao servidor.";

    mensagemNovoProduto.className = "text-sm mt-4 text-red-600";
  }
});

// Registra a entrada de um produto no estoque
formEntrada.addEventListener("submit", async function (event) {
  event.preventDefault();

  const produtoId = campoProdutoEntrada.value;
  const quantidade = quantidadeEntrada.value;
  const observacao = observacaoEntrada.value.trim();

  // Verifica os campos obrigatórios
  if (!produtoId || !quantidade) {
    mensagemEntrada.textContent =
      "Selecione um produto e informe a quantidade.";

    mensagemEntrada.className = "text-sm mt-4 text-red-600";

    return;
  }

  if (Number(quantidade) <= 0) {
    mensagemEntrada.textContent = "A quantidade deve ser maior que zero.";

    mensagemEntrada.className = "text-sm mt-4 text-red-600";

    return;
  }

  mensagemEntrada.textContent = "Registrando entrada...";
  mensagemEntrada.className = "text-sm mt-4 text-slate-500";

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
          tipo: "ENTRADA",
          quantidade: Number(quantidade),
          observacao: observacao,
        }),
      },
    );

    if (!resposta.ok) {
      mensagemEntrada.textContent = "Não foi possível registrar a entrada.";

      mensagemEntrada.className = "text-sm mt-4 text-red-600";

      return;
    }

    // Aqui limpa os campos
    formEntrada.reset();

    // Atualiza a quantidade mostrada na lista.
    await carregarProdutosEntrada();

    mensagemEntrada.textContent = "Entrada registrada com sucesso!";

    mensagemEntrada.className = "text-sm mt-4 text-green-600";
  } catch (erro) {
    mensagemEntrada.textContent = "Não foi possível conectar ao servidor.";

    mensagemEntrada.className = "text-sm mt-4 text-red-600";
  }
});
