const token = sessionStorage.getItem("token");
const usuarioId = sessionStorage.getItem("usuarioId");
const usuarioNome = sessionStorage.getItem("usuarioNome") || "Usuário";
const usuarioPerfil = sessionStorage.getItem("usuarioPerfil");
if (!token) window.location.replace("login.html");
const admin = usuarioPerfil === "admin";
const $ = (id) => document.getElementById(id);
$("nomeUsuario").textContent = usuarioNome;
$("perfilUsuario").textContent = admin ? "Administrador" : "Usuário";
$("saudacao").textContent = usuarioNome;
$("tituloPainel").textContent = admin ? "Visão geral" : "Meu painel";
$("descricaoPainel").textContent = admin ? "Acompanhe os materiais e as atividades do almoxarifado." : "Consulte materiais e acompanhe suas requisições.";
if (admin) {
  $("menuEntrada").classList.remove("hidden");
  $("menuUsuarios").classList.remove("hidden");
} else {
  $("menuEntrada").classList.add("hidden");
  $("menuUsuarios").classList.add("hidden");
}
function encerrarSessao(evento) {
  evento?.preventDefault();
  sessionStorage.clear();
  window.location.replace("login.html");
}
$("botaoSair").addEventListener("click", encerrarSessao);
$("botaoSairMenu").addEventListener("click", encerrarSessao);
function fecharMenu() {
  $("menuConfiguracoesUsuario").classList.add("hidden");
  $("setaMenuUsuario").classList.remove("rotate-180");
  $("botaoMenuUsuario").setAttribute("aria-expanded", "false");
}
$("botaoMenuUsuario").addEventListener("click", () => {
  const aberto = !$("menuConfiguracoesUsuario").classList.toggle("hidden");
  $("setaMenuUsuario").classList.toggle("rotate-180", aberto);
  $("botaoMenuUsuario").setAttribute("aria-expanded", String(aberto));
});
document.addEventListener("click", (evento) => {
  if (!$("areaMenuUsuario").contains(evento.target)) fecharMenu();
});
document.addEventListener("keydown", (evento) => { if (evento.key === "Escape") { fecharMenu(); fecharModais(); } });
function fecharModais() {
  $("modalMeuPerfil").classList.add("hidden");
  $("modalAlterarSenha").classList.add("hidden");
}
$("botaoMeuPerfil").addEventListener("click", async () => {
  fecharMenu();
  $("mensagemMeuPerfil").textContent = "";
  $("modalMeuPerfil").classList.remove("hidden");
  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!resposta.ok) throw new Error("Não foi possível carregar seu perfil.");
    const dados = await resposta.json();
    $("nomePerfil").value = dados.nome || "";
    $("emailPerfil").value = dados.email || "";
    $("perfilTipoUsuario").value = admin ? "Administrador" : "Usuário";
  } catch (erro) { $("mensagemMeuPerfil").textContent = erro.message; }
});
$("botaoAlterarSenha").addEventListener("click", () => { fecharMenu(); $("formAlterarSenha").reset(); $("mensagemAlterarSenha").textContent = ""; $("modalAlterarSenha").classList.remove("hidden"); });
$("botaoPreferencias").addEventListener("click", fecharMenu);
for (const id of ["botaoFecharPerfil", "botaoCancelarPerfil", "botaoFecharSenha", "botaoCancelarSenha"]) $(id).addEventListener("click", fecharModais);
for (const id of ["modalMeuPerfil", "modalAlterarSenha"]) $(id).addEventListener("click", (evento) => { if (evento.target === $(id)) fecharModais(); });
document.querySelectorAll("[data-toggle-senha]").forEach((botao) => botao.addEventListener("click", () => {
  const campo = $(botao.dataset.toggleSenha);
  campo.type = campo.type === "password" ? "text" : "password";
}));
$("formMeuPerfil").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try {
    const resposta = await fetch(`${API_URL}/usuarios/me`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ nome: $("nomePerfil").value.trim(), email: $("emailPerfil").value.trim() }) });
    if (!resposta.ok) throw new Error("Não foi possível atualizar seu perfil.");
    sessionStorage.setItem("usuarioNome", $("nomePerfil").value.trim());
    $("nomeUsuario").textContent = $("nomePerfil").value.trim();
    $("saudacao").textContent = $("nomePerfil").value.trim();
    $("mensagemMeuPerfil").textContent = "Perfil atualizado com sucesso.";
  } catch (erro) { $("mensagemMeuPerfil").textContent = erro.message; }
});
$("formAlterarSenha").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const atual = $("senhaAtual").value, nova = $("novaSenha").value;
  if (nova !== $("confirmarNovaSenha").value) { $("mensagemAlterarSenha").textContent = "As novas senhas não coincidem."; return; }
  try {
    const resposta = await fetch(`${API_URL}/usuarios/me/senha`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ senhaAtual: atual, novaSenha: nova }) });
    if (!resposta.ok) throw new Error("Não foi possível alterar a senha.");
    $("mensagemAlterarSenha").textContent = "Senha alterada com sucesso.";
    $("formAlterarSenha").reset();
  } catch (erro) { $("mensagemAlterarSenha").textContent = erro.message; }
});
function card(titulo, valor, descricao, destino) {
  const link = document.createElement("a");
  link.href = destino;
  link.className = "panel rounded-2xl p-6 hover:border-blue-400 transition block";
  const numero = document.createElement("p");
  numero.className = "text-3xl font-extrabold text-blue-600 mb-4";
  numero.textContent = String(valor);
  const rotulo = document.createElement("h4");
  rotulo.className = "font-bold text-slate-800 mb-2";
  rotulo.textContent = titulo;
  const texto = document.createElement("p");
  texto.className = "text-sm text-slate-500";
  texto.textContent = descricao + " ›";
  link.append(numero, rotulo, texto);
  $("cardsPainel").append(link);
}
async function carregar() {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const respostas = await Promise.all([
      fetch(`${API_URL}/produtos/listar`, { headers }),
      fetch(`${API_URL}/movimentacoes/requisicoes`, { headers }),
    ]);
    if (respostas.some((resposta) => !resposta.ok)) throw new Error("Não foi possível carregar os indicadores.");
    const [produtos, requisicoes] = await Promise.all(respostas.map((r) => r.json()));
    if (!Array.isArray(produtos) || !Array.isArray(requisicoes)) throw new Error("Dados inesperados.");
    if (admin) {
      const alertas = produtos.filter((p) => Number(p.quantidade || 0) <= Number(p.estoqueMinimo || 0));
      const semCusto = produtos.filter((p) => p.custoMedio == null || p.custoMedio === "");
      card("Produtos cadastrados", produtos.length, "Consultar estoque", "estoque.html");
      card("Estoque crítico", alertas.length, "Ver materiais", "estoque.html");
      card("Requisições", requisicoes.length, "Acompanhar solicitações", "requisicoes.html");
      card("Sem custo médio", semCusto.length, "Consultar produtos", "estoque.html");
    } else {
      if (!usuarioId) throw new Error("Não foi possível identificar o usuário autenticado.");
      const minhas = requisicoes.filter((r) => String(r.usuarioId) === String(usuarioId));
      card("Consultar estoque", "📦", "Pesquisar materiais disponíveis", "estoque.html");
      card("Minhas requisições", minhas.length, "Acompanhar solicitações", "requisicoes.html");
      card("Aguardando autorização", minhas.filter((r) => r.status === "AGUARDANDO").length, "Ver pendências", "requisicoes.html");
      card("Finalizadas", minhas.filter((r) => r.status === "FINALIZADO").length, "Consultar histórico", "requisicoes.html");
    }
  } catch (erro) { $("mensagemPainel").textContent = erro.message; }
}
carregar();
