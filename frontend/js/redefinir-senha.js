const tokenLogin = sessionStorage.getItem("token");

// Elementos da página
const formRedefinirSenha = document.getElementById("formRedefinirSenha");
const mensagemSenha = document.getElementById("mensagemSenha");
const tituloPagina = document.getElementById("tituloPagina");
const descricaoPagina = document.getElementById("descricaoPagina");
const grupoSenhaAtual = document.getElementById("grupoSenhaAtual");
const botaoAlterarSenha = document.getElementById("botaoAlterarSenha");

// Campos de senha
const campoSenhaAtual = document.getElementById("senhaAtual");
const campoNovaSenha = document.getElementById("novaSenha");
const campoConfirmarSenha = document.getElementById("confirmarSenha");

// Botões para mostrar ou ocultar as senhas
const botaoSenhaAtual = document.getElementById("mostrarSenhaAtual");
const botaoNovaSenha = document.getElementById("mostrarNovaSenha");
const botaoConfirmarSenha = document.getElementById("mostrarConfirmarSenha");

// Identifica se o usuário veio do link de recuperação
const parametros = new URLSearchParams(window.location.search);
const tokenRecuperacao = parametros.get("token");
const recuperacao = parametros.get("recuperacao") === "1";
const modoRecuperacao = Boolean(recuperacao && tokenRecuperacao);

let alteracaoConcluida = false;

// Configura a página conforme o tipo de redefinição
if (modoRecuperacao) {
  grupoSenhaAtual.classList.add("hidden");

  tituloPagina.textContent = "Criar nova senha";
  descricaoPagina.textContent = "Digite e confirme sua nova senha para recuperar o acesso.";
} else {
  grupoSenhaAtual.classList.add("hidden");

  tituloPagina.textContent = "Primeiro acesso";
  descricaoPagina.textContent = "Para continuar, cadastre uma nova senha.";

  if (!tokenLogin) {
    window.location.replace("login.html");
  }
}

// Mostra ou oculta a senha do campo informado
function configurarMostrarSenha(botao, campo) {
  if (!botao || !campo) {
    return;
  }

  const icone = botao.querySelector("img");

  botao.addEventListener("click", function () {
    if (campo.type === "password") {
      campo.type = "text";

      if (icone) {
        icone.src = "assets/icons/eye-off.svg";
      }

      botao.setAttribute("aria-label", "Ocultar senha");
    } else {
      campo.type = "password";

      if (icone) {
        icone.src = "assets/icons/eye.svg";
      }

      botao.setAttribute("aria-label", "Mostrar senha");
    }
  });
}

// Ativa os botões dos olhos
configurarMostrarSenha(botaoSenhaAtual, campoSenhaAtual);
configurarMostrarSenha(botaoNovaSenha, campoNovaSenha);
configurarMostrarSenha(botaoConfirmarSenha, campoConfirmarSenha);

// Valida os campos e solicita a alteração da senha
formRedefinirSenha.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (alteracaoConcluida || botaoAlterarSenha.disabled) {
    return;
  }

  const novaSenha = campoNovaSenha.value;
  const confirmarSenha = campoConfirmarSenha.value;

  mensagemSenha.textContent = "";

  if (!novaSenha || !confirmarSenha) {
    mostrarErro("Preencha todos os campos.");
    return;
  }

  if (novaSenha.length < 6) {
    mostrarErro("A nova senha deve possuir pelo menos 6 caracteres.");
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mostrarErro("As novas senhas não são iguais.");
    return;
  }

  botaoAlterarSenha.disabled = true;
  botaoAlterarSenha.textContent = "Alterando...";
  botaoAlterarSenha.classList.add("opacity-70", "cursor-not-allowed");

  mostrarMensagem("Alterando senha...", "gray");

  if (modoRecuperacao) {
    await redefinirPorEmail(novaSenha);
  } else {
    await redefinirPrimeiroAcesso(novaSenha);
  }
});

// Salva a nova senha no primeiro acesso
async function redefinirPrimeiroAcesso(novaSenha) {
  try {
    const resposta = await fetch(`${API_URL}/usuarios/primeiro-acesso/senha`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenLogin}`,
      },
      body: JSON.stringify({
        novaSenha: novaSenha,
      }),
    });

    if (resposta.status === 401) {
      mostrarErro("Sua sessão expirou. Faça o login novamente.");

      limparSessao();
      restaurarBotao();
      return;
    }

    if (resposta.status === 400) {
      mostrarErro("A nova senha deve possuir pelo menos 6 caracteres e ser diferente da senha inicial.");

      restaurarBotao();
      return;
    }

    if (resposta.status === 403) {
      mostrarErro("Não foi possível concluir o primeiro acesso. Faça o login novamente.");

      restaurarBotao();
      return;
    }

    if (!resposta.ok) {
      mostrarErro("Não foi possível cadastrar a nova senha.");

      restaurarBotao();
      return;
    }

    // Registra que o primeiro acesso foi concluído
    sessionStorage.setItem("primeiroAcesso", "false");

    concluirAlteracao();
  } catch (erro) {
    console.error("Erro ao cadastrar a nova senha:", erro);

    mostrarErro("Não foi possível conectar ao servidor.");
    restaurarBotao();
  }
}

// Redefine a senha usando o link enviado por e-mail
async function redefinirPorEmail(novaSenha) {
  try {
    const resposta = await fetch(`${API_URL}/auth/redefinir-senha`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenRecuperacao,
        novaSenha: novaSenha,
      }),
    });

    if (resposta.status === 400) {
      mostrarErro("O link é inválido, expirou ou a nova senha não pode ser utilizada.");

      restaurarBotao();
      return;
    }

    if (!resposta.ok) {
      mostrarErro("Não foi possível redefinir a senha.");

      restaurarBotao();
      return;
    }

    concluirAlteracao();
  } catch (erro) {
    console.error("Erro na recuperação de senha:", erro);

    mostrarErro("Não foi possível conectar ao servidor.");
    restaurarBotao();
  }
}

// Mostra a confirmação e encaminha o usuário
function concluirAlteracao() {
  alteracaoConcluida = true;

  botaoAlterarSenha.textContent = "Senha cadastrada";

  if (modoRecuperacao) {
    mostrarMensagem("Senha alterada com sucesso! Redirecionando para o login...", "green");

    // Na recuperação por e-mail é necessário fazer login
    limparSessao();

    setTimeout(function () {
      window.location.replace("login.html?senhaAlterada=1");
    }, 1500);
  } else {
    mostrarMensagem("Senha cadastrada com sucesso! Entrando no SIA...", "green");

    // No primeiro acesso, mantém a sessão e entra diretamente
    setTimeout(function () {
      window.location.replace("estoque.html");
    }, 1500);
  }
}

// Exibe uma mensagem de erro
function mostrarErro(mensagem) {
  mostrarMensagem(mensagem, "red");
}

// Mostra mensagens abaixo do formulário
function mostrarMensagem(mensagem, cor) {
  const cores = {
    red: "text-red-600",
    green: "text-green-600",
    blue: "text-blue-700",
    gray: "text-gray-500",
  };

  mensagemSenha.textContent = mensagem;

  mensagemSenha.className = `text-sm text-center mt-4 ${cores[cor] || cores.gray}`;
}

// Restaura o botão após uma tentativa sem sucesso
function restaurarBotao() {
  botaoAlterarSenha.disabled = false;
  botaoAlterarSenha.textContent = "Cadastrar nova senha";

  botaoAlterarSenha.classList.remove("opacity-70", "cursor-not-allowed");
}

// Limpa os dados da sessão
function limparSessao() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuarioId");
  sessionStorage.removeItem("usuarioNome");
  sessionStorage.removeItem("usuarioPerfil");
  sessionStorage.removeItem("primeiroAcesso");
}
