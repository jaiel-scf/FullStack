// configuração para mostrar e ocultar a senha
const campoSenha = document.getElementById("senha");
const botaoMostrarSenha = document.getElementById("mostrarSenha");
const iconeSenha = botaoMostrarSenha.querySelector("img");

// aqui alterna entre senha visível e senha oculta
botaoMostrarSenha.addEventListener("click", function () {
  if (campoSenha.type === "password") {
    campoSenha.type = "text";
    iconeSenha.src = "assets/icons/eye-off.svg";
    botaoMostrarSenha.setAttribute("aria-label", "Ocultar senha");
  } else {
    campoSenha.type = "password";
    iconeSenha.src = "assets/icons/eye.svg";
    botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
  }
});

// Elementos usados no formulário de login
const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

// Verifica se o usuário chegou ao login depois de sair do sistema
const parametros = new URLSearchParams(window.location.search);

if (parametros.get("logout") === "1") {
  mensagemLogin.textContent = "Sessão encerrada. Faça login novamente.";

  mensagemLogin.className = "text-sm text-center mt-4 text-blue-700";

  // Remove o parâmetro da URL depois de mostrar a mensagem
  window.history.replaceState({}, document.title, "login.html");
}

// Envia os dados do login para o backend
formLogin.addEventListener("submit", async function (event) {
  // Impede que a página seja recarregada ao enviar o formulário
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = campoSenha.value;

  mensagemLogin.textContent = "Entrando...";
  mensagemLogin.className = "text-sm text-center mt-4 text-gray-500";

  try {
    const resposta = await fetch("http://localhost:8080/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });

    if (!resposta.ok) {
      mensagemLogin.textContent = "E-mail ou senha inválidos.";
      mensagemLogin.className = "text-sm text-center mt-4 text-red-600";
      return;
    }

    const dados = await resposta.json();

    // Guarda os dados necessários para acessar as páginas protegidas
    sessionStorage.setItem("token", dados.token);
    sessionStorage.setItem("usuarioId", dados.id);
    sessionStorage.setItem("usuarioNome", dados.nome);
    sessionStorage.setItem("usuarioPerfil", dados.perfil);

    mensagemLogin.textContent = "Login realizado com sucesso!";
    mensagemLogin.className = "text-sm text-center mt-4 text-green-600";

    window.location.href = "estoque.html";
  } catch (erro) {
    mensagemLogin.textContent = "Não foi possível conectar ao servidor.";
    mensagemLogin.className = "text-sm text-center mt-4 text-red-600";
  }
});
