// Elementos da senha
const campoSenha = document.getElementById("senha");
const botaoMostrarSenha = document.getElementById("mostrarSenha");
const iconeSenha = botaoMostrarSenha.querySelector("img");

// Elementos do login
const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");
const botaoEntrar = document.getElementById("botaoEntrar");
const botaoEsqueciSenha = document.getElementById("esqueciSenha");

// Elementos da recuperação
const modalRecuperacao = document.getElementById("modalRecuperacao");
const fecharRecuperacao = document.getElementById("fecharRecuperacao");
const formRecuperacao = document.getElementById("formRecuperacao");
const campoEmailRecuperacao = document.getElementById("emailRecuperacao");
const mensagemRecuperacao = document.getElementById("mensagemRecuperacao");
const botaoEnviarRecuperacao = document.getElementById("botaoEnviarRecuperacao");

// Mostra ou oculta a senha
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

// Parâmetros recebidos pela URL
const parametros = new URLSearchParams(window.location.search);

// Mensagem depois do logout
if (parametros.get("logout") === "1") {
  mostrarMensagem("Sessão encerrada. Faça login novamente.", "blue");

  limparParametros();
}

// Mensagem depois da troca de senha
if (parametros.get("senhaAlterada") === "1") {
  mostrarMensagem("Senha alterada com sucesso. Faça login novamente.", "green");

  limparParametros();
}

// Faz o login
formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();

  const senha = campoSenha.value;

  if (!email || !senha) {
    mostrarMensagem("Preencha o e-mail e a senha.", "red");

    return;
  }

  botaoEntrar.disabled = true;
  botaoEntrar.textContent = "Entrando...";

  botaoEntrar.classList.add("opacity-70", "cursor-not-allowed");

  mostrarMensagem("Verificando seus dados...", "gray");

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
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
      mostrarMensagem("E-mail ou senha inválidos.", "red");

      restaurarBotao();

      return;
    }

    const dados = await resposta.json();

    sessionStorage.setItem("token", dados.token);

    sessionStorage.setItem("usuarioId", dados.id);

    sessionStorage.setItem("usuarioNome", dados.nome);

    sessionStorage.setItem("usuarioPerfil", dados.perfil);

    sessionStorage.setItem("primeiroAcesso", String(dados.primeiroAcesso));

    // Primeiro acesso
    if (dados.primeiroAcesso === true) {
      botaoEntrar.textContent = "Login confirmado";

      mostrarMensagem("Primeiro acesso. Redefina sua senha.", "blue");

      setTimeout(function () {
        window.location.href = "redefinir-senha.html";
      }, 1000);

      return;
    }

    // Login normal
    botaoEntrar.textContent = "Login confirmado";

    mostrarMensagem("Login realizado com sucesso!", "green");

    setTimeout(function () {
      window.location.href = "estoque.html";
    }, 900);
  } catch (erro) {
    mostrarMensagem("Não foi possível conectar ao servidor.", "red");

    restaurarBotao();
  }
});

// Abre recuperação de senha
botaoEsqueciSenha.addEventListener("click", function () {
  campoEmailRecuperacao.value = document.getElementById("email").value.trim();

  mensagemRecuperacao.textContent = "";

  modalRecuperacao.classList.remove("hidden");

  campoEmailRecuperacao.focus();
});

// Fecha recuperação
fecharRecuperacao.addEventListener("click", fecharModalRecuperacao);

// Fecha clicando fora
modalRecuperacao.addEventListener("click", function (event) {
  if (event.target === modalRecuperacao) {
    fecharModalRecuperacao();
  }
});

// Envia pedido de recuperação
formRecuperacao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = campoEmailRecuperacao.value.trim();

  if (!email) {
    mostrarMensagemRecuperacao("Informe seu e-mail.", "red");

    return;
  }

  botaoEnviarRecuperacao.disabled = true;

  botaoEnviarRecuperacao.textContent = "Enviando...";

  botaoEnviarRecuperacao.classList.add("opacity-70", "cursor-not-allowed");

  mostrarMensagemRecuperacao("Enviando solicitação...", "gray");

  try {
    const resposta = await fetch(`${API_URL}/auth/esqueci-senha`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
      }),
    });

    if (!resposta.ok) {
      mostrarMensagemRecuperacao("Não foi possível solicitar a recuperação.", "red");

      restaurarBotaoRecuperacao();

      return;
    }

    mostrarMensagemRecuperacao(
      "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
      "green",
    );

    botaoEnviarRecuperacao.textContent = "Solicitação enviada";
  } catch (erro) {
    mostrarMensagemRecuperacao("Não foi possível conectar ao servidor.", "red");

    restaurarBotaoRecuperacao();
  }
});

// Fecha o modal
function fecharModalRecuperacao() {
  modalRecuperacao.classList.add("hidden");

  restaurarBotaoRecuperacao();
}

// Mensagens do login
function mostrarMensagem(mensagem, cor) {
  mensagemLogin.textContent = mensagem;

  const cores = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-700",
    gray: "text-gray-500",
  };

  mensagemLogin.className = `text-sm text-center mt-4 ${cores[cor]}`;
}

// Mensagens da recuperação
function mostrarMensagemRecuperacao(mensagem, cor) {
  mensagemRecuperacao.textContent = mensagem;

  const cores = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-700",
    gray: "text-gray-500",
  };

  mensagemRecuperacao.className = `text-sm text-center mt-4 ${cores[cor]}`;
}

// Restaura botão do login
function restaurarBotao() {
  botaoEntrar.disabled = false;
  botaoEntrar.textContent = "Entrar";

  botaoEntrar.classList.remove("opacity-70", "cursor-not-allowed");
}

// Restaura botão da recuperação
function restaurarBotaoRecuperacao() {
  botaoEnviarRecuperacao.disabled = false;

  botaoEnviarRecuperacao.textContent = "Enviar link de recuperação";

  botaoEnviarRecuperacao.classList.remove("opacity-70", "cursor-not-allowed");
}

// Remove parâmetros da URL
function limparParametros() {
  window.history.replaceState({}, document.title, "login.html");
}
